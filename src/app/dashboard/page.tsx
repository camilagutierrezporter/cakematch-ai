"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";

type DashboardRecord = {
  id: string | number;
  title: string;
  detail: string;
  createdAt: string | null;
  href: string;
};

type RecordGroup = {
  name: string;
  records: DashboardRecord[];
  status: "loading" | "ready" | "unavailable";
};

const emptyGroups: RecordGroup[] = [
  { name: "Event plans", records: [], status: "loading" },
  { name: "Market research", records: [], status: "loading" },
  { name: "Pricing scenarios", records: [], status: "loading" },
];

function formatDate(value: string | null) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}

export default function DashboardPage() {
  const [groups, setGroups] = useState(emptyGroups);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadRecords() {
      if (!isSupabaseConfigured) {
        setGroups(emptyGroups.map((group) => ({ ...group, status: "unavailable" })));
        setIsLoading(false);
        return;
      }

      const results = await Promise.allSettled([
        supabase.from("core_outputs").select("id, created_at, occasion, product_type, guests").order("created_at", { ascending: false }).limit(5),
        supabase.from("research_outputs").select("id, created_at, topic, target_user, market").order("created_at", { ascending: false }).limit(5),
        supabase.from("pricing_scenarios").select("id, created_at, name, scenario_type").order("created_at", { ascending: false }).limit(5),
      ]);

      if (!isMounted) return;

      const nextGroups: RecordGroup[] = [
        { name: "Event plans", records: [], status: "ready" },
        { name: "Market research", records: [], status: "ready" },
        { name: "Pricing scenarios", records: [], status: "ready" },
      ];

      const [plans, research, pricing] = results;
      if (plans.status === "fulfilled" && !plans.value.error && plans.value.data) {
        nextGroups[0].records = plans.value.data.map((row) => ({
          id: row.id,
          title: row.occasion,
          detail: `${row.product_type} · ${row.guests} guests`,
          createdAt: row.created_at,
          href: "/core",
        }));
      } else {
        nextGroups[0].status = "unavailable";
      }
      if (research.status === "fulfilled" && !research.value.error && research.value.data) {
        nextGroups[1].records = research.value.data.map((row) => ({
          id: row.id,
          title: row.topic,
          detail: `${row.target_user} · ${row.market}`,
          createdAt: row.created_at,
          href: "/research",
        }));
      } else {
        nextGroups[1].status = "unavailable";
      }
      if (pricing.status === "fulfilled" && !pricing.value.error && pricing.value.data) {
        nextGroups[2].records = pricing.value.data.map((row) => ({
          id: row.id,
          title: row.name,
          detail: `${row.scenario_type} scenario`,
          createdAt: row.created_at,
          href: "/pricing",
        }));
      } else {
        nextGroups[2].status = "unavailable";
      }

      setGroups(nextGroups);
      setIsLoading(false);
    }

    loadRecords().catch(() => {
      if (!isMounted) return;
      setGroups(emptyGroups.map((group) => ({ ...group, status: "unavailable" })));
      setIsLoading(false);
    });

    return () => { isMounted = false; };
  }, []);

  return (
    <main className="week6-page dashboard-page">
      <section className="week6-hero" aria-labelledby="dashboard-title">
        <p className="eyebrow">Project workspace</p>
        <h1 id="dashboard-title">Your CakeMatch records.</h1>
        <p className="week6-lead">This page shows records returned by the existing Supabase tables under their current access rules. It does not add sample records.</p>
      </section>
      <section className="week6-card-grid dashboard-groups" aria-label="Saved project records" aria-live="polite">
        {groups.map((group) => (
          <article className="week6-card record-group" key={group.name}>
            <h2>{group.name}</h2>
            {isLoading || group.status === "loading" ? <p className="week6-muted">Loading saved records…</p> : null}
            {!isLoading && group.status === "unavailable" ? <p className="week6-muted">These records are unavailable right now. Check the Supabase connection and table access.</p> : null}
            {!isLoading && group.status === "ready" && group.records.length === 0 ? <p className="week6-muted">No saved records are available to this browser yet.</p> : null}
            {group.status === "ready" && group.records.length > 0 ? (
              <ul className="record-list">
                {group.records.map((record) => (
                  <li key={`${group.name}-${record.id}`}>
                    <Link href={record.href}>
                      <span><strong>{record.title || "Untitled record"}</strong><small>{record.detail}</small></span>
                      <time dateTime={record.createdAt ?? undefined}>{formatDate(record.createdAt)}</time>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </section>
      <p className="dashboard-privacy">Private chat and marketing records are not listed here. They remain available only through their existing pages and access rules.</p>
    </main>
  );
}
