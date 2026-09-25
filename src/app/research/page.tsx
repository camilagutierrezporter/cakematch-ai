"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase, type ResearchOutput } from "@/lib/supabase/client";

type Competitor = {
  name: string;
  type: string;
  market: string;
  offer: string;
  strength: string;
  gap: string;
  risk: "Low" | "Medium" | "High";
  source: string;
};

type Benchmark = {
  name: string;
  country: string;
  pattern: string;
  relevance: string;
  source: string;
  accessed: string;
};

const benchmarks: Benchmark[] = [
  {
    name: "Tastemade",
    country: "United States",
    pattern: "Recipe and food discovery are organized around visual inspiration.",
    relevance: "CakeMatch can make celebration planning feel inspiring before it becomes a purchase decision.",
    source: "https://www.tastemade.com/",
    accessed: "September 24, 2026",
  },
  {
    name: "Etsy",
    country: "United States",
    pattern: "Customers compare handmade offers through filters, reviews, and clear seller details.",
    relevance: "CakeMatch can reduce choice overload with useful filters and confidence-building details.",
    source: "https://www.etsy.com/",
    accessed: "September 24, 2026",
  },
  {
    name: "Felicity Sweets",
    country: "United Kingdom",
    pattern: "Custom cake ordering uses a guided brief to turn a visual idea into a quote.",
    relevance: "A short intake can help CakeMatch capture occasion, style, servings, and budget.",
    source: "https://www.felicitysweets.co.uk/",
    accessed: "September 24, 2026",
  },
  {
    name: "Milk Bar",
    country: "United States",
    pattern: "A strong product voice makes familiar desserts feel distinctive and memorable.",
    relevance: "CakeMatch can use a warm point of view while still giving practical recommendations.",
    source: "https://milkbarstore.com/",
    accessed: "September 24, 2026",
  },
  {
    name: "Rappi",
    country: "Colombia",
    pattern: "Local delivery discovery combines convenience, location, and fast selection.",
    relevance: "CakeMatch should make delivery limits and timing visible before a customer commits.",
    source: "https://www.rappi.com.mx/",
    accessed: "September 24, 2026",
  },
];

const competitors: Competitor[] = [
  {
    name: "Panadería La Esperanza",
    type: "Bakery chain",
    market: "Mexico",
    offer: "Everyday bread, cakes, and celebration desserts in physical stores.",
    strength: "Local familiarity and immediate purchase options.",
    gap: "Limited planning guidance for choosing size, design, and quantity.",
    risk: "Medium",
    source: "https://www.laesperanza.mx/",
  },
  {
    name: "Pastelerías El Globo",
    type: "Bakery chain",
    market: "Mexico",
    offer: "Cakes, pastries, and online ordering for common celebrations.",
    strength: "Recognizable brand with broad product availability.",
    gap: "The customer still has to choose from products without much personalization help.",
    risk: "High",
    source: "https://www.elglobo.com.mx/",
  },
  {
    name: "Kekas",
    type: "Custom bakery",
    market: "Mexico",
    offer: "Custom cakes and themed designs for events.",
    strength: "Personal service and strong visual customization.",
    gap: "Discovery and comparison can depend on social messages and manual quotes.",
    risk: "Medium",
    source: "https://www.instagram.com/",
  },
  {
    name: "Rappi",
    type: "Delivery marketplace",
    market: "Mexico and Latin America",
    offer: "On-demand discovery and delivery from local restaurants and bakeries.",
    strength: "Convenient local search and delivery infrastructure.",
    gap: "The platform is optimized for transaction speed, not celebration planning.",
    risk: "High",
    source: "https://www.rappi.com.mx/",
  },
  {
    name: "Etsy",
    type: "Marketplace",
    market: "Global",
    offer: "Search and purchase handmade cakes, toppers, and party details where available.",
    strength: "Large variety with seller reviews and visual examples.",
    gap: "Local freshness, delivery, and cake serving advice can be unclear.",
    risk: "Medium",
    source: "https://www.etsy.com/",
  },
  {
    name: "Milk Bar",
    type: "Direct-to-consumer bakery",
    market: "United States",
    offer: "Signature cakes and desserts with online ordering.",
    strength: "Distinctive brand and clear signature products.",
    gap: "Its offer and delivery model are not designed around Mexican local needs.",
    risk: "Low",
    source: "https://milkbarstore.com/",
  },
  {
    name: "Felicity Sweets",
    type: "Custom bakery",
    market: "United Kingdom",
    offer: "Custom celebration cakes supported by an inquiry process.",
    strength: "Structured custom brief and premium presentation.",
    gap: "The process may feel slow for a customer who needs a quick starting point.",
    risk: "Low",
    source: "https://www.felicitysweets.co.uk/",
  },
  {
    name: "Home baker networks",
    type: "Social substitute",
    market: "Mexico and global",
    offer: "Recommendations and custom orders through WhatsApp, Instagram, and word of mouth.",
    strength: "High trust from personal referrals and flexible customization.",
    gap: "Prices, availability, and quality signals are inconsistent.",
    risk: "High",
    source: "https://www.whatsapp.com/business/",
  },
];

const riskItems = [
  { name: "Demand risk", level: "Medium", detail: "People may enjoy inspiration but not need a dedicated planning tool." },
  { name: "Differentiation risk", level: "High", detail: "Bakery brands and marketplaces already own discovery and ordering." },
  { name: "Execution risk", level: "Medium", detail: "Local pricing and delivery data will take careful research to keep current." },
  { name: "Trust risk", level: "Low", detail: "Clear sources, dates, and demo labels can make early findings easier to evaluate." },
] as const;

const marketOptions = ["All markets", "Mexico", "Mexico and Latin America", "Global", "United States", "United Kingdom"];
const typeOptions = ["All types", "Bakery chain", "Custom bakery", "Delivery marketplace", "Marketplace", "Direct-to-consumer bakery", "Social substitute"];

function buildResearchSummary(topic: string, targetUser: string, market: string, goal: string) {
  return `Student-created analysis for ${topic.trim()} in ${market}. I am researching ${targetUser.trim()} to ${goal.trim().toLowerCase()}. The five benchmarks suggest that guided discovery, clear comparison, distinctive product voice, and visible delivery details could help CakeMatch. Mexico localization should prioritize MXN prices, WhatsApp-friendly follow-up, local delivery limits, event traditions, and customization. The eight competitor and substitute examples show that CakeMatch must earn trust through practical planning help rather than compete only on catalog size. This is a deterministic research summary, not live AI or live market data.`;
}

async function fetchSavedResearch() {
  const { data, error } = await supabase
    .from("research_outputs")
    .select("id, created_at, topic, target_user, market, research_goal, summary, benchmarks, competitors, risks")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    throw error;
  }

  return data as ResearchOutput[];
}

export default function ResearchPage() {
  const [topic, setTopic] = useState("Celebration dessert planning");
  const [targetUser, setTargetUser] = useState("People planning a celebration");
  const [market, setMarket] = useState("Mexico");
  const [goal, setGoal] = useState("Understand how CakeMatch can make cake decisions easier");
  const [hasGenerated, setHasGenerated] = useState(false);
  const [summary, setSummary] = useState("");
  const [formError, setFormError] = useState("");
  const [savedResearch, setSavedResearch] = useState<ResearchOutput[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [dashboardError, setDashboardError] = useState("");
  const [search, setSearch] = useState("");
  const [marketFilter, setMarketFilter] = useState("All markets");
  const [typeFilter, setTypeFilter] = useState("All types");

  const filteredCompetitors = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return competitors.filter((competitor) => {
      const matchesSearch = !normalizedSearch || `${competitor.name} ${competitor.offer}`.toLowerCase().includes(normalizedSearch);
      const matchesMarket = marketFilter === "All markets" || competitor.market === marketFilter;
      const matchesType = typeFilter === "All types" || competitor.type === typeFilter;

      return matchesSearch && matchesMarket && matchesType;
    });
  }, [marketFilter, search, typeFilter]);

  useEffect(() => {
    let isMounted = true;

    fetchSavedResearch()
      .then((records) => {
        if (isMounted) {
          setSavedResearch(records);
          setDashboardError("");
        }
      })
      .catch(() => {
        if (isMounted) {
          setDashboardError("Saved research is not available right now.");
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

  function handleGenerate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if ([topic, targetUser, market, goal].some((value) => !value.trim())) {
      setFormError("Please complete every research intake field before generating the dashboard.");
      setHasGenerated(false);
      setSummary("");
      return;
    }

    setFormError("");
    setSaveMessage("");
    setSummary(buildResearchSummary(topic, targetUser, market, goal));
    setHasGenerated(true);
  }

  async function handleSave() {
    if (!hasGenerated || !summary) {
      return;
    }

    setIsSaving(true);
    setSaveMessage("");

    const { error } = await supabase.from("research_outputs").insert({
      topic: topic.trim(),
      target_user: targetUser.trim(),
      market: market.trim(),
      research_goal: goal.trim(),
      summary,
      benchmarks,
      competitors,
      risks: [...riskItems],
    });

    if (error) {
      setSaveMessage("We could not save this research. Please check the Supabase setup and try again.");
      setIsSaving(false);
      return;
    }

    try {
      setSavedResearch(await fetchSavedResearch());
      setDashboardError("");
      setSaveMessage("Research saved successfully.");
    } catch {
      setSaveMessage("Research saved, but the dashboard could not refresh.");
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
          <Link href="/core">Core</Link>
          <Link href="/research" aria-current="page">Research</Link>
          <Link href="/docs">Documentation</Link>
        </div>
      </nav>

      <section className="research-page" aria-labelledby="research-title">
        <div className="research-intro">
          <p className="eyebrow">Research Desk · Week 2</p>
          <h1 id="research-title">Make the next product decision with evidence.</h1>
          <p className="research-description">
            This dashboard helps the CakeMatch team research customer needs, compare competitors, review benchmarks and risks, and make better product decisions. The analysis below is a student-created starting point, not live market data.
          </p>
        </div>

        <form className="research-intake" onSubmit={handleGenerate}>
          <div className="research-section-heading">
            <p className="eyebrow">Research intake</p>
            <h2>Start with one clear question.</h2>
          </div>
          <div className="research-form-grid">
            <label className="form-field">
              Research topic
              <input value={topic} onChange={(event) => setTopic(event.target.value)} required />
            </label>
            <label className="form-field">
              Target user
              <input value={targetUser} onChange={(event) => setTargetUser(event.target.value)} required />
            </label>
            <label className="form-field">
              Market
              <select value={market} onChange={(event) => setMarket(event.target.value)}>
                <option>Mexico</option>
                <option>Global</option>
                <option>Mexico and Latin America</option>
              </select>
            </label>
            <label className="form-field">
              Research goal
              <input value={goal} onChange={(event) => setGoal(event.target.value)} required />
            </label>
          </div>
          <div className="research-intake-actions">
            <button className="primary-button" type="submit">Generate Dashboard</button>
            <p className="research-form-status" role="status" aria-live="polite">
              {hasGenerated ? `Snapshot ready for ${market}.` : "Static research snapshot ready to review."}
            </p>
          </div>
          {formError ? <p className="form-error" role="alert">{formError}</p> : null}
        </form>

        {hasGenerated ? (
          <section className="research-output" aria-labelledby="research-output-title">
            <div>
              <p className="eyebrow">Student-created analysis</p>
              <h2 id="research-output-title">A focused research starting point.</h2>
              <p>{summary}</p>
            </div>
            <button className="save-button research-save-button" type="button" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Research"}
            </button>
            {saveMessage ? <p className="save-message research-save-message" role="status" aria-live="polite">{saveMessage}</p> : null}
          </section>
        ) : null}

        <section className="research-section" aria-labelledby="benchmarks-title">
          <div className="research-section-heading">
            <p className="eyebrow">Global benchmarks · 5 examples</p>
            <h2 id="benchmarks-title">Patterns worth studying.</h2>
          </div>
          <div className="benchmark-grid">
            {benchmarks.map((benchmark) => (
              <article className="benchmark-card" key={benchmark.name}>
                <p className="benchmark-country">{benchmark.country}</p>
                <h3>{benchmark.name}</h3>
                <dl>
                  <div><dt>Pattern observed</dt><dd>{benchmark.pattern}</dd></div>
                  <div><dt>Relevance</dt><dd>{benchmark.relevance}</dd></div>
                </dl>
                <a href={benchmark.source} target="_blank" rel="noreferrer">Official source ↗</a>
                <p className="source-date">Accessed {benchmark.accessed}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="localization-section" aria-labelledby="localization-title">
          <div className="research-section-heading">
            <p className="eyebrow">Mexico localization</p>
            <h2 id="localization-title">Make the useful details local.</h2>
          </div>
          <div className="localization-grid">
            <article><h3>Prices in MXN</h3><p>Show budgets and price examples in Mexican pesos, with a date because bakery prices change.</p></article>
            <article><h3>WhatsApp ordering</h3><p>Many small businesses use WhatsApp for questions, photos, quotes, and order confirmation.</p></article>
            <article><h3>Local delivery limits</h3><p>Delivery distance, traffic, refrigeration, and pickup windows can change what is practical.</p></article>
            <article><h3>Event traditions</h3><p>Birthdays, quinceañeras, weddings, and family gatherings can shape serving size and design choices.</p></article>
            <article><h3>Customization expectations</h3><p>People may expect colors, names, themes, and personal details rather than a fixed catalog item.</p></article>
          </div>
          <p className="analysis-note">Student-created analysis: these are research hypotheses to validate with local customers and bakers.</p>
        </section>

        <section className="competitor-section" aria-labelledby="competitors-title">
          <div className="research-section-heading">
            <p className="eyebrow">Competitors and substitutes · 8 examples</p>
            <h2 id="competitors-title">See the alternatives clearly.</h2>
          </div>
          <div className="research-table-controls" aria-label="Competitor table filters">
            <label className="filter-field">
              Search by name or offer
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Try bakery or delivery" />
            </label>
            <label className="filter-field">
              Market
              <select value={marketFilter} onChange={(event) => setMarketFilter(event.target.value)}>
                {marketOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className="filter-field">
              Type
              <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
                {typeOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
          </div>
          <div className="research-table-wrap">
            <table className="research-table">
              <caption className="visually-hidden">Competitors and substitutes filtered by name, offer, market, and type</caption>
              <thead><tr><th scope="col">Name</th><th scope="col">Type</th><th scope="col">Market</th><th scope="col">Offer</th><th scope="col">Strength</th><th scope="col">Gap</th><th scope="col">Risk</th><th scope="col">Source</th></tr></thead>
              <tbody>
                {filteredCompetitors.map((competitor) => (
                  <tr key={competitor.name}>
                    <th scope="row">{competitor.name}</th>
                    <td>{competitor.type}</td>
                    <td>{competitor.market}</td>
                    <td>{competitor.offer}</td>
                    <td>{competitor.strength}</td>
                    <td>{competitor.gap}</td>
                    <td><span className={`risk-label risk-${competitor.risk.toLowerCase()}`}>{competitor.risk}</span></td>
                    <td><a href={competitor.source} target="_blank" rel="noreferrer">Source ↗</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCompetitors.length === 0 ? <p className="table-empty" role="status">No competitors match these filters. Try a different search or reset a filter.</p> : null}
          </div>
          <p className="analysis-note">Student-created analysis: competitor strengths and gaps are working hypotheses, not verified claims.</p>
        </section>

        <section className="risk-section" aria-labelledby="risk-title">
          <div className="research-section-heading">
            <p className="eyebrow">Simple risk map</p>
            <h2 id="risk-title">Name the questions early.</h2>
          </div>
          <div className="risk-list">
            {riskItems.map((risk) => (
              <article className="risk-item" key={risk.name}>
                <div><h3>{risk.name}</h3><p>{risk.detail}</p></div>
                <span className={`risk-label risk-${risk.level.toLowerCase()}`}>{risk.level}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="saved-research" aria-labelledby="saved-research-title">
          <div>
            <p className="eyebrow">Saved research</p>
            <h2 id="saved-research-title">Your latest snapshot will live here.</h2>
            <p>Saved records are student-created research snapshots. They are not live AI or live market data.</p>
          </div>
          <span className="saved-placeholder">Latest 5</span>
          {isLoadingSaved ? <p className="dashboard-status" role="status">Loading saved research...</p> : null}
          {dashboardError ? <p className="dashboard-status" role="alert">{dashboardError}</p> : null}
          {!isLoadingSaved && !dashboardError && savedResearch.length === 0 ? (
            <p className="dashboard-status">Your saved research records will appear here.</p>
          ) : null}
          {savedResearch.length > 0 ? (
            <div className="saved-research-list">
              {savedResearch.map((record) => (
                <article className="saved-research-item" key={record.id}>
                  <p className="saved-item-type">{record.market}</p>
                  <h3>{record.topic}</h3>
                  <p>{record.target_user}</p>
                  <p>{new Date(record.created_at).toLocaleDateString()}</p>
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
