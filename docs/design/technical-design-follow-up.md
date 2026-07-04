# Historical technical-design follow-up

This note records a pre-v0.1.5 follow-up from the original eval-kit extraction. It is not current
integration guidance and should not be used to plan new consumer work.

Current model-judge guidance lives in:

- [`../guides/model-assisted-evals.md`](../guides/model-assisted-evals.md)
- [`../guides/model-judge-calibration-reporting.md`](../guides/model-judge-calibration-reporting.md)
- [`../guides/consumer-integration.md`](../guides/consumer-integration.md)

## Current policy

- Keep `evals/eval-kit.config.json` deterministic and CI-safe.
- Put manual pointwise judge coverage in `evals/eval-kit.model-judge.config.json`.
- Use consumer-owned prompts, expected items, and adapter semantics for the meaning being judged.
- Keep provider-backed commands manual and outside `pnpm check` and CI.
- Treat pairwise and generation lanes as separate, opt-in future work with explicit configs and human
  calibration.

The old extraction-era advice to wire generation and pairwise variables for `technical-design` is no
longer required by the standard pointwise model-judge lane.
