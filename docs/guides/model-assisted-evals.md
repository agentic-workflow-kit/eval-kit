# Model-assisted evals

Model-assisted evals are optional. Deterministic evals are the default.

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
- calibration policy before using judge results as gates.

## Commands

```bash
eval-kit generate \
  --case <case-id> \
  --model <model> \
  --provider openai \
  --effort medium \
  --run-id <run-id>


eval-kit judge-coverage \
  --case <case-id> \
  --candidate <candidate.md> \
  --model <model> \
  --provider openai \
  --effort medium \
  --run-id <run-id>


eval-kit judge-pairwise \
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
