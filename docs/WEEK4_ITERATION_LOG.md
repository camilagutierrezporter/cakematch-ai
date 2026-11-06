# CakeMatch AI — Week 4 Iteration Log

## Simulated A/B result labeling

- **Testing observation:** While entering the requested sample counts in both A/B comparisons, the result itself showed the calculated CTR and winner but did not carry an explicit simulated-data label. The section's general note could be missed when a result was read on its own.
- **Improvement:** Added a separate, unchecked simulated-data checkbox to each A/B comparison. If selected, the calculated result prominently says **SIMULATED DEMO DATA — NOT REAL VISITOR RESULTS**. Counts remain blank by default and the tool does not collect visitor data.
- **Retest:** Re-entered the requested counts into both comparisons and selected the simulated-data checkbox:
  - Test 1: A 18/100 (18.00%) vs B 12/100 (12.00%); Option A displayed as winner with the simulated-data label.
  - Test 2: A 15/100 (15.00%) vs B 22/100 (22.00%); Option B displayed as winner with the simulated-data label.
- **Result:** The improvement passed both browser retests.

See [WEEK4_TEST_LOG.md](./WEEK4_TEST_LOG.md) for the complete expected/actual test results and evidence boundaries.
