# Week 6 Test Log — Integrated Venture

**Last updated:** November 19, 2026  
**Status:** Local software and route checks completed. A Vercel Preview deployment completed successfully after the no-environment fix. Production route verification, real Supabase data access, and five external-user sessions remain open. The first Preview deployment failed; detailed logs were not available here, so its exact cause is unconfirmed.

## External user sessions

The assignment requires five external users total. Use fictional event details and ask before recording feedback. Do not collect names, contact details, allergies, or sensitive personal information.

| Tester | Tasks completed | Confusion or issue | Feedback | Retest |
|---|---|---|---|---|
| 1 | Pending | Pending | Pending | Pending |
| 2 | Pending | Pending | Pending | Pending |
| 3 | Pending | Pending | Pending | Pending |
| 4 | Pending | Pending | Pending | Pending |
| 5 | Pending | Pending | Pending | Pending |

## Software and regression checks

| Check | Expected | Actual result | Status |
|---|---|---|---|
| `npm test` | Existing automated tests pass | 13 passed, 0 failed after the Preview build correction | PASS |
| `npm run lint` | No lint errors | Completed with no errors | PASS |
| `npm run build` | Production build succeeds | Build and TypeScript completed with no Supabase environment variables; route list includes `/dashboard`, `/demo`, and `/docs`. | PASS (local build only) |
| Route regression | All existing and new routes load | All 10 routes returned HTTP 200 and expected page markers in a local production-server check with no Supabase variables. | PASS (local HTTP check) |
| Responsive and keyboard review | Pages work at desktop/mobile widths and controls are keyboard reachable | Pending manual browser review | NOT RUN |
| Dashboard data states | Existing records, empty tables, or access failures are shown accurately | Query behavior against the real Supabase project not verified locally; dashboard has explicit loading, empty, and unavailable UI states. | NOT VERIFIED |
| External user sessions | Five different external users test the integrated site | No sessions recorded yet | PENDING |
| Vercel Preview deployment | Preview deploys and `/demo` loads | First attempt failed. The retry on commit `ca0bb4f` completed successfully according to the Vercel GitHub status. The preview route was not independently opened. | BUILD PASS; route not independently verified |
| No-environment build reproduction | Build works without public Supabase values | After the fallback change, build and TypeScript completed and all routes were prerendered. | PASS (local build only) |

## Fix and retest evidence

The first local route check could not reach a server started in a separate execution session. The server and route checks were then run in the same process. The repeat check passed for all 10 routes. This was a test setup issue, not an application bug. The Vercel Preview deployment failed. A local build without public Supabase values reproduced a missing-configuration prerender error on `/chat`. A reserved `.invalid` fallback now allows the no-environment build to complete and the dashboard reports unavailable data. The original Vercel failure cause is not confirmed. The Preview retry completed successfully according to GitHub’s Vercel status; the preview page itself was not independently opened. Production deployment and direct public-route verification remain pending.

No application issue was found in the automated tests, lint, build, or local route response check. External-user feedback, browser interaction, live deployment, and real Supabase data access remain open.
