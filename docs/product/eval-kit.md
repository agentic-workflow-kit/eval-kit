---
title: eval-kit product brief
status: draft
---

# eval-kit Product Brief

## Why this exists

`eval-kit` exists so agentic-workflow-kit repos can share evaluation mechanics without copying local
harness code between products. It starts by extracting reusable mechanics from `technical-design`
into `@agentic-workflow-kit/eval-kit`, while leaving repo-specific evaluation semantics with the
consumer.

The immediate user is a maintainer of `technical-design` or `eval-kit` who needs the same case
manifest loading, fixture validation, runner plumbing, report shape, and command conventions to be
available from one shared package instead of a local copy.

## Scope now

Only two repos are in scope for the initial extraction:

- `eval-kit`: owns shared package mechanics and future bootstrap helpers.
- `technical-design`: first consumer and source of the initial extraction.

The following repos are deferred until the first extraction proves the shared boundary:

- `define-product`
- `design-to-plan`
- `jig`
- `learning-loop`

## Product boundary

`eval-kit` owns reusable mechanics:

- package entrypoints and command wrappers
- common case discovery, manifest parsing, fixture checks, and report plumbing
- generic schema mechanics and validator wiring
- bootstrap helpers that create or update a consumer's eval harness files
- shared skills that explain how to use and adapt the package

Consumers own evaluation semantics:

- domain-specific case content
- repo-specific rubrics, graders, assertions, and prompts
- product vocabulary and workflow stage meaning
- local policy for what a passing evaluation proves

## Packaging position

The package stays private for now. Consumers should use a private Git tag dependency until there is
enough implementation and adoption evidence to decide whether npm publishing is warranted. The docs
must not claim npm publication.

The initial version target is `v0.1.0` after Phase 3. That gives Phase 4 a complete initial package
tag that `technical-design` can pin when it switches from local mechanics to the shared package.

## Non-goals

Phase 1 does not implement runtime code, schemas, CLI behavior, skills, downstream integrations, or
repo-template work.

The product is not Promptfoo-first. It may support Promptfoo-shaped workflows where useful, but the
shared package boundary is the agentic-workflow-kit evaluation contract, not a wrapper around one
external tool.

`repo-template` does not include eval-kit integration now. New repos should not receive template
eval scaffolding until the package contract is proven by `technical-design`.

## Phase plan

1. Phase 1: document product scope, design decisions, extraction risks, and implementation order.
2. Phase 2: build the shared package mechanics in `eval-kit` without downstream consumer changes.
3. Phase 3: add bootstrap CLI and skills, then cut the intended `v0.1.0` private Git tag.
4. Phase 4: update `technical-design` to consume the tagged package and remove duplicated local
   mechanics.

Future phases can evaluate `define-product`, `design-to-plan`, and `learning-loop` after
`technical-design` is pinned to a complete initial package. `jig` remains deferred until it has a
real evaluation need that matches the shared boundary.
