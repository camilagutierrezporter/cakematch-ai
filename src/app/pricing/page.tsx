"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  calculateAnnualRevenue,
  calculateMonthlyRevenue,
  createPricingScenarioInsert,
  SCENARIO_PRESETS,
  validatePricingInputs,
  type PricingInputs,
  type PricingScenarioType,
  type SavedPricingScenario,
} from "@/lib/pricing.mjs";

const money = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
const LOCAL_STORAGE_KEY = "cakematch-pricing-scenarios";

function isLocalStorageAvailable() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const testKey = "__cakematch_storage_test__";
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

async function getSupabaseClient() {
  try {
    const { supabase } = await import("@/lib/supabase/client");
    return supabase;
  } catch {
    return null;
  }
}

function readLocalScenarios(): SavedPricingScenario[] {
  if (!isLocalStorageAvailable()) {
    throw new Error("Local browser storage is unavailable.");
  }

  const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedPricingScenario[]) : [];
  } catch {
    throw new Error("Stored pricing scenarios could not be read.");
  }
}

function writeLocalScenarios(scenarios: SavedPricingScenario[]) {
  if (!isLocalStorageAvailable()) {
    throw new Error("Local browser storage is unavailable.");
  }

  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(scenarios));
}

export default function PricingPage() {
  const [scenarioType, setScenarioType] = useState<PricingScenarioType>("Conservador");
  const [inputs, setInputs] = useState<PricingInputs>(SCENARIO_PRESETS.Conservador);
  const [scenarioName, setScenarioName] = useState("");
  const [savedScenarios, setSavedScenarios] = useState<SavedPricingScenario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const monthlyRevenue = useMemo(() => calculateMonthlyRevenue(inputs), [inputs]);
  const annualRevenue = useMemo(() => calculateAnnualRevenue(inputs), [inputs]);
  const validationError = validatePricingInputs(inputs);
  const scenarioOptionLabels: Record<PricingScenarioType, string> = {
    Conservador: "Conservative",
    Optimista: "Optimistic",
  };

  const loadSavedScenarios = useCallback(async () => {
    const client = await getSupabaseClient();

    if (client) {
      try {
        const { data, error: loadError } = await client
          .from("pricing_scenarios")
          .select("id, created_at, name, scenario_type, customer_counts, monthly_prices, monthly_revenue, annual_revenue")
          .order("created_at", { ascending: false })
          .limit(10);

        if (!loadError) {
          return (data ?? []) as SavedPricingScenario[];
        }
      } catch {
        // Fall back to local browser storage below.
      }
    }

    try {
      return readLocalScenarios();
    } catch {
      throw new Error("Could not load the scenarios. Neither Supabase nor browser storage is available.");
    }
  }, []);

  useEffect(() => {
    let active = true;
    loadSavedScenarios()
      .then((records) => {
        if (active) setSavedScenarios(records);
      })
      .catch(() => {
        if (active) setError("The scenarios could not be loaded. Neither Supabase nor browser storage is available.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, [loadSavedScenarios]);

  function changeScenario(next: PricingScenarioType) {
    setScenarioType(next);
    setInputs(SCENARIO_PRESETS[next]);
    setMessage("");
    setError("");
  }

  function updateInput(field: keyof PricingInputs, value: string) {
    setInputs((current) => ({ ...current, [field]: value === "" ? Number.NaN : Number(value) }));
    setMessage("");
  }

  async function saveScenario(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = scenarioName.trim();
    if (!trimmedName) {
      setError("Give the scenario a name before saving it.");
      return;
    }
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    setError("");
    setMessage("");
    const payload = createPricingScenarioInsert(trimmedName, scenarioType, inputs);

    try {
      const client = await getSupabaseClient();
      if (client) {
        const { error: saveError } = await client.from("pricing_scenarios").insert(payload);
        if (!saveError) {
          setSavedScenarios(await loadSavedScenarios());
          setScenarioName("");
          setMessage("Scenario saved.");
          setIsSaving(false);
          return;
        }
      }
    } catch {
      // Fall through to local browser storage below.
    }

    try {
      const localScenario: SavedPricingScenario = {
        id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `local-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        created_at: new Date().toISOString(),
        ...payload,
      };
      const existing = readLocalScenarios();
      const nextScenarios = [localScenario, ...existing].slice(0, 10);
      writeLocalScenarios(nextScenarios);
      setSavedScenarios(nextScenarios);
      setScenarioName("");
      setMessage("Scenario saved.");
    } catch {
      setError("Could not save the scenario. Neither Supabase nor browser storage is available.");
    } finally {
      setIsSaving(false);
    }
  }

  async function removeScenario(id: string) {
    setError("");

    try {
      const client = await getSupabaseClient();
      if (client) {
        const { error: deleteError } = await client.from("pricing_scenarios").delete().eq("id", id);
        if (!deleteError) {
          setSavedScenarios((current) => current.filter((scenario) => scenario.id !== id));
          return;
        }
      }
    } catch {
      // Fall through to local browser storage below.
    }

    try {
      const remaining = readLocalScenarios().filter((scenario) => scenario.id !== id);
      writeLocalScenarios(remaining);
      setSavedScenarios(remaining);
    } catch {
      setError("Could not delete the scenario. Neither Supabase nor browser storage is available.");
    }
  }

  return (
    <main>
      <nav className="site-nav" aria-label="Main navigation">
        <Link className="brand" href="/">CakeMatch <span>AI</span></Link>
        <div className="nav-links">
          <Link href="/product">Product</Link>
          <Link href="/pricing" aria-current="page">Pricing</Link>
          <Link href="/core">Plan an event</Link>
          <Link href="/research">Research</Link>
        </div>
      </nav>

      <section className="pricing-page" aria-labelledby="pricing-title">
        <div className="pricing-intro">
          <p className="eyebrow">Pricing simulator · Week 3</p>
          <h1 id="pricing-title">Try different scenarios.</h1>
          <p className="product-lead">Adjust the assumptions to estimate how the monthly and annual revenue of CakeMatch AI would look.</p>
          <p className="assumption-note">This is a planning exercise. The customers, prices, and revenue are editable assumptions, not real sales or a guaranteed forecast.</p>
        </div>

        <section className="pricing-tiers" aria-labelledby="pricing-tiers-title">
          <div className="section-heading"><p className="eyebrow">Three tiers</p><h2 id="pricing-tiers-title">Proposed monthly pricing</h2></div>
          <div className="tier-grid">
            <article className="tier-card"><p className="eyebrow">For celebrations</p><h3>Free Planner</h3><p className="tier-price">$0</p><p>Suggestions for cake or cupcakes, flavor, style, budget, and estimated price.</p></article>
            <article className="tier-card tier-featured"><p className="eyebrow">For multiple events</p><h3>Plus Planner</h3><p className="tier-price">$99 <span>MXN / month</span></p><p>The proposed idea includes saved plans and favorites.</p></article>
            <article className="tier-card"><p className="eyebrow">For bakeries</p><h3>Bakery Pro</h3><p className="tier-price">$399 <span>MXN / month</span></p><p>The proposed idea includes profile, catalog, and organized requests.</p></article>
          </div>
          <p className="assumption-note">The Free plan does not generate monthly subscription revenue; the simulator adds the two paid plans.</p>
        </section>

        <section className="simulator-card" aria-labelledby="simulator-title">
          <div className="simulator-heading"><div><p className="eyebrow">Explore</p><h2 id="simulator-title">Estimated revenue</h2></div><span className="status-pill status-proposed">Not real sales</span></div>
          <div className="scenario-toggle" role="group" aria-label="Select a scenario">
            {(["Conservador", "Optimista"] as const).map((option) => <button className={scenarioType === option ? "scenario-button is-active" : "scenario-button"} key={option} type="button" aria-pressed={scenarioType === option} onClick={() => changeScenario(option)}>{scenarioOptionLabels[option]}</button>)}
          </div>
          <p className="scenario-description">{scenarioType === "Conservador" ? "Example with fewer subscriptions to test initial adoption." : "Example with more subscriptions to compare a growth scenario."} You can change any value.</p>

          <div className="assumption-grid">
            <fieldset className="assumption-group"><legend>Segment: people planning events</legend>
              <label htmlFor="planner-free-count">Free Plan users (MXN $0)</label>
              <input id="planner-free-count" type="number" min="0" step="1" value={Number.isFinite(inputs.freePlannerUsers) ? inputs.freePlannerUsers : ""} onChange={(event) => updateInput("freePlannerUsers", event.target.value)} />
              <label htmlFor="planner-count">Plus Planner subscriptions</label>
              <input id="planner-count" type="number" min="0" step="1" value={Number.isFinite(inputs.plannerPlusSubscribers) ? inputs.plannerPlusSubscribers : ""} onChange={(event) => updateInput("plannerPlusSubscribers", event.target.value)} />
              <label htmlFor="planner-price">Monthly trial price (MXN)</label>
              <input id="planner-price" type="number" min="0" step="1" value={Number.isFinite(inputs.plannerPlusPrice) ? inputs.plannerPlusPrice : ""} onChange={(event) => updateInput("plannerPlusPrice", event.target.value)} />
            </fieldset>
            <fieldset className="assumption-group"><legend>Segment: independent bakeries</legend>
              <label htmlFor="bakery-count">Bakery Pro subscriptions</label>
              <input id="bakery-count" type="number" min="0" step="1" value={Number.isFinite(inputs.bakeryProSubscribers) ? inputs.bakeryProSubscribers : ""} onChange={(event) => updateInput("bakeryProSubscribers", event.target.value)} />
              <label htmlFor="bakery-price">Monthly trial price (MXN)</label>
              <input id="bakery-price" type="number" min="0" step="1" value={Number.isFinite(inputs.bakeryProPrice) ? inputs.bakeryProPrice : ""} onChange={(event) => updateInput("bakeryProPrice", event.target.value)} />
            </fieldset>
          </div>

          <div className="revenue-results" aria-live="polite"><article><span>Estimated monthly revenue</span><strong>{validationError ? "—" : money.format(monthlyRevenue)}</strong></article><article><span>Estimated annual revenue</span><strong>{validationError ? "—" : money.format(annualRevenue)}</strong><small>Monthly × 12</small></article></div>

          <div className="assumptions-table-wrap"><h3>Assumption table</h3><table className="assumptions-table"><thead><tr><th>Plan</th><th>Segment</th><th>Customers in scenario</th><th>Monthly price</th><th>Monthly revenue</th></tr></thead><tbody><tr><th>Free Planner</th><td>People planning events</td><td>{Number.isFinite(inputs.freePlannerUsers) ? inputs.freePlannerUsers : "—"}</td><td>{money.format(0)}</td><td>{money.format(0)}</td></tr><tr><th>Plus Planner</th><td>People planning events</td><td>{Number.isFinite(inputs.plannerPlusSubscribers) ? inputs.plannerPlusSubscribers : "—"}</td><td>{Number.isFinite(inputs.plannerPlusPrice) ? money.format(inputs.plannerPlusPrice) : "—"}</td><td>{Number.isFinite(inputs.plannerPlusSubscribers * inputs.plannerPlusPrice) ? money.format(inputs.plannerPlusSubscribers * inputs.plannerPlusPrice) : "—"}</td></tr><tr><th>Bakery Pro</th><td>Independent bakeries</td><td>{Number.isFinite(inputs.bakeryProSubscribers) ? inputs.bakeryProSubscribers : "—"}</td><td>{Number.isFinite(inputs.bakeryProPrice) ? money.format(inputs.bakeryProPrice) : "—"}</td><td>{Number.isFinite(inputs.bakeryProSubscribers * inputs.bakeryProPrice) ? money.format(inputs.bakeryProSubscribers * inputs.bakeryProPrice) : "—"}</td></tr></tbody></table></div>

          <form className="save-scenario-form" onSubmit={saveScenario}>
            <p className="assumption-note">Scenarios in this demo are stored in a public table and may be visible to other people. Do not save private information.</p>
            <label htmlFor="scenario-name">Name this scenario</label>
            <div className="save-scenario-row"><input id="scenario-name" value={scenarioName} maxLength={60} onChange={(event) => setScenarioName(event.target.value)} placeholder="e.g. Year 1" /><button className="primary-button" type="submit" disabled={isSaving || Boolean(validationError)}>{isSaving ? "Saving…" : "Save scenario"}</button></div>
            {validationError && <p className="form-message form-error" role="alert">{validationError}</p>}
            {error && <p className="form-message form-error" role="alert">{error}</p>}
            {message && <p className="form-message" role="status">{message}</p>}
          </form>
        </section>

        <section className="saved-scenarios" aria-labelledby="saved-title"><div className="section-heading"><p className="eyebrow">Your tests</p><h2 id="saved-title">Saved scenarios</h2></div>
          {isLoading ? <p role="status">Loading scenarios…</p> : savedScenarios.length === 0 ? <p className="empty-state">There are no saved scenarios yet. Try different assumptions and save one to compare it later.</p> : <div className="saved-scenario-list">{savedScenarios.map((scenario) => <article className="saved-scenario-card" key={scenario.id}><div><span className="status-pill">{scenarioOptionLabels[scenario.scenario_type] ?? scenario.scenario_type}</span><h3>{scenario.name}</h3><p>{scenario.customer_counts.freePlannerUsers} Free · {scenario.customer_counts.plannerPlusSubscribers} Plus Planner · {scenario.customer_counts.bakeryProSubscribers} Bakery Pro</p></div><div className="saved-values"><span>{money.format(scenario.monthly_revenue)} <small>per month</small></span><span>{money.format(scenario.annual_revenue)} <small>per year</small></span></div><button className="remove-button" type="button" onClick={() => removeScenario(scenario.id)} aria-label={`Delete ${scenario.name}`}>Delete</button></article>)}</div>}
        </section>
      </section>
      <footer className="site-footer"><p>CakeMatch AI — Project by Camila Gutiérrez</p><p>AI-Native Builder 2026</p></footer>
    </main>
  );
}
