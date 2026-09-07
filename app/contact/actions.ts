"use server";

import {
  assertHumanRequest,
  BotProtectionError,
} from "../lib/bot-protection";

export type ContactFormState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

const SUCCESS_MESSAGE =
  "Thank you for your enquiry, I’ll get back to you as soon as possible!";

// Portfolio exposes a trusted submit route; direct /api/form-submissions create is locked.
const DEFAULT_FORM_SUBMIT_URL =
  "https://aminbihamta.com/api/forms/motif/submit";

function readField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitContactForm(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  try {
    await assertHumanRequest();
  } catch (error) {
    if (error instanceof BotProtectionError) {
      return { status: "error", message: error.message };
    }
    throw error;
  }

  const name = readField(formData, "name");
  const email = readField(formData, "email");
  const enquiry = readField(formData, "enquiry");

  if (!name || !email || !enquiry) {
    return {
      status: "error",
      message: "Please fill in your name, email, and enquiry.",
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      status: "error",
      message: "Please enter a valid email address.",
    };
  }

  const formUrl =
    process.env.MOTIF_CONTACT_FORM_URL?.trim() || DEFAULT_FORM_SUBMIT_URL;

  try {
    // Field names must match the Payload form field `name` values on form slug "motif".
    const payload = new FormData();
    payload.set("Name", name);
    payload.set("Email Address", email);
    payload.set("Enquiry", enquiry);

    const response = await fetch(formUrl, {
      method: "POST",
      body: payload,
      cache: "no-store",
    });

    if (!response.ok) {
      const body = await response.text();
      console.error("Contact form submission failed:", response.status, body);
      return {
        status: "error",
        message: "Something went wrong sending your enquiry. Please try again.",
      };
    }

    return { status: "success", message: SUCCESS_MESSAGE };
  } catch (error) {
    console.error("Contact form submission error:", error);
    return {
      status: "error",
      message: "Something went wrong sending your enquiry. Please try again.",
    };
  }
}
