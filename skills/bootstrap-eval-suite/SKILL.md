---
name: bootstrap-eval-suite
description: Bootstrap or refresh a consumer repo's generic eval-kit harness while keeping consumer semantics out of the shared package.
---

# Bootstrap Eval Suite

Use this skill when adding `@agentic-workflow-kit/eval-kit` harness files to a consumer repo.

## Steps

1. Read the consumer repo instructions and identify the repo root before writing.
2. Confirm the consumer actually wants eval-kit; do not add it because a template exists.
3. Run `eval-kit init --suite generic --dry-run` and inspect the planned files.
4. Run `eval-kit init --suite generic` only when the dry-run matches the intended scope.
5. Run `eval-kit doctor` and record the command result.

## Boundaries

- The kit owns loading, validation, discovery, result plumbing, and generic bootstrap mechanics.
- The consumer owns cases, prompts, rubrics, graders, pass/fail policy, and product vocabulary.
- Do not add technical-design, define-product, design-to-plan, jig, or learning-loop semantics by default.
- Do not install Promptfoo or require Codex auth for deterministic bootstrap.
- Use `--force` only after inspecting existing files and deciding the overwrite is intended.

## Evidence

Report the repo path, generated files, `eval-kit doctor` result, and any consumer decisions still needed.
