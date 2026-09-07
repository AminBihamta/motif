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

const DEFAULT_FORM_URL = "https://aminbihamta.com/api/form-submissions";
const DEFAULT_FORM_ID = 4;

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
    process.env.MOTIF_CONTACT_FORM_URL?.trim() || DEFAULT_FORM_URL;
  const formId = Number(
    process.env.MOTIF_CONTACT_FORM_ID?.trim() || DEFAULT_FORM_ID,
  );

  if (!Number.isFinite(formId)) {
    return {
      status: "error",
      message: "Contact form is misconfigured. Please try again later.",
    };
  }

  try {
    const response = await fetch(formUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        form: formId,
        submissionData: [
          { field: "Name", value: name },
          { field: "Email Address", value: email },
          { field: "Enquiry", value: enquiry },
        ],
      }),
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
