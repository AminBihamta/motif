import "server-only";

import { compare, hash } from "bcryptjs";
import { getDatabase } from "./db";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export type PasswordAuthUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
};

export type PasswordAuthResult =
  | { ok: true; user: PasswordAuthUser }
  | {
      ok: false;
      reason: "invalid_input" | "account_not_found" | "incorrect_password" | "oauth_only";
    };

export async function authenticatePasswordUser(
  credentials: Record<string, unknown> | undefined,
): Promise<PasswordAuthResult> {
  const email = typeof credentials?.email === "string"
    ? normalizeEmail(credentials.email)
    : "";
  const password = typeof credentials?.password === "string"
    ? credentials.password
    : "";

  if (!emailPattern.test(email) || password.length === 0) {
    return { ok: false, reason: "invalid_input" };
  }

  const sql = getDatabase();
  const rows = await sql`
    SELECT id::text AS id, name, email, image, password_hash
    FROM public.users
    WHERE lower(email) = ${email}
    LIMIT 1
  ` as Array<{
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    password_hash: string | null;
  }>;
  const user = rows[0];

  if (!user) {
    return { ok: false, reason: "account_not_found" };
  }

  if (!user.password_hash) {
    return { ok: false, reason: "oauth_only" };
  }

  if (!(await compare(password, user.password_hash))) {
    return { ok: false, reason: "incorrect_password" };
  }

  return {
    ok: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    },
  };
}

export async function createPasswordUser(name: string, email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  const sql = getDatabase();
  const passwordHash = await hash(password, 12);
  const rows = await sql`
    INSERT INTO public.users (name, email, password_hash)
    VALUES (${name.trim()}, ${normalizedEmail}, ${passwordHash})
    RETURNING id::text AS id
  ` as Array<{ id: string }>;

  return rows[0]?.id ?? null;
}

export async function updatePasswordHash(userId: string, password: string) {
  if (password.length < 8 || password.length > 72) {
    throw new Error("Use a password between 8 and 72 characters.");
  }

  const sql = getDatabase();
  const passwordHash = await hash(password, 12);
  const rows = await sql`
    UPDATE public.users
    SET password_hash = ${passwordHash}
    WHERE id::text = ${userId}
      AND password_hash IS NOT NULL
    RETURNING id::text AS id
  ` as Array<{ id: string }>;

  return rows[0]?.id ?? null;
}

export function isValidEmail(email: string) {
  return emailPattern.test(normalizeEmail(email));
}
