# Integrating eval-kit in another repo

## Scope first

Before adding eval-kit, write down what the repo wants to evaluate.

Examples:

- `define-product`: PRD shape, acceptance-criteria ID stability, no design/runtime invention.
- `technical-design`: source-grounded design quality, boundary ownership, enforceability.
- `design-to-plan`: projection-only planning, traceability, no phantom producer/consumer links.
- learning-loop later: defect classification and durable-check recommendations.

If you cannot state the eval goal, do not bootstrap a suite yet. Empty harnesses are how projects grow decorative machinery.

## Add the package

```json
{
  "devDependencies": {
    "@agentic-workflow-kit/eval-kit": "github:agentic-workflow-kit/eval-kit#v0.1.1"
  }
}
```

Run:

```bash
pnpm install
```

## Bootstrap generic files

```bash
eval-kit init --suite generic --dry-run
eval-kit init --suite generic
eval-kit doctor
```

## Replace semantics

The generated adapter is intentionally simple. Replace it with repo-owned logic.

A mature consumer should define:

```text
evals/adapter.mjs          # local grader/reporter/hooks
evals/cases/*              # local cases
evals/schemas/*            # local fixture schemas, if needed
evals/rubric.md            # local model judge rubric, if needed
evals/prompts/*            # local prompts, if overriding bundled generic prompts
```

## Decide gate level

Start manual:

```json
{
  "scripts": {
    "eval:doctor": "eval-kit doctor --config evals/eval-kit.config.json",
    "eval:case": "eval-kit run-case --config evals/eval-kit.config.json"
  }
}
```

Once stable, add deterministic evals to `pnpm check`.

Do not add model-assisted evals to `pnpm check` unless the repo has explicit policy for credentials, cost, determinism, and judge calibration.

## Review checklist

```text
- [ ] Does the eval goal belong to this repo?
- [ ] Are expected facts visible in source artifacts?
- [ ] Are hidden reference answers avoided?
- [ ] Are deterministic blockers not averaged away?
- [ ] Are model judges advisory unless calibrated?
- [ ] Does pnpm check remain reasonable for contributors?
```
