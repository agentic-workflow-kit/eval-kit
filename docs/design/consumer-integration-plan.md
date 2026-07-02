---
title: eval-kit consumer integration plan
status: draft
---

# Consumer Integration Plan

## Initial consumer

`technical-design` is the only initial consumer. It is also the source repo for the mechanics being
extracted.

## Integration point

Phase 4 should update `technical-design` to depend on a private Git tag for
`@agentic-workflow-kit/eval-kit`. The intended first tag is `v0.1.0`, cut after Phase 3 so the
consumer pins a complete initial package.

## Consumer responsibilities

`technical-design` keeps:

- local evaluation cases and fixtures
- domain-specific expected facts and boundaries
- prompts, rubrics, and grader semantics
- local scripts that express what `technical-design` considers a required gate

## Package responsibilities

`eval-kit` provides:

- reusable mechanics behind package entrypoints
- shared validators and generic schema contracts
- command wrappers or APIs that `technical-design` scripts can call
- report shapes that can be consumed by local checks and reviews
- bootstrap helpers for future consumers

## Deferred integrations

Do not integrate `define-product`, `design-to-plan`, `jig`, or `learning-loop` in Phase 1-4. Future
work may add them one at a time after proving the boundary with `technical-design`.

Do not add repo-template integration. A template should not imply that every new repo needs eval-kit
before the package contract is proven.
