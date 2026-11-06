export type DesignFeeling =
  | "Romantic"
  | "Fun"
  | "Luxurious"
  | "Nostalgic"
  | "Surprising";

export type UniqueCakeDetail =
  | "Personal details"
  | "Flowers"
  | "Textures"
  | "Special decorations"
  | "Creative shape";

export type CakeInspirationSource =
  | "Pinterest idea"
  | "Favorite color palette"
  | "Personal memory"
  | "Special theme";

export type DesignGuardrailCategory =
  | "allergy_safety"
  | "feasibility"
  | "exact_price"
  | "availability"
  | "ordering"
  | "other";

export type CakeDesignTranscriptMessage = {
  id: number;
  role: "assistant" | "user";
  message_type: "prompt" | "selection" | "design" | "guardrail";
  content: string;
};

export const DESIGN_FEELINGS: readonly DesignFeeling[];
export const UNIQUE_DETAILS: readonly UniqueCakeDetail[];
export const INSPIRATION_SOURCES: readonly CakeInspirationSource[];
export const GUARDRAIL_CATEGORIES: readonly DesignGuardrailCategory[];

export function createDesignDescription(answers: {
  feeling: DesignFeeling;
  uniqueDetail: UniqueCakeDetail;
  inspiration: CakeInspirationSource;
}): string;

export function getGuardrailResponse(category: DesignGuardrailCategory): string;

export function createDesignBrief(design: {
  feeling: DesignFeeling;
  uniqueDetail: UniqueCakeDetail;
  inspiration: CakeInspirationSource;
  designDescription: string;
}): string;
