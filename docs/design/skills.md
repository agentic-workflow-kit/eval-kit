---
title: eval-kit skills
status: draft
---

# Eval Kit Skills

## Decision

`eval-kit` should ship agent-facing skills in a later phase. Skills are part of adoption mechanics:
they tell an agent how to use the package without moving consumer semantics into the shared repo.

## Intended skill surface

Initial skills should cover:

- using eval-kit commands in a consumer repo
- bootstrapping or refreshing consumer harness files
- authoring consumer-owned cases and fixtures
- preserving the mechanics-versus-semantics boundary
- migrating `technical-design` from local mechanics to the tagged package

## Phase boundary

Phase 1 only documents the skill intent. It does not add skill files, runtime code, or consumer
integration.

## Skill quality bar

Skills should be concise, operational, and tied to real package commands once those commands exist.
They should not contain a copied handoff dump or ask agents to edit deferred repos.
