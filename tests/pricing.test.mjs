import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateAnnualRevenue,
  calculateMonthlyRevenue,
  createPricingScenarioInsert,
  SCENARIO_PRESETS,
  validatePricingInputs,
} from "../src/lib/pricing.mjs";

const example = {
  freePlannerUsers: 100,
  plannerPlusSubscribers: 20,
  bakeryProSubscribers: 5,
  plannerPlusPrice: 99,
  bakeryProPrice: 399,
};

test("pricing logic 1: monthly revenue sums the paid tiers", () => {
  assert.equal(calculateMonthlyRevenue(example), 3975);
});

test("pricing logic 2: annual revenue is monthly revenue times twelve and free users add zero", () => {
  const annual = calculateAnnualRevenue(example);
  const withFreeUsers = calculateAnnualRevenue({ ...example, freePlannerUsers: 1000 });
  assert.equal(annual, 47700);
  assert.equal(withFreeUsers, annual);
});

test("software 1: rejects invalid counts and prices", () => {
  assert.match(validatePricingInputs({ ...example, freePlannerUsers: -1 }) ?? "", /no puede ser negativo/);
  assert.match(validatePricingInputs({ ...example, plannerPlusPrice: -1 }) ?? "", /no puede ser negativo/);
  assert.match(validatePricingInputs({ ...example, plannerPlusSubscribers: Number.NaN }) ?? "", /números válidos/);
  assert.match(validatePricingInputs({ ...example, plannerPlusSubscribers: 1.5 }) ?? "", /número entero/);
});

test("software 2: scenario presets provide two distinct, editable starting mixes", () => {
  assert.equal(SCENARIO_PRESETS.Conservador.plannerPlusSubscribers, 20);
  assert.equal(SCENARIO_PRESETS.Optimista.plannerPlusSubscribers, 60);
  assert.ok(calculateMonthlyRevenue(SCENARIO_PRESETS.Optimista) > calculateMonthlyRevenue(SCENARIO_PRESETS.Conservador));
});

test("software 3: creates a complete saved scenario payload from current inputs", () => {
  const payload = createPricingScenarioInsert("  First year  ", "Conservador", example);
  assert.equal(payload.name, "First year");
  assert.equal(payload.scenario_type, "Conservador");
  assert.equal(payload.customer_counts.freePlannerUsers, 100);
  assert.equal(payload.monthly_prices.bakeryProPrice, 399);
  assert.equal(payload.monthly_revenue, 3975);
  assert.equal(payload.annual_revenue, 47700);
});
