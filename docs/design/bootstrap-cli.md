---
title: eval-kit bootstrap CLI
status: implemented
---

# Bootstrap CLI

## Decision

`eval-kit` will include bootstrap functionality in the package itself. The bootstrap flow is for
consumer repos that want to add or refresh the local files needed to call the shared mechanics.

## Command surface

- `eval-kit init --suite generic [--dry-run] [--force]`
- `eval-kit scaffold-case --case <id> [--config <path>] [--dry-run] [--force]`
- `eval-kit doctor [--config <path>]`
- `eval-kit list-cases [--config <path>]`

The default config path is `evals/eval-kit.config.json`, matching the generated skeleton.

## Generated generic skeleton

`eval-kit init --suite generic` writes only deterministic generic harness files:

- `evals/eval-kit.config.json`
- `evals/adapter.mjs`
- `evals/cases/README.md`
- `evals/results/README.md`

The command supports dry-run output and refuses to overwrite existing files unless `--force` is
passed. It does not install Promptfoo, require Codex auth, or generate technical-design semantics.

`eval-kit scaffold-case --case <id>` validates a safe case id and writes:

- `case-manifest.json`
- `input.md`
- `expected-items.json`
- `rubric.md`

The case is placed under the configured `cases.root`, uses generic deterministic artifacts, and
refuses overwrite unless `--force` is passed.

## Doctor checks

`eval-kit doctor` validates:

- config file existence and schema compatibility
- contained suite and results roots
- results-root writability
- adapter import
- configured case manifest discovery
- case artifact paths
- adapter fixture validation hooks
- Promptfoo availability only when Promptfoo-backed methods are enabled

## Non-goals

The bootstrap command must not:

- publish the package
- integrate `repo-template`
- assume every repo should use eval-kit
- generate product semantics for a consumer
- make Promptfoo the primary contract
- update downstream repos during Phase 3
- create suite-specific presets beyond the generic deterministic skeleton until they are designed
