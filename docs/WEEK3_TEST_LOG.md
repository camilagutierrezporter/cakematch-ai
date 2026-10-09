# Week 3 Test Log and Iteration

## Automated pricing logic tests

1. **Monthly revenue calculation:** 20 Planificador Plus subscriptions at MXN $99 and 5 Pastelería Pro subscriptions at MXN $399 return MXN $3,975. **PASS**
2. **Annual revenue calculation:** the same paid mix returns MXN $47,700 per year; increasing the count of the Free tier does not change subscription revenue. **PASS**

## Automated software tests

3. **Input validation:** negative values, blank numeric input, and fractional customer counts are rejected. **PASS**
4. **Scenario presets:** Conservative and Optimistic presets have different starting mixes and the Optimistic example calculates a larger revenue amount. **PASS**
5. **Saved scenario payload:** the record preserves its trimmed name, scenario type, all three customer counts, paid prices, and calculated monthly and annual totals. **PASS**

## Code checks

- `npm test`: **PASS**, 5 tests.
- `npm run lint`: **PASS**.
- `npx tsc --noEmit`: **PASS**.
- `npm run build`: **BLOCKED in this workspace**. The uploaded project contains the macOS Apple Silicon Next.js SWC package, while this runtime is Linux. Next could not load the Linux SWC binary because the ZIP contains only the macOS Apple Silicon package. The local runtime also blocked Next from querying the npm registry. The lock file lists Linux packages for Vercel, so this does not establish a source-code build failure; a Linux/Vercel build still needs to be run.

## Feature and deployment checks still to record

- Browser test of the public Supabase save, reload, and delete flow: pending until the `pricing_scenarios` SQL is run in the project's Supabase SQL Editor.
- Desktop and mobile visual check: pending a local or deployed browser preview.
- Live `/product` and `/pricing` checks: pending deployment.
- Five Week 3 commits are present in the local working copy. The GitHub push and two deployment checks are still pending; the commits have not been pushed and no live deployment is claimed in this log.

## Iteration made from testing

- The first lint run caught a React hooks warning in the saved-scenario loading effect. I changed the loader to return data and update component state from its asynchronous response. Lint then passed.
- The first test setup used a newer Node TypeScript-strip feature. I moved the shared calculator to a plain JavaScript ES module with TypeScript declarations so the tests can run with the built-in Node test runner without adding a dependency.
- I changed the test command to use TAP output so the five individual checks are visible in the test evidence.
- Saved scenarios now have a visible note that demo records are public and should not contain private information.
