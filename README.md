# eval-kit

> Shared evaluation infrastructure for agentic-workflow-kit repos.

## Status

Phase 2 implementation. The repository now owns the private root package
`@agentic-workflow-kit/eval-kit` with reusable eval mechanics extracted from the original
technical-design package source. Consumer-specific prompts, expected schemas, rubrics, and cases stay
with consumers until their migration phase.

Current package surfaces:

- config loading and safe path resolution
- case manifest discovery and validation
- adapter loading
- deterministic case runs and result bundle writing
- schema registry and bundled generic schemas
- verdict aggregation and generic text coverage helpers
- optional Promptfoo helpers and generic prompt templates

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
