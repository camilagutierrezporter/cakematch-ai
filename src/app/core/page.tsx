"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase, type CoreOutput } from "@/lib/supabase/client";

type ProductType = "cake" | "cupcakes";

type FormValues = {
  occasion: string;
  productType: ProductType;
  guests: string;
  flavor: string;
  style: string;
  budget: string;
};

type Recommendation = {
  amount: string;
  flavor: string;
  design: string;
  price: string;
  explanation: string;
};

const initialValues: FormValues = {
  occasion: "",
  productType: "cake",
  guests: "",
  flavor: "",
  style: "",
  budget: "",
};

function buildRecommendation(values: FormValues): Recommendation {
  const guestCount = Number(values.guests);
  const budgetLabel = values.budget.toLowerCase();
  const priceAdjustment = budgetLabel.includes("under")
    ? "Starting near $45"
    : budgetLabel.includes("50")
      ? "$55–$85"
      : budgetLabel.includes("100")
        ? "$95–$135"
        : "$140–$190";

  if (values.productType === "cupcakes") {
    const cupcakeQuantity = Math.ceil(guestCount * 1.1);
    const cupcakePrice = guestCount > 24 ? "$75–$120" : priceAdjustment;

    return {
      amount: `${cupcakeQuantity} cupcakes`,
      flavor: values.flavor,
      design: `${values.style} cupcakes with simple matching details`,
      price: cupcakePrice,
      explanation: `This gives each guest an individual serving for your ${values.occasion.toLowerCase()}, with a few extra cupcakes to share.`,
    };
  }

  const cakeSize = guestCount <= 8 ? "6-inch cake" : guestCount <= 16 ? "8-inch cake" : guestCount <= 28 ? "10-inch cake" : "12-inch cake";
  const cakePrice = guestCount > 28 ? "$125–$180" : priceAdjustment;

  return {
    amount: cakeSize,
    flavor: values.flavor,
    design: `${values.style} design with a simple celebration finish`,
    price: cakePrice,
    explanation: `This size gives your ${values.occasion.toLowerCase()} enough portions for ${guestCount} guests while keeping the design focused on your preferences.`,
  };
}

function formatRecommendation(recommendation: Recommendation) {
  return [
    `Recommended amount: ${recommendation.amount}`,
    `Suggested flavor: ${recommendation.flavor}`,
    `Suggested design: ${recommendation.design}`,
    `Estimated price: ${recommendation.price}`,
    `Explanation: ${recommendation.explanation}`,
  ].join("\n");
}

async function fetchSavedRecommendations() {
  const { data, error } = await supabase
    .from("core_outputs")
    .select("id, created_at, occasion, product_type, guests, flavor, style, budget, recommendation")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    throw error;
  }

  return data as CoreOutput[];
}

export default function CorePage() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [error, setError] = useState("");
  const [savedRecommendations, setSavedRecommendations] = useState<CoreOutput[]>([]);
  const [dashboardError, setDashboardError] = useState("");
  const [isLoadingSaved, setIsLoadingSaved] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    fetchSavedRecommendations()
      .then((records) => {
        if (isMounted) {
          setSavedRecommendations(records);
          setDashboardError("");
        }
      })
      .catch(() => {
        if (isMounted) {
          setDashboardError("Saved recommendations are not available right now.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingSaved(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function updateValue(field: keyof FormValues, value: string) {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (Object.values(values).some((value) => !value.trim())) {
      setError("Please complete every field before creating your recommendation.");
      setRecommendation(null);
      return;
    }

    if (Number(values.guests) < 1) {
      setError("Please enter at least one guest.");
      setRecommendation(null);
      return;
    }

    setError("");
    setSaveMessage("");
    setRecommendation(buildRecommendation(values));
  }

  async function handleSave() {
    if (!recommendation) {
      return;
    }

    setIsSaving(true);
    setSaveMessage("");

    const { error: saveError } = await supabase.from("core_outputs").insert({
      occasion: values.occasion,
      product_type: values.productType,
      guests: Number(values.guests),
      flavor: values.flavor,
      style: values.style,
      budget: values.budget,
      recommendation: formatRecommendation(recommendation),
    });

    if (saveError) {
      setSaveMessage("We could not save this recommendation. Please try again.");
      setIsSaving(false);
      return;
    }

    try {
      setSavedRecommendations(await fetchSavedRecommendations());
      setDashboardError("");
      setSaveMessage("Recommendation saved successfully.");
    } catch {
      setSaveMessage("Recommendation saved, but the dashboard could not refresh.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main>
      <nav className="site-nav" aria-label="Main navigation">
        <Link className="brand" href="/">
          CakeMatch <span>AI</span>
        </Link>
        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/#como-funciona">How It Works</Link>
          <Link href="/core" aria-current="page">Core</Link>
          <Link href="/research">Research</Link>
          <Link href="/docs">Documentation</Link>
        </div>
      </nav>

      <section className="core-page" aria-labelledby="core-title">
        <div className="core-intro">
          <p className="eyebrow">Generative Core · Week 1</p>
          <h1 id="core-title">Plan the sweet part of your celebration.</h1>
          <p className="core-description">
            Tell me a little about your event and I will make a simple cake or cupcake suggestion for you.
          </p>
        </div>

        <div className="core-layout">
          <form className="core-form" onSubmit={handleSubmit}>
            <div className="core-form-heading">
              <p className="eyebrow">Your celebration</p>
              <h2>Start with the basics.</h2>
            </div>

            <label className="form-field">
              Occasion
              <input
                type="text"
                value={values.occasion}
                onChange={(event) => updateValue("occasion", event.target.value)}
                placeholder="Birthday, wedding, baby shower..."
                required
              />
            </label>

            <fieldset className="form-field product-options">
              <legend>Product type</legend>
              <div className="product-choice-grid">
                <label className={values.productType === "cake" ? "product-choice selected" : "product-choice"}>
                  <input
                    type="radio"
                    name="productType"
                    value="cake"
                    checked={values.productType === "cake"}
                    onChange={(event) => updateValue("productType", event.target.value)}
                  />
                  <span>Cake</span>
                </label>
                <label className={values.productType === "cupcakes" ? "product-choice selected" : "product-choice"}>
                  <input
                    type="radio"
                    name="productType"
                    value="cupcakes"
                    checked={values.productType === "cupcakes"}
                    onChange={(event) => updateValue("productType", event.target.value)}
                  />
                  <span>Cupcakes</span>
                </label>
              </div>
            </fieldset>

            <div className="form-row">
              <label className="form-field">
                Number of guests
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={values.guests}
                  onChange={(event) => updateValue("guests", event.target.value)}
                  placeholder="12"
                  required
                />
              </label>
              <label className="form-field">
                Preferred flavor
                <input
                  type="text"
                  value={values.flavor}
                  onChange={(event) => updateValue("flavor", event.target.value)}
                  placeholder="Vanilla, chocolate..."
                  required
                />
              </label>
            </div>

            <div className="form-row">
              <label className="form-field">
                Style
                <input
                  type="text"
                  value={values.style}
                  onChange={(event) => updateValue("style", event.target.value)}
                  placeholder="Minimal, colorful, floral..."
                  required
                />
              </label>
              <label className="form-field">
                Budget
                <select
                  value={values.budget}
                  onChange={(event) => updateValue("budget", event.target.value)}
                  required
                >
                  <option value="" disabled>Select a range</option>
                  <option>Under $50</option>
                  <option>$50–$100</option>
                  <option>$100–$150</option>
                  <option>$150+</option>
                </select>
              </label>
            </div>

            {error ? <p className="form-error" role="alert">{error}</p> : null}
            <button className="primary-button core-submit" type="submit">
              Create My Recommendation
            </button>
          </form>

          <section className="recommendation-panel" aria-live="polite" aria-labelledby="recommendation-title">
            {recommendation ? (
              <article className="recommendation-card">
                <div className="recommendation-card-heading">
                  <div>
                    <p className="eyebrow">Demo Recommendation</p>
                    <h2 id="recommendation-title">A sweet fit for your plans.</h2>
                  </div>
                  <span className="demo-badge">Demo</span>
                </div>
                <dl className="recommendation-details">
                  <div>
                    <dt>Recommended amount</dt>
                    <dd>{recommendation.amount}</dd>
                  </div>
                  <div>
                    <dt>Suggested flavor</dt>
                    <dd>{recommendation.flavor}</dd>
                  </div>
                  <div>
                    <dt>Suggested design</dt>
                    <dd>{recommendation.design}</dd>
                  </div>
                  <div>
                    <dt>Estimated price</dt>
                    <dd>{recommendation.price}</dd>
                  </div>
                </dl>
                <p className="recommendation-explanation">{recommendation.explanation}</p>
                <p className="demo-note">This is a demo suggestion, not a final quote or order.</p>
                <button className="save-button" type="button" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Recommendation"}
                </button>
                {saveMessage ? <p className="save-message" role="status" aria-live="polite">{saveMessage}</p> : null}
              </article>
            ) : (
              <div className="recommendation-empty">
                <span className="empty-mark" aria-hidden="true">✦</span>
                <p className="eyebrow">Your result will appear here</p>
                <h2>One celebration, one clear starting point.</h2>
                <p>Complete the form to see a simple demo recommendation based on your event.</p>
              </div>
            )}
          </section>
        </div>

        <section className="saved-dashboard" aria-labelledby="saved-title">
          <div className="saved-dashboard-heading">
            <div>
              <p className="eyebrow">Your saved ideas</p>
              <h2 id="saved-title">Saved Recommendations</h2>
            </div>
            <span className="saved-count">Latest 5</span>
          </div>
          {isLoadingSaved ? <p className="dashboard-status">Loading saved recommendations...</p> : null}
          {dashboardError ? <p className="dashboard-status" role="alert">{dashboardError}</p> : null}
          {!isLoadingSaved && !dashboardError && savedRecommendations.length === 0 ? (
            <p className="dashboard-status">Your saved recommendations will appear here.</p>
          ) : null}
          {savedRecommendations.length > 0 ? (
            <div className="saved-list">
              {savedRecommendations.map((savedRecommendation) => (
                <article className="saved-item" key={savedRecommendation.id}>
                  <div>
                    <p className="saved-item-type">{savedRecommendation.product_type === "cake" ? "Cake" : "Cupcakes"}</p>
                    <h3>{savedRecommendation.occasion}</h3>
                  </div>
                  <p>{savedRecommendation.guests} guests · {savedRecommendation.flavor}</p>
                  <p>{savedRecommendation.style} · {savedRecommendation.budget}</p>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      </section>

      <footer className="site-footer">
        <p>CakeMatch AI — Project created by Camila Gutiérrez</p>
        <p>AI-Native Builder 2026</p>
      </footer>
    </main>
  );
}
