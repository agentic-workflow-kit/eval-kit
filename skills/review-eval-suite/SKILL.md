---
name: review-eval-suite
description: Review an eval-kit consumer suite for harness validity, boundary mistakes, and evidence quality.
---

# Review Eval Suite

Use this skill when auditing or reviewing an eval-kit suite.

## Steps

1. Read the consumer repo instructions, eval-kit config, and relevant product or eval docs.
2. Run `pnpm exec eval-kit doctor` and treat failures as primary evidence.
3. Run `pnpm exec eval-kit list-cases` and inspect representative case manifests and artifacts.
4. Check whether generated or shared files contain consumer semantics that should stay local, or local files duplicate kit mechanics unnecessarily.
5. If model judging is present, confirm the default config stays deterministic and a separate manual
   model-judge config owns pointwise `judge_coverage`.
6. If reviewing a change, verify overwrite behavior and generated files with a dry run where relevant.

## Boundaries

- Mechanics belong in eval-kit; product vocabulary, rubric policy, cases, and expected outputs belong in the consumer.
- Do not require Promptfoo for deterministic suites.
- Treat model-assisted judging as advisory unless the consumer documents calibration and acceptance thresholds.
- Prefer `evals/eval-kit.model-judge.config.json` for manual pointwise judging; do not require users
  to flip enabled flags in the deterministic config.
- Review expected-good and expected-bad calibration separately. Expected-bad fixtures should produce
  adverse evidence on the targeted defect; pass-like `covered` verdicts for that defect are false
  passes.
- Treat `partial` as non-covered unless the consumer explicitly documents why a non-critical partial
  is acceptable. Repeated `unknown` verdicts are calibration or prompt-quality risks.
- Verify pointwise run metadata before trusting manual judge evidence: run id, one case id, model,
  provider, reasoning effort when present, prompt version, rubric version, runner version, and
  artifact/output paths must be present and coherent.
- Treat run-producing semantic portfolios as local on-demand evidence before significant changes, not default CI.
- Do not claim suite readiness without command evidence.

## Evidence

Report command results, reviewed case ids, concrete boundary issues, calibration false pass/false
fail risks, `partial`/`unknown` interpretation, and remaining risks.
