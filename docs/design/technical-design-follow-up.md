# Technical-design follow-up

## Problem

After extracting eval-kit, `technical-design` consumes the shared package successfully for deterministic evals. The deterministic smoke path passed, but the model-assisted Promptfoo path needs compatibility hardening.

The shared generic prompts use generic variables:

- generation: `source_material`, `candidate_instructions`, `output_format`;
- pointwise: `source_material`, `case_rubric`, `expected_items`, `candidate_path`, `candidate`;
- pairwise: `source_material`, `case_rubric`, `expected_items`, `candidate_a`, `candidate_b`, randomization fields.

Technical-design adapters may still return older variables such as `product_md`, `source_map_md`, `source_facts`, and DDD-specific template keys. That can leave bundled prompts with missing variables.

## Required fix

In `technical-design/evals/adapter.mjs`:

1. Update `resolveGenerationVars` to return:

```js
{
  source_material: [
    "# Product Brief",
    productText,
    "# Source Map",
    sourceMapText,
  ].join("\n\n"),
  candidate_instructions: [
    authorSkill,
    technicalDesignTemplate,
    boundedContextTemplate,
    enforcementMapTemplate,
    dddEvalExpectations,
  ].join("\n\n"),
  output_format: "Markdown technical design",
}
```

2. Update `resolvePointwiseVars` to return `source_material`. Keep `source_facts` temporarily only if local code still needs it.

3. Update `resolvePairwiseVars` to return `source_material` and `expected_items` in the shape expected by the shared prompt.

4. Add tests that call these adapter exports and assert required keys exist.

5. Run:

```bash
pnpm check
pnpm eval:case -- --case case-tiny-laundry-pickup-v1 --candidate evals/cases/case-tiny-laundry-pickup-v1/reference-design.md --run-id verify-shared-eval-kit
```

Optional if local auth exists:

```bash
pnpm eval:generate -- --case case-tiny-laundry-pickup-v1 --model <model> --provider openai --effort medium --run-id verify-generation-vars
pnpm eval:judge:coverage -- --case case-tiny-laundry-pickup-v1 --candidate evals/cases/case-tiny-laundry-pickup-v1/reference-design.md --model <model> --provider openai --effort medium --run-id verify-pointwise-vars
```

## Alternative

If technical-design should keep fully specialized prompts, add local prompt templates under `technical-design/evals/prompts/` and configure `prompt_templates` in `evals/eval-kit.config.json`.

Preferred path: align the adapter to generic variable names and keep specialized details inside `candidate_instructions` and source material.
