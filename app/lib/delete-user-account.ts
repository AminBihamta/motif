import "server-only";

import { del } from "@vercel/blob";
import { getDatabase } from "./db";

export async function deleteUserAccountData(userId: string, email?: string | null) {
  const sql = getDatabase();

  const blobRows = await sql`
    SELECT image.blob_pathname
    FROM public.taste_profile_images AS image
    INNER JOIN public.taste_profiles AS profile
      ON profile.id = image.profile_id
    WHERE profile.user_id = ${userId}
  ` as Array<{ blob_pathname: string }>;

  const pathnames = blobRows
    .map((row) => row.blob_pathname)
    .filter((pathname) => typeof pathname === "string" && pathname.length > 0);

  if (pathnames.length > 0) {
    try {
      await del(pathnames);
    } catch (error) {
      console.error("Failed to clean up account Blob images:", error);
    }
  }

  await sql`
    DELETE FROM public.taste_profiles
    WHERE user_id = ${userId}
  `;

  await sql`
    DELETE FROM public.motif_usage_allowances
    WHERE user_id = ${userId}
  `;

  const normalizedEmail = email?.trim().toLowerCase();
  if (normalizedEmail) {
    await sql`
      DELETE FROM public.verification_token
      WHERE lower(identifier) = ${normalizedEmail}
    `;
  }

  await sql`
    DELETE FROM public.users
    WHERE id::text = ${userId}
  `;
}
