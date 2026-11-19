# Week 6 Iteration Log — Integrated Venture

Record observed issues and their corrections here. Do not list planned changes as completed fixes.

| Iteration | Observed issue or evidence | Correction | Verification |
|---|---|---|---|
| Planning review | Prior feedback asked for visible planning before code, a real architecture diagram, and evidence of build order. | Added and committed the Week 6 packet and UX mockup before application-code changes. | The plan and mockup were committed before application-code changes. |

| Local test setup | A route check could not reach a server started in a separate execution session. | Started the production server and checked the routes in one process. | All 10 routes returned HTTP 200 with expected page content. |
| Visible testing summary | The `/demo` page needed the Week 6 testing summary required by the assignment. | Added verified local technical results and labeled five external-user tests as pending. | `npm test` 13/13, lint, build, and 10-route local check passed; external testing remains open. |

| Vercel Preview build | The first Vercel Preview deployment failed. A local production build without public Supabase variables reproduced a prerender error on `/chat`. | Added a reserved `.invalid` Supabase client fallback for build-only environments and a dashboard unavailable state when Supabase is not configured. | No-environment build, lint, 13 automated tests, and all 10 local route checks pass. Vercel reports the retry deployment completed. The Preview page was not independently opened, and the exact first-failure cause is not available. |

| Production route check | The production deployment needed verification at the required `/demo` route and across the integrated site. | Checked the public demo and all ten existing/new routes; recorded HTTP status and expected content markers. | `/demo` and all ten routes returned HTTP 200. Database behavior and interactive user testing remain unverified. |
| Five external-user feedback sessions | Five people reviewed the live site and gave comments. One person said a section stayed on a loading state; another suggested making buttons larger. The page and cause of the loading state were not identified. | Follow up to identify the loading section, investigate and retest it; review the button-size suggestion before deciding on a UI change. | Five anonymized feedback messages are recorded in `WEEK6_TEST_LOG.md`. Follow-up, correction, and retest are pending. |
