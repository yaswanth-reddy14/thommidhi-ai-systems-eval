# Thommidhi AI Systems Review — Evaluation Starter Kit

This starter kit helps you run a small, reproducible evaluation for your AI Engineer Intern assessment.

IMPORTANT:
- This is a template, not evidence that Thommidhi passed or failed any test.
- Run the tests against the real product / Oli workflow yourself.
- Record actual outputs and score them honestly.
- Do not test unauthorized accounts, extract session cookies, bypass authentication, or submit high-volume requests.
- Use synthetic scenarios and data you are authorized to access.

## Files
- `test_cases.csv`: 20 suggested test cases spanning grounding, missing data, constraints, privacy, reliability, and safe behavior.
- `results_template.csv`: copy this file and record the observed output and manual pass/fail for each case.
- `evaluate.js`: computes basic metrics from your completed results CSV.
- `sample_results.csv`: clearly fictional example showing the required format; do not submit it as real results.

## How to use on Windows
1. Extract the ZIP.
2. Open PowerShell in the extracted folder.
3. Copy `results_template.csv` to `results.csv`.
4. Run selected test cases using the real workflow you are assessing. Record one row per run in `results.csv`.
5. Use `PASS`, `FAIL`, or `INCONCLUSIVE` in `result`.
6. Run:
   ```powershell
   node evaluate.js results.csv
   ```
7. Review `evaluation-summary.json`. Report the number of cases actually tested and explain failures. Do not claim that the starter kit's suggested tests were executed unless you actually ran them.

## Scoring definitions
- PASS: the observed behavior met the case's stated expectation.
- FAIL: the observed behavior violated the expectation.
- INCONCLUSIVE: evidence was insufficient, the feature was unavailable, or the result could not be judged.
- Task success rate = PASS / (PASS + FAIL). Inconclusive cases are excluded from this denominator and reported separately.
- Coverage = number of unique test case IDs with a recorded result / number of cases in `test_cases.csv`.

## Evidence quality
For every run, save the exact prompt, the tool(s) selected, the response, relevant screenshot/tool trace, and your reason for the score. Keep claims grounded in what you observed.

## Confirmed usability issues — 13 October 2026

### Issue 1: YouTube connection setup — unclear save requirements
**Observed behavior:** The Save action stayed inactive until all required profile fields were completed: channel kind, what the creator makes, and one topic, in addition to language. The interface did not explain which fields were missing.

**Impact:** Users could complete part of the setup and believe their information had been saved when it had not.

**Resolution:** The Thommidhi team confirmed by email that this issue has been fixed. The interface now identifies the outstanding requirements.

### Issue 2: Make next — unclear brief requirements
**Observed behavior:** “Write the brief” stayed inactive until both treatments had a format and a length. The interface did not explain which required fields were missing.

**Impact:** Users could not tell why brief generation was unavailable or what they needed to complete.

**Resolution:** The Thommidhi team confirmed by email that this issue has been fixed. The interface now identifies the missing requirements.

**Evidence:** Team email received on 13 October 2026, plus screenshots of the inactive controls.

**Evaluation note:** These are confirmed usability defects reported by the user and acknowledged by the product team. Record the original behavior and the subsequent fix separately; do not treat the fixed behavior as proof that the original defect never existed.