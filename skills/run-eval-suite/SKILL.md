---
name: run-eval-suite
description: Run an eval-kit consumer suite and report deterministic evidence without overstating model-assisted results.
---

# Run Eval Suite

Use this skill when executing a local eval-kit suite.

## Steps

1. Read the consumer repo instructions and eval-kit config.
2. Run `pnpm exec eval-kit doctor` before suite execution.
3. Run `pnpm exec eval-kit list-cases` and select the requested case ids or the repo-documented subset.
4. For deterministic runs, execute `pnpm exec eval-kit run-case --case <id> --candidate <path>` for each selected case.
5. Compile reports with `pnpm exec eval-kit report` when the consumer workflow asks for a combined summary.
6. Run pointwise model-assisted commands only when explicitly requested, configured, and routed
   through `evals/eval-kit.model-judge.config.json`.

## Boundaries

- Deterministic evidence can support pass/fail claims according to the consumer policy.
- Semantic case portfolios are local on-demand checks before significant changes, not default CI.
- Model-assisted generation, coverage judging, and pairwise judging are advisory unless calibrated.
- Do not require Codex auth or Promptfoo for deterministic-only runs.
- Do not put Promptfoo provider calls, Codex/OpenAI calls, LLM judging, pairwise judging, or long
  replay suites in `pnpm check`.
- Use the consumer's `eval:judge:doctor`, `eval:judge:list`, and `eval:judge:validate-fixtures`
  scripts before any manual `eval:judge:coverage` run.
- For pointwise model-judge summaries, treat `partial`, `missing`, `contradicted`, and `unknown` as
  non-covered unless the consumer policy explicitly accepts the item.
- Prefer the eval-kit pointwise summary helpers for curated report counts, and record
  expected-good/expected-bad labels plus false-pass/false-fail notes when summarizing manual judge
  evidence.
- Expected-bad fixtures should remain adverse on their intended defect. Do not describe an adverse
  bad-fixture result as a failed eval when it matches the calibration label.
- Preserve raw outputs according to the consumer repo's artifact policy.

## Evidence

Report the config path, cases run, result directories, verdicts, report paths, and any skipped or
advisory-only checks. For model-assisted runs, state that provider calls were explicitly requested.
Report deterministic evidence first, then model-judge counts for `covered`, `partial`, `missing`,
`contradicted`, and `unknown`. If a pointwise result manifest is missing run id, case id, model,
provider, prompt version, rubric version, runner version, or artifact paths, treat that run as
invalid evidence.
