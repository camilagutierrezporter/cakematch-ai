# Week 5 Test Log — Cake Design Assistant

**Last updated:** 2026-11-06
**Status:** Internal checks and owner-reported manual checks recorded; external user tests pending.

This log separates automated results, browser checks performed during implementation, and manual results reported by the project owner. Owner-reported Supabase results are not presented as independently reproduced. No external participant results are recorded.

## Automated software checks

| Check | Expected | Actual | Result |
|---|---|---|---|
| `npm test` | Existing tests and Cake Design Assistant logic tests pass. | 10 tests passed, 0 failed: five cake-design tests and five existing pricing tests. | PASS |
| `npm run lint` | ESLint reports no errors. | Command completed successfully with exit code 0. | PASS |
| `npm run build` | Production build and App Router route generation succeed. | Command completed successfully with exit code 0; `/chat` and existing routes were generated. | PASS |
| `git diff --check` | No whitespace errors in the worktree diff. | Command completed successfully with exit code 0. | PASS |
| Wireframe XML parse | SVG is well-formed XML. | Parsed `WEEK5_CHAT_WIREFRAME.svg` successfully. | PASS |

The cake-design unit tests cover every combination of the approved feeling, unique-detail, and inspiration options; deterministic output; invalid values; preset guardrails; and design-brief contents. They do not constitute database/RLS tests.

## Manual and browser checks

### Project-owner reported checks

The project owner reported manually verifying the following in the configured Supabase project:

| Check | Reported result |
|---|---|
| `/chat` loads and the three design questions work. | PASS |
| Romantic + Flowers + Personal memory produces a personalized design description. | PASS |
| Save design succeeds and the saved design remains after a page reload. | PASS |
| Thumbs-up feedback saves to Supabase. | PASS |
| `chat_sessions` and `chat_feedback` contain the expected records. | PASS |

These are owner-reported results; no private record contents or credentials are included here.

### Browser checks performed during implementation

| Check | Actual result | Result |
|---|---|---|
| Complete the guided chat using Romantic + Flowers + Personal memory. | The three steps completed and the result reflected all selected answers. | PASS |
| Change an answer after generating a result. | Returning to the selected feeling and choosing another option updated the flow. | PASS |
| Choose the allergy/safety guardrail. | The assistant declined to assure safety and directed the visitor to confirm ingredients and cross-contact precautions with a baker. | PASS |
| Save a design, reload `/chat`, and restore the saved design. | In the locally configured Supabase project after Anonymous Sign-Ins were enabled, save succeeded and the same design was restored after reload. | PASS |
| Delete the saved design. | Confirmed deletion returned the page to the initial question flow. | PASS |
| Narrow viewport layout. | No horizontal overflow was observed in the viewport check. | PASS |
| Supabase owner isolation with two distinct anonymous users. | Not tested. | NOT RUN |
| Database constraint failures and cross-owner write attempts. | Not tested. | NOT RUN |

### Corrections recorded

- The earlier `/chat` 404 was investigated. The App Router file and route manifests registered `/chat`, and the local route returned successfully; no routing code change was required for that investigation.
- The earlier Supabase restore error occurred while anonymous sign-in was disabled. The browser reported “Anonymous sign-ins are disabled.” After the project owner enabled Anonymous Sign-Ins, reloading `/chat` allowed restore; save, reload, and deletion were subsequently verified in the browser.
- Restore handling was improved to identify which phase fails, validate saved data shapes, and explicitly filter feedback by owner. No RLS policy was disabled or weakened.

## External user tests

The three planned external user sessions have **not** been conducted. No participant feedback is available; none is inferred or fabricated.

| Planned test | Scope | Status |
|---|---|---|
| External test 1 — discoverability and choice flow | Unassisted completion and understanding of the three-choice flow. | PENDING |
| External test 2 — personalization and comprehension | Whether a participant recognizes how all three choices shape the design and understands it is a concept, not a confirmed design. | PENDING |
| External test 3 — guardrail, human checkpoint, storage, and feedback | Allergy/safety guardrail, unsent brief, save/reload, and feedback comprehension. | PENDING |

Record anonymized observations only after each session is actually conducted, with consent as specified in the build packet.

## Remaining verification

- Run the two-anonymous-session owner isolation test and verify invalid-value/cross-owner attempts against the live Week 5 tables.
- Conduct and document the three external user tests.
- No accessibility audit across all controls or regression-browser pass over every existing route is claimed by this log.
- No commit, push, or deployment is recorded.
