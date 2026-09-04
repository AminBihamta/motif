import { NextResponse } from "next/server";
import { verifyEmailToken } from "../lib/email-verification";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";

  try {
    const verified = await verifyEmailToken(token);
    const destination = new URL("/signin", request.url);
    destination.searchParams.set("verification", verified ? "success" : "invalid");
    return NextResponse.redirect(destination);
  } catch (error) {
    console.error("Email verification failed:", error);
    const destination = new URL("/signin", request.url);
    destination.searchParams.set("verification", "error");
    return NextResponse.redirect(destination);
  }
}
