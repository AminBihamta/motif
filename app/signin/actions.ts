"use server";

import {
  createPasswordUser,
  isValidEmail,
  normalizeEmail,
} from "../lib/auth-users";
import {
  sendEmailVerification,
  sendEmailVerificationForAddress,
} from "../lib/email-verification";

export type RegistrationState = {
  error?: string;
  notice?: string;
};

export async function registerAccount(
  _previousState: RegistrationState,
  formData: FormData,
): Promise<RegistrationState> {
  const name = typeof formData.get("name") === "string"
    ? String(formData.get("name")).trim()
    : "";
  const email = typeof formData.get("email") === "string"
    ? String(formData.get("email"))
    : "";
  const password = typeof formData.get("password") === "string"
    ? String(formData.get("password"))
    : "";
  const confirmation = typeof formData.get("passwordConfirmation") === "string"
    ? String(formData.get("passwordConfirmation"))
    : "";
  if (name.length < 1 || name.length > 80) {
    return { error: "Enter a name between 1 and 80 characters." };
  }

  if (!isValidEmail(email)) {
    return { error: "Enter a valid email address." };
  }

  if (password.length < 8 || password.length > 72) {
    return { error: "Use a password between 8 and 72 characters." };
  }

  if (password !== confirmation) {
    return { error: "The passwords do not match." };
  }

  let userId: string | null;

  try {
    userId = await createPasswordUser(name, normalizeEmail(email), password);

    if (!userId) {
      return { error: "We could not create that account. Please try again." };
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("users_email_unique")) {
      return { error: "An account already exists for that email." };
    }

    console.error("Account registration failed:", error);
    return { error: "We could not create that account. Please try again." };
  }

  try {
    await sendEmailVerification(userId, normalizeEmail(email));
  } catch (error) {
    console.error("Verification email after registration failed:", error);
    return {
      notice: "Your account was created, but we could not send the verification email. Use the resend form below once Brevo is configured.",
    };
  }

  return {
    notice: "Check your inbox for a verification link. Your five analyses and five searches per week unlock after you verify your email.",
  };
}

export async function resendVerification(
  _previousState: RegistrationState,
  formData: FormData,
): Promise<RegistrationState> {
  const email = typeof formData.get("email") === "string"
    ? String(formData.get("email"))
    : "";

  if (!isValidEmail(email)) {
    return { error: "Enter a valid email address." };
  }

  try {
    await sendEmailVerificationForAddress(email);
  } catch (error) {
    console.error("Verification resend failed:", error);
  }

  return {
    notice: "If that address has an unverified Motif account, a new link is on its way.",
  };
}
