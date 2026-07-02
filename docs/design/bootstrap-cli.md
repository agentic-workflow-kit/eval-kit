---
title: eval-kit bootstrap CLI
status: draft
---

# Bootstrap CLI

## Decision

`eval-kit` will include bootstrap functionality in the package itself. The bootstrap flow is for
consumer repos that want to add or refresh the local files needed to call the shared mechanics.

## Intended behavior

The bootstrap command should:

- inspect the consumer repo before writing
- create or update minimal local eval harness files
- preserve consumer-owned case content, rubrics, prompts, and local policy
- be repeatable and diff-friendly
- support a dry-run mode before writes
- explain required manual follow-up when a consumer decision is needed

## Non-goals

The bootstrap command must not:

- publish the package
- integrate `repo-template`
- assume every repo should use eval-kit
- generate product semantics for a consumer
- make Promptfoo the primary contract
- update downstream repos during Phase 1

## Open design questions

- Exact command name and flags.
- Whether bootstrap templates live as package assets, generated code, or both.
- How to report conflicts when existing consumer files diverge.
- Which files Phase 3 must generate before tagging `v0.1.0`.
