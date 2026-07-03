# Writing eval cases

## Good eval cases are small

A case should test one coherent behavior or failure class. If a case needs a novel to explain itself, it is probably three cases wearing a trench coat.

## Case anatomy

A generic deterministic case has:

```text
case-manifest.json
input.md
expected-items.json
rubric.md
```

Consumer repos may add more files, for example:

```text
product.md
source-map.md
reference-design.md
expected-facts.json
expected-boundaries.json
grader-notes.md
provenance.md
```

## Manifest rules

Every case manifest must include:

```json
{
  "schema_version": "eval-kit.case.v1",
  "case_id": "case-example-v1",
  "artifacts": [
    { "role": "generation_visible", "path": "input.md" },
    { "role": "grader_input", "path": "expected-items.json" }
  ]
}
```

Artifact paths are relative to the manifest directory.

## Expected items

Expected items should be:

- source-visible;
- specific enough to grade;
- small enough to debug;
- not copied from hidden reference outputs;
- explicit about severity.

## Rubrics

Rubrics are for semantic interpretation. They should not contain hidden hard requirements that are absent from source artifacts.

## Case portfolios

Semantic case portfolios are local on-demand evidence. Keep cases small enough to debug, then run
the consumer repo's deterministic portfolio before significant changes. Do not make long
run-producing portfolios, full-case replays, or model-assisted judging part of default CI.

## Bad signs

Avoid cases where:

- the expected answer only appears in a reference output;
- “good design” is defined as matching one exact document;
- deterministic and model-judge verdicts are mixed into one vague score;
- the case depends on live external content;
- fixture names reveal private app names or customer details;
- model judges are asked to reward confidence or verbosity.

## Case review checklist

```text
- [ ] Case ID is stable and path-safe.
- [ ] Case purpose is clear.
- [ ] Source artifacts contain all required facts.
- [ ] Grader inputs are machine-readable where possible.
- [ ] Hidden answer keys are not used as source facts.
- [ ] Expected failures are explicit.
- [ ] Model-assisted judging is optional or calibrated.
```
