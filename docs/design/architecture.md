---
title: eval-kit architecture
status: draft
---

# eval-kit Architecture

## Current baseline

The live repository is a private root package named `@agentic-workflow-kit/eval-kit` at version
`0.1.0`. Phase 2 added reusable mechanics at the repo root: CLI entrypoint, SDK helpers, generic
schemas, adapter loading, case discovery, deterministic result bundles, optional Promptfoo helpers,
and focused package tests.

## Package shape

The package will expose reusable mechanics for evaluation workflows:

- loading case manifests and fixture directories
- validating shared structural contracts
- running generic evaluation steps
- emitting stable machine-readable and human-readable reports
- providing command wrappers that consumers can call from local scripts
- future bootstrapping of a consumer repo's local harness files

The package must avoid importing consumer domain semantics. Consumer repos can provide callbacks,
configuration, local fixtures, or adapters for semantics that the package should not own.

## Boundary rule

The architectural boundary is:

- `eval-kit`: mechanics, file conventions, runner orchestration, validation plumbing, generic
  schemas, bootstrap helpers, and usage skills.
- consumer repo: domain cases, prompts, rubrics, grader semantics, expected facts, workflow stage
  meaning, and local pass/fail policy.

When a technical-design-specific concept appears in extracted code, choose one of two outcomes:

1. Move it back into `technical-design`.
2. Generalize it behind a consumer-supplied contract and document the generic name here.

## Private Git tag consumption

Until publishing is reconsidered, downstream consumers should depend on a private Git tag rather than
an npm release. The intended first usable tag is `v0.1.0` after Phase 3.

## Compatibility posture

Once runtime entrypoints exist, package command contracts, schema namespaces, report formats, and
bootstrap outputs are versioned boundaries. Breaking changes should be intentional, documented, and
paired with consumer migration notes.
