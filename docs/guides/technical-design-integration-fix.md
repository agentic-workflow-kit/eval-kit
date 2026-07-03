# Fixing the technical-design integration

This guide is for the follow-up PR in `agentic-workflow-kit/technical-design`.

## Current issue

`technical-design` consumes `@agentic-workflow-kit/eval-kit` through `github:agentic-workflow-kit/eval-kit#v0.1.0`. Deterministic evals pass, but model-assisted Promptfoo commands need variable alignment with the shared generic prompts.

## Fix steps

1. Read `technical-design/AGENTS.md` and `technical-design/evals/README.md`.
2. Inspect `evals/eval-kit.config.json`.
3. Inspect `evals/adapter.mjs`.
4. Update generation, pointwise, and pairwise variable resolvers to include the generic keys expected by eval-kit prompts.
5. Add unit tests for adapter variable contracts.
6. Run the fast/offline `pnpm check` gate and the local on-demand deterministic smoke.

## Required keys

Generation:

```text
source_material
candidate_instructions
output_format
```

Pointwise:

```text
source_material
case_rubric
expected_items
candidate_path
candidate
```

Pairwise:

```text
source_material
case_rubric
expected_items
candidate_a
candidate_b
randomization_method
randomization_seed
original_order
candidate_order
```

## Verification

Required:

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm eval:case -- --case case-tiny-laundry-pickup-v1 --candidate evals/cases/case-tiny-laundry-pickup-v1/reference-design.md --run-id verify-shared-eval-kit
```

Manual/advisory if auth is available:

```bash
pnpm eval:generate -- --case case-tiny-laundry-pickup-v1 --model <model> --provider openai --effort medium --run-id verify-generation-vars
pnpm eval:judge:coverage -- --case case-tiny-laundry-pickup-v1 --candidate evals/cases/case-tiny-laundry-pickup-v1/reference-design.md --model <model> --provider openai --effort medium --run-id verify-pointwise-vars
```
