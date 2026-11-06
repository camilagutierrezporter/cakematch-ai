export const DESIGN_FEELINGS = Object.freeze([
  "Romantic",
  "Fun",
  "Luxurious",
  "Nostalgic",
  "Surprising",
]);

export const UNIQUE_DETAILS = Object.freeze([
  "Personal details",
  "Flowers",
  "Textures",
  "Special decorations",
  "Creative shape",
]);

export const INSPIRATION_SOURCES = Object.freeze([
  "Pinterest idea",
  "Favorite color palette",
  "Personal memory",
  "Special theme",
]);

export const GUARDRAIL_CATEGORIES = Object.freeze([
  "allergy_safety",
  "feasibility",
  "exact_price",
  "availability",
  "ordering",
  "other",
]);

const feelingDescriptions = {
  Romantic: "soft, romantic details and flowing lines",
  Fun: "playful details, lively shapes, and cheerful contrast",
  Luxurious: "a polished finish and refined, elegant details",
  Nostalgic: "vintage-inspired forms and familiar, warm details",
  Surprising: "an unexpected silhouette and bold visual contrast",
};

const uniqueDetailDescriptions = {
  "Personal details": "a personal detail as its focal point",
  Flowers: "flowers as its focal point",
  Textures: "layered textures as its focal point",
  "Special decorations": "one special decoration as its focal point",
  "Creative shape": "a distinctive cake shape as its focal point",
};

const inspirationDescriptions = {
  "Pinterest idea": "a Pinterest idea you like",
  "Favorite color palette": "your favorite color palette",
  "Personal memory": "a personal memory",
  "Special theme": "a special theme",
};

const guardrailResponses = {
  allergy_safety:
    "I can't confirm whether a cake is safe for an allergy or dietary need. Please speak directly with a cake designer or baker and confirm ingredients and cross-contact precautions.",
  feasibility:
    "I can't confirm that a design can be built exactly as described. A cake designer or baker can review the shape, decorations, and materials and suggest a practical version.",
  exact_price:
    "I can't provide or guarantee a cake price. A cake designer or baker needs to review the design and give you a quote.",
  availability:
    "I can't check a cake designer's schedule or confirm availability. Please contact the designer or bakery directly.",
  ordering:
    "I can't place or confirm an order. Please contact a cake designer or bakery directly to discuss the design and next steps.",
  other:
    "I can help with a simple cake design idea, but I can't answer that request. A cake designer or baker can help with details outside this guide.",
};

/**
 * @param {{ feeling: string, uniqueDetail: string, inspiration: string }} answers
 */
export function createDesignDescription(answers) {
  const { feeling, uniqueDetail, inspiration } = answers;

  if (!DESIGN_FEELINGS.includes(feeling)) {
    throw new TypeError("Choose a supported cake feeling.");
  }
  if (!UNIQUE_DETAILS.includes(uniqueDetail)) {
    throw new TypeError("Choose a supported unique cake detail.");
  }
  if (!INSPIRATION_SOURCES.includes(inspiration)) {
    throw new TypeError("Choose a supported inspiration source.");
  }

  return `Create a ${feeling.toLowerCase()} cake with ${feelingDescriptions[feeling]}. Make it unique with ${uniqueDetail.toLowerCase()}: ${uniqueDetailDescriptions[uniqueDetail]}. Let ${inspirationDescriptions[inspiration]} guide the colors and small details, so the finished concept connects the mood, focal point, and inspiration. A cake designer can adapt this idea into a practical design.`;
}

/**
 * @param {string} category
 */
export function getGuardrailResponse(category) {
  if (!GUARDRAIL_CATEGORIES.includes(category)) {
    throw new TypeError("Choose a supported follow-up topic.");
  }

  return guardrailResponses[category];
}

/**
 * @param {{ feeling: string, uniqueDetail: string, inspiration: string, designDescription: string }} design
 */
export function createDesignBrief(design) {
  const { feeling, uniqueDetail, inspiration, designDescription } = design;
  return [
    "Cake design brief — starting concept, not a confirmed order",
    `Feeling: ${feeling}`,
    `Unique detail: ${uniqueDetail}`,
    `Inspiration: ${inspiration}`,
    `Design idea: ${designDescription}`,
    "Please confirm feasibility, ingredients, safety, and final details with a cake designer or baker.",
  ].join("\n");
}
