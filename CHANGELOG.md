# Changelog

All notable changes to this package are documented here.

This project is pre-1.0. Breaking changes may happen between minor versions, but they must be
documented with migration notes.

## [Unreleased]

### Planned

- Additional docs for suite-specific adoption.
- Better compatibility tests for Promptfoo variable contracts.

## [0.1.4] - 2026-07-04

### Fixed

- Made model-assisted CLI commands fail closed unless their method is explicitly enabled in config.
- Added regression coverage for omitted model-assisted method config and method entries without
  `enabled`.

### Notes

- Deterministic `run-case` and manual `report` remain compatible unless explicitly disabled.
- No npm package is published.
- Consumers may pin `github:agentic-workflow-kit/eval-kit#v0.1.4`.

## [0.1.3] - 2026-07-04

### Added

- Documented the standard two-config pattern for deterministic and manual pointwise model-judge
  consumer eval lanes.
- Updated eval-kit skills to direct agents toward manual model-judge configs while keeping provider
  calls out of default CI gates.

### Notes

- No runtime, schema, or CLI behavior changed.
- No npm package is published.
- Consumers may pin `github:agentic-workflow-kit/eval-kit#v0.1.3`.

## [0.1.2] - 2026-07-03

### Fixed

- Enforced disabled method flags across run-producing CLI commands.
- Added regression coverage for disabled generation, pointwise judging, deterministic runs, and
  manual reports.

### Notes

- No npm package is published.
- Consumers may pin `github:agentic-workflow-kit/eval-kit#v0.1.2`.

## [0.1.1] - 2026-07-03

### Changed

- Clarified generic CLI help wording for candidate artifacts and expected items.
- Documented pairwise adapter display-slot semantics.
- Fixed adapter contract reporter example.

### Notes

- No npm package is published.
- Consumers may pin `github:agentic-workflow-kit/eval-kit#v0.1.1`.

## [0.1.0] - 2026-07-02

### Added

- Private root package `@agentic-workflow-kit/eval-kit`.
- CLI entrypoint `eval-kit`.
- Config loading and schema validation.
- Safe path and ID helpers.
- Case manifest discovery.
- Adapter loading.
- Deterministic `run-case` command.
- Result bundle and artifact manifest writing.
- Generic verdict and text coverage helpers.
- Optional Promptfoo helpers.
- Generic bootstrap commands: `init`, `scaffold-case`, `doctor`, and `list-cases`.
- Agent-facing skills for bootstrapping, authoring, reviewing, and running eval suites.
- Git-tag consumption model for private package users.

### Notes

- No npm package is published.
- Suite-specific presets remain deferred.
- Consumer repos own their own semantics, prompts, cases, and pass/fail policies.

[Unreleased]: https://github.com/agentic-workflow-kit/eval-kit/compare/v0.1.4...main
[0.1.4]: https://github.com/agentic-workflow-kit/eval-kit/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/agentic-workflow-kit/eval-kit/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/agentic-workflow-kit/eval-kit/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/agentic-workflow-kit/eval-kit/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/agentic-workflow-kit/eval-kit/releases/tag/v0.1.0
