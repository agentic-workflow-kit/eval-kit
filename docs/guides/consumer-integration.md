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
    "@agentic-workflow-kit/eval-kit": "github:agentic-workflow-kit/eval-kit#v0.1.3"
  }
}
```

Run:

```bash
pnpm install
```

## Bootstrap generic files

```bash
pnpm exec eval-kit init --suite generic --dry-run
pnpm exec eval-kit init --suite generic
pnpm exec eval-kit doctor
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

Start with package scripts for local use:

```json
{
  "scripts": {
    "eval:doctor": "eval-kit doctor --config evals/eval-kit.config.json",
    "eval:case": "eval-kit run-case --config evals/eval-kit.config.json"
  }
}
```

Use three lanes:

- **CI / `pnpm check`:** fast, offline, structural checks only. This can include format/lint,
  static docs/schema validation, adapter import or syntax validation, fixture manifest validation,
  local unit tests for graders/helpers, and seeded fixture checks that do not require auth, network,
  model calls, or manual calibration.
- **Local on-demand:** deterministic `run-case` suites and semantic case portfolios. Run these
  before significant changes, using the consumer repo's scripts or `pnpm exec eval-kit`.
- **Manual/advisory:** Promptfoo/Codex generation, LLM judge coverage, pairwise judging, long
  product-to-design/product-to-plan session evals, and expensive full-case replay suites.

Do not add run-producing semantic portfolios or model-assisted evals to the default CI gate. If a
consumer wants a deterministic subset in `pnpm check`, keep it short, offline, and structural.

## Add manual pointwise judging

When a consumer is ready for pointwise model judging, add a separate
`evals/eval-kit.model-judge.config.json` instead of toggling model methods in the default
deterministic config.

Standard scripts:

```json
{
  "eval:judge:doctor": "eval-kit doctor --config evals/eval-kit.model-judge.config.json",
  "eval:judge:list": "eval-kit list-cases --config evals/eval-kit.model-judge.config.json",
  "eval:judge:validate-fixtures": "eval-kit validate-fixtures --config evals/eval-kit.model-judge.config.json",
  "eval:judge:coverage": "eval-kit judge-coverage --config evals/eval-kit.model-judge.config.json"
}
```

Keep `generate`, `judge_pairwise`, and `report` disabled in this manual config. Add pairwise later
with a separate config only after the consumer has calibrated pointwise evidence.

## Review checklist

```text
- [ ] Does the eval goal belong to this repo?
- [ ] Are expected facts visible in source artifacts?
- [ ] Are hidden reference answers avoided?
- [ ] Are deterministic blockers not averaged away?
- [ ] Are model judges advisory unless calibrated?
- [ ] Does `pnpm check` remain fast, offline, and reasonable for contributors?
```
