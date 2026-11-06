# Week 5 Test Log — Cake Design Assistant

**Last updated:** 2026-11-06
**Status:** Internal checks, owner-reported manual checks, and three external user sessions recorded. Database isolation checks remain pending.

This log separates automated results, browser checks performed during implementation, manual results reported by the project owner, and feedback from three real external users. Owner-reported Supabase results are not presented as independently reproduced. External feedback is recorded as reported; no participant is claimed to have submitted an in-app rating.

## Automated software checks

| Check | Expected | Actual | Result |
|---|---|---|---|
| `npm test` | Existing tests and Cake Design Assistant logic tests pass. | 13 tests passed, 0 failed: eight cake-design tests (including three variation tests) and five existing pricing tests. | PASS |
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
| “Try another design” generates an alternative from the same three answers, without restarting. | PASS |
| The original design remains available while reviewing the alternative. | PASS |
| Select “Use this version,” save it, and reload `/chat`. | The selected alternative saved successfully and was restored after reload. | PASS |

These are owner-reported results; no private record contents or credentials are included here.

### Browser checks performed during implementation

| Check | Actual result | Result |
|---|---|---|
| Complete the guided chat using Romantic + Flowers + Personal memory. | The three steps completed and the result reflected all selected answers. | PASS |
| Change an answer after generating a result. | Returning to the selected feeling and choosing another option updated the flow. | PASS |
| Choose the allergy/safety guardrail. | The assistant declined to assure safety and directed the visitor to confirm ingredients and cross-contact precautions with a baker. | PASS |
| Save a design, reload `/chat`, and restore the saved design. | In the locally configured Supabase project after Anonymous Sign-Ins were enabled, save succeeded and the same design was restored after reload. | PASS |
| Delete the saved design. | Confirmed deletion returned the page to the initial question flow. | PASS |
| Generate another variation with the same answers. | “Try another design” displayed a different preview using Romantic + Flowers + Personal memory without restarting the conversation. | PASS |
| Keep the current design after previewing a variation. | “Keep current design” dismissed the preview and left the displayed design unchanged. Reloading while a preview was pending also restored the previously saved version. | PASS |
| Choose and save a variation. | “Use this version” replaced the current design, marked it as changed, and disabled feedback until saving. After save and reload, the selected variation restored. | PASS |
| Preserve guardrails and feedback UI with a variation preview. | Existing guardrail section remained visible; feedback remained available for the saved version while a new variation was only a preview. | PASS |
| Narrow viewport layout. | No horizontal overflow was observed in the viewport check. | PASS |
| Supabase owner isolation with two distinct anonymous users. | Not tested. | NOT RUN |
| Database constraint failures and cross-owner write attempts. | Not tested. | NOT RUN |

### Corrections recorded

- The earlier `/chat` 404 was investigated. The App Router file and route manifests registered `/chat`, and the local route returned successfully; no routing code change was required for that investigation.
- The earlier Supabase restore error occurred while anonymous sign-in was disabled. The browser reported “Anonymous sign-ins are disabled.” After the project owner enabled Anonymous Sign-Ins, reloading `/chat` allowed restore; save, reload, and deletion were subsequently verified in the browser.
- Restore handling was improved to identify which phase fails, validate saved data shapes, and explicitly filter feedback by owner. No RLS policy was disabled or weakened.
- The first variation unit-test run exposed that the preview paraphrased the unique-detail choice rather than naming the selected option. Variation text was adjusted to retain the selected feeling, unique detail, and inspiration explicitly; all 13 tests then passed.

## External user tests

Three real external users tested CakeMatch AI `/chat`. The observations and suggestions below were reported by the project owner. No in-app vote or database feedback record is attributed to these participants.

| User | Reported observation | Suggested improvement |
|---|---|---|
| Test 1 — Nati | Liked the cake design and found the page easy to use. | Allow users to upload inspiration photos to make the design more personalized. |
| Test 2 — Renata | Really liked the result and found the questions easy to understand. | Add more color and decoration options. |
| Test 3 — Regina | Liked the idea and said it helped her imagine a cake. Some answers were confusing at first, then became easy. | Allow users to edit the final design without restarting and show more design options. |

These summaries do not provide measured task completion times or detailed protocol outcomes. Do not infer consent details, verbatim quotations, or ratings that were not reported.

The three external sessions have occurred, but the complete planned protocol is not established by the available notes. Treat measured unaided completion, detailed comprehension checks, and the specific storage/feedback tasks as **not separately verified** unless additional evidence is recorded.

## Remaining verification

- Run the two-anonymous-session owner isolation test and verify invalid-value/cross-owner attempts against the live Week 5 tables.
- Consider another external feedback session for the variation feature; the previously reported external user tests occurred before this feature was implemented.
- No accessibility audit across all controls or regression-browser pass over every existing route is claimed by this log.
- No commit, push, or deployment is recorded.
