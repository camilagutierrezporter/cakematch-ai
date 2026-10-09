# CakeMatch AI Week 3 Build Discipline Packet

## 1. Problem

CakeMatch AI already helps a person plan a celebration cake or cupcakes by suggesting an amount, flavor, design, and estimated price. The project needs a clear product map and a simple way to explore which features could belong in different product levels. It also needs a simulator to compare possible subscription revenue without presenting guesses as real sales forecasts.

## 2. User

- **Celebration planners:** people planning a birthday or another celebration who want help choosing a cake or cupcakes within a budget.
- **Independent bakeries:** small cake businesses that could use CakeMatch to present their options and receive better-organized customer requests in a future version.

The first user segment is supported by the existing `/core` experience. Bakery tools are a proposed future direction, not an existing product feature.

## 3. Success

Week 3 is successful when `/product` explains the feature architecture and the two customer segments, and `/pricing` displays three proposed tiers and a working revenue simulator. The simulator must let the user choose a scenario, edit customer counts and monthly prices, calculate estimated monthly and annual revenue, save scenarios, and reload saved scenarios. The existing `/core` and `/research` pages must continue to work.

## 4. UX Concept

The page uses CakeMatch AI's existing cream, blush, and burgundy visual style. `/product` explains the current celebration-planning features and separates them from proposed future bakery tools. `/pricing` shows three tier cards, followed by segment and scenario controls, editable assumptions, revenue totals, and saved scenarios.

The generated concept image is included as `WEEK3_PRICING_MOCKUP.png`.

### Planned-versus-built note

After implementation, I will add a short comparison here describing which sections match the mockup, what changed to fit the existing CakeMatch design, and why. I will not mark this evidence complete until I compare the final live page with the mockup.

## 5. Scope Cuts

This week includes product and pricing pages plus a planning simulator. It does not include payment processing, real subscriptions, customer accounts, checkout, a live bakery marketplace, real customer or market data, AI pricing advice, order management, or guaranteed revenue forecasts. All scenario counts and prices are editable planning assumptions.

## 6. Product Specification

### Feature map

| Product area | Celebration planner | Independent bakery | Status |
|---|---|---|---|
| Cake or cupcake suggestions by occasion and guest count | Use recommendations | Review example customer flow | Existing `/core` feature |
| Flavor, style, budget, and estimated-price inputs | Personalize a suggestion | Understand customer preferences | Existing `/core` feature |
| Save a recommendation | Keep a planning record | See the customer-facing concept | Existing `/core` feature, saved through current Supabase setup |
| Saved favorites and event plans | Revisit plans | — | Proposed future feature |
| Bakery profile and product catalog | Browse options | Present products and prices | Proposed future feature |
| Organized custom-request inbox | Send a clearer request | Review incoming requests | Proposed future feature |

### Proposed product tiers

These are classroom pricing assumptions for the simulator, not validated prices or launched plans.

| Tier | Proposed customer | Proposed monthly price | Feature scope |
|---|---|---:|---|
| **Planificador Gratis** | Celebration planner | MXN $0 | Basic cake or cupcake suggestion, flavor/style/budget inputs, estimated price |
| **Planificador Plus** | Celebration planner who plans several events | MXN $99 | Free features plus saved event plans and favorites (proposed) |
| **Pastelería Pro** | Independent bakery | MXN $399 | Bakery profile, product catalog, and organized custom-request inbox (proposed) |

The simulator focuses revenue on paid subscriptions. Free users can be shown in the customer mix but contribute MXN $0 in subscription revenue.

### Two customer segments

1. Celebration planners: individuals organizing birthdays and other events.
2. Independent bakeries: small businesses that make custom cakes or cupcakes.

### Pricing simulator requirements

- Provide Conservador and Optimista scenario presets.
- Allow editable customer counts for all three tiers, including the Free tier; free users contribute MXN $0 to subscription revenue.
- Allow editable monthly prices for paid tiers; show Free at MXN $0.
- Calculate monthly revenue as the sum of (paid subscribers × monthly tier price).
- Calculate annual revenue as monthly revenue × 12.
- Clearly label all counts, prices, and revenue as assumptions and estimates.
- Save a named scenario and display saved scenarios after reload. Saved demo scenarios are public; the page must tell users not to store private information.
- Provide clear validation for negative, blank, or invalid values and a useful empty state.

### Acceptance criteria

1. `/product` and `/pricing` load directly and have working navigation links.
2. `/product` displays the feature map, all three tiers, and both customer segments.
3. Existing features and proposed future features are clearly distinguished.
4. `/pricing` displays all three tiers and the two scenario presets.
5. Editing either paid-tier subscriber count or price updates monthly and annual totals immediately.
6. Annual revenue equals monthly revenue multiplied by 12.
7. Invalid or negative entries are blocked or corrected with clear feedback.
8. Saving a scenario stores its name, scenario type, counts, prices, and calculated totals.
9. Saved scenarios remain visible after a page reload; a saved scenario can be removed.
10. All estimates are visibly described as assumptions, not actual market research or guaranteed results.
11. The new pages work on mobile and desktop and preserve the existing CakeMatch visual identity.
12. `/core` and `/research` retain their existing behavior.
13. Two pricing-logic tests and at least three software tests pass.

## 7. Architecture

```text
/product: feature map + segments + tier cards
/pricing: scenario controls + editable assumptions
        -> typed pricing calculation functions
        -> monthly and annual estimates
        -> save/load scenario records
        -> existing Supabase client and a dedicated pricing_scenarios table

GitHub stores source and planning evidence; Vercel publishes the app.
```

The calculator will use a small typed module with pure functions for validation and revenue calculations. Saved scenarios will use a dedicated Supabase table and the existing browser client only after the table schema and row-level security policies are prepared and checked. The page will show a clear database error rather than claim a scenario was saved if Supabase is unavailable.

## 8. Tech Stack

| Tool | Use | Reason |
|---|---|---|
| Next.js App Router | `/product` and `/pricing` routes | Already used by CakeMatch |
| React and TypeScript | Interactive controls and typed calculations | Existing project stack; makes input and scenario shapes clearer |
| Existing CSS/Tailwind setup | Responsive CakeMatch styling | Keep visual consistency without adding a UI framework |
| Supabase | Store and reload saved pricing scenarios | Already configured in the project; use a separate table |
| Node built-in test runner | Pricing logic and utility tests where compatible | Avoid adding a paid service or unnecessary dependency |
| GitHub and Vercel | Source history and live deployment | Existing project workflow |

## 9. DevOps Plan

1. Keep the existing `/core` and `/research` behavior intact.
2. Add and review this plan and the UX mockup before feature code.
3. Add the pricing scenarios schema and policies in a separate SQL file; verify the expected columns and access rules before using the table.
4. Keep environment values out of Git. Use only the existing public Supabase URL and publishable key in the browser; never expose a service-role key.
5. Work in small, reviewable changes and create at least five real commits over the planning, product, pricing, data, and testing steps.
6. Run the tests, lint, production build, and desktop/mobile checks. Fix issues and redeploy after the fix.
7. Push the completed source and verify the live `/product` and `/pricing` URLs before recording deployment evidence.

## 10. Test Plan

### Pricing logic test 1 — monthly revenue

With 20 Planificador Plus subscribers at MXN $99 and 5 Pastelería Pro subscribers at MXN $399, monthly revenue must equal `20 × 99 + 5 × 399 = MXN $3,975`.

### Pricing logic test 2 — annual revenue and free tier

With the same paid subscribers and any number of free users, annual subscription revenue must equal `MXN $3,975 × 12 = MXN $47,700`; free users add MXN $0.

### Software test 1 — input validation

Enter blank, negative, and non-numeric customer counts or prices. The app must prevent invalid calculations from being saved and show understandable feedback.

### Software test 2 — scenario interaction

Switch between Conservador and Optimista, then edit an input. The chosen values and revenue results must update together without a page error.

### Software test 3 — save and reload

Save a named scenario, reload `/pricing`, and verify the saved values and totals appear. Remove it and verify it disappears. If Supabase fails, the app must show an error rather than false success.

### Additional regression checks

Open `/product`, `/pricing`, `/core`, and `/research` directly at desktop and mobile widths. Run the production build and lint checks.

## 11. Exact Coding-Agent Prompt

```text
ROLE: You are my disciplined AI-native product architect and coding partner.
COURSE RULE: The Week 3 Build Discipline Packet and UX mockup are complete before feature coding. Follow them exactly and keep changes small and testable.

TASK: Implement the CakeMatch AI Week 3 product architecture and pricing simulator in the existing Next.js project.

BEFORE CODING:
- Read AGENTS.md, this packet, the Week 1 and Week 2 packets, the current home/core/research pages, shared CSS, and the existing Supabase client.
- Read the relevant Next.js 16 documentation under node_modules/next/dist/docs before using framework APIs.
- Inspect the existing repository status and preserve unrelated user work.

SCOPE:
- Add `/product` with a feature map, two customer segments, three proposed tiers, and clear labels distinguishing current features from proposed features.
- Add `/pricing` with Conservador and Optimista presets, editable paid-tier subscriber counts and prices, monthly and annual revenue, an assumptions table, and saved scenarios.
- Use the agreed simulator math: monthly revenue is the sum of paid subscriber counts multiplied by monthly prices; annual revenue is monthly revenue × 12. The free tier is MXN $0.
- Save and reload named scenarios with their inputs and calculated results in a dedicated Supabase `pricing_scenarios` table. Prepare the SQL schema and public demo policies separately. The page must state that demo scenarios are visible to other visitors. Do not claim persistence works unless the live database flow is verified.
- Add navigation links while preserving `/core` and `/research` behavior and existing CakeMatch styling.
- Add two pricing logic tests and at least three software tests from the packet.

CONSTRAINTS:
- Use only free tools; no paid APIs, checkout, payment processing, real subscriptions, external AI calls, or live market data.
- Clearly label prices, subscriber counts, and output as editable assumptions and estimates.
- Never expose secrets, edit `.env.local`, or use a Supabase service-role key in browser code.
- Avoid unnecessary dependencies. Do not invent test results, commits, database records, or deployments.

VALIDATION:
- Run the two pricing logic tests, at least three software tests, lint, and production build.
- Check the new routes and `/core` and `/research` at mobile and desktop widths.
- Fix errors and update the test/iteration log with actual outcomes.
- Do not claim Vercel deployment or GitHub push until confirmed.

REPORT:
List changed files, actual test results, known limitations, Supabase setup status, and whether the live routes were verified.
```

## Scope decisions

- I will use three tiers that reflect the current celebration-planning feature and a clearly marked proposed bakery direction.
- I will keep both customer segments visible, while avoiding the claim that bakery tools already exist.
- I will use local scenario presets only as editable planning examples; the user can change every paid count and price.
- I will not build checkout or claim the tiers are commercially validated.
