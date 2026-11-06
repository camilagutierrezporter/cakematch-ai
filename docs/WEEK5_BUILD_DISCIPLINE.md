# CakeMatch AI — Week 5 Build Discipline Packet
## Public Cake Design Assistant

**Status:** Approved direction — implementation, commits, and deployment remain subject to the staged approvals below.

## 1. Problem

People may have a feeling, personal detail, or source of inspiration in mind but struggle to turn those ideas into a clear cake design. The existing `/core` page handles practical planning inputs; Week 5 should complement it with a distinct Cake Design Assistant rather than repeat those questions.

The assistant combines three creative choices into a personalized design description. It provides inspiration, not a finished rendering, bakery search, safety check, price quote, or order.

## 2. User

The primary user is anyone looking for a cake design idea who wants to express a mood, make a cake feel personal, and turn an inspiration source into one coherent design direction. They want a quick, approachable creative conversation without needing design vocabulary.

The secondary human participant is a baker or cake designer who can review the brief and confirm feasibility, ingredients, safety, materials, and final details.

## 3. Success Criteria

Week 5 is successful when:

- A visitor can open `/chat` and answer these three creative questions, in order:
  1. “What feeling do you want your cake to create?” — Romantic, Fun, Luxurious, Nostalgic, Surprising.
  2. “What would you like to make your cake unique?” — Personal details, Flowers, Textures, Special decorations, Creative shape.
  3. “Where would you like to find inspiration for your cake?” — Pinterest idea, Favorite color palette, Personal memory, Special theme.
- The assistant creates one deterministic, personalized cake design description combining all three selected answers.
- The experience never asks for event type, guest count, flavor, style, or budget; practical planning remains in `/core`.
- Unsupported requests receive a clear guardrail response; allergy, food-safety, feasibility, and other bakery-specific questions lead to a human checkpoint.
- A visitor can return to their own saved chat on the same anonymous browser session and give a thumbs-up or thumbs-down.
- Chat data and feedback are stored in Supabase with owner-only access. QA test cases and outcomes are kept in repository tests and the test log, not visitor records.
- The existing `/core`, `/research`, `/pricing`, and `/marketing` features continue to work.
- Three software tests and three moderated external user tests are completed and documented; findings are addressed and retested.
- The new route passes desktop, mobile, accessibility, and persistence checks.
- After approval, the work is delivered in five meaningful GitHub commits and two verified Vercel deployments, with separate approval before production deployment.

## 4. UX Concept and Mockup Plan

Use the existing CakeMatch AI visual identity: cream background, blush accents, burgundy actions, and current typography. Keep the design conversation focused and mobile-first:

1. A short introduction presents CakeMatch as a design inspiration assistant, not a bakery.
2. Assistant bubbles ask the three approved questions in order. Each answer uses accessible single-choice buttons for the exact options listed in the product spec.
3. The assistant confirms each selected answer, then creates a personalized design description that connects mood, unique detail, and inspiration source.
4. A guardrail area offers preset follow-up topics. It responds safely to unsupported, allergy/safety, feasibility, pricing, availability, and ordering questions without storing arbitrary free text.
5. A human checkpoint reminds users that a cake designer must confirm feasibility and safety; visitors can copy an unsent design brief.
6. Visitors can save the result and give thumbs-up/down feedback.

Use simple English to match the existing app. The three-option flow is the only design intake; do not reintroduce the `/core` event, guest, flavor, style, or budget fields.

### Mockup plan

The low-fidelity wireframe is `docs/WEEK5_CHAT_WIREFRAME.svg`. It shows the three exact design questions/options, selected-answer chat, personalized cake design, guardrail choices, human checkpoint, save and feedback controls, and private-chat notice. Review mobile and desktop presentation against this packet. The SVG is a UX plan, not a production UI or substitute for testing the built page.

## 5. Scope Cuts

This week will not include:

- Paid AI services or claims that a human or AI has reviewed the recommendation.
- Real bakery search, product catalogs, live availability, exact prices, ordering, delivery, payments, or booking.
- Generated images, image uploads, image understanding, 3D rendering, or claims that a text description is a finished visual design.
- Allergy, food-safety, feasibility, medical, or dietary assurance.
- User registration, email, phone number, or account management. The page uses a silent Supabase anonymous session for private ownership.
- External model APIs. The three creative steps, personalized description, and guardrails use local deterministic rules. Follow-up guardrail topics are preset choices; arbitrary free-text prompts are not collected or retained.
- Advanced analytics, staff dashboards, a feedback moderation queue, or automatic contact with a baker.
- Changes to the existing `/core` recommendation logic or its saved data.
- New paid services or dependencies.

## 6. Product Specification and Acceptance Criteria

### Public route and chat behavior

- Add a public `/chat` route and link to it from the homepage without removing or renaming existing routes.
- Present the three exact design questions and option sets in order. Keep the conversation visible and do not generate a design description until all three choices are selected.
- Let the user change a selection before completing the flow and restart the conversation.
- Do not ask for or display event type, guest count, flavor, style, or budget.
- Clearly show loading, save success, save failure, empty, and retry states. Do not claim a chat or vote was saved if Supabase returned an error.

### Personalized cake design response

- Use local, typed, deterministic rules; no AI request or paid API is used.
- Combine the selected feeling, unique detail, and inspiration source into a clear, warm design description. Every selection must visibly influence the result.
- Avoid unsupported claims about actual materials, food safety, construction feasibility, pricing, or availability. Present the result as a creative concept, not a quote or confirmed design.
- Include a short explanation that explicitly reflects all three choices.
- Test each option, representative combinations, stable output, and invalid values.

### Guardrail and human checkpoint

- Offer preset follow-up topics such as allergies/food safety, design feasibility, exact price, availability, ordering, and “Something else.”
- For unsupported topics, explain the boundary and return the user to the design conversation without pretending to provide expert advice.
- For allergies, safety, feasibility, exact price, availability, or ordering, do not guess or promise a result. State that a human cake designer/baker must confirm it.
- Provide a “Copy design brief” action that creates a copyable summary from the three selections and design description. It does not send the brief or contact anyone.
- Do not collect arbitrary user free text. Store only the fixed prompts/options, selected answers, generated description, preset guardrail category/response, and feedback.

### Chat and test storage

Use the existing Supabase project and public publishable client. Before implementation, confirm that anonymous sign-in is enabled and prepare a separate Week 5 SQL setup file. The visitor does not see a sign-in flow, but Supabase creates an anonymous identity; saved chat recovery is limited to that same browser profile while its Supabase session remains available. Clearing browser data or losing that session may make saved chats unrecoverable, and the UI must not promise cross-device recovery.

Proposed data:

- `chat_sessions`: owner ID, created/updated timestamps, three selected design options, generated description, guardrail categories, and a bounded structured transcript of fixed prompts, chosen options, and generated messages.
- `chat_feedback`: owner ID, session ID, design response version, thumbs-up/down value, and timestamp. Enforce at most one current vote per owner and session.
- Test cases and expected outcomes remain in the repository's automated test suite; actual test results are recorded in the Week 5 test log. Do not mix QA fixtures with visitor chat records or add a public test-data dashboard.

The Supabase anonymous user ID is the owner boundary; there is no visible login. Enable Row Level Security on every visitor-data table and permit reads, writes, updates, and deletes only when `auth.uid()` matches the row owner. Use database constraints for the exact approved option values, bounded generated text/transcript, valid guardrail categories, and valid feedback values. Never expose a service-role key.

Show a concise privacy note: do not enter names, contact details, or sensitive information. Explain that clearing browser data or losing the anonymous Supabase session can make saved chats unrecoverable. Keep only the structured chat needed for this experience. For the MVP, retain data until the visitor deletes the chat; do not imply an automatic deletion schedule. Provide a delete-chat action that removes the visitor's session, messages, and feedback. If an automatic retention period is later added, disclose it and verify it is actually configured before claiming it.

### Acceptance criteria

1. `/chat` loads directly for a visitor without a visible account-creation or email step.
2. The chat asks exactly the three approved design questions in order and displays exactly their option sets.
3. The chat does not ask for event type, guest count, flavor, style, or budget.
4. The user can select one option per question, correct a selection, and complete the flow with keyboard or pointer.
5. A valid flow produces a deterministic cake design description reflecting all three selected answers. The result is a creative concept, not a rendered image, quote, or confirmed order.
6. The recommendation software test covers each option and representative combinations, confirming all three answer dimensions influence output.
7. Unsupported topics receive a clear guardrail response. Allergy, food-safety, feasibility, exact-price, availability, and ordering topics reach a human checkpoint without unsupported assurances.
8. The design brief contains the three selected answers and generated design description, can be copied, and clearly remains unsent.
9. A completed chat is saved to Supabase and is available to the same anonymous browser session after refresh. Save and reload failures are shown explicitly, and the UI explains that recovery is not guaranteed after browser data is cleared.
10. A visitor can cast either thumbs vote, see which vote is selected, change it, and reload the saved state. Another anonymous user cannot read, edit, or delete that visitor's session or feedback.
11. A visitor can delete their own chat and its feedback; the page confirms completion or reports failure.
12. Database validation and Row Level Security are tested for owner isolation, invalid values, message/session ownership, and feedback ownership.
13. The interface has accessible labels, keyboard-operable controls, visible focus, announced errors/status, and a useful responsive layout at mobile and desktop sizes.
14. Existing project tests, lint, production build, and the existing `/core`, `/research`, `/pricing`, and `/marketing` routes continue to pass.
15. No paid tool, external AI API, new visible account system, secret in client code, or unsupported claim is introduced.
16. The desktop/mobile UX wireframe is updated and reviewed against the design-assistant requirements.
17. Three software tests and three separate moderated external user tests are completed, with anonymized expected/actual results and improvements recorded in the Week 5 test log. Do not mark a test complete without evidence.
18. After implementation and release approvals, create five meaningful GitHub commits and complete two Vercel deployments (Preview and Production). If approvals or free-tier capability prevent either deployment, report it as incomplete rather than claim success.

## 7. Architecture

```text
Public visitor
    -> Next.js App Router /chat page
    -> guided React chat state + typed deterministic design-description/guardrail rules
    -> existing Supabase browser client + anonymous Auth session
    -> chat_sessions (bounded structured transcript) / chat_feedback
    -> RLS: rows readable/writable only by auth.uid() owner

Repository test suite
    -> pure design-response and option-validation tests
    -> recorded results in docs/WEEK5_TEST_LOG.md
```

Keep design-response and guardrail logic in a small pure module so it can be tested without React, Supabase, network access, or paid services. Keep chat UI state and persistence concerns separate. Extend the existing Supabase database types carefully and use a Week 5-specific schema rather than modifying `core_outputs`. Prepare the SQL in `docs/WEEK5_SUPABASE_SETUP.sql`; review it before running it in the existing Supabase project.

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

1. Confirm this packet, `docs/WEEK5_CHAT_WIREFRAME.svg`, current Git status, and existing project behavior. Read relevant Next.js 16 documentation under `node_modules/next/dist/docs/` before using framework APIs.
2. Before using storage, confirm anonymous sign-in is enabled and review `docs/WEEK5_SUPABASE_SETUP.sql`; do not run it against Supabase without the project owner's approval.
3. Implement the three-option flow and deterministic design description, then complete the dedicated Supabase schema/RLS and `/chat` persistence in small reviewable changes. Do not expose secrets.
4. Complete the three external user tests and three software tests described below. Fix and retest any failures; record actual outcomes in `docs/WEEK5_TEST_LOG.md`. Do not deploy to production if a test reveals unresolved safety, privacy, or comprehension issues.
5. Run full existing tests, lint, production build, and desktop/mobile browser checks. Verify existing routes and Supabase persistence/owner isolation with separate anonymous sessions.
6. Review the diff and confirm `.env.local`, service-role keys, and unrelated user changes remain untouched.
7. Create the five planned meaningful commits only after implementation is approved and each change is reviewed and validated. Push through the existing GitHub workflow only with approval.
8. **Deployment 1 — Vercel Preview:** after the preview commit is pushed and all local checks pass, deploy a preview only with deployment approval. Verify the `/chat` design flow, responsive layout, storage, and RLS on the preview environment.
9. Fix any preview findings, rerun affected tests, and record the changes.
10. **Deployment 2 — Vercel Production:** deploy the verified release only after the user separately approves production deployment. Verify the live route and core behavior, then record the actual URL and result. If approval or free-tier capacity is unavailable, stop and document that deployment as not completed; never claim it occurred.

### Planned five meaningful commits

These are proposed commit scopes, not commits already made. Keep commits focused and ensure each is tested before it is created.

1. `test: add design assistant response tests` — pure design-description rules, option validation, and combination coverage.
2. `feat: add private design chat storage` — Week 5 SQL setup, constraints, owner-only RLS, and matching Supabase types.
3. `feat: add guided cake design chat` — exact three-question flow, personalized description, responsive UI, and homepage entry point.
4. `feat: add design guardrails and feedback` — guardrail/human checkpoint, copyable design brief, thumbs feedback, and owner-only save/reload/delete.
5. `test: verify design chat and document results` — integration/regression fixes, accessibility/responsive verification, and completed test evidence.

Do not split or label work as a commit unless an actual Git commit with that scope is made. Do not commit until the plan and implementation have been approved.

## 10. Test Plan

### Three software tests

1. **Design response logic test (automated):** run table-driven tests for every feeling, unique-detail, and inspiration option plus representative combinations. Expected: output is deterministic, includes the effect of every selected answer, and never introduces event/guest/flavor/style/budget details, pricing, safety, or availability claims.
2. **Chat workflow and accessibility test (browser):** complete the three-question flow at desktop and mobile widths; exercise answer selection/correction, restart, guardrail, allergy/feasibility checkpoint, copy brief, feedback selection/change, loading/error states, keyboard-only use, and status announcements. Expected: all controls work, all five/five/four choice sets match exactly, and content remains usable without overflow.
3. **Supabase integration and isolation test (existing client, two anonymous sessions):** save/reload/delete a chat and feedback as owner A, then attempt read/update/delete as owner B and test invalid values and mismatched session relationships. Expected: owner A succeeds; owner B cannot access owner A's rows; invalid and cross-owner writes are rejected; simulated failures never show false success. Clean up test records and record the actual Supabase environment used.

### Three external user tests

Conduct three separate, moderated 10–15 minute sessions with three different people who plan celebrations and are not the builder. Ask permission before testing, explain that the prototype is a demo, and do not collect names, contact details, allergy details, or other sensitive information. Use fictitious scenarios and record only anonymized task outcomes and feedback in `docs/WEEK5_TEST_LOG.md`.

1. **External test 1 — discoverability and choice flow:** ask the participant to start a design chat and choose one option for each question without coaching. Record whether they understand the options and complete the flow. Pass target: participant finishes unaided within two minutes and does not expect event/guest/budget intake.
2. **External test 2 — personalization and comprehension:** give a fictional combination (Romantic + Flowers + Personal memory). Ask the participant to describe how the result reflects their choices and whether it is a finished design or idea. Pass target: they identify all three influences and understand a baker must confirm the final design.
3. **External test 3 — guardrail, human checkpoint, storage, and feedback:** ask the participant to choose an allergy/safety follow-up, prepare a brief, save the result, vote and change their vote, then describe same-browser recovery. Pass target: they do not interpret the response as safety assurance, find the human checkpoint, complete save/feedback, and understand recovery limits.

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

TASK AFTER APPROVAL: Implement the public CakeMatch AI Cake Design Assistant
described in docs/WEEK5_BUILD_DISCIPLINE.md.

BEFORE CODING:
- Review AGENTS.md, this packet, the existing `/core` page, homepage,
  shared styles, Supabase client/types, test setup, SQL setup files, and Git
  status. Preserve unrelated work and all existing routes.
- Read relevant Next.js 16 documentation under node_modules/next/dist/docs/
  before using framework APIs.
- Confirm with me before changing any scope, privacy, storage, pricing, or
  deployment decision in this packet.

BUILD:
- Add a public, mobile-first `/chat` with exactly these three design questions:
  feeling (Romantic, Fun, Luxurious, Nostalgic, Surprising); uniqueness
  (Personal details, Flowers, Textures, Special decorations, Creative shape);
  inspiration (Pinterest idea, Favorite color palette, Personal memory, Special
  theme).
- Do not repeat `/core` questions about event type, guests, flavor, style, or
  budget.
- Use deterministic, typed, testable local rules to combine all three choices
  into one personalized cake design description. Do not call an external AI
  API, claim to render an image, or promise design feasibility.
- Include a clear guardrail, a human checkpoint for safety/feasibility/price/
  availability/order questions, and a copyable but unsent design brief.
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

**Prompt 1 — design response and option validation**

```text
Implement only the pure, typed Week 5 cake design-description and guardrail
logic plus its Node built-in unit tests. Do not ask for or implement event
type, guest count, flavor, style, or budget. Cover every approved option and
representative combinations; verify that all three choices influence the
description and that it never makes safety, price, availability, or feasibility
claims. Run focused tests and report actual results.
```

**Prompt 2 — Supabase storage and access rules**

```text
Implement only the reviewed Week 5 Supabase SQL setup and matching database
types for design-chat sessions and thumbs feedback. Store only approved option
values, deterministic generated text, preset guardrail categories, and bounded
transcript messages. Include constraints, cascading deletion, and owner-only
RLS based on auth.uid(). Do not run SQL against the project or expose
credentials. Verify policy logic and report the exact manual setup steps.
```

**Prompt 3 — public chat interface**

```text
Implement the responsive public /chat route and homepage entry point using the
approved wireframe and existing styles. Build the three exact design questions
and choice sets, answer correction, personalized design-description card,
clear concept disclaimer, loading/error states, restart flow, and accessible
keyboard interaction. Do not add Supabase persistence in this step or alter
existing routes' behavior.
```

**Prompt 4 — privacy, guardrails, and feedback**

```text
Wire the approved anonymous Supabase session to owner-only design-chat save,
reload, delete, and thumbs up/down feedback. Add preset guardrail responses,
allergy/safety/feasibility/price human checkpoint, and a copyable design brief
that clearly is not sent. Do not store arbitrary free text, claim a save on
error, or expose service-role credentials. Test using two anonymous sessions.
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
