---
title: eval-kit skills
status: implemented
---

# Eval Kit Skills

## Decision

`eval-kit` ships agent-facing skills as adoption mechanics: they tell an agent how to use the
package without moving consumer semantics into the shared repo.

## Skill surface

- `skills/bootstrap-eval-suite/SKILL.md`
- `skills/author-eval-case/SKILL.md`
- `skills/review-eval-suite/SKILL.md`
- `skills/run-eval-suite/SKILL.md`

The skills guide agents through CLI use, evidence collection, case authoring, review, and running
suites. They avoid technical-design semantics by default and keep model-assisted judging advisory
unless the consumer has calibrated it.

## Skill quality bar

Skills should be concise, operational, and tied to real package commands once those commands exist.
They should not contain a copied handoff dump or ask agents to edit deferred repos.
