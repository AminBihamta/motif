"use server";

import { redirect } from "next/navigation";
import {
  assertHumanRequest,
  BotProtectionError,
} from "../lib/bot-protection";
import { resetPasswordWithToken } from "../lib/password-reset";

export type ResetPasswordState = {
  error?: string;
};

export async function resetPasswordAction(
  _previousState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  try {
    await assertHumanRequest();
  } catch (error) {
    if (error instanceof BotProtectionError) {
      return { error: error.message };
    }
    throw error;
  }

  const token = typeof formData.get("token") === "string"
    ? String(formData.get("token"))
    : "";
  const password = typeof formData.get("password") === "string"
    ? String(formData.get("password"))
    : "";
  const confirmation = typeof formData.get("passwordConfirmation") === "string"
    ? String(formData.get("passwordConfirmation"))
    : "";

  if (!token) {
    return { error: "That reset link is invalid or has expired." };
  }

  if (password.length < 8 || password.length > 72) {
    return { error: "Use a password between 8 and 72 characters." };
  }

  if (password !== confirmation) {
    return { error: "The passwords do not match." };
  }

  try {
    const updated = await resetPasswordWithToken(token, password);
    if (!updated) {
      return { error: "That reset link is invalid or has expired." };
    }
  } catch (error) {
    console.error("Password reset failed:", error);
    return { error: "We could not update your password. Please try again." };
  }

  redirect("/signin?reset=success");
}
