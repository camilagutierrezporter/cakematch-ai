# Week 6 Test Log — Integrated Venture

**Last updated:** November 19, 2026  
**Status:** Local software and route checks completed. Five external-user sessions are still pending. Supabase integration and live deployment checks are not yet verified.

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
| `npm test` | Existing automated tests pass | 13 passed, 0 failed | PASS |
| `npm run lint` | No lint errors | Completed with no errors | PASS |
| `npm run build` | Production build succeeds | Build and TypeScript completed; route list includes `/dashboard`, `/demo`, and `/docs`. Used placeholder public Supabase values because local credentials were not present. | PASS (local build only) |
| Route regression | All existing and new routes load | All 10 routes returned HTTP 200 and expected page markers in a local production-server check. | PASS (local HTTP check) |
| Responsive and keyboard review | Pages work at desktop/mobile widths and controls are keyboard reachable | Pending manual browser review | NOT RUN |
| Dashboard data states | Existing records, empty tables, or access failures are shown accurately | Query behavior against the real Supabase project not verified locally; dashboard has explicit loading, empty, and unavailable UI states. | NOT VERIFIED |
| External user sessions | Five different external users test the integrated site | No sessions recorded yet | PENDING |
| Live `/demo` deployment | Deployed route loads after publish | Initial deployment has not been verified yet | PENDING |

## Fix and retest evidence

The first local route check could not reach a server started in a separate execution session. The server and route checks were then run in the same process. The repeat check passed for all 10 routes. This was a test setup issue, not an application bug.

No application issue was found in the automated tests, lint, build, or local route response check. External-user feedback, browser interaction, live deployment, and real Supabase data access remain open.
