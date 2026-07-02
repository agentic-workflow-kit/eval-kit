# eval-kit

> Shared evaluation infrastructure for agentic-workflow-kit repos.

## Status

Phase 3 implementation. The repository owns the private root package
`@agentic-workflow-kit/eval-kit` with reusable eval mechanics, a deterministic generic bootstrap CLI,
and agent-facing skills. Consumer-specific prompts, expected schemas, rubrics, and cases stay with
consumers until their migration phase.

Current package surfaces:

- config loading and safe path resolution
- case manifest discovery and validation
- adapter loading
- deterministic case runs and result bundle writing
- schema registry and bundled generic schemas
- verdict aggregation and generic text coverage helpers
- optional Promptfoo helpers and generic prompt templates
- deterministic generic bootstrap commands
- eval-kit skills for bootstrapping, authoring, reviewing, and running suites

## CLI

Bootstrap a generic deterministic suite in a consumer repo:

```bash
eval-kit init --suite generic --dry-run
eval-kit init --suite generic
eval-kit doctor
```

The generic skeleton writes:

- `evals/eval-kit.config.json`
- `evals/adapter.mjs`
- `evals/cases/README.md`
- `evals/results/README.md`

It does not install Promptfoo, require Codex auth, or generate product-specific semantics.

Create and inspect a case:

```bash
eval-kit scaffold-case --case case-example-v1
eval-kit list-cases
eval-kit doctor
```

`scaffold-case` writes generic deterministic case files under the configured `cases.root` and
refuses to overwrite existing files unless `--force` is passed. `doctor` validates config loading,
schema compatibility, contained roots, adapter import, case artifacts, results-root writability, and
Promptfoo availability only when Promptfoo-backed methods are enabled.

Existing runner commands remain available:

```bash
eval-kit run-case --case <id> --candidate <path>
eval-kit validate-fixtures
eval-kit report --run-id <id> --deterministic <run-id>
```

Model-assisted commands (`generate`, `judge-coverage`, `judge-pairwise`) remain optional and should
be treated as advisory until a consumer has calibrated them.

## Skills

The repo ships concise skills under `skills/`:

- `bootstrap-eval-suite`
- `author-eval-case`
- `review-eval-suite`
- `run-eval-suite`

They are operational guides for agents using the package in consumer repos. They preserve the
kit-versus-consumer boundary and require command/check evidence before claiming success.

## Development

```bash
pnpm install --frozen-lockfile
pnpm check
```

`pnpm check` runs formatting plus the focused package tests.

## Documentation

- [`docs/product/`](docs/product/) — what & why (audience-facing).
- [`docs/design/`](docs/design/) — how (mechanics, decisions, contracts).

## Relationship to the suite

`eval-kit` is part of [`agentic-workflow-kit`](https://github.com/agentic-workflow-kit), a polyrepo
family of standalone, composable products for an agentic software-development lifecycle. Each repo
is independently useful and composes through shared contracts, not internals.

## License

MIT License. See [LICENSE](LICENSE).
