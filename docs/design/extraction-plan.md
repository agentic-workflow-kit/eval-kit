---
title: eval-kit extraction plan
status: draft
---

# Extraction Plan

## Source and target

The extraction starts from `technical-design` because it already has evaluation mechanics that can
be shared. The target is `@agentic-workflow-kit/eval-kit`, consumed from a private Git tag after the
initial implementation is complete.

## Technical-design extraction risks

- Local case semantics may be accidentally moved into the shared package.
- Schema namespaces or report shapes may retain technical-design names.
- Commands may assume technical-design paths instead of consumer-provided paths.
- Fixtures may encode product-specific vocabulary as if it were generic structure.
- Migration may leave duplicate mechanics in `technical-design` after package adoption.
- Review may confuse a clean local package build with a complete consumer migration.

Mitigation: classify every extracted item as shared mechanics or consumer semantics, then either
generalize it behind a documented contract or leave it in `technical-design`.

## Phase 1: documentation

Capture the product/design handoff, decisions, risks, and implementation order in `eval-kit` docs.
No runtime implementation, schemas, CLI behavior, skills, repo-template work, downstream consumer
changes, or publishing claims.

## Phase 2: shared mechanics

Implement the package mechanics in `eval-kit`:

- package entrypoints
- manifest and fixture loading
- shared structural validation
- generic schemas and namespace choices
- runner orchestration
- report output contracts
- focused tests for the shared mechanics

Phase 2 should not update `technical-design` to consume the package yet.

Status: landed in the root package layout. The shared package includes generic mechanics and a fake
consumer fixture for config loading, adapter import, case manifest resolution, deterministic result
bundle writing, and fixture validation. Technical-design-specific expected fact and boundary schemas,
DDD-shaped prompts, and reference cases remain out of the shared package and belong to the Phase 4
consumer migration.

## Phase 3: bootstrap and skills

Add bootstrap CLI behavior and eval-kit skills. Verify that a consumer can prepare local harness
files while keeping semantics local. Cut the intended private `v0.1.0` Git tag only after this phase
is complete.

Status: implemented in the root package. The CLI provides a generic deterministic bootstrap, case
scaffolding, suite doctor, and case listing. Skills now cover bootstrapping, authoring, reviewing,
and running eval suites. Phase 3 still does not update downstream consumers.

## Phase 4: technical-design consumption

Update `technical-design` to pin the `v0.1.0` Git tag, call shared mechanics from
`@agentic-workflow-kit/eval-kit`, and remove duplicated local mechanics. Preserve
technical-design-owned cases, rubrics, prompts, and pass/fail policy.

## Future consumers

After `technical-design` is pinned to a complete initial package, evaluate whether `define-product`,
`design-to-plan`, and `learning-loop` have matching evaluation needs. `jig` stays deferred until it
has a concrete evaluation workflow that benefits from the shared package.
