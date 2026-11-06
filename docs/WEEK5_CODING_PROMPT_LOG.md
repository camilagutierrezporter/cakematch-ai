# Week 5 Coding Prompt Log — Cake Design Assistant

**Last updated:** 2026-11-06
**Purpose:** Record implementation work that actually occurred against the five bounded prompts in [WEEK5_BUILD_DISCIPLINE.md](./WEEK5_BUILD_DISCIPLINE.md). This is not a claim that the original prompts were issued as five separate coding sessions.

| Prompt | Planned scope | Actual work and evidence | Status |
|---|---|---|---|
| 1 — Design response and option validation | Deterministic design-description and guardrail logic with unit tests. | Added the pure cake-design module and automated tests covering every approved answer combination, deterministic output, invalid answers, guardrails, and the design brief. Included in `npm test` (10 total tests pass). | IMPLEMENTED; automated checks pass |
| 2 — Supabase storage and access rules | Week 5 schema, RLS setup, and matching client types. | Added `WEEK5_SUPABASE_SETUP.sql` and chat/feedback types. The setup was reviewed and tightened with owner-restrictive RLS policies. The project owner reports creating the tables and confirming expected records. The SQL was not executed by this coding task, and two-user RLS isolation was not tested. | IMPLEMENTED; owner reports tables active; isolation test pending |
| 3 — Public chat interface | Responsive `/chat` with the exact three prompts and personalized result. | Updated the existing `/chat` page and shared styles for the three-option flow, answer changes, result, and responsive layout. The earlier route investigation found `/chat` registered and responding; no route configuration change was made. | IMPLEMENTED; automated build and browser flow checks pass |
| 4 — Privacy, guardrails, and feedback | Save/reload/delete, guardrails, design brief, and thumbs feedback. | Wired anonymous Supabase persistence and feedback; added preset guardrails, human checkpoint, copyable unsent brief, and owner-specific reload. The owner reports thumbs-up and expected database rows. Browser verification confirmed save/reload/delete after Anonymous Sign-Ins were enabled. Two-user isolation remains untested. | IMPLEMENTED; persistence manually verified, isolation pending |
| 5 — Verification and release evidence | Automated checks, manual/browser checks, external sessions, and test evidence. | `npm test` (10 pass), `npm run lint`, and `npm run build` passed. Manual and browser evidence is separated in [WEEK5_TEST_LOG.md](./WEEK5_TEST_LOG.md). External user tests are still pending and are not represented as complete. No commit, push, or deployment occurred. | PARTIAL; external tests and RLS isolation pending |

## Corrections captured

- Anonymous sign-in initially failed because it was disabled in Supabase Auth. The owner enabled it; save and restore then worked in the local browser.
- Restore error handling now identifies its phase, validates saved values, and scopes feedback lookup by owner and session.
- The previous `/chat` 404 report was investigated; the route was present and returned successfully, so no routing code change was needed for that investigation.

## Release status

No commit, push, Preview deployment, or Production deployment is recorded here. External user testing and owner-isolation testing remain open.
