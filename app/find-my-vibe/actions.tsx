"use server";

import { Buffer } from "node:buffer";
import { randomUUID } from "node:crypto";
import { del, put } from "@vercel/blob";
import {
  isVibeAnalysis,
  type AnalyzeImagesState,
} from "../lib/vibe-analysis";
import {
  getOrCreateAnonymousOwnerId,
  saveTasteProfile,
} from "../lib/taste-profile";
import { REQUIRED_IMAGE_COUNT } from "../lib/upload-constraints";

const acceptedTypes = new Set(["image/jpeg", "image/png"]);
const maxFileSize = 5 * 1024 * 1024;

async function deleteBlobs(pathnames: string[], context: string) {
  if (pathnames.length === 0) return;

  try {
    await del(pathnames);
  } catch (error) {
    console.error(`Failed to clean up ${context}:`, error);
  }
}

type OpenRouterResponse = {
  model?: string;
  error?: unknown;
  choices?: Array<{
    finish_reason?: string | null;
    message?: {
      content?: unknown;
      refusal?: unknown;
    };
  }>;
};

const vibeAnalysisSchema = {
  type: "object",
  properties: {
    vibeName: { type: "string" },
    description: { type: "string" },
    characteristics: {
      type: "array",
      items: { type: "string" },
      minItems: 2,
    },
    colors: {
      type: "array",
      items: { type: "string" },
      minItems: 2,
    },
    preferenceInsights: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      maxItems: 5,
    },
    searchQuery: { type: "string" },
  },
  required: [
    "vibeName",
    "description",
    "characteristics",
    "colors",
    "preferenceInsights",
    "searchQuery",
  ],
  additionalProperties: false,
} as const;

function getTextContent(content: unknown) {
  if (typeof content === "string") {
    return content;
  }

  if (!Array.isArray(content)) {
    return null;
  }

  const text = content
    .filter(
      (part): part is { type: "text"; text: string } =>
        typeof part === "object" &&
        part !== null &&
        (part as { type?: unknown }).type === "text" &&
        typeof (part as { text?: unknown }).text === "string",
    )
    .map((part) => part.text)
    .join("")
    .trim();

  return text || null;
}

export async function analyzeImages(
  _previousState: AnalyzeImagesState,
  formData: FormData,
): Promise<AnalyzeImagesState> {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  const OPENROUTER_MODEL =
    process.env.OPENROUTER_MODEL ??
    "dots-studio/dots-3-note-preview:free";

  if (!OPENROUTER_API_KEY) {
    return { status: "error", message: "OpenRouter API key is missing." };
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { status: "error", message: "Image storage is not configured." };
  }

  const files = Array.from({ length: REQUIRED_IMAGE_COUNT }, (_, index) => {
    return formData.get(`file${index + 1}`);
  }).filter((file): file is File => file instanceof File && file.size > 0);

  if (files.length !== REQUIRED_IMAGE_COUNT) {
    return {
      status: "error",
      message: `Please upload ${REQUIRED_IMAGE_COUNT} images.`,
    };
  }

  for (const file of files) {
    if (!acceptedTypes.has(file.type)) {
      return {
        status: "error",
        message: "Only JPG and PNG files are allowed.",
      };
    }

    if (file.size > maxFileSize) {
      return {
        status: "error",
        message: "Each image must be smaller than 5 MB.",
      };
    }
  }

  try {
    const base64Files = await Promise.all(
      files.map(async (file) => {
        const fileBinary = await file.arrayBuffer();
        const base64 = Buffer.from(fileBinary).toString("base64");

        return `data:${file.type};base64,${base64}`;
      }),
    );

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          temperature: 0.2,
          max_tokens: 2500,
          reasoning: {
            enabled: false,
          },
          provider: {
            require_parameters: true,
          },
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "vibe_analysis",
              strict: true,
              schema: vibeAnalysisSchema,
            },
          },
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `
  Analyze these images together as one mood board.

  Identify a recognizable and searchable visual style, such as
  "mid-century modern", "Scandinavian minimalism", or "dark academia".

  Return only valid JSON with this structure:
  {
    "vibeName": "short recognizable style name",
    "description": "one or two sentence explanation",
    "characteristics": ["characteristic 1", "characteristic 2"],
    "colors": ["color 1", "color 2"],
    "preferenceInsights": [
      "You seem drawn to spacious, open layouts",
      "You appear to prefer warm natural materials"
    ],
    "searchQuery": "a useful query for searching Pexels"
  }

  Give 3 to 5 preference insights based only on visible patterns shared by
  the uploaded images. Write them directly to the user using tentative phrases
  such as "you seem drawn to" or "you may prefer". Discuss visual preferences
  like scale, openness, decoration, color, materials, shapes, and atmosphere.
  Do not infer sensitive traits, identity, wealth, health, or personality.

  Do not include Markdown or code fences.
                  `.trim(),
                },
                ...base64Files.map((url) => ({
                  type: "image_url",
                  image_url: {
                    url,
                  },
                })),
              ],
            },
          ],
        }),
      },
    );

    const responseText = await response.text();

    if (!response.ok) {
      console.error("OpenRouter error:", response.status, responseText);

      return {
        status: "error",
        message: "The AI service could not analyze your images.",
      };
    }

    const data = JSON.parse(responseText) as OpenRouterResponse;
    const choice = data.choices?.[0];
    const content = getTextContent(choice?.message?.content);

    if (!content) {
      console.error("OpenRouter returned no text content:", {
        model: data.model,
        finishReason: choice?.finish_reason,
        refusal: choice?.message?.refusal,
        error: data.error,
      });

      return {
        status: "error",
        message:
          "The selected free AI model did not return an answer. Please try again.",
      };
    }

    const normalizedContent = content
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
    const analysis: unknown = JSON.parse(normalizedContent);

    if (!isVibeAnalysis(analysis)) {
      return {
        status: "error",
        message: "The AI response was missing required information.",
      };
    }

    const anonymousOwnerId = await getOrCreateAnonymousOwnerId();
    const analysisRunId = randomUUID();
    const uploadResults = await Promise.allSettled(
      files.map((file, index) => {
        const extension = file.type === "image/png" ? "png" : "jpg";
        const pathname = [
          "taste-profiles",
          anonymousOwnerId,
          analysisRunId,
          `${index + 1}.${extension}`,
        ].join("/");

        return put(pathname, file, {
          access: "private",
          addRandomSuffix: false,
          contentType: file.type,
          maximumSizeInBytes: maxFileSize,
        });
      }),
    );
    const uploadedBlobs = uploadResults.flatMap((result) =>
      result.status === "fulfilled" ? [result.value] : [],
    );
    const uploadFailure = uploadResults.find(
      (result) => result.status === "rejected",
    );

    if (uploadFailure) {
      await deleteBlobs(
        uploadedBlobs.map((blob) => blob.pathname),
        "partially uploaded taste images",
      );
      console.error("Taste image upload failed:", uploadFailure.reason);

      return {
        status: "error",
        message: "Your analysis succeeded, but the images could not be saved.",
      };
    }

    const storedImages = uploadedBlobs.map((blob, index) => ({
      position: index + 1,
      blobPathname: blob.pathname,
      contentType: files[index].type,
    }));

    let oldBlobPathnames: string[];

    try {
      oldBlobPathnames = await saveTasteProfile(
        anonymousOwnerId,
        analysis,
        storedImages,
      );
    } catch (error) {
      await deleteBlobs(
        uploadedBlobs.map((blob) => blob.pathname),
        "taste images after a database failure",
      );
      throw error;
    }

    await deleteBlobs(oldBlobPathnames, "replaced taste images");

    return {
      status: "success",
      analysis,
    };
  } catch (error) {
    console.error("Image analysis failed:", error);

    return {
      status: "error",
      message: "Something went wrong while analyzing your images.",
    };
  }
}
