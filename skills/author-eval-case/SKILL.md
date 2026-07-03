---
name: author-eval-case
description: Author a consumer-owned generic deterministic eval case using eval-kit scaffold-case and local rubric evidence.
---

# Author Eval Case

Use this skill when creating or revising a case in a repo that already has an eval-kit config.

## Steps

1. Read the consumer repo instructions and the local eval-kit config.
2. Choose a safe case id and run `pnpm exec eval-kit scaffold-case --case <id>`.
3. Fill the generated `input.md`, `expected-items.json`, and `rubric.md` with consumer-owned content.
4. Run `pnpm exec eval-kit list-cases` to confirm discovery.
5. Run `pnpm exec eval-kit doctor` to validate manifests and artifacts.
6. If a deterministic candidate is available, run `pnpm exec eval-kit run-case --case <id> --candidate <path>`.

## Boundaries

- Keep domain facts, rubrics, expected items, and pass/fail policy in the consumer repo.
- Do not move consumer semantics into `@agentic-workflow-kit/eval-kit`.
- Avoid model-assisted judging until the consumer has calibrated prompts, rubrics, and acceptance policy.
- Keep semantic portfolio runs local on-demand before significant changes, not default CI.
- Search for sibling cases before introducing a new fixture shape.

## Evidence

Report the case id, touched case files, discovery output, doctor output, and deterministic run result when run.
