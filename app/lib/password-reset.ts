import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { updatePasswordHash } from "./auth-users";
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

async function deliverPasswordResetEmail(email: string, resetUrl: string) {
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
      subject: "Reset your Motif password",
      htmlContent: `<p>Reset your Motif password.</p><p><a href="${resetUrl}">Choose a new password</a></p><p>This link expires in 24 hours. If you did not request a reset, you can ignore this email.</p>`,
      textContent: `Reset your Motif password: ${resetUrl}\n\nThis link expires in 24 hours. If you did not request a reset, you can ignore this email.`,
      tags: ["motif-password-reset"],
    }),
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`Brevo password reset email failed (${response.status}): ${responseText}`);
  }
}

export async function requestPasswordReset(rawEmail: string) {
  const email = rawEmail.trim().toLowerCase();
  const sql = getDatabase();
  const rows = await sql`
    SELECT id::text AS id, email
    FROM public.users
    WHERE lower(email) = ${email}
      AND password_hash IS NOT NULL
    LIMIT 1
  ` as Array<{ id: string; email: string | null }>;

  const user = rows[0];
  if (!user?.email) return;

  const recent = await sql`
    SELECT created_at
    FROM public.motif_password_reset_tokens
    WHERE user_id = ${user.id}::integer
      AND created_at > now() - interval '5 minutes'
    ORDER BY created_at DESC
    LIMIT 1
  `;

  if (recent.length > 0) return;

  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + tokenLifetimeMs);

  await sql`
    DELETE FROM public.motif_password_reset_tokens
    WHERE user_id = ${user.id}::integer
      AND consumed_at IS NULL
  `;
  await sql`
    INSERT INTO public.motif_password_reset_tokens (token_hash, user_id, expires_at)
    VALUES (${tokenHash}, ${user.id}::integer, ${expiresAt})
  `;

  const resetUrl = new URL("/reset-password", applicationUrl());
  resetUrl.searchParams.set("token", token);

  try {
    await deliverPasswordResetEmail(user.email, resetUrl.toString());
  } catch (error) {
    await sql`
      DELETE FROM public.motif_password_reset_tokens
      WHERE token_hash = ${tokenHash}
    `;
    throw error;
  }
}

export async function consumePasswordResetToken(token: string) {
  if (!token || token.length > 256) return null;

  const sql = getDatabase();
  const tokenHash = hashToken(token);
  const rows = await sql`
    UPDATE public.motif_password_reset_tokens AS reset
    SET consumed_at = now()
    WHERE reset.token_hash = ${tokenHash}
      AND reset.consumed_at IS NULL
      AND reset.expires_at > now()
    RETURNING reset.user_id::text AS user_id
  ` as Array<{ user_id: string }>;

  return rows[0]?.user_id ?? null;
}

export async function resetPasswordWithToken(token: string, password: string) {
  const userId = await consumePasswordResetToken(token);
  if (!userId) return false;

  const updated = await updatePasswordHash(userId, password);
  return Boolean(updated);
}
