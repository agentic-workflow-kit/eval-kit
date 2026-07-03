# Eval Kit product overview

## Summary

`eval-kit` gives `agentic-workflow-kit` repos a shared way to define, run, and inspect local evaluation suites without copying harness code between repos.

It is deliberately small. It gives repos the mechanics for local evals, but each repo keeps ownership of what “good” means for its layer.

## Audience

Primary users:

- maintainers of `agentic-workflow-kit` repos;
- agents bootstrapping or running repo-local eval suites;
- contributors adding deterministic checks or model-assisted evals;
- future maintainers integrating `define-product`, `design-to-plan`, or learning-loop eval suites.

## Problem

The suite needs evaluation across several repos:

```text
define-product
technical-design
design-to-plan
learning-loop later
```

Each layer needs different semantics:

- Product cares about PRD quality and stable acceptance-criteria IDs.
- Technical Design cares about source-grounded design quality, boundaries, and enforceability.
- Planning cares about projection-only story decomposition and traceability.
- Learning later cares about defect classification and durable prevention.

All of those suites need similar mechanics: discovering cases, loading config, validating fixtures,
running deterministic checks, writing reports, and optionally calling model judges. Copying that
harness into every repo would create repeated maintenance work without improving the repo-specific
semantics.

## Product promise

`eval-kit` provides a shared, versioned, private package for eval mechanics that consumer repos can adopt without surrendering their domain semantics.

## What it does

- Creates generic deterministic eval-suite scaffolding.
- Discovers case manifests.
- Loads consumer adapters.
- Runs deterministic grading.
- Writes machine-readable and Markdown result bundles.
- Validates result artifacts.
- Provides optional Promptfoo-backed generation and judging helpers.
- Provides skills that guide agents through bootstrap, authoring, review, and running.

## What it does not do

- It does not publish to npm yet.
- It does not own consumer grading semantics.
- It does not define Product, Design, Planning, Jig, or Learning quality by itself.
- It does not add anything to `repo-template`.
- It does not make Promptfoo required for deterministic evals.
- It does not make LLM judge verdicts authoritative without calibration.

## Fit

Use eval-kit when a repo needs:

- local deterministic evals;
- repeatable fixture validation;
- structured result bundles;
- a standard way for agents to bootstrap and run evals;
- optional model-assisted grading with explicit caveats.

Do not use eval-kit when:

- a normal unit test is enough;
- the repo needs runtime-specific test harnesses, such as Jig execution tests;
- the eval semantics are not yet understood;
- the change would freeze a downstream contract too early.

## Current consumers

- `technical-design` consumes `@agentic-workflow-kit/eval-kit` through a private Git tag.

Deferred consumers:

- `define-product`
- `design-to-plan`
- learning-loop

Excluded for now:

- `jig`
- `repo-template`

## Success criteria

Eval-kit succeeds when:

- consumer repos can add deterministic local evals with minimal boilerplate;
- result bundles are inspectable and stable enough for review;
- shared mechanics improve without contaminating consumer semantics;
- releases are tag-pinned and easy to consume;
- model-assisted evals remain optional and calibrated.
