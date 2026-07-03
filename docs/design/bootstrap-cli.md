# Bootstrap CLI design

## Goal

The bootstrap CLI gives a consumer repo a working deterministic eval harness without requiring the author to remember every file path by hand. Apparently humans do not enjoy memorizing manifest layouts. Strange, but accepted.

## Commands

```text
eval-kit init
eval-kit scaffold-case
eval-kit doctor
eval-kit list-cases
```

## `init`

Creates a generic deterministic suite skeleton.

```bash
eval-kit init --suite generic --dry-run
eval-kit init --suite generic
```

Generated files:

```text
evals/
  eval-kit.config.json
  adapter.mjs
  cases/
    README.md
  results/
    README.md
```

Rules:

- `--suite generic` is the only required supported suite for now.
- `--dry-run` prints planned files and writes nothing.
- existing files are not overwritten unless `--force` is set.
- generated config disables model-assisted commands by default.
- generated adapter is deliberately generic and should be replaced by consumer semantics.

## `scaffold-case`

Creates a generic deterministic case.

```bash
eval-kit scaffold-case --case case-example-v1
```

Generated files:

```text
evals/cases/case-example-v1/
  case-manifest.json
  input.md
  expected-items.json
  rubric.md
```

Rules:

- case ID must be an ID, not a path;
- case directory is resolved from config `cases.root`;
- existing files are not overwritten unless `--force` is set;
- scaffolded expectations are placeholders, not meaningful pass/fail semantics.

## `doctor`

Validates a suite setup.

Checks:

- config loads and validates;
- suite root exists;
- results root is writable;
- adapter imports;
- case manifests resolve;
- artifact paths exist;
- duplicate case IDs fail;
- consumer fixture validation hook passes;
- Promptfoo exists only when model-assisted methods are enabled.

## `list-cases`

Lists discovered case IDs from the configured case manifests.

## Test expectations

Bootstrap tests should cover:

- dry-run writes nothing;
- init creates expected files;
- overwrite refusal and `--force` behavior;
- doctor on empty suite;
- scaffolded case discovery;
- duplicate case IDs;
- missing artifact paths;
- path-shaped case ID rejection.
