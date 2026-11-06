# CakeMatch AI — Week 5 Build Discipline Packet
## Public Guided Cake Chat

**Status:** Planning only — implementation, commits, and deployment require approval.

## 1. Problem

People planning a celebration may not know where to start when choosing a cake or how to make the guest count and budget work together. The existing `/core` page collects several details in a form, but a public guided chat could make the first planning steps feel more conversational and approachable.

This Week 5 experience will provide a simple starting recommendation, not a live bakery search, final quote, or order.

## 2. User

The primary user is a person in Mexico planning a birthday, wedding, baby shower, or another celebration. They want quick guidance for a cake that fits their event, guest count, and budget in Mexican pesos (MXN), without creating an account or contacting a bakery before they are ready.

The secondary human participant is a baker or trusted person who can review the plan and confirm details the demo cannot verify.

## 3. Success Criteria

Week 5 is successful when:

- A visitor can open `/chat` without signing in and finish a guided flow covering event type, number of guests, and budget in MXN.
- The chat presents a simple, repeatable cake recommendation that reflects those answers and is clearly labeled as guidance rather than a quote.
- Unsupported requests receive a clear guardrail response; allergy, safety, exact-price, and other high-stakes or bakery-specific requests lead to a human checkpoint.
- A visitor can return to their own saved chat on the same anonymous browser session and give a thumbs-up or thumbs-down.
- Chat data and feedback are stored in Supabase with owner-only access. No visitor can read another visitor's chat.
- The existing `/core`, `/research`, `/pricing`, and `/marketing` features continue to work.
- Three software tests and three moderated external user tests are completed and documented; findings are addressed and retested.
- The new route passes desktop, mobile, accessibility, and persistence checks.
- After approval, the work is delivered in five meaningful GitHub commits and two verified Vercel deployments, with separate approval before production deployment.

## 4. UX Concept and Mockup Plan

Use the existing CakeMatch AI visual identity: cream background, blush accents, burgundy actions, and current typography. Keep the chat layout focused and mobile-first:

1. A short introduction explains that this is a guided demo, not a bakery or ordering service.
2. Assistant bubbles ask the three intake questions in order:
   - **Event type:** choose from suggested event types, with a safe “Other” option.
   - **Number of guests:** enter a positive whole number.
   - **Budget:** enter a positive MXN amount.
3. Quick replies and small, accessible input cards keep the interaction easy to complete.
4. A recommendation card summarizes the answers, portion guidance, and budget-aware planning suggestion.
5. “This is a demo, not a quote” remains visible with the recommendation.
6. A feedback control offers clearly labeled thumbs up and thumbs down.
7. A human checkpoint offers a copyable summary the visitor can take to a baker. It must not imply a baker has been contacted.

Use English for this MVP to match the current app's page content and navigation. MXN is explicit in the budget label and all displayed amounts. Spanish localization is a possible follow-up, not a Week 5 dependency.

### Mockup plan

Before feature code begins, create a low-fidelity desktop and mobile wireframe at `docs/WEEK5_CHAT_MOCKUP.svg`, following the existing project documentation style. The mockup will show the welcome/privacy note, all three sequential questions and answer states, validation, the completed recommendation with its estimate disclaimer, guardrail and baker checkpoint, copy-brief confirmation, thumbs feedback, loading/error states, and delete confirmation. Review the flow and responsive layout against this packet before implementation; revise the mockup and packet together if a required behavior is unclear. The SVG is a planned UX artifact, not a production UI or a substitute for testing the built page.

## 5. Scope Cuts

This week will not include:

- Paid AI services, external model APIs, or claims that a human or AI has reviewed the recommendation.
- Real bakery search, product catalogs, live availability, exact prices, ordering, delivery, payments, or booking.
- Allergy, food-safety, medical, or dietary assurance.
- User registration, email, phone number, or account management. The page uses a silent Supabase anonymous session for private ownership.
- Open-ended generative chat. The three intake steps and canned guidance are deterministic. Unsupported free-text requests receive a guardrail response; arbitrary prompt text is not retained in the database.
- Advanced analytics, staff dashboards, a feedback moderation queue, or automatic contact with a baker.
- Changes to the existing `/core` recommendation logic or its saved data.
- New paid services or dependencies.

## 6. Product Specification and Acceptance Criteria

### Public route and chat behavior

- Add a public `/chat` route and link to it from the homepage without removing or renaming existing routes.
- Present the three required questions in order. Keep the current question visible in the conversation, and do not generate a recommendation until all three answers are valid.
- Validate event type, guest count, and budget. Guest count must be a positive whole number; budget must be a positive finite amount in MXN. Explain invalid input inline and allow correction.
- Let the user restart the flow and confirm before deleting a saved conversation.
- Clearly show loading, save success, save failure, empty, and retry states. Do not claim a chat or vote was saved if Supabase returned an error.

### Simple guided recommendation

- Use local, typed, deterministic rules; no AI request is made.
- Calculate a portion starting point from the guest count, select a simple design direction from the event type, and use the budget as a planning constraint.
- Keep any price guidance conservative and clearly identified as an illustrative estimate or budget target, not a bakery price. Do not claim that a real cake is available at that amount. If a credible amount cannot be produced from current project data, show the user's budget as a target and ask a baker to confirm pricing instead of inventing a quote.
- Include a short explanation linking the recommendation to the user's answers.
- Make the rule assumptions explicit in the UI or a nearby note, and test threshold boundaries.

### Guardrail and human checkpoint

- For requests outside the supported cake-planning flow, explain the boundary and offer to continue with the event, guest, and budget questions.
- For allergies, food safety, dietary suitability, exact pricing, availability, complex custom design, or ordering, do not guess or promise a result. Explain that a baker must confirm the details.
- Provide a “Prepare for a baker” action that creates a copyable brief from the three intake answers and recommendation. It does not send the brief or contact anyone.
- Do not store arbitrary unsupported user text. Store only structured answers, generated messages, a guardrail category when needed, and the user's feedback.

### Chat and test storage

Use the existing Supabase project and public publishable client. Before implementation, confirm that anonymous sign-in is enabled and prepare a separate Week 5 SQL setup file. The visitor does not see a sign-in flow, but Supabase creates an anonymous identity; saved chat recovery is limited to that same browser profile while its Supabase session remains available. Clearing browser data or losing that session may make saved chats unrecoverable, and the UI must not promise cross-device recovery.

Proposed data:

- `chat_sessions`: owner ID, created/updated timestamps, structured event type, guest count, budget in MXN, recommendation payload, and completion state.
- `chat_messages`: owner ID, session ID, role, message type, and bounded display content for the guided prompts, selected answers, and generated responses. Do not persist arbitrary free-text prompts.
- `chat_feedback`: owner ID, session ID, recommendation ID/version, thumbs-up/down value, and timestamp. Enforce at most one current vote per owner and recommendation.
- Test cases and expected outcomes remain in the repository's automated test suite; actual test results are recorded in the Week 5 test log. Do not mix QA fixtures with visitor chat records or add a public test-data dashboard.

The Supabase anonymous user ID is the owner boundary; there is no visible login. Enable Row Level Security on every visitor-data table and permit reads, writes, updates, and deletes only when `auth.uid()` matches the row owner. Validate foreign-key ownership so a visitor cannot attach messages or feedback to another owner's session. Use database constraints for bounded strings, positive counts/budgets, valid roles, and valid feedback values. Never expose a service-role key.

Show a concise privacy note: do not enter names, contact details, or sensitive information. Keep only the structured chat needed for this experience. For the MVP, retain data until the visitor deletes the chat; do not imply an automatic deletion schedule. Provide a delete-chat action that removes the visitor's session, messages, and feedback. If an automatic retention period is later added, disclose it and verify it is actually configured before claiming it.

### Acceptance criteria

1. `/chat` loads directly for a visitor without a visible account-creation or email step.
2. The interface asks exactly the three required intake questions and displays budget in MXN.
3. Missing, invalid, zero, negative, decimal guest counts, and non-finite numeric values do not produce a recommendation; actionable validation is shown.
4. A valid flow produces a deterministic cake recommendation based on event type, guests, and budget. The output shows its assumptions and is not represented as a live quote or confirmed order.
5. The recommendation software test covers representative events, guest counts, budget values, and portion/price threshold boundaries.
6. Unsupported requests receive the guardrail response. Allergy, safety, exact-price, and custom-order cases reach the human checkpoint without unsupported assurances.
7. The baker brief contains the visitor's structured answers and recommendation, can be copied, and clearly remains unsent.
8. A completed chat is saved to Supabase and is available to the same anonymous browser session after refresh. Save and reload failures are shown explicitly, and the UI explains that recovery is not guaranteed after browser data is cleared.
9. A visitor can cast either thumbs vote, see which vote is selected, change it, and reload the saved state. Another anonymous user cannot read, edit, or delete that visitor's session or feedback.
10. A visitor can delete their own chat and its related messages and feedback; the page confirms completion or reports failure.
11. Database validation and Row Level Security are tested for owner isolation, invalid values, message/session ownership, and feedback ownership.
12. The interface has accessible labels, keyboard-operable controls, visible focus, announced errors/status, and a useful responsive layout at mobile and desktop sizes.
13. Existing project tests, lint, production build, and the existing `/core`, `/research`, `/pricing`, and `/marketing` routes continue to pass.
14. No paid tool, external AI API, new visible account system, secret in client code, or unsupported claim is introduced.
15. The desktop/mobile UX mockup is reviewed against the requirements before feature code begins.
16. Three software tests and three separate moderated external user tests are completed, with anonymized expected/actual results and improvements recorded in the Week 5 test log. Do not mark a test complete without evidence.
17. After implementation and release approvals, create five meaningful GitHub commits and complete two Vercel deployments (Preview and Production). If approvals or free-tier capability prevent either deployment, report it as incomplete rather than claim success.

## 7. Architecture

```text
Public visitor
    -> Next.js App Router /chat page
    -> guided React chat state + typed deterministic recommendation rules
    -> existing Supabase browser client + anonymous Auth session
    -> chat_sessions / chat_messages / chat_feedback
    -> RLS: rows readable/writable only by auth.uid() owner

Repository test suite
    -> pure recommendation and validation tests
    -> recorded results in docs/WEEK5_TEST_LOG.md
```

Keep recommendation rules in a small pure module so they can be tested without React, Supabase, network access, or paid services. Keep chat UI state and persistence concerns separate. Extend the existing Supabase database types carefully and use a Week 5-specific schema rather than modifying `core_outputs`. SQL setup must be reviewed before running it in the existing Supabase project.

## 8. Tech Stack

| Tool | Week 5 use |
|---|---|
| Next.js 16 App Router | Add the `/chat` route using existing project conventions. |
| React 19 and TypeScript | Build typed chat state, validation, and recommendation output. |
| Existing Tailwind CSS 4 and shared styles | Match the current CakeMatch palette and responsive behavior; no new UI framework. |
| Existing Supabase project and `@supabase/supabase-js` | Anonymous identity and private chat/feedback persistence with RLS. |
| Node.js built-in test runner | Add deterministic unit tests without a paid test service or new dependency. |
| GitHub | Reviewable source history and Week 5 planning/test evidence. |
| Existing Vercel project | Preview and production hosting only after approval and passing checks. |

Use only current free-tier capabilities and do not upgrade a plan or add a paid tool without approval. Confirm the actual Supabase and Vercel project settings before relying on an assumed free-tier feature or limit.

## 9. DevOps and Approval Gate

**Before approval:** keep this packet as planning documentation only. Do not edit application code, SQL setup, dependencies, environment files, or configuration. Do not commit, push, or deploy.

**After approval, proposed sequence:**

1. Confirm this packet, the mockup, current Git status, and existing project behavior. Read relevant Next.js 16 documentation under `node_modules/next/dist/docs/` before using framework APIs.
2. After approval to implement, complete the mockup, deterministic recommendation rules, dedicated Supabase schema/RLS, and `/chat` in small reviewable changes. Confirm anonymous sign-in and policy behavior without exposing secrets.
3. Complete the three external user tests and three software tests described below. Fix and retest any failures; record actual outcomes in `docs/WEEK5_TEST_LOG.md`. Do not deploy to production if an external user test reveals unresolved safety, privacy, or comprehension issues.
4. Run full existing tests, lint, production build, and desktop/mobile browser checks. Verify existing routes and Supabase persistence/owner isolation with separate anonymous sessions.
5. Review the diff and confirm `.env.local`, service-role keys, and unrelated user changes remain untouched.
6. Create the five planned meaningful commits only after implementation is approved and each change is reviewed and validated. Push through the existing GitHub workflow only with approval.
7. **Deployment 1 — Vercel Preview:** after the preview commit is pushed and all local checks pass, deploy a preview only with deployment approval. Verify the `/chat` flow, responsive layout, storage, and RLS on the preview environment.
8. Fix any preview findings, rerun affected tests, and record the changes.
9. **Deployment 2 — Vercel Production:** deploy the verified release only after the user separately approves production deployment. Verify the live route and core behavior, then record the actual URL and result. If approval or free-tier capacity is unavailable, stop and document that deployment as not completed; never claim it occurred.

### Planned five meaningful commits

These are proposed commit scopes, not commits already made. Keep commits focused and ensure each is tested before it is created.

1. `test: add chat recommendation and input validation coverage` — pure recommendation rules, input validation, and boundary tests.
2. `feat: add private chat storage schema` — Week 5 SQL setup, constraints, owner-safe relationships/RLS, and matching Supabase types.
3. `feat: add guided chat experience` — public `/chat`, the three-step intake, responsive UI, deterministic recommendation, and homepage entry point.
4. `feat: add chat guardrails and feedback` — guardrail/human checkpoint, copyable baker brief, thumbs feedback, and owner-only save/reload/delete behavior.
5. `test: verify chat workflow and document results` — integration/regression fixes, accessibility/responsive verification, and completed test evidence.

Do not split or label work as a commit unless an actual Git commit with that scope is made. Do not commit until the plan and implementation have been approved.

## 10. Test Plan

### Three software tests

1. **Recommendation and validation test (automated):** run table-driven tests with the existing Node.js test runner for all three event types, small and large guest counts, budget thresholds and adjacent boundary values, plus blank, zero, negative, decimal, and non-finite inputs. Expected: deterministic output matches the declared rules; invalid input never generates a recommendation.
2. **Chat workflow and accessibility test (browser):** complete the three-question flow at desktop and mobile widths; exercise corrections, restart, guardrail, allergy/exact-price checkpoint, copy brief, feedback selection/change, loading/error states, keyboard-only use, and status announcements. Expected: all controls work, no unsupported claim appears, and content remains usable without overflow.
3. **Supabase integration and isolation test (existing client, two anonymous sessions):** save/reload/delete a chat and feedback as owner A, then attempt read/update/delete as owner B and test invalid values and mismatched session relationships. Expected: owner A succeeds; owner B cannot access owner A's rows; invalid and cross-owner writes are rejected; simulated failures never show false success. Clean up test records and record the actual Supabase environment used.

### Three external user tests

Conduct three separate, moderated 10–15 minute sessions with three different people who plan celebrations and are not the builder. Ask permission before testing, explain that the prototype is a demo, and do not collect names, contact details, allergy details, or other sensitive information. Use fictitious scenarios and record only anonymized task outcomes and feedback in `docs/WEEK5_TEST_LOG.md`.

1. **External test 1 — discoverability and intake:** give the participant a fictional birthday scenario (12 guests, MXN $1,500) and ask them to start and finish the chat without coaching. Record whether they find `/chat`, complete all three questions, and how long it takes. Pass target: participant completes unaided within two minutes.
2. **External test 2 — recommendation comprehension and trust:** after a fictional wedding scenario, ask the participant to explain what the recommendation means, whether it is a confirmed quote, and what they would do next. Pass target: participant correctly identifies it as illustrative guidance, names at least one key assumption, and can find the baker checkpoint without prompting.
3. **External test 3 — safety, feedback, and recovery:** ask the participant to handle a fictional allergy question, prepare a baker brief, submit/change a thumbs vote, and describe how they would return to the saved chat. Pass target: participant does not interpret the guardrail as a safety assurance, finds the human checkpoint, completes the feedback action, and understands saved-chat recovery is limited to the same browser session.

For each participant, record task completion, observed hesitation, a short anonymized quote only with permission, and one proposed improvement. If a target is missed or a safety/privacy misunderstanding occurs, revise the plan or implementation and repeat the relevant test with a new participant before release. Do not report planned tests as completed or invent participant evidence.

### Regression and accessibility

- Run the repository's existing `npm test`, `npm run lint`, and `npm run build`.
- Check `/chat` and existing `/core`, `/research`, `/pricing`, and `/marketing` routes at desktop and mobile widths.
- Check keyboard-only operation, focus order, labels, error announcements, contrast, and responsive overflow.
- Record actual expected/actual results and any iteration in `docs/WEEK5_TEST_LOG.md` after implementation; do not fill in future results in advance.

## 11. Implementation Prompts

```text
ROLE: You are my disciplined AI-native product architect and coding partner.

APPROVAL GATE: This Week 5 Build Discipline Packet is planning only. Do not
implement, edit code or SQL, commit, push, or deploy until I explicitly approve
the packet.

TASK AFTER APPROVAL: Implement the public CakeMatch AI `/chat` guided cake
planning experience described in docs/WEEK5_BUILD_DISCIPLINE.md.

BEFORE CODING:
- Review AGENTS.md, this packet, the existing `/core` page, homepage,
  shared styles, Supabase client/types, test setup, SQL setup files, and Git
  status. Preserve unrelated work and all existing routes.
- Read relevant Next.js 16 documentation under node_modules/next/dist/docs/
  before using framework APIs.
- Confirm with me before changing any scope, privacy, storage, pricing, or
  deployment decision in this packet.

BUILD:
- Add a public, mobile-first `/chat` with exactly three guided intake questions:
  event type, positive whole-number guest count, and positive budget in MXN.
- Use deterministic, typed, testable local rules. Do not call an external AI
  API, invent a live bakery quote, or claim availability.
- Include visible demo/estimate qualifications, an out-of-scope guardrail,
  a human checkpoint for allergies/safety/exact-price/custom-order requests,
  and a copyable but unsent baker brief.
- Include thumbs up/down feedback and clear loading, empty, success, and error
  states.
- Save structured chat and feedback in the existing Supabase project using a
  silent anonymous Auth session and owner-only RLS. Store no arbitrary free
  text; do not expose service-role credentials. Include owner-only reload and
  delete behavior.
- Keep automated QA fixtures and results in repository tests and the Week 5
  test log, not in public visitor tables.
- Match existing CakeMatch AI styles, add a homepage link without removing
  current navigation, and do not change `/core` behavior or its schema.
- Use only the existing stack and free tools; add no dependency unless a
  demonstrated requirement cannot be met with current tooling and I approve it.

VALIDATE AND REPORT:
- Complete the three software tests and three external user tests in this
  packet, as well as existing tests, lint, production build, and desktop/mobile
  checks. Record actual expected/actual results and limitations.
- Report changed files, SQL setup steps, privacy/RLS behavior, tests, unresolved
  issues, and deployment status. Never invent participant feedback, commits,
  test results, or deployments.
- Do not push or deploy without separate approval.
```

### Five bounded coding prompts

Use these as five separate, ordered implementation prompts only after the user approves the packet. Keep the broad implementation prompt above as shared context; do not treat these planned prompts as work already performed.

**Prompt 1 — recommendation and validation**

```text
Implement only the pure, typed Week 5 chat input-validation and deterministic
recommendation module described in this packet, plus its Node built-in unit
tests. Do not change the UI, Supabase schema, dependencies, or environment.
Cover event type, guest-count and MXN budget validation, recommendation rules,
and every threshold boundary. Run the focused tests and report actual results.
```

**Prompt 2 — Supabase storage and access rules**

```text
Implement only the reviewed Week 5 Supabase SQL setup and matching database
types for chat sessions, guided messages, and thumbs feedback. Include bounded
constraints, owner-safe session relationships, cascading deletion, and RLS
policies based on auth.uid(). Do not run SQL against the project or expose
credentials. Verify policy logic and report the exact manual setup steps.
```

**Prompt 3 — public chat interface**

```text
Implement the responsive public /chat route and homepage entry point using the
approved mockup and existing styles. Build the three guided questions, inline
validation, deterministic recommendation card, estimate disclaimer, loading
and error states, restart flow, and accessible keyboard interaction. Do not
add Supabase persistence in this step or alter existing routes' behavior.
```

**Prompt 4 — privacy, guardrails, and feedback**

```text
Wire the approved anonymous Supabase session to owner-only chat save, reload,
delete, and thumbs up/down feedback. Add the unsupported-request guardrail,
allergy/safety/exact-price human checkpoint, and a copyable baker brief that
clearly is not sent. Do not store arbitrary free text, claim a save on error,
or expose service-role credentials. Test using two anonymous sessions.
```

**Prompt 5 — verification and release evidence**

```text
Do not add product scope. Run the three software tests, conduct the three
external user tests after consent, run existing tests, lint, build, responsive
browser checks, and route regressions from the approved packet. If the external
tests cannot be conducted, document the blocker and do not mark the acceptance
criterion complete. Fix only Week 5-caused failures, retest, and record actual
expected/actual outcomes in the Week 5 test log. Do not invent user results,
commits, or deployments; do not push or deploy without separate approval.
```
