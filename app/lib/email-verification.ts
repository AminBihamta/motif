import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { getDatabase } from "./db";

const tokenLifetimeMs = 24 * 60 * 60 * 1000;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function applicationUrl() {
  const value = process.env.MOTIF_APP_URL;
  if (!value) throw new Error("MOTIF_APP_URL is not configured.");

  const url = new URL(value);
  if (url.protocol !== "https:" && process.env.NODE_ENV === "production") {
    throw new Error("MOTIF_APP_URL must use HTTPS in production.");
  }

  return url;
}

async function deliverVerificationEmail(email: string, verificationUrl: string) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME ?? "Motif";

  if (!apiKey || !senderEmail) {
    throw new Error("Brevo email is not configured.");
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    cache: "no-store",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: senderName },
      to: [{ email }],
      subject: "Verify your Motif email",
      htmlContent: `<p>Welcome to Motif.</p><p><a href="${verificationUrl}">Verify your email</a> to unlock five free analyses and five product searches per week.</p><p>This link expires in 24 hours.</p>`,
      textContent: `Verify your Motif email to unlock five free analyses and five product searches per week: ${verificationUrl}\n\nThis link expires in 24 hours.`,
      tags: ["motif-email-verification"],
    }),
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`Brevo verification email failed (${response.status}): ${responseText}`);
  }
}

export async function sendEmailVerification(userId: string, email: string) {
  const sql = getDatabase();
  const recent = await sql`
    SELECT created_at
    FROM public.motif_email_verification_tokens
    WHERE user_id = ${userId}::integer
      AND created_at > now() - interval '5 minutes'
    ORDER BY created_at DESC
    LIMIT 1
  `;

  if (recent.length > 0) return { sent: false, throttled: true };

  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + tokenLifetimeMs);

  await sql`
    DELETE FROM public.motif_email_verification_tokens
    WHERE user_id = ${userId}::integer
      AND consumed_at IS NULL
  `;
  await sql`
    INSERT INTO public.motif_email_verification_tokens (token_hash, user_id, expires_at)
    VALUES (${tokenHash}, ${userId}::integer, ${expiresAt})
  `;

  const verificationUrl = new URL("/verify-email", applicationUrl());
  verificationUrl.searchParams.set("token", token);

  try {
    await deliverVerificationEmail(email, verificationUrl.toString());
  } catch (error) {
    await sql`
      DELETE FROM public.motif_email_verification_tokens
      WHERE token_hash = ${tokenHash}
    `;
    throw error;
  }

  return { sent: true, throttled: false };
}

export async function verifyEmailToken(token: string) {
  if (!token || token.length > 256) return false;

  const sql = getDatabase();
  const tokenHash = hashToken(token);
  const rows = await sql`
    UPDATE public.motif_email_verification_tokens AS verification
    SET consumed_at = now()
    WHERE verification.token_hash = ${tokenHash}
      AND verification.consumed_at IS NULL
      AND verification.expires_at > now()
    RETURNING verification.user_id
  ` as Array<{ user_id: number }>;
  const userId = rows[0]?.user_id;
  if (!userId) return false;

  await sql`
    UPDATE public.users
    SET "emailVerified" = COALESCE("emailVerified", now())
    WHERE id = ${userId}
  `;
  return true;
}

export async function markEmailVerified(userId: string) {
  const sql = getDatabase();
  await sql`
    UPDATE public.users
    SET "emailVerified" = COALESCE("emailVerified", now())
    WHERE id::text = ${userId}
  `;
}

export async function sendEmailVerificationForAddress(rawEmail: string) {
  const email = rawEmail.trim().toLowerCase();
  const sql = getDatabase();
  const rows = await sql`
    SELECT id::text AS id, email
    FROM public.users
    WHERE lower(email) = ${email}
      AND "emailVerified" IS NULL
      AND password_hash IS NOT NULL
    LIMIT 1
  ` as Array<{ id: string; email: string | null }>;
  const user = rows[0];
  if (user?.email) await sendEmailVerification(user.id, user.email);
}
