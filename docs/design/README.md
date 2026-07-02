---
title: eval-kit — design
status: draft
---

# eval-kit — design

Design owns **how**: architecture, decisions, internal contracts, and formats. It implements and
verifies the product promises in [`../product/`](../product/) and reconciles to them — where design
and product intent conflict, name the conflict and resolve it deliberately, not by silent churn.

Phase 0 does not define runtime architecture. Add design detail when the extraction work starts and
keep consumer-specific semantics out of this repo unless product explicitly moves them here.
