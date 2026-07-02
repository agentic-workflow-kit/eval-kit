# eval-kit

> Shared evaluation infrastructure for agentic-workflow-kit repos, starting as an extraction target
> for reusable eval mechanics from `technical-design`.

## Status

Phase 0 baseline. The repository is initialized to org standards and does not yet contain runtime
eval-kit implementation.

## Development

```bash
pnpm install --frozen-lockfile
pnpm check
```

`pnpm check` is the single required local and CI gate.

## Documentation

- [`docs/product/`](docs/product/) — what & why (audience-facing).
- [`docs/design/`](docs/design/) — how (mechanics, decisions, contracts).

## Relationship to the suite

`eval-kit` is part of [`agentic-workflow-kit`](https://github.com/agentic-workflow-kit), a polyrepo
family of standalone, composable products for an agentic software-development lifecycle. Each repo
is independently useful and composes through shared contracts, not internals.

## License

MIT License. See [LICENSE](LICENSE).
