# Result bundles

Run-producing eval-kit commands write result bundles under the configured `results_root`.

These commands create run directories:

- `run-case`
- `generate`
- `judge-coverage`
- `judge-pairwise`
- `report`

Run-producing commands are local on-demand or manual/advisory evidence. They are not default CI
gates. Keep `pnpm check` limited to fast, offline, structural validation unless a consumer
documents a narrow deterministic subset that does not call external providers.

Setup and inspection commands do not create result bundles. `init` and `scaffold-case` write suite
or case files, while `doctor`, `list-cases`, and `validate-fixtures` validate or report current
state without writing `<results_root>/<run-id>/manifest.json`.

```text
<results_root>/<run-id>/
  manifest.json
  report.md
  ...command-specific artifacts
```

## Manifest

Current schema:

```json
{
  "schema_version": "eval-kit.result-manifest.v2",
  "run_id": "verify-example",
  "run_type": "deterministic",
  "runner": {
    "id": "generic-eval-case",
    "version": "0.1.1"
  },
  "case_ids": ["case-example-v1"],
  "started_at": "2026-07-03T00:00:00.000Z",
  "ended_at": "2026-07-03T00:00:01.000Z",
  "duration_ms": 1000,
  "status": "completed",
  "git": {
    "commit": "abc123"
  },
  "command": "pnpm exec eval-kit run-case ...",
  "tool_versions": {
    "node": "v26.0.0",
    "pnpm": "11.9.0"
  },
  "artifacts": [],
  "output_files": ["manifest.json", "report.md"]
}
```

## Artifact records

Artifacts record:

- role;
- path;
- media type;
- byte size;
- SHA-256;
- encoding;
- redaction status.

## Commit policy

Consumers decide what to commit.

Recommended default:

- commit `evals/results/README.md`;
- ignore transient run directories;
- commit curated summaries only when useful;
- never commit private prompts, customer data, secrets, or raw model output unless explicitly reviewed.

## Deterministic artifacts

A deterministic run usually writes:

```text
manifest.json
report.md
grades.json
cases/<case-id>/candidate.md
cases/<case-id>/grader-output.json
```

## Model-assisted artifacts

Promptfoo-backed runs may write:

```text
promptfooconfig.json
promptfoo-results.json
promptfoo-report.html
candidate.md
pointwise-result.json
pairwise-result.json
```

For `judge-pairwise`, `pairwise-result.json` stores the final winner normalized back to the original
CLI candidate labels. Its `randomization.original_order` field records the original
`candidate_a`/`candidate_b` labels, and `randomization.candidate_order` records which original
candidate keys were displayed as Candidate A/B for the model judge.

Treat these as potentially sensitive.
