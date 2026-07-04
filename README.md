# eval-kit

Shared evaluation infrastructure for `agentic-workflow-kit` repositories.

`@agentic-workflow-kit/eval-kit` provides portable mechanics for local eval suites: config loading, safe path handling, case discovery, deterministic runner commands, result bundles, optional Promptfoo helpers, and bootstrap commands. Consumer repositories own their own eval meaning: cases, fixtures, rubrics, graders, prompts, and local pass/fail policy.

## Status

`eval-kit` is currently a **private Git-tagged package**, not an npm-published package.

```json
{
  "devDependencies": {
    "@agentic-workflow-kit/eval-kit": "github:agentic-workflow-kit/eval-kit#v0.1.6"
  }
}
```

The package is usable for deterministic local eval suites. Model-assisted commands are supported,
but consumers must configure Promptfoo and calibrate judge behavior before treating model output as
more than advisory evidence.

## Evaluation policy

Keep evals in three lanes:

- **CI / `pnpm check`:** fast, offline, structural checks only. Suitable checks include
  format/lint, static docs or schema validation, adapter import/syntax validation, fixture manifest
  validation, local unit tests for graders/helpers, and seeded fixture checks that never call
  external providers.
- **Local on-demand:** deterministic suite runs, including semantic case portfolios, run before
  significant changes in the consumer repo. These commands may create result bundles and should use
  the consumer's documented local scripts.
- **Manual/advisory:** Promptfoo/Codex model-assisted generation, pointwise judging, pairwise
  judging, LLM judge coverage, long product-to-design or product-to-plan session evals, and
  expensive replay suites. These require explicit local setup, auth where relevant, and human
  calibration. They are not default CI gates.

## What it is

`eval-kit` is a small runner and bootstrap package for repository-local evaluation suites.

It owns reusable mechanics:

- `eval-kit` CLI entrypoint;
- config loading and validation;
- safe path and ID handling;
- case manifest discovery;
- adapter loading;
- deterministic case execution;
- result bundle and artifact manifests;
- generic grading/verdict helpers;
- optional Promptfoo execution helpers;
- generic deterministic bootstrap commands;
- agent-facing skills for setup, authoring, review, and running.

It does **not** own consumer semantics:

- product/PRD quality rules;
- technical-design/DDD rubrics;
- planning traceability rules;
- learning-loop defect classification;
- Jig runtime behavior;
- consumer-specific prompts or hidden answer keys.

## Quick start

Install from a Git tag in a consumer repo:

```json
{
  "devDependencies": {
    "@agentic-workflow-kit/eval-kit": "github:agentic-workflow-kit/eval-kit#v0.1.6"
  },
  "scripts": {
    "eval:doctor": "eval-kit doctor --config evals/eval-kit.config.json",
    "eval:case": "eval-kit run-case --config evals/eval-kit.config.json",
    "eval:list": "eval-kit list-cases --config evals/eval-kit.config.json"
  }
}
```

Bootstrap a generic deterministic suite:

```bash
pnpm exec eval-kit init --suite generic --dry-run
pnpm exec eval-kit init --suite generic
pnpm exec eval-kit doctor
```

Create a case:

```bash
pnpm exec eval-kit scaffold-case --case case-example-v1
pnpm exec eval-kit list-cases
pnpm exec eval-kit doctor
```

Run a deterministic case:

```bash
pnpm exec eval-kit run-case \
  --config evals/eval-kit.config.json \
  --case case-example-v1 \
  --candidate path/to/candidate.md \
  --run-id verify-example
```

## Generated layout

`eval-kit init --suite generic` creates:

```text
evals/
  eval-kit.config.json
  adapter.mjs
  cases/
    README.md
  results/
    README.md
```

`eval-kit scaffold-case --case case-example-v1` creates:

```text
evals/cases/case-example-v1/
  case-manifest.json
  input.md
  expected-items.json
  rubric.md
```

## CLI commands

| Command             | Purpose                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `init`              | Create a deterministic generic eval skeleton.                                                                       |
| `scaffold-case`     | Create a generic case skeleton under the configured case root.                                                      |
| `doctor`            | Validate config, adapter import, case manifests, artifact paths, results root, and optional Promptfoo availability. |
| `list-cases`        | List case IDs discovered from config.                                                                               |
| `run-case`          | Run a deterministic case against a candidate artifact.                                                              |
| `validate-fixtures` | Validate case manifests and call the consumer validation hook.                                                      |
| `generate`          | Optional Promptfoo-backed candidate generation.                                                                     |
| `judge-coverage`    | Optional Promptfoo-backed pointwise judge.                                                                          |
| `judge-pairwise`    | Optional Promptfoo-backed pairwise judge.                                                                           |
| `report`            | Compose existing run bundles into a manual report through a consumer hook.                                          |

See [`docs/reference/cli.md`](docs/reference/cli.md).

## Documentation

Start here:

- [`docs/product/README.md`](docs/product/README.md) - what and why.
- [`docs/design/README.md`](docs/design/README.md) - architecture, decisions, and contracts.
- [`docs/guides/quickstart.md`](docs/guides/quickstart.md) - bootstrap and first deterministic run.
- [`docs/guides/consumer-integration.md`](docs/guides/consumer-integration.md) - add eval-kit to another repo.
- [`docs/guides/model-assisted-evals.md`](docs/guides/model-assisted-evals.md) - configure manual model-judge lanes.
- [`docs/guides/model-judge-calibration-reporting.md`](docs/guides/model-judge-calibration-reporting.md) - interpret and report manual pointwise evidence.
- [`docs/reference/adapter-contract.md`](docs/reference/adapter-contract.md) - adapter exports and hook shapes.
- [`docs/reference/release-process.md`](docs/reference/release-process.md) - version and tag process.

## Skills

The repo ships operational skills under `skills/`:

- `bootstrap-eval-suite`
- `author-eval-case`
- `review-eval-suite`
- `run-eval-suite`

They guide agents using the CLI. They do not replace the CLI, and they do not decide consumer semantics.

## Development

```bash
pnpm install --frozen-lockfile
pnpm check
```

`pnpm check` is the required local and CI gate for fast, offline, structural checks. Keep
run-producing semantic portfolios, model-assisted generation/judging, LLM judge coverage, pairwise
judging, and expensive full-case replays out of the default gate unless a consumer repo documents a
narrow deterministic structural subset.

## Release model

For now, releases are Git tags that consumers pin in `package.json`:

```text
v0.1.0
v0.1.1
v0.1.2
v0.1.3
v0.1.4
v0.1.5
v0.1.6
v0.2.0
```

A release updates `package.json` version, changelog/release notes, commits the release, creates an annotated tag, pushes the tag, and then consumer repos bump their Git dependency and lockfile.

See [`docs/reference/release-process.md`](docs/reference/release-process.md).

## License

MIT. See [`LICENSE`](LICENSE).
