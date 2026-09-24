# CakeMatch AI Week 2 Build Discipline Packet

## Problem Definition

I need a simple way to organize research before I make more product decisions. I want to compare useful global examples, understand what must change for Mexico, see competitors and substitutes, and record the risks I find. Today, that work would be scattered across notes and browser tabs.

## User Definition

I am building for myself as the product builder. I need a focused research workspace that helps me make and save one clear research snapshot for CakeMatch AI. The future product user is a person planning a celebration, but this Week 2 page is a builder research tool.

## Success Definition

I will consider Week 2 successful when I can open `/research`, enter a research question, review five global benchmarks and eight competitors or substitutes, inspect Mexico localization notes, search and filter the comparison table, understand a simple risk map, save one research record to Supabase, and see it in a latest-saved dashboard widget. The existing `/core` page and Week 1 behavior must continue to work.

## UX Concept

I will make `/research` a calm research desk. I will start with a short intake form. Below it, I will show a research snapshot with benchmark cards, Mexico localization findings, and a searchable competitor table. I will keep the risk map simple and readable. At the bottom, I will show one save action and the latest saved research records. I will label curated examples as a research snapshot so they are not mistaken for live market data.

## Scope Cuts

I will include only the following:

- One `/research` page.
- One research intake form.
- Five curated global benchmark examples.
- Mexico localization findings.
- Eight competitors or substitutes.
- Search and filters for the comparison table.
- One simple risk map.
- Saving one research record to Supabase.
- A latest saved research dashboard widget.
- One real human validation conversation.
- Three software tests.

I will not add login, user accounts, payments, ordering, paid APIs, external AI APIs, web scraping, live market feeds, image generation, advanced analytics, multi-user permissions, or changes to the Week 1 recommendation logic. I will not claim that curated examples are statistically representative research.

## Product Specification

### Route and navigation

I will add a live `/research` route. I will add a Research link only where it is needed for discovery. I will preserve the existing `/core` route, its form, its save flow, and its saved recommendation dashboard.

### Research intake

I will collect:

- Research title
- Research question
- Target customer
- Product category
- Market, with Mexico available

I will block the snapshot when required fields are empty and show a clear validation message.

### Research snapshot

I will show exactly five benchmark cards. Each card will include a name, country, category, observed pattern, relevance to CakeMatch AI, source label, and source date.

I will show Mexico localization findings covering celebration context, buying behavior, trust or discovery, language, and currency or pricing considerations. I will include source notes and a confidence label where a finding is an informed hypothesis.

I will show exactly eight competitors or substitutes in a table. Each row will include name, type, market, offer, strength, gap, and risk level. I will provide a text search and filters for type, market relevance, and risk level. I will show a useful empty state when no row matches.

### Risk map

I will show a simple two-axis map or grouped matrix for demand risk, differentiation risk, and execution risk. I will use Low, Medium, and High labels. I will describe the map as a decision aid, not as measured market probability.

### Save and dashboard

I will save one complete research snapshot to a `research_records` Supabase table. I will include the intake values, benchmarks, localization findings, competitors, risk map, validation conversation, sources, and a readable summary. I will show saving, success, and error states. I will load and display the latest saved research records in a compact dashboard widget.

## Acceptance Criteria

1. I can open `/research` directly and the page renders without changing the behavior of `/core`.
2. I see required intake fields for title, research question, target customer, product category, and market.
3. Submitting incomplete intake shows validation feedback and does not create a saved record.
4. A valid intake displays exactly five global benchmark examples with source labels and dates.
5. A valid intake displays Mexico localization findings that are visibly separate from global benchmarks.
6. The page displays exactly eight competitors or substitutes in the comparison table.
7. Searching by text changes the table rows and shows a clear no-results state when appropriate.
8. Type, market relevance, and risk filters can be applied and combined.
9. The risk map shows Low, Medium, or High labels for the selected research snapshot.
10. Saving a valid snapshot inserts one record into `research_records` and announces success or failure.
11. After saving, the latest saved research dashboard widget includes the new record.
12. The page clearly identifies curated or hypothesis-based content and does not present it as live or statistically proven data.
13. The page works at mobile and desktop widths while keeping the existing CakeMatch AI colors and typography.
14. Three software tests cover intake validation, combined table filtering, and save/dashboard behavior.
15. One real human validation conversation is documented with the participant context, date, questions, observations, and changes I will make.

## Architecture Sketch

```text
Research intake
    -> validated form state
    -> curated benchmark and competitor snapshot
    -> search and combined filters
    -> risk map and readable summary
    -> save action
    -> Supabase research_records
    -> latest saved research dashboard widget
```

I will keep curated Week 2 research data in a typed local module. I will keep Supabase access in the existing typed client module. I will use JSONB fields for the snapshot arrays so I can validate the workflow without designing several related tables.

## Tech Stack and Reasons

- **Next.js App Router:** I will use the existing route structure and add `/research` without introducing a second framework.
- **React 19 and TypeScript:** I will use client state for intake, filtering, save feedback, and dashboard refresh, with typed research records to catch shape errors.
- **Existing CSS and Tailwind setup:** I will extend the current CakeMatch AI styles so the research page matches the Week 1 visual direction.
- **Supabase:** I will store and read the single saved research record through the existing publishable client. I will confirm the table and RLS policy before implementation.
- **Local curated data:** I will avoid paid APIs, scraping, and unreliable live dependencies. Every benchmark and competitor item will have a source label or a clearly marked hypothesis note.
- **Free browser and test tools:** I will use the repository's free local development workflow and add only a free test tool if a test runner is needed.

## DevOps and Deployment Plan

I will work on a separate Week 2 change while leaving Week 1 files and behavior intact. I will run lint, TypeScript/build checks, the three software tests, and a local browser check at desktop and mobile widths. I will confirm the Supabase table and public insert/select policies before testing save behavior. I will deploy the Next.js app through the existing Vercel plan only after local checks pass. I will create a focused Git commit for the completed Week 2 implementation and push only after review. I will not add secrets to the repository.

## Test Plan

### Software test 1: Intake validation

I will submit the research form with one required field empty. I will verify that the page shows an error, does not render a valid snapshot, and does not call the save action. I will then complete the fields and verify that the snapshot can be generated.

### Software test 2: Search and combined filters

I will search for a known competitor and apply a type and risk filter together. I will verify that every visible row matches all active conditions. I will search for an unknown term and verify that the table shows its empty state without breaking the page.

### Software test 3: Save and dashboard refresh

I will generate a valid snapshot, save it, and verify that one `research_records` row is inserted. I will verify that the save feedback is announced, the latest saved research widget refreshes, and a Supabase error produces a useful error message without a false success state.

## Plan for One Real Human Validation Conversation

I will speak with one real person who has planned a celebration or helped choose a cake or dessert. I will ask for 15 to 20 minutes and will not describe the page as finished or ask them to approve my idea.

I will ask:

1. When you choose a cake or dessert for a celebration, what information do you look for first?
2. Which part of this research view is easiest to understand?
3. Which competitor or substitute feels missing or incorrectly described?
4. What Mexico-specific assumption feels wrong, incomplete, or unclear?
5. What would you need before trusting a saved research snapshot?

I will record the date, participant context without unnecessary personal information, questions, direct observations, and three changes or decisions. I will label the conversation as real human validation and keep it separate from invented benchmark data. I will only mark this criterion complete after the conversation happens.

## Exact Codex Implementation Prompt

```text
ROLE: You are my disciplined AI-native coding partner for CakeMatch AI.

TASK: Implement Week 2 as a new `/research` page in the existing Next.js project. Before editing, read AGENTS.md, the existing `/core` page, `src/app/globals.css`, `src/lib/supabase/client.ts`, and this Week 2 Build Discipline Packet. Preserve all Week 1 behavior.

SCOPE:
- Add `/research`.
- Add a research intake for title, research question, target customer, product category, and market.
- Show exactly 5 curated global benchmark examples.
- Show Mexico localization findings with source notes and confidence labels.
- Show exactly 8 competitors or substitutes.
- Add text search and combined filters for type, market relevance, and risk level.
- Add a simple Low/Medium/High risk map for demand, differentiation, and execution risk.
- Save one complete research snapshot to Supabase table `research_records`.
- Load and show a latest saved research dashboard widget.
- Keep `/core`, `core_outputs`, and all Week 1 documentation behavior unchanged.

CONSTRAINTS:
- Use only free tools and the existing Next.js, React, TypeScript, CSS, and Supabase setup.
- Do not use paid APIs, external AI APIs, scraping, live market feeds, authentication, payments, or ordering.
- Do not change `.env.local`, `next-env.d.ts`, package files, or existing Week 1 documentation.
- Keep curated data in a typed local module and label it as a research snapshot.
- Include source labels and dates; mark hypotheses as hypotheses.
- Use the existing CakeMatch AI colors, typography, borders, responsive layout, and accessible form patterns.
- Add loading, error, empty, validation, saving, and save-success states.
- Use accessible labels, table headings, status messages, and keyboard-friendly controls.
- Keep the Supabase types accurate. Confirm the table and public RLS policies before relying on save behavior.

DATA:
Use a `research_records` table with `id`, `created_at`, `title`, `research_question`, `product_category`, `target_customer`, `market`, `intake_summary`, `benchmarks`, `localization_findings`, `competitors`, `risk_map`, `validation_conversation`, `sources`, `summary`, and `status`. Use typed JSON-compatible objects for the arrays and objects.

TESTS:
1. Verify incomplete intake blocks snapshot generation and saving.
2. Verify search plus type and risk filters return only matching rows and show a no-results state.
3. Verify successful save refreshes the latest saved widget and Supabase failure does not show false success.

VALIDATION:
Run the narrowest available tests first, then lint and the production build. Check `/research` at desktop and mobile widths. Do not commit or push unless I explicitly ask.

REPORT:
Summarize changed files, tests run, known limitations, and any Supabase setup still required.
```

## Week 2 Evidence Checklist

- [ ] I can open the live `/research` page.
- [ ] I saved the final Week 2 packet and wireframe before feature coding.
- [ ] The research intake works and validates required fields.
- [ ] Five benchmark examples are visible with source labels and dates.
- [ ] Mexico localization findings are visible and labeled by confidence.
- [ ] Eight competitors or substitutes are visible.
- [ ] Search and combined filters work, including the empty state.
- [ ] The risk map is visible and uses simple risk labels.
- [ ] One research record saves to Supabase.
- [ ] The latest saved research dashboard widget refreshes.
- [ ] Three software tests pass.
- [ ] I completed one real human validation conversation and recorded the evidence.
- [ ] `/core` still passes the Week 1 test scenarios.
- [ ] I checked desktop and mobile layouts.
- [ ] I reviewed sources, dates, hypotheses, and known limitations.
- [ ] I created the implementation commit only after the checks passed.

## Proposed Saved Record Fields

I will use these fields for `research_records`:

- `id`
- `created_at`
- `title`
- `research_question`
- `product_category`
- `target_customer`
- `market`
- `intake_summary` as JSONB
- `benchmarks` as JSONB
- `localization_findings` as JSONB
- `competitors` as JSONB
- `risk_map` as JSONB
- `validation_conversation` as JSONB
- `sources` as JSONB
- `summary`
- `status`
