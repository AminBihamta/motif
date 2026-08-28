export type VibeAnalysis = {
  vibeName: string;
  description: string;
  characteristics: string[];
  colors: string[];
  preferenceInsights: string[];
  searchQuery: string;
};

export type AnalyzeImagesState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; analysis: VibeAnalysis };

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function isVibeAnalysis(value: unknown): value is VibeAnalysis {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const result = value as Record<string, unknown>;

  return (
    typeof result.vibeName === "string" &&
    typeof result.description === "string" &&
    isStringArray(result.characteristics) &&
    isStringArray(result.colors) &&
    isStringArray(result.preferenceInsights) &&
    typeof result.searchQuery === "string"
  );
}
