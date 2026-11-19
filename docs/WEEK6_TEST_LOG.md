# Week 6 Test Log — Integrated Venture

**Last updated:** November 19, 2026  
**Status:** Local checks and the public production route regression completed. Vercel reports successful Preview and Production deployments. Five anonymized external-user feedback messages have been received; exact task-by-task completion was not captured, and one loading issue needs follow-up and retest. The live dashboard shows event-plan and market-research records, while pricing scenarios are unavailable. The first Preview deployment failed; detailed logs were not available here, so its exact cause is unconfirmed.

## External user sessions

The assignment requires five external users total. Use fictional event details and ask before recording feedback. Do not collect names, contact details, allergies, or sensitive personal information.

| Tester | Tasks completed | Confusion or issue | Feedback | Retest |
|---|---|---|---|---|
| 1 | Reviewed the demo and found the event planner. Exact task-by-task completion was not recorded. | No confusion reported. Asked for larger buttons. | Liked the step-by-step flow and understood what to do. | Pending review of button-size suggestion. |
| 2 | Reviewed the design idea and its bakery confirmation reminder. Exact task-by-task completion was not recorded. | No confusion reported. | Understood that CakeMatch helps with a design idea and that a bakery must confirm price and ingredients; found this useful. | No specific change requested. |
| 3 | Reviewed the page. Exact task-by-task completion was not recorded. | No confusion reported. | Liked the page design, found it easy to use, and said they would leave it as it is. | No specific change requested. |
| 4 | Tried the design chat. Exact task-by-task completion was not recorded. | No confusion reported. | Liked the concept and said the chat was easy to use. | No specific change requested. |
| 5 | Reviewed the page. Exact task-by-task completion was not recorded. | Reported that one section kept loading; the page/section and cause were not identified. The tester thought it might be their internet connection. | Said the page was easy to use and liked it. | Pending identification of the loading section and retest. |

**Session evidence:** Five anonymized feedback messages were received on November 18, 2026. These messages confirm five people reviewed the site and gave feedback, but they do not document completion of each assigned task. Do not claim task-by-task success without follow-up evidence.

## Software and regression checks

| Check | Expected | Actual result | Status |
|---|---|---|---|
| `npm test` | Existing automated tests pass | 13 passed, 0 failed after the Preview build correction | PASS |
| `npm run lint` | No lint errors | Completed with no errors | PASS |
| `npm run build` | Production build succeeds | Build and TypeScript completed with no Supabase environment variables; route list includes `/dashboard`, `/demo`, and `/docs`. | PASS (local build only) |
| Route regression | All existing and new routes load | All 10 routes returned HTTP 200 and expected page markers in a local production-server check with no Supabase variables. | PASS (local HTTP check) |
| Responsive and keyboard review | Pages work at desktop/mobile widths and controls are keyboard reachable | Pending manual browser review | NOT RUN |
| Dashboard data states | Existing records, empty tables, or access failures are shown accurately | Live dashboard screenshot shows event-plan and market-research records. Pricing scenarios display an unavailable message. | PARTIAL; investigate pricing data/table access |
| External user sessions | Five different external users test the integrated site | Five anonymized feedback messages received. Task-by-task completion was not recorded; one person reported a section that kept loading. | PARTIAL; investigate and retest the loading report, and record task outcomes if available |
| Vercel Preview deployment | Preview deploys and `/demo` loads | First attempt failed. The retry on commit `ca0bb4f` is marked Ready in Vercel; the Preview route was not independently opened. | BUILD PASS; route not independently verified |
| No-environment build reproduction | Build works without public Supabase values | After the fallback change, build and TypeScript completed and all routes were prerendered. | PASS (local build only) |

## Fix and retest evidence

The first local route check could not reach a server started in a separate execution session. The server and route checks were then run in one process; all 10 routes returned HTTP 200 with expected page content. This was a test setup issue, not an application bug. The first Vercel Preview deployment failed. A local build without public Supabase values reproduced a missing-configuration prerender error on `/chat`. A reserved `.invalid` fallback now allows the no-environment build to complete and the dashboard reports unavailable data when it cannot connect. The original Vercel failure cause is not confirmed. The Preview retry on commit `ca0bb4f` is marked Ready in Vercel, but its page was not independently opened. The public production `/demo` route and all 10 production routes returned HTTP 200 with expected content. This was an HTTP route check, not a full interaction check. A live dashboard screenshot later showed event-plan and market-research records and an unavailable pricing-scenarios panel. Five anonymized external-user feedback messages were received on November 18. One person reported an unidentified section that kept loading; its cause is unknown and it still needs follow-up and retesting. Exact task-by-task outcomes, responsive/keyboard review, and live pricing-table access remain unverified.

No application issue was found in the automated tests, lint, build, or local route response check. External feedback has now been received from five people. A loading report needs clarification and retesting; responsive/keyboard review and pricing-scenario data access also remain open.
