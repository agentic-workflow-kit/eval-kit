# Changelog

All notable changes to this package are documented here.

This project is pre-1.0. Breaking changes may happen between minor versions, but they must be
documented with migration notes.

## [Unreleased]

### Planned

- Consumer integration hardening.
- Additional docs for suite-specific adoption.
- Better compatibility tests for Promptfoo variable contracts.

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

[Unreleased]: https://github.com/agentic-workflow-kit/eval-kit/compare/v0.1.0...main
[0.1.0]: https://github.com/agentic-workflow-kit/eval-kit/releases/tag/v0.1.0
