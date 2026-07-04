# Consumer integration design

## Goal

Consumer repos should adopt eval-kit through a pinned Git tag and keep their eval semantics local.

## Dependency

```json
{
  "devDependencies": {
    "@agentic-workflow-kit/eval-kit": "github:agentic-workflow-kit/eval-kit#v0.1.7"
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

Consumers decide which eval checks belong in each lane. Keep `pnpm check` fast, offline, and
structural: format/lint, static schema/docs validation, adapter import/syntax validation, fixture
manifest validation, local grader/helper unit tests, and seeded fixture checks that do not call
external providers. Run deterministic semantic case portfolios locally before significant changes.
Keep Promptfoo/Codex generation, LLM judge coverage, pairwise judging, long session evals, and
expensive full-case replays manual/advisory rather than default CI gates.

Pointwise model-judge consumers should use a separate manual config instead of toggling model
methods in the deterministic default config. Keep `evals/eval-kit.config.json` deterministic and
CI-safe. Put `judge_coverage.enabled=true` in `evals/eval-kit.model-judge.config.json`, keep
`generate`, `judge_pairwise`, and `report` disabled there, and route `eval:judge:*` scripts through
that manual config. Add pairwise later only when the consumer has calibrated pointwise evidence and a
specific comparison need.

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
- [ ] Run `pnpm exec eval-kit doctor`.
- [ ] Run one deterministic case.
- [ ] Decide whether any fast, offline structural checks enter `pnpm check`.
- [ ] Document local eval commands in README or evals/README.md.
```

## What consumers must not do

- Do not import internals from eval-kit `src/*` unless exported by the package.
- Do not depend on another consumer repo’s eval fixtures.
- Do not put suite semantics into eval-kit.
- Do not enable Promptfoo commands without local dependency/auth setup.
- Do not trust model judges without calibration.
- Do not require auth, network, external providers, or manual calibration in `pnpm check`.
