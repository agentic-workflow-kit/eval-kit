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
5. If reviewing a change, verify overwrite behavior and generated files with a dry run where relevant.

## Boundaries

- Mechanics belong in eval-kit; product vocabulary, rubric policy, cases, and expected outputs belong in the consumer.
- Do not require Promptfoo for deterministic suites.
- Treat model-assisted judging as advisory unless the consumer documents calibration and acceptance thresholds.
- Treat run-producing semantic portfolios as local on-demand evidence before significant changes, not default CI.
- Do not claim suite readiness without command evidence.

## Evidence

Report command results, reviewed case ids, concrete boundary issues, and remaining risks.
