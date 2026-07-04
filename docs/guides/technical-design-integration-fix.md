# Historical technical-design integration fix

This guide is retained as extraction-era history only. It described a `technical-design` follow-up for
early eval-kit tags and should not be used as current guidance.

For current consumer setup, use:

- [`consumer-integration.md`](consumer-integration.md)
- [`model-assisted-evals.md`](model-assisted-evals.md)
- [`model-judge-calibration-reporting.md`](model-judge-calibration-reporting.md)

Current consumers should keep the two-config pattern:

- `evals/eval-kit.config.json` remains deterministic and CI-safe.
- `evals/eval-kit.model-judge.config.json` owns manual pointwise judge coverage.
- `eval:judge:*` scripts target the model-judge config.
- Provider-backed commands remain manual and outside `pnpm check` and CI.

Do not revive generation or pairwise wiring from this historical note as required work. Generation
and pairwise lanes require separate explicit configs, consumer-owned semantics, and human calibration.
