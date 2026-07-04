# Model-assisted evals

Model-assisted evals are optional manual/advisory checks. Deterministic evals are the default
local evidence path, and model-assisted commands are never default CI gates.

## When to use

Use model-assisted evals for semantic quality that deterministic checks cannot reasonably decide:

- clarity;
- coherence;
- tradeoff quality;
- source-grounded usefulness;
- relative comparison between candidate artifacts.

Do not use model-assisted evals for facts that can be checked mechanically.

## Requirements

A consumer repo must provide:

- Promptfoo as a dependency;
- local model/auth setup;
- adapter hooks for prompt variables;
- rubrics;
- result review process;
- calibration policy before using judge results as gates outside default CI.

## Standard consumer config

Use two configs for pointwise model judging:

- `evals/eval-kit.config.json` is the default deterministic config. It is the only config that
  belongs in `pnpm check` or CI. Keep `generate`, `judge_coverage`, and `judge_pairwise` disabled.
- `evals/eval-kit.model-judge.config.json` is the manual pointwise config. Enable
  `judge_coverage`, disable `generate`, `judge_pairwise`, and `report`, and include only the cases
  the consumer has chosen for manual judge calibration.

Use stable script names so agents can run the right config without guessing:

```json
{
  "eval:judge:doctor": "eval-kit doctor --config evals/eval-kit.model-judge.config.json",
  "eval:judge:list": "eval-kit list-cases --config evals/eval-kit.model-judge.config.json",
  "eval:judge:validate-fixtures": "eval-kit validate-fixtures --config evals/eval-kit.model-judge.config.json",
  "eval:judge:coverage": "eval-kit judge-coverage --config evals/eval-kit.model-judge.config.json"
}
```

Do not ask contributors to temporarily flip `judge_coverage` in the deterministic config. That
creates drift between local manual runs and CI-safe defaults.

Pairwise judging is a separate follow-up lane. Add `evals/eval-kit.pairwise.config.json` only after
the consumer has calibrated pointwise evidence and a specific comparison need.

## Commands

Pointwise judging uses the standard manual model-judge config:

```bash
pnpm exec eval-kit judge-coverage \
  --config evals/eval-kit.model-judge.config.json \
  --case <case-id> \
  --candidate <candidate.md> \
  --model <model> \
  --provider openai \
  --effort medium \
  --run-id <run-id>
```

Generation and pairwise are separate manual lanes. They require separate configs whose relevant
method is explicitly enabled; do not run them through `evals/eval-kit.config.json` or
`evals/eval-kit.model-judge.config.json`.

```bash
pnpm exec eval-kit generate \
  --config evals/eval-kit.generate.config.json \
  --case <case-id> \
  --model <model> \
  --provider openai \
  --effort medium \
  --run-id <run-id>

pnpm exec eval-kit judge-pairwise \
  --config evals/eval-kit.pairwise.config.json \
  --case <case-id> \
  --candidate-a <a.md> \
  --candidate-b <b.md> \
  --model <model> \
  --provider openai \
  --effort medium \
  --seed 123 \
  --run-id <run-id>
```

## Adapter variables

Bundled generic prompts expect:

Generation:

```js
{
  source_material: "...",
  candidate_instructions: "...",
  output_format: "Markdown"
}
```

Pointwise:

```js
{
  source_material: "...",
  case_rubric: "...",
  expected_items: "...json string...",
  candidate_path: "...",
  candidate: "..."
}
```

Pairwise:

```js
{
  source_material: "...",
  case_rubric: "...",
  expected_items: "...json string...",
  candidate_a: "...",
  candidate_b: "...",
  randomization_method: "...",
  randomization_seed: "...",
  original_order: "...",
  candidate_order: "..."
}
```

For pairwise judging, eval-kit randomizes display slots before calling `resolvePairwiseVars`.
`candidate_a` and `candidate_b` should contain the displayed Candidate A/B content supplied to the
adapter. `original_order` records the original CLI labels, and `candidate_order` records which
original candidate keys were displayed in Candidate A/B order. Do not randomize again inside the
adapter.

## Bias controls

Model judge prompts should:

- require evidence citations;
- allow `unknown`;
- reject unsupported invention;
- avoid rewarding length;
- avoid relying on hidden reference answers;
- preserve trusted metadata supplied by deterministic fixtures.

## Calibration

Before using model judges as gates, keep a human-reviewed golden set and track:

- false passes on invented facts;
- false failures on acceptable alternatives;
- position bias in pairwise comparison;
- verbosity bias;
- over-reliance on reference wording.
