---
name: run-eval-suite
description: Run an eval-kit consumer suite and report deterministic evidence without overstating model-assisted results.
---

# Run Eval Suite

Use this skill when executing a local eval-kit suite.

## Steps

1. Read the consumer repo instructions and eval-kit config.
2. Run `eval-kit doctor` before suite execution.
3. Run `eval-kit list-cases` and select the requested case ids or the repo-documented subset.
4. For deterministic runs, execute `eval-kit run-case --case <id> --candidate <path>` for each selected case.
5. Compile reports with `eval-kit report` when the consumer workflow asks for a combined summary.
6. Run model-assisted commands only when explicitly requested and configured.

## Boundaries

- Deterministic evidence can support pass/fail claims according to the consumer policy.
- Model-assisted generation, coverage judging, and pairwise judging are advisory unless calibrated.
- Do not require Codex auth or Promptfoo for deterministic-only runs.
- Preserve raw outputs according to the consumer repo's artifact policy.

## Evidence

Report the config path, cases run, result directories, verdicts, report paths, and any skipped or advisory-only checks.
