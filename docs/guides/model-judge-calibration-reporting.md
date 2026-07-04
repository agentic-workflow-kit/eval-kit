# Model-judge calibration and reporting

Manual model-judge evidence is useful only after a human reviewer checks it against committed
calibration fixtures. It remains advisory unless a consumer repo explicitly changes its own policy.

## Verdict interpretation

Use the same pointwise meaning across consumers:

- `covered`: the candidate clearly satisfies the item with direct candidate evidence.
- `partial`: the candidate addresses part of the item but does not fully satisfy it. Treat it as
  non-covered unless the consumer explicitly accepts that non-critical item.
- `missing`: the candidate does not provide enough support for the item.
- `contradicted`: the candidate conflicts with the item.
- `unknown`: the candidate is too ambiguous to judge from visible inputs.

`partial`, `missing`, `contradicted`, and `unknown` are adverse evidence for a target item unless the
consumer's documented policy says otherwise.

## Good and bad fixtures

Calibrate with committed expected-good and expected-bad fixtures:

- Expected-good fixtures should cover critical items. A critical `partial`, `missing`,
  `contradicted`, or repeated `unknown` is a calibration issue until a human explains it.
- Expected-bad fixtures should remain adverse on the intended defect. That means the targeted
  critical item should not receive pass-like `covered` evidence.
- A bad fixture is behaving correctly when the judge identifies the intended miss, contradiction, or
  ambiguity.

When a bad fixture receives `covered` for the targeted defect, classify it as a false pass. When a
good fixture receives an unjustified adverse verdict, classify it as a false fail.

## Reporting

Manual reports should be written for reviewer handoff, not CI:

- show deterministic evidence first;
- show model-judge evidence as a separate advisory section;
- include verdict counts for `covered`, `partial`, `missing`, `contradicted`, and `unknown`;
- identify expected-good and expected-bad fixture labels;
- record false pass, false fail, ambiguity, verbosity bias, reference-wording bias, and unknown-rate
  risks;
- state that model-judge evidence cannot upgrade deterministic red or yellow results.

Eval-kit exposes `countPointwiseVerdicts` and `formatPointwiseCalibrationSummary` as a shared
summary pattern. Consumers may use these helpers when writing curated notes or report hooks, but the
consumer still owns expected-good/expected-bad labels, critical-item policy, and false-pass or
false-fail interpretation.

For pointwise result bundles, eval-kit fails closed when required run metadata is absent or
mismatched. A valid pointwise run records run id, one case id, model, provider, reasoning effort when
present, prompt version, rubric version, runner version, and the artifact/output paths for the
pointwise result bundle.

Keep raw provider bundles under ignored `evals/results/` paths unless a human curates and commits a
summary.
