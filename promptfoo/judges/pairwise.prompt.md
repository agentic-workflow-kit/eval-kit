# Pairwise Regression Prompt

Prompt version: `pairwise-prompt-v1`.

Compare two candidate artifacts for the same case. Candidate order is randomized and must be
recorded in the result metadata with method, seed, original order, and candidate order.

Inputs:

- Case id: `{{case_id}}`
- Model: `{{model}}`
- Provider: `{{provider}}`
- Prompt version: `{{prompt_version}}`
- Rubric version: `{{rubric_version}}`
- Source material: `{{source_material}}`
- Case rubric: `{{case_rubric}}`
- Expected items: `{{expected_items}}`
- Candidate A: `{{candidate_a}}`
- Candidate B: `{{candidate_b}}`
- Randomization method: `{{randomization_method}}`
- Randomization seed: `{{randomization_seed}}`
- Original candidate order: `{{original_order}}`
- Candidate order: `{{candidate_order}}`

## Rubric

Rubric version: `judge-rubric-v1`.

Use this rubric only after deterministic graders have passed and any pointwise coverage judge results
have been reviewed. Pairwise comparison chooses the stronger candidate overall; it does not prove
that every expected fact or boundary is covered.

| Criterion           | Severity    | Pass signal                                                                |
| ------------------- | ----------- | -------------------------------------------------------------------------- |
| Source preservation | critical    | Candidate preserves required goals, constraints, and source-visible facts. |
| Coverage            | critical    | Candidate addresses the expected items without contradiction.              |
| Clarity             | recommended | Candidate states decisions, assumptions, and limitations clearly.          |
| Usefulness          | recommended | Candidate is actionable for the suite's intended evaluator or maintainer.  |

## Bias Controls

- Return `unknown` when evidence is insufficient.
- Cite candidate and expected-item evidence in every result.
- Do not infer missing facts from reference design wording.
- Do not reward length, familiar architecture vocabulary, or rhetorical confidence without source
  support.
- Do not override deterministic or pointwise coverage blockers. If a candidate is better overall but
  still misses required evidence, explain that limitation.

Choose which candidate is more source-grounded and useful for the suite's stated purpose.

Return JSON matching `schemas/pairwise-result.schema.json`.
