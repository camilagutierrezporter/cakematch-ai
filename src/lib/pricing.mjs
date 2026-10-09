export const DEFAULT_PRICES = {
  plannerPlusPrice: 99,
  bakeryProPrice: 399,
};

export const SCENARIO_PRESETS = {
  Conservador: {
    freePlannerUsers: 100,
    plannerPlusSubscribers: 20,
    bakeryProSubscribers: 5,
    ...DEFAULT_PRICES,
  },
  Optimista: {
    freePlannerUsers: 300,
    plannerPlusSubscribers: 60,
    bakeryProSubscribers: 15,
    ...DEFAULT_PRICES,
  },
};

export function calculateMonthlyRevenue(inputs) {
  return (
    inputs.plannerPlusSubscribers * inputs.plannerPlusPrice +
    inputs.bakeryProSubscribers * inputs.bakeryProPrice
  );
}

export function calculateAnnualRevenue(inputs) {
  return calculateMonthlyRevenue(inputs) * 12;
}

export function validatePricingInputs(inputs) {
  const values = Object.values(inputs);

  if (!values.every(Number.isFinite)) {
    return "Escribe solo números válidos en todos los campos.";
  }

  if (inputs.freePlannerUsers < 0 || inputs.plannerPlusSubscribers < 0 || inputs.bakeryProSubscribers < 0) {
    return "El número de clientes no puede ser negativo.";
  }

  if (!Number.isInteger(inputs.freePlannerUsers) || !Number.isInteger(inputs.plannerPlusSubscribers) || !Number.isInteger(inputs.bakeryProSubscribers)) {
    return "El número de clientes debe ser un número entero.";
  }

  if (inputs.plannerPlusPrice < 0 || inputs.bakeryProPrice < 0) {
    return "El precio mensual no puede ser negativo.";
  }

  return null;
}

export function createPricingScenarioInsert(name, scenarioType, inputs) {
  const monthlyRevenue = calculateMonthlyRevenue(inputs);

  return {
    name: name.trim(),
    scenario_type: scenarioType,
    customer_counts: {
      freePlannerUsers: inputs.freePlannerUsers,
      plannerPlusSubscribers: inputs.plannerPlusSubscribers,
      bakeryProSubscribers: inputs.bakeryProSubscribers,
    },
    monthly_prices: {
      plannerPlusPrice: inputs.plannerPlusPrice,
      bakeryProPrice: inputs.bakeryProPrice,
    },
    monthly_revenue: monthlyRevenue,
    annual_revenue: monthlyRevenue * 12,
  };
}
