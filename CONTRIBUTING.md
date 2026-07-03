# Contributing to eval-kit

Thanks for contributing. This repository is small on purpose, which means changes should preserve boring boundaries. Boring boundaries are how future maintainers avoid becoming unpaid archaeologists.

## Development setup

```bash
pnpm install --frozen-lockfile
pnpm check
```

`pnpm check` is the required local and CI gate.

## Working rules

- Read `AGENTS.md` before non-trivial work.
- Branch from `main`.
- Open a pull request into `main`.
- Keep each PR focused.
- Show evidence from commands, not prose claims.
- Do not add consumer semantics to the shared package.
- Do not add eval-kit files to `repo-template` unless there is a new accepted design decision.
- Do not publish to npm. Releases are Git tags for now.

## Boundary rule

```text
eval-kit owns mechanics.
consumer repos own meaning.
```

Good shared mechanics:

- config loading;
- path containment;
- case discovery;
- adapter loading;
- deterministic runner orchestration;
- result bundle writing;
- generic schemas;
- bootstrap file generation;
- optional Promptfoo wrappers.

Bad shared semantics:

- PRD acceptance criteria quality rules;
- DDD bounded context expectations;
- design-to-plan traceability policy;
- Jig execution-plan schema assumptions;
- learning-loop root-cause categories;
- consumer-specific judge rubrics.

## Pull request checklist

Before requesting review:

```text
- [ ] I read AGENTS.md and the docs that own this area.
- [ ] The change keeps mechanics separate from consumer semantics.
- [ ] I updated docs for changed CLI/config/adapter behavior.
- [ ] I added or updated tests for behavior changes.
- [ ] I ran pnpm check.
- [ ] I included command output/evidence in the PR body.
```

## Documentation changes

Docs follow the repo altitude split:

- `docs/product/` owns what/why.
- `docs/design/` owns how/architecture/decisions.
- `docs/guides/` owns task-oriented usage.
- `docs/reference/` owns exact CLI/config/schema/API details.

Do not put product/design docs at repo root. `README.md` is the only top-level Markdown entry point besides standard project files like `CONTRIBUTING.md`, `SECURITY.md`, and `CHANGELOG.md`.

## Release changes

Release PRs should be titled like:

```text
chore(release): v0.1.1
```

They should update:

- `package.json` version;
- `CHANGELOG.md`;
- any current-version references in docs;
- lockfile only when needed.

After merge, create an annotated tag and push it. Do not move tags after consumers have pinned them.

See `docs/reference/release-process.md`.
