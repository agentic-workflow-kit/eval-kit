# eval-kit Decisions

This log is append-only. Amend a decision only for typo-level clarity; record later changes as new
decisions.

## D-001 Extract Eval Kit into separate shared repo

Status: accepted

Extract reusable evaluation mechanics into `eval-kit` so products do not duplicate harness code.
`technical-design` is the first source and first consumer. The initial extraction scope is limited to
`eval-kit` and `technical-design`.

## D-002 Keep the package private for now

Status: accepted

Keep `@agentic-workflow-kit/eval-kit` private and consume it by private Git tag until the initial
contract is proven. Do not claim npm publishing in docs or PRs.

## D-003 Shared package owns mechanics, consumers own semantics

Status: accepted

`eval-kit` owns reusable mechanics such as loading, validation, orchestration, reporting, command
wrappers, and bootstrap helpers. Consumers own domain cases, prompts, rubrics, grader semantics, and
local pass/fail policy.

## D-004 Drop Eval Kit from repo-template

Status: accepted

Do not add eval-kit integration or templates to `repo-template` now. Template integration is
deferred until a real consumer proves the package contract.

## D-005 Add bootstrapping functionality to Eval Kit itself

Status: accepted

Bootstrap functionality belongs in `eval-kit`, not `repo-template`. It should help an existing
consumer add or refresh local eval harness files while preserving consumer-owned semantics.

## D-006 Add Eval Kit skills

Status: accepted

Add skills in a later implementation phase so agents know how to use the package, bootstrap a
consumer, and preserve the mechanics-versus-semantics boundary.

## D-007 Move or generalize technical-design-specific content

Status: accepted

During extraction, any technical-design-specific content must either remain in `technical-design` or
be generalized behind a documented consumer contract. The shared package should not silently absorb
technical-design semantics.

## D-008 Use a root package layout for the shared implementation

Status: accepted

Phase 2 moved the reusable package mechanics into the `eval-kit` repository root rather than a nested
`packages/eval-kit` workspace. The repo is a single private package for now, so root layout keeps
local development and Git tag consumption simpler. If future packages are needed, the workspace can
be reintroduced deliberately.

## D-009 Ship generic bootstrap before suite presets

Status: accepted

Phase 3 ships only a generic deterministic bootstrap skeleton. Suite-specific presets such as
technical-design, define-product, design-to-plan, jig, and learning-loop remain deferred until each
consumer has an explicit design for which semantics stay local and which mechanics are shared.

## D-010 Releases are Git tags until publishing is revisited

Status: accepted

A release consists of a version bump, changelog update, release commit, annotated Git tag, pushed tag, and consumer bump PRs. Do not move tags after consumers pin them.

## D-011 Prompt template variable names are compatibility surfaces

Status: accepted

Bundled prompt templates and adapter hook return keys must stay aligned. If a bundled prompt changes expected variables, update the adapter contract, tests, and known consumers in the same release or provide migration notes.
