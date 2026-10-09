export type PricingInputs = {
  freePlannerUsers: number;
  plannerPlusSubscribers: number;
  bakeryProSubscribers: number;
  plannerPlusPrice: number;
  bakeryProPrice: number;
};

export type PricingScenarioType = "Conservador" | "Optimista";

export type SavedPricingScenario = {
  id: string;
  created_at: string;
  name: string;
  scenario_type: PricingScenarioType;
  customer_counts: Pick<PricingInputs, "freePlannerUsers" | "plannerPlusSubscribers" | "bakeryProSubscribers">;
  monthly_prices: Pick<PricingInputs, "plannerPlusPrice" | "bakeryProPrice">;
  monthly_revenue: number;
  annual_revenue: number;
};

export type PricingScenarioInsert = Omit<SavedPricingScenario, "id" | "created_at">;

export const DEFAULT_PRICES: Pick<PricingInputs, "plannerPlusPrice" | "bakeryProPrice">;
export const SCENARIO_PRESETS: Record<PricingScenarioType, PricingInputs>;
export function calculateMonthlyRevenue(inputs: PricingInputs): number;
export function calculateAnnualRevenue(inputs: PricingInputs): number;
export function validatePricingInputs(inputs: PricingInputs): string | null;
export function createPricingScenarioInsert(name: string, scenarioType: PricingScenarioType, inputs: PricingInputs): PricingScenarioInsert;
