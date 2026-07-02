---
title: eval-kit — design
status: draft
---

# eval-kit — design

Design owns **how**: architecture, decisions, internal contracts, and formats. It implements and
verifies the product promises in [`../product/`](../product/) and reconciles to them — where design
and product intent conflict, name the conflict and resolve it deliberately, not by silent churn.

## Design docs

- [architecture](./architecture.md) - package boundary and component map.
- [decisions](./decisions.md) - append-only decision log.
- [bootstrap CLI](./bootstrap-cli.md) - intended bootstrap command behavior.
- [skills](./skills.md) - intended skill surface.
- [extraction plan](./extraction-plan.md) - Phase 1-4 implementation order and risks.
- [consumer integration plan](./consumer-integration-plan.md) - how `technical-design` will adopt
  the package after the initial tag.

Phase 1 documents the design plan only. Runtime source, schemas, commands, and skills land in later
phases.
