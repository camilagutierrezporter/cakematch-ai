"use client";

import { useState } from "react";

type Winner = "A" | "B" | "tie";

type Comparison = {
  id: string;
  title: string;
  headlineA: string;
  headlineB: string;
  visitorsA: string;
  clicksA: string;
  visitorsB: string;
  clicksB: string;
  result: {
    rateA: number;
    rateB: number;
    winner: Winner;
  } | null;
  error: string;
};

type EditableField =
  | "headlineA"
  | "headlineB"
  | "visitorsA"
  | "clicksA"
  | "visitorsB"
  | "clicksB";

const initialComparisons: Comparison[] = [
  {
    id: "cake-headline",
    title: "Test 1 · Finding the right cake",
    headlineA: "Find the right cake for your celebration.",
    headlineB: "A cake that makes every celebration feel like yours.",
    visitorsA: "",
    clicksA: "",
    visitorsB: "",
    clicksB: "",
    result: null,
    error: "",
  },
  {
    id: "marketing-message",
    title: "Test 2 · Easy planning or bakery discovery",
    headlineA: "Make cake planning feel simple.",
    headlineB: "Discover independent bakeries for your next celebration.",
    visitorsA: "",
    clicksA: "",
    visitorsB: "",
    clicksB: "",
    result: null,
    error: "",
  },
];

function parseCount(value: string, label: string) {
  if (!/^\d+$/.test(value)) {
    return { error: `${label} must be a whole number of zero or more.` };
  }

  const count = Number(value);
  if (!Number.isSafeInteger(count)) {
    return { error: `${label} is too large to calculate reliably.` };
  }

  return { count };
}

export default function AbHeadlineTester() {
  const [comparisons, setComparisons] = useState(initialComparisons);

  function updateComparison(
    comparisonId: string,
    field: EditableField,
    value: string,
  ) {
    setComparisons((current) =>
      current.map((comparison) =>
        comparison.id === comparisonId
          ? { ...comparison, [field]: value, result: null, error: "" }
          : comparison,
      ),
    );
  }

  function compare(event: React.FormEvent<HTMLFormElement>, comparisonId: string) {
    event.preventDefault();
    const comparison = comparisons.find((item) => item.id === comparisonId);

    if (!comparison) {
      return;
    }

    if (!comparison.headlineA.trim() || !comparison.headlineB.trim()) {
      setComparisonError(comparisonId, "Enter both headline options before comparing.");
      return;
    }

    const visitorsA = parseCount(comparison.visitorsA, "Option A visitors");
    const clicksA = parseCount(comparison.clicksA, "Option A clicks");
    const visitorsB = parseCount(comparison.visitorsB, "Option B visitors");
    const clicksB = parseCount(comparison.clicksB, "Option B clicks");
    const error =
      visitorsA.error ??
      clicksA.error ??
      visitorsB.error ??
      clicksB.error;

    if (error) {
      setComparisonError(comparisonId, error);
      return;
    }

    if (
      visitorsA.count === undefined ||
      clicksA.count === undefined ||
      visitorsB.count === undefined ||
      clicksB.count === undefined
    ) {
      setComparisonError(comparisonId, "Enter valid visitor and click counts for both options.");
      return;
    }

    if (visitorsA.count === 0 || visitorsB.count === 0) {
      setComparisonError(comparisonId, "Each option needs at least one visitor to calculate a rate.");
      return;
    }

    if (clicksA.count > visitorsA.count || clicksB.count > visitorsB.count) {
      setComparisonError(comparisonId, "Clicks cannot be greater than visitors.");
      return;
    }

    const crossProductA = BigInt(clicksA.count) * BigInt(visitorsB.count);
    const crossProductB = BigInt(clicksB.count) * BigInt(visitorsA.count);
    const winner: Winner =
      crossProductA === crossProductB
        ? "tie"
        : crossProductA > crossProductB
          ? "A"
          : "B";

    setComparisons((current) =>
      current.map((item) =>
        item.id === comparisonId
          ? {
              ...item,
              error: "",
              result: {
                rateA: (clicksA.count / visitorsA.count) * 100,
                rateB: (clicksB.count / visitorsB.count) * 100,
                winner,
              },
            }
          : item,
      ),
    );
  }

  function setComparisonError(comparisonId: string, error: string) {
    setComparisons((current) =>
      current.map((item) =>
        item.id === comparisonId ? { ...item, error, result: null } : item,
      ),
    );
  }

  return (
    <section
      className="marketing-section ab-testing-section"
      aria-labelledby="ab-testing-title"
    >
      <div className="marketing-section-heading">
        <p className="eyebrow">07 · Headline experiments</p>
        <h2 id="ab-testing-title">Compare two messages at a time.</h2>
        <p className="marketing-section-note">
          Enter visitor and click counts from a test you ran, then compare
          click-through rates. No visitor data is prefilled or collected
          automatically. Practice numbers are simulated and should be labeled
          <strong> SIMULATED DEMO DATA</strong>.
        </p>
      </div>

      <div className="ab-comparison-list">
        {comparisons.map((comparison, index) => {
          const prefix = `ab-${comparison.id}`;
          const resultId = `${prefix}-result`;
          const errorId = `${prefix}-error`;
          const winnerText =
            comparison.result?.winner === "tie"
              ? "It’s a tie: both options have the same click-through rate."
              : comparison.result
                ? `Option ${comparison.result.winner} wins with the higher click-through rate.`
                : "";

          return (
            <article className="marketing-card ab-comparison-card" key={comparison.id}>
              <div className="ab-comparison-heading">
                <span className="content-number">{String(index + 1).padStart(2, "0")}</span>
                <h3>{comparison.title}</h3>
              </div>
              <form
                onSubmit={(event) => compare(event, comparison.id)}
                aria-describedby={`${prefix}-guidance`}
              >
                <p className="ab-guidance" id={`${prefix}-guidance`}>
                  Enter actual test counts below, or use clearly labeled
                  simulated demo data for practice.
                </p>
                <div className="ab-option-grid">
                  {(["A", "B"] as const).map((option) => {
                    const headlineField = option === "A" ? "headlineA" : "headlineB";
                    const visitorsField = option === "A" ? "visitorsA" : "visitorsB";
                    const clicksField = option === "A" ? "clicksA" : "clicksB";

                    return (
                      <fieldset className="ab-option" key={option}>
                        <legend>Option {option}</legend>
                        <label className="ab-field ab-headline-field" htmlFor={`${prefix}-headline-${option}`}>
                          Headline {option}
                          <textarea
                            id={`${prefix}-headline-${option}`}
                            value={comparison[headlineField]}
                            onChange={(event) =>
                              updateComparison(comparison.id, headlineField, event.target.value)
                            }
                            rows={3}
                            required
                          />
                        </label>
                        <div className="ab-count-fields">
                          <label className="ab-field" htmlFor={`${prefix}-visitors-${option}`}>
                            Visitors
                            <input
                              id={`${prefix}-visitors-${option}`}
                              type="number"
                              min="0"
                              step="1"
                              inputMode="numeric"
                              value={comparison[visitorsField]}
                              onChange={(event) =>
                                updateComparison(comparison.id, visitorsField, event.target.value)
                              }
                              aria-describedby={comparison.error ? errorId : undefined}
                            />
                          </label>
                          <label className="ab-field" htmlFor={`${prefix}-clicks-${option}`}>
                            Clicks
                            <input
                              id={`${prefix}-clicks-${option}`}
                              type="number"
                              min="0"
                              step="1"
                              inputMode="numeric"
                              value={comparison[clicksField]}
                              onChange={(event) =>
                                updateComparison(comparison.id, clicksField, event.target.value)
                              }
                              aria-describedby={comparison.error ? errorId : undefined}
                            />
                          </label>
                        </div>
                      </fieldset>
                    );
                  })}
                </div>

                {comparison.error && (
                  <p className="ab-error" id={errorId} role="alert">
                    {comparison.error}
                  </p>
                )}
                <button className="primary-button ab-compare-button" type="submit">
                  Compare click-through rates
                </button>
                <div
                  className="ab-result"
                  id={resultId}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {comparison.result && (
                    <>
                      <p className="ab-result-heading">{winnerText}</p>
                      <dl className="ab-rate-grid">
                        <div>
                          <dt>Option A · {comparison.headlineA}</dt>
                          <dd>{comparison.result.rateA.toFixed(2)}% CTR</dd>
                          <small>{comparison.clicksA} clicks / {comparison.visitorsA} visitors</small>
                        </div>
                        <div>
                          <dt>Option B · {comparison.headlineB}</dt>
                          <dd>{comparison.result.rateB.toFixed(2)}% CTR</dd>
                          <small>{comparison.clicksB} clicks / {comparison.visitorsB} visitors</small>
                        </div>
                      </dl>
                    </>
                  )}
                </div>
              </form>
            </article>
          );
        })}
      </div>
    </section>
  );
}
