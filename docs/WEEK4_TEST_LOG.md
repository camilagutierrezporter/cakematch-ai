# CakeMatch AI — Week 4 Test Log

## Test environment and evidence boundaries

- Local application: `http://127.0.0.1:3000/marketing`
- Browser checks were run against the local development site using the integrated browser.
- Supabase persistence evidence below was manually verified by the project owner and reported for this task. It was not independently repeated by the coding agent.
- A/B counts in this log are **SIMULATED DEMO DATA**, not real visitor results.

## Software tests

| Test | Expected result | Actual result | Pass/Fail |
|---|---|---|---|
| 1. Marketing page content and route | `/marketing` opens and shows brand/content sections, exactly 10 social posts, 3 video scripts, all 14 campaign days, two A/B comparisons, and Saved Assets. | Local browser opened the route successfully. The page showed 10 `.social-post-card` elements, 3 `.video-script-card` elements, 14 `.campaign-day` elements, 2 `.ab-comparison-card` elements, and the Saved Assets section. | PASS |
| 2. Copy and Export actions | Every requested content unit copies to the clipboard and exports a readable `.txt` file with the expected name and section content. | Clicked all 15 Copy controls (landing copy, 10 posts, 3 scripts, calendar). Each clipboard read was non-empty and each control reported successful copy. Read the landing-copy clipboard text and confirmed its headline, description, and CTA. Clicked all 15 Export controls and inspected generated Blob content and filenames. Filenames were distinct and descriptive; Post 01 included its theme, Script 01 included all scenes, and the calendar export contained all 14 day labels. | PASS |
| 3. Saved Assets integration and access boundary | Saved content is private, requires sign-in, and remains retrievable after refresh by the owner. | Local browser, signed out: the sign-in form and Saved Assets section appeared; clicking Save on Social post 01 showed “Sign in with your email before saving marketing assets.” Separately, the project owner manually verified that Social post 01 persisted after a local refresh and was retrieved on the deployed Vercel page after signing in. The deployed persistence check is owner-reported evidence, not an agent-run test. | PASS — local sign-in guard verified; persistence manually verified by owner |
| 4. A/B CTR calculation and simulated-data label | Given the two requested count sets and the simulated-data checkbox selected, calculate each CTR, choose the correct winner, and clearly label results as simulated. | Test 1 produced 18.00% vs 12.00% and Option A; Test 2 produced 15.00% vs 22.00% and Option B. Both result regions displayed “SIMULATED DEMO DATA — NOT REAL VISITOR RESULTS.” Repeated after the UI improvement with no browser console errors. | PASS |

## A/B demonstrations

These are **SIMULATED DEMO DATA** entered into the A/B tester to verify its calculations. They are not real visitor results, do not establish statistical significance, and do not mean a live experiment ran automatically.

| Demonstration | Option A | Option B | Actual calculation and displayed result |
|---|---:|---:|---|
| Test 1 — finding the right cake | 18 clicks / 100 visitors = 18.00% CTR | 12 clicks / 100 visitors = 12.00% CTR | Option A wins. The result displayed “SIMULATED DEMO DATA — NOT REAL VISITOR RESULTS.” |
| Test 2 — easy planning vs bakery discovery | 15 clicks / 100 visitors = 15.00% CTR | 22 clicks / 100 visitors = 22.00% CTR | Option B wins. The result displayed “SIMULATED DEMO DATA — NOT REAL VISITOR RESULTS.” |

## Iteration Log

### Adding an explicit simulated-data result label

- **Observed during testing:** The A/B tester correctly calculated results but did not visibly label a result as simulated when sample values were entered. A nearby instruction alone could be separated from the result and was not a strong enough safeguard against misrepresenting demo data.
- **Change:** Added an unchecked “These counts are SIMULATED DEMO DATA” checkbox to each comparison. When selected, the calculated result includes a prominent “SIMULATED DEMO DATA — NOT REAL VISITOR RESULTS” label. Inputs remain blank by default; no visitor counts are generated or prefilled.
- **Verification:** Re-ran both requested demonstrations with the checkbox selected. Test 1 displayed 18.00% vs 12.00% and Option A as winner; Test 2 displayed 15.00% vs 22.00% and Option B as winner. Both results displayed the simulated-data label.
- **Outcome:** The improvement passed the retest.

## Automated project checks

| Check | Expected result | Actual result | Pass/Fail |
|---|---|---|---|
| `npm run lint` | No lint errors. | Completed with exit code 0. | PASS |
| `npm run build` | Production build and static page generation succeed. | Completed with exit code 0; `/marketing` was generated. | PASS |
| `git diff --check` | No whitespace errors. | Completed with exit code 0. | PASS |
| `npm test` | Existing project tests pass. | 5 tests passed; 0 failed. | PASS |

The first production-build attempt during the final verification found a missing default for the simulated-data flag in the second comparison (`TS2741`). The missing `false` default was added and the production build then passed.
