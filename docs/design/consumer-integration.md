# Consumer integration design

## Goal

Consumer repos should adopt eval-kit through a pinned Git tag and keep their eval semantics local.

## Dependency

```json
{
  "devDependencies": {
    "@agentic-workflow-kit/eval-kit": "github:agentic-workflow-kit/eval-kit#v0.1.1"
  }
}
```

## Suggested scripts

```json
{
  "scripts": {
    "eval:doctor": "eval-kit doctor --config evals/eval-kit.config.json",
    "eval:list": "eval-kit list-cases --config evals/eval-kit.config.json",
    "eval:case": "eval-kit run-case --config evals/eval-kit.config.json",
    "eval:fixtures": "eval-kit validate-fixtures --config evals/eval-kit.config.json"
  }
}
```

Consumers decide whether evals are part of `pnpm check`. Start with manual scripts until the suite is stable, then add deterministic checks to `pnpm check`.

## Consumer-owned files

```text
evals/
  eval-kit.config.json
  adapter.mjs
  cases/
  schemas/
  prompts/
  rubric.md
  results/
```

## Integration checklist

```text
- [ ] Add Git-tag dependency.
- [ ] Run pnpm install to update lockfile.
- [ ] Bootstrap or create evals/ files.
- [ ] Replace generic adapter semantics with repo-local semantics.
- [ ] Add at least one deterministic case.
- [ ] Run eval-kit doctor.
- [ ] Run one deterministic case.
- [ ] Decide whether deterministic evals enter pnpm check.
- [ ] Document local eval commands in README or evals/README.md.
```

## What consumers must not do

- Do not import internals from eval-kit `src/*` unless exported by the package.
- Do not depend on another consumer repo’s eval fixtures.
- Do not put suite semantics into eval-kit.
- Do not enable Promptfoo commands without local dependency/auth setup.
- Do not trust model judges without calibration.
