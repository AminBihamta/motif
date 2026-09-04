import "server-only";

import { compare, hash } from "bcryptjs";
import { getDatabase } from "./db";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function authenticatePasswordUser(credentials: Record<string, unknown> | undefined) {
  const email = typeof credentials?.email === "string"
    ? normalizeEmail(credentials.email)
    : "";
  const password = typeof credentials?.password === "string"
    ? credentials.password
    : "";

  if (!emailPattern.test(email) || password.length === 0) {
    return null;
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

  if (!user?.password_hash || !(await compare(password, user.password_hash))) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
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

export function isValidEmail(email: string) {
  return emailPattern.test(normalizeEmail(email));
}
