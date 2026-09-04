import { get } from "@vercel/blob";
import type { NextRequest } from "next/server";
import { auth } from "../../../../auth";
import {
  anonymousOwnerCookie,
  getOwnedTasteProfileImage,
} from "../../../lib/taste-profile";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const anonymousOwnerId = request.cookies.get(anonymousOwnerCookie)?.value;
  const session = await auth();
  const userId = session?.user?.id;

  if (
    (!anonymousOwnerId || !uuidPattern.test(anonymousOwnerId)) &&
    !userId ||
    !uuidPattern.test(id)
  ) {
    return new Response(null, { status: 404 });
  }

  const image = await getOwnedTasteProfileImage(
    id,
    anonymousOwnerId && uuidPattern.test(anonymousOwnerId)
      ? anonymousOwnerId
      : "00000000-0000-0000-0000-000000000000",
    userId,
  );

  if (!image) {
    return new Response(null, { status: 404 });
  }

  try {
    const blob = await get(image.blobPathname, {
      access: "private",
      ifNoneMatch: request.headers.get("if-none-match") ?? undefined,
    });

    if (!blob) {
      return new Response(null, { status: 404 });
    }

    if (blob.statusCode === 304) {
      return new Response(null, {
        status: 304,
        headers: {
          ETag: blob.blob.etag,
          "Cache-Control": "private, max-age=3600",
        },
      });
    }

    return new Response(blob.stream, {
      headers: {
        "Content-Type": image.contentType,
        "Content-Length": String(blob.blob.size),
        "Cache-Control": "private, max-age=3600",
        ETag: blob.blob.etag,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Failed to read a private taste image:", error);
    return new Response(null, { status: 502 });
  }
}
