# Changelog

All notable changes to this package are documented here.

This project is pre-1.0. Breaking changes may happen between minor versions, but they must be
documented with migration notes.

## [Unreleased]

### Planned

- Additional docs for suite-specific adoption.
- Better compatibility tests for Promptfoo variable contracts.

## [0.1.8] - 2026-07-04

### Added

- Added generic pointwise summary helpers for advisory verdict counts and calibration notes.
- Documented the shared pointwise report summary pattern for curated manual evidence.

### Fixed

- Hardened pointwise judge result handling so provider, prompt version, rubric version, and run
  manifest metadata must match the configured run before the result bundle is written.
- Added regression tests for malformed or missing pointwise run metadata.

### Notes

- Deterministic `run-case` and manual `report` compatibility are preserved.
- Consumer repos still own judge semantics, prompts, fixtures, and calibration policy.
- No npm package is published.
- Consumers may pin `github:agentic-workflow-kit/eval-kit#v0.1.8`.

## [0.1.7] - 2026-07-04

### Fixed

- Generic bootstrap now writes `evals/results/.gitignore` so raw result bundles stay local by
  default while preserving `README.md` and the ignore file.
- Updated bootstrap tests to cover the generated results ignore policy.

### Notes

- No runner, schema, prompt, or consumer semantic behavior changed.
- No npm package is published.
- Consumers may pin `github:agentic-workflow-kit/eval-kit#v0.1.7`.

## [0.1.6] - 2026-07-04

### Fixed

- Marked extraction-era technical-design Promptfoo follow-up docs as historical so they do not
  override current two-config pointwise model-judge guidance.
- Replaced a stale release-process dependency example with a version placeholder.

### Notes

- No runtime, schema, prompt, or CLI behavior changed.
- No npm package is published.
- Consumers may pin `github:agentic-workflow-kit/eval-kit#v0.1.6`.

## [0.1.5] - 2026-07-04

### Added

- Documented shared manual pointwise model-judge calibration and reporting policy.
- Clarified `covered`, `partial`, `missing`, `contradicted`, and `unknown` interpretation.
- Updated eval-kit skills to report deterministic evidence first, keep raw provider bundles local
  unless curated, and treat expected-bad fixtures as successful calibration evidence when they
  remain adverse.

### Notes

- No runtime, schema, prompt, or CLI behavior changed.
- No npm package is published.
- Consumers may pin `github:agentic-workflow-kit/eval-kit#v0.1.5`.

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

[Unreleased]: https://github.com/agentic-workflow-kit/eval-kit/compare/v0.1.8...main
[0.1.8]: https://github.com/agentic-workflow-kit/eval-kit/compare/v0.1.7...v0.1.8
[0.1.7]: https://github.com/agentic-workflow-kit/eval-kit/compare/v0.1.6...v0.1.7
[0.1.6]: https://github.com/agentic-workflow-kit/eval-kit/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/agentic-workflow-kit/eval-kit/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/agentic-workflow-kit/eval-kit/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/agentic-workflow-kit/eval-kit/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/agentic-workflow-kit/eval-kit/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/agentic-workflow-kit/eval-kit/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/agentic-workflow-kit/eval-kit/releases/tag/v0.1.0
