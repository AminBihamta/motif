import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { getDatabase } from "./db";
import {
  isVibeAnalysis,
  type VibeAnalysis,
} from "./vibe-analysis";

export const anonymousOwnerCookie = "motif_anonymous_owner";
const oneYearInSeconds = 60 * 60 * 24 * 365;
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type TasteProfileImageRow = {
  id: unknown;
  position: unknown;
};

type StoredTasteProfileImage = {
  position: number;
  blobPathname: string;
  contentType: string;
};

type OldBlobRow = {
  blob_pathname: unknown;
};

type OwnedImageRow = {
  blob_pathname: unknown;
  content_type: unknown;
};

export type TasteProfileImage = {
  id: string;
  position: number;
};

export type TasteProfile = VibeAnalysis & {
  images: TasteProfileImage[];
};

export async function getOrCreateAnonymousOwnerId() {
  const cookieStore = await cookies();
  const existingOwnerId = cookieStore.get(anonymousOwnerCookie)?.value;

  if (existingOwnerId && uuidPattern.test(existingOwnerId)) {
    return existingOwnerId;
  }

  const ownerId = randomUUID();

  cookieStore.set(anonymousOwnerCookie, ownerId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: oneYearInSeconds,
  });

  return ownerId;
}

export async function getAnonymousOwnerId() {
  const ownerId = (await cookies()).get(anonymousOwnerCookie)?.value;
  return ownerId && uuidPattern.test(ownerId) ? ownerId : undefined;
}

export async function saveTasteProfile(
  owner: { anonymousOwnerId?: string; userId?: string },
  analysis: VibeAnalysis,
  images: StoredTasteProfileImage[],
) {
  const sql = getDatabase();
  const imagePayload = JSON.stringify(images);
  const ownerId = owner.userId ?? owner.anonymousOwnerId;

  if (!ownerId) {
    throw new Error("A taste profile owner is required.");
  }

  const [profile] = owner.userId
    ? await sql`
        INSERT INTO public.taste_profiles (
          anonymous_id, user_id, vibe_name, description, characteristics,
          colors, preference_insights, search_query
        )
        VALUES (
          NULL, ${owner.userId}, ${analysis.vibeName}, ${analysis.description},
          ${JSON.stringify(analysis.characteristics)}::jsonb,
          ${JSON.stringify(analysis.colors)}::jsonb,
          ${JSON.stringify(analysis.preferenceInsights)}::jsonb,
          ${analysis.searchQuery}
        )
        ON CONFLICT (user_id) DO UPDATE SET
          vibe_name = EXCLUDED.vibe_name,
          description = EXCLUDED.description,
          characteristics = EXCLUDED.characteristics,
          colors = EXCLUDED.colors,
          preference_insights = EXCLUDED.preference_insights,
          search_query = EXCLUDED.search_query,
          updated_at = now()
        RETURNING id
      `
    : await sql`
        INSERT INTO public.taste_profiles (
          anonymous_id, user_id, vibe_name, description, characteristics,
          colors, preference_insights, search_query
        )
        VALUES (
          ${owner.anonymousOwnerId}::uuid, NULL, ${analysis.vibeName},
          ${analysis.description},
          ${JSON.stringify(analysis.characteristics)}::jsonb,
          ${JSON.stringify(analysis.colors)}::jsonb,
          ${JSON.stringify(analysis.preferenceInsights)}::jsonb,
          ${analysis.searchQuery}
        )
        ON CONFLICT (anonymous_id) DO UPDATE SET
          vibe_name = EXCLUDED.vibe_name,
          description = EXCLUDED.description,
          characteristics = EXCLUDED.characteristics,
          colors = EXCLUDED.colors,
          preference_insights = EXCLUDED.preference_insights,
          search_query = EXCLUDED.search_query,
          updated_at = now()
        RETURNING id
      `;

  const profileId = profile?.id;

  if (typeof profileId !== "string") {
    throw new Error("Taste profile could not be saved.");
  }

  const [oldBlobRows] = await sql.transaction([
    sql`
      SELECT image.blob_pathname
      FROM public.taste_profile_images AS image
      WHERE image.profile_id = ${profileId}::uuid
    `,
    sql`
      DELETE FROM public.taste_profile_images
      WHERE profile_id = ${profileId}::uuid
    `,
    sql`
      INSERT INTO public.taste_profile_images (
        profile_id,
        position,
        blob_pathname,
        content_type
      )
      SELECT
        profile.id,
        image.position,
        image."blobPathname",
        image."contentType"
      FROM public.taste_profiles AS profile
      CROSS JOIN jsonb_to_recordset(${imagePayload}::jsonb) AS image(
        position smallint,
        "blobPathname" text,
        "contentType" text
      )
      WHERE profile.id = ${profileId}::uuid
    `,
  ]);

  return (oldBlobRows as OldBlobRow[])
    .map((row) => row.blob_pathname)
    .filter((pathname): pathname is string => typeof pathname === "string");
}

export async function getTasteProfile(userId?: string): Promise<TasteProfile | null> {
  const anonymousOwnerId = (await cookies()).get(anonymousOwnerCookie)?.value;

  if (
    (!anonymousOwnerId || !uuidPattern.test(anonymousOwnerId)) &&
    !userId
  ) {
    return null;
  }

  const sql = getDatabase();
  const validAnonymousOwnerId =
    anonymousOwnerId && uuidPattern.test(anonymousOwnerId)
      ? anonymousOwnerId
      : null;
  const rows = await sql`
    SELECT
      id,
      vibe_name,
      description,
      characteristics,
      colors,
      preference_insights,
      search_query
    FROM public.taste_profiles
    WHERE (
      ${userId ?? null}::text IS NOT NULL
      AND user_id = ${userId ?? null}
    )
    OR (
      ${validAnonymousOwnerId}::uuid IS NOT NULL
      AND anonymous_id = ${validAnonymousOwnerId}::uuid
    )
    ORDER BY CASE WHEN user_id = ${userId ?? null} THEN 0 ELSE 1 END
    LIMIT 1
  `;
  const row = rows[0];

  if (!row) {
    return null;
  }

  const analysis: unknown = {
    vibeName: row.vibe_name,
    description: row.description,
    characteristics: row.characteristics,
    colors: row.colors,
    preferenceInsights: row.preference_insights,
    searchQuery: row.search_query,
  };

  if (!isVibeAnalysis(analysis)) {
    return null;
  }

  const imageRows = await sql`
    SELECT image.id, image.position
    FROM public.taste_profile_images AS image
    WHERE image.profile_id = ${row.id}::uuid
    ORDER BY image.position
  `;

  const images = (imageRows as TasteProfileImageRow[])
    .filter(
      (image): image is { id: string; position: number } =>
        typeof image.id === "string" && typeof image.position === "number",
    )
    .map(({ id, position }) => ({ id, position }));

  return { ...analysis, images };
}

export async function getOwnedTasteProfileImage(
  imageId: string,
  anonymousOwnerId: string,
  userId?: string,
) {
  const sql = getDatabase();
  const rows = await sql`
    SELECT image.blob_pathname, image.content_type
    FROM public.taste_profile_images AS image
    INNER JOIN public.taste_profiles AS profile
      ON profile.id = image.profile_id
    WHERE image.id = ${imageId}::uuid
      AND (
        profile.anonymous_id = ${anonymousOwnerId}::uuid
        OR (
          ${userId ?? null}::text IS NOT NULL
          AND profile.user_id = ${userId ?? null}
        )
      )
    LIMIT 1
  ` as OwnedImageRow[];
  const row = rows[0];

  if (
    !row ||
    typeof row.blob_pathname !== "string" ||
    typeof row.content_type !== "string"
  ) {
    return null;
  }

  return {
    blobPathname: row.blob_pathname,
    contentType: row.content_type,
  };
}

export async function claimAnonymousTasteProfile(userId: string) {
  const anonymousOwnerId = (await cookies()).get(anonymousOwnerCookie)?.value;

  if (!anonymousOwnerId || !uuidPattern.test(anonymousOwnerId) || !userId) {
    return false;
  }

  const sql = getDatabase();
  const rows = await sql`
    UPDATE public.taste_profiles AS anonymous_profile
    SET
      user_id = ${userId},
      anonymous_id = NULL,
      updated_at = now()
    WHERE anonymous_profile.anonymous_id = ${anonymousOwnerId}::uuid
      AND NOT EXISTS (
        SELECT 1
        FROM public.taste_profiles AS existing_profile
        WHERE existing_profile.user_id = ${userId}
      )
    RETURNING anonymous_profile.id
  ` as { id: unknown }[];

  return rows.length > 0;
}
