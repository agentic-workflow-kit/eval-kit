---
name: bootstrap-eval-suite
description: Bootstrap or refresh a consumer repo's generic eval-kit harness while keeping consumer semantics out of the shared package.
---

# Bootstrap Eval Suite

Use this skill when adding `@agentic-workflow-kit/eval-kit` harness files to a consumer repo.

## Steps

1. Read the consumer repo instructions and identify the repo root before writing.
2. Confirm the consumer actually wants eval-kit; do not add it because a template exists.
3. Run `pnpm exec eval-kit init --suite generic --dry-run` and inspect the planned files.
4. Run `pnpm exec eval-kit init --suite generic` only when the dry-run matches the intended scope.
5. Run `pnpm exec eval-kit doctor` and record the command result.

## Manual Model-Judge Config

When adding pointwise model judging to a consumer that already has deterministic evals, use the
standard two-config pattern:

- Keep `evals/eval-kit.config.json` deterministic and CI-safe, with model-assisted methods disabled.
- Add `evals/eval-kit.model-judge.config.json` for manual pointwise judging, with
  `judge_coverage.enabled=true` and `generate`, `judge_pairwise`, and `report` disabled.
- Add scripts named `eval:judge:doctor`, `eval:judge:list`, `eval:judge:validate-fixtures`, and
  `eval:judge:coverage` that point at the manual config.
- Keep pairwise out of this standard setup. Add a separate pairwise config only after calibration.
- Document the local calibration policy before treating pointwise results as more than raw advisory
  evidence. The policy should define expected-good and expected-bad fixture labels, `partial` and
  `unknown` handling, and where curated summaries live.
- For curated summaries, use the shared count shape for `covered`, `partial`, `missing`,
  `contradicted`, and `unknown`, then add consumer-owned false-pass and false-fail notes.

## Boundaries

- The kit owns loading, validation, discovery, result plumbing, and generic bootstrap mechanics.
- The consumer owns cases, prompts, rubrics, graders, pass/fail policy, and product vocabulary.
- Do not add technical-design, define-product, design-to-plan, jig, or learning-loop semantics by default.
- Do not install Promptfoo or require Codex auth for deterministic bootstrap.
- Do not add run-producing, model-assisted, networked, or manually calibrated evals to default CI.
- Do not tell users to edit the deterministic config to enable manual judge runs.
- Do not commit raw provider result bundles unless a human has curated them according to repo policy.
- Use `--force` only after inspecting existing files and deciding the overwrite is intended.

## Evidence

Report the repo path, generated files, `pnpm exec eval-kit doctor` result, and any consumer
decisions still needed.
