import assert from "node:assert/strict";
import test from "node:test";
import {
  createDesignBrief,
  createDesignDescription,
  createDesignVariation,
  DESIGN_FEELINGS,
  getGuardrailResponse,
  GUARDRAIL_CATEGORIES,
  INSPIRATION_SOURCES,
  UNIQUE_DETAILS,
} from "../src/lib/cake-design.mjs";

test("design response logic: every approved choice appears in the personalized description", () => {
  for (const feeling of DESIGN_FEELINGS) {
    for (const uniqueDetail of UNIQUE_DETAILS) {
      for (const inspiration of INSPIRATION_SOURCES) {
        const description = createDesignDescription({ feeling, uniqueDetail, inspiration });
        assert.match(description.toLowerCase(), new RegExp(feeling.toLowerCase()));
        assert.match(description.toLowerCase(), new RegExp(uniqueDetail.toLowerCase()));
        assert.match(description.toLowerCase(), new RegExp(inspiration.toLowerCase()));
      }
    }
  }
});

test("design response logic: output is deterministic and makes no price or safety promise", () => {
  const answers = {
    feeling: "Romantic",
    uniqueDetail: "Flowers",
    inspiration: "Personal memory",
  };
  const first = createDesignDescription(answers);
  assert.equal(createDesignDescription(answers), first);
  assert.match(first, /A cake designer can adapt this idea/);
  assert.doesNotMatch(first, /event|guest|flavor|style|budget|MXN|price|quote|allergy|safe|available/i);
});

test("design response logic: rejects values outside the approved option sets", () => {
  assert.throws(() => createDesignDescription({
    feeling: "Calm",
    uniqueDetail: "Flowers",
    inspiration: "Personal memory",
  }), /supported cake feeling/);
  assert.throws(() => createDesignDescription({
    feeling: "Fun",
    uniqueDetail: "Glitter",
    inspiration: "Pinterest idea",
  }), /supported unique cake detail/);
  assert.throws(() => createDesignDescription({
    feeling: "Fun",
    uniqueDetail: "Textures",
    inspiration: "A random image",
  }), /supported inspiration source/);
});

test("design variation logic: creates a different deterministic concept from the same three answers", () => {
  const answers = {
    feeling: "Romantic",
    uniqueDetail: "Flowers",
    inspiration: "Personal memory",
  };
  const original = createDesignDescription(answers);
  const variation = createDesignVariation(answers, original);

  assert.notEqual(variation, original);
  assert.equal(createDesignVariation(answers, original), variation);
  assert.match(variation.toLowerCase(), /romantic/);
  assert.match(variation.toLowerCase(), /flowers/);
  assert.match(variation.toLowerCase(), /personal memory/);
});

test("design variation logic: offers multiple choices and cycles without returning the current design", () => {
  const answers = {
    feeling: "Fun",
    uniqueDetail: "Creative shape",
    inspiration: "Special theme",
  };
  const first = createDesignVariation(answers, createDesignDescription(answers));
  const second = createDesignVariation(answers, first);
  const third = createDesignVariation(answers, second);
  const next = createDesignVariation(answers, third);

  assert.notEqual(first, second);
  assert.notEqual(second, third);
  assert.notEqual(third, first);
  assert.equal(next, first);
  assert.match(first.toLowerCase(), /fun/);
  assert.match(first.toLowerCase(), /creative shape/);
  assert.match(first.toLowerCase(), /special theme/);
});

test("design variation logic: rejects values outside the approved option sets", () => {
  assert.throws(() => createDesignVariation({
    feeling: "Calm",
    uniqueDetail: "Flowers",
    inspiration: "Personal memory",
  }, "Current idea"), /supported cake feeling/);
});

test("guardrail logic: every supported follow-up has a human confirmation response", () => {
  for (const category of GUARDRAIL_CATEGORIES) {
    const response = getGuardrailResponse(category);
    assert.ok(response.length > 30);
    assert.match(response, /can't|cannot/i);
  }
  assert.match(getGuardrailResponse("allergy_safety"), /confirm.*safe|confirm whether.*safe/i);
  assert.match(getGuardrailResponse("exact_price"), /can't provide or guarantee.*price/i);
  assert.throws(() => getGuardrailResponse("unsupported"), /supported follow-up topic/);
});

test("design brief logic: includes all selected design inputs and human confirmation note", () => {
  const brief = createDesignBrief({
    feeling: "Luxurious",
    uniqueDetail: "Textures",
    inspiration: "Favorite color palette",
    designDescription: "A sample design idea.",
  });
  assert.match(brief, /Feeling: Luxurious/);
  assert.match(brief, /Unique detail: Textures/);
  assert.match(brief, /Inspiration: Favorite color palette/);
  assert.match(brief, /A sample design idea/);
  assert.match(brief, /not a confirmed order/);
});
