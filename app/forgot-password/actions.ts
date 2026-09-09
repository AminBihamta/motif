"use server";

import { isValidEmail } from "../lib/auth-users";
import {
  assertHumanRequest,
  BotProtectionError,
} from "../lib/bot-protection";
import { requestPasswordReset } from "../lib/password-reset";

export type ForgotPasswordState = {
  error?: string;
  notice?: string;
};

export async function requestPasswordResetAction(
  _previousState: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  try {
    await assertHumanRequest();
  } catch (error) {
    if (error instanceof BotProtectionError) {
      return { error: error.message };
    }
    throw error;
  }

  const email = typeof formData.get("email") === "string"
    ? String(formData.get("email"))
    : "";

  if (!isValidEmail(email)) {
    return { error: "Enter a valid email address." };
  }

  try {
    await requestPasswordReset(email);
  } catch (error) {
    console.error("Password reset request failed:", error);
    return {
      error:
        "We could not send a reset email right now. Please try again in a moment.",
    };
  }

  return {
    notice:
      "If an account exists for that email, a password reset link is on its way.",
  };
}
