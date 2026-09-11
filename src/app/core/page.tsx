"use client";

import Link from "next/link";
import { useState } from "react";

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

export default function CorePage() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [error, setError] = useState("");

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
    setRecommendation(buildRecommendation(values));
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
      </section>

      <footer className="site-footer">
        <p>CakeMatch AI — Project created by Camila Gutiérrez</p>
        <p>AI-Native Builder 2026</p>
      </footer>
    </main>
  );
}
