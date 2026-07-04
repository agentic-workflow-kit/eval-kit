# Adapter contract

Eval-kit stays generic by loading consumer behavior from the adapter module declared in config.

```json
{
  "adapter": "adapter.mjs"
}
```

## Deterministic grader

The adapter should export one of:

```js
export const gradeCandidate = ({ candidateText, expectedItems }) => ({
  verdict: "green",
  findings: [],
});

export default ({ candidateText }) => ({ verdict: "green", findings: [] });
```

Technical-design and legacy consumers may also expose compatibility names, but `gradeCandidate` is the generic preferred export.

Input includes:

```js
{
  candidateText: "...",
  // plus JSON grader_input artifacts converted from file names:
  expectedItems: { ... },
  expectedFacts: { ... },
  expectedBoundaries: { ... }
}
```

Return:

```js
{
  verdict: "red" | "yellow" | "green" | "great",
  findings: [
    {
      id: "expected-item-1",
      kind: "generic",
      severity: "critical",
      verdict: "covered",
      evidence: "candidate excerpt or explanation"
    }
  ]
}
```

## Deterministic reporter

Export one of:

```js
export const renderDeterministicReport = (input) => "# Eval Report\n";
export const renderReport = (input) => "# Eval Report\n";
```

Input:

```js
{
  caseId,
  grades,
  findings,
  caseDir,
  candidatePath,
  resolver,
}
```

## Generation hook

Required for `generate`:

```js
export const resolveGenerationVars = async ({
  caseId,
  caseDir,
  artifacts,
  resolver,
}) => ({
  source_material: "...",
  candidate_instructions: "...",
  output_format: "Markdown",
});
```

The bundled generation prompt expects exactly these generic keys.

## Pointwise judge hook

Required for `judge-coverage`:

```js
export const resolvePointwiseVars = async ({
  caseId,
  caseDir,
  artifacts,
  candidateContent,
  candidatePath,
  promptVersion,
  rubricVersion,
  model,
  provider,
  resolver,
}) => ({
  case_id: caseId,
  model,
  provider,
  prompt_version: promptVersion,
  rubric_version: rubricVersion,
  source_material: "...",
  case_rubric: "...",
  expected_items: JSON.stringify([...], null, 2),
  candidate_path: resolver.relativeToRepo(candidatePath),
  candidate: candidateContent,
  _expectedItemsForCanonicalization: [...],
});
```

Optional metadata canonicalization:

```js
export const canonicalizeExpectedItemMetadata = (actualItems, expectedItems) =>
  expectedItems.map((expected) => ({
    ...actualItems.find((item) => item.item_id === expected.item_id),
    kind: expected.kind,
    severity: expected.severity,
    source_refs: expected.source_refs,
  }));
```

Eval-kit exports generic pointwise helpers for consumers that curate summaries:

```js
import {
  countPointwiseVerdicts,
  formatPointwiseCalibrationSummary,
} from "@agentic-workflow-kit/eval-kit";
```

Use these helpers to report advisory counts for `covered`, `partial`, `missing`, `contradicted`, and
`unknown`, plus expected-good/expected-bad calibration labels and false-pass/false-fail notes. The
helpers do not define consumer semantics.

## Pairwise judge hook

Required for `judge-pairwise`:

```js
export const resolvePairwiseVars = async ({
  caseId,
  caseDir,
  artifacts,
  candidateAContent,
  candidateBContent,
  candidateAPath,
  candidateBPath,
  promptVersion,
  rubricVersion,
  model,
  provider,
  randomizedOrder,
  resolver,
}) => ({
  case_id: caseId,
  model,
  provider,
  prompt_version: promptVersion,
  rubric_version: rubricVersion,
  source_material: "...",
  case_rubric: "...",
  expected_items: "...",
  candidate_a: candidateAContent,
  candidate_b: candidateBContent,
  randomization_method: randomizedOrder.method,
  randomization_seed: randomizedOrder.seed,
  original_order: randomizedOrder.original_order.join(", "),
  candidate_order: randomizedOrder.candidate_order.join(", "),
});
```

`judgePairwise` randomizes the displayed candidate order before it calls
`resolvePairwiseVars`. The `candidateAContent`, `candidateBContent`, `candidateAPath`, and
`candidateBPath` inputs are displayed Candidate A/B slots, not necessarily the original
`--candidate-a` and `--candidate-b` CLI inputs.

Use `randomizedOrder` to preserve the mapping:

- `randomizedOrder.original_order` records the original labels: `candidate_a`, then
  `candidate_b`.
- `randomizedOrder.candidate_order` records which original candidate keys were shown in displayed
  Candidate A/B order.

Adapters must not randomize candidate order again. They should pass the displayed Candidate A/B
values through to the prompt variables and include the provided randomization metadata in model
judge inputs and outputs.

## Manual report hook

Required for `report`:

```js
export const compileReport = async ({
  config,
  runId,
  runs,
  resultDir,
  resolver,
}) => ({
  reportContent: "# Manual Combined Report\n",
  caseIds: ["case-example-v1"],
  artifacts: [],
  outputFiles: [],
});
```

## Fixture validation hook

Optional:

```js
export const validateFixtures = async ({ config, manifests }) => {
  for (const { manifest, fullPath, relativePath } of manifests) {
    // consumer-specific checks
  }
};
```

Throw to fail validation.

## Resolver API

Hooks receive `resolver`, which supports contained path helpers such as:

```text
resolveRunDir(runId)
resolveResultArtifact(runDir, relativePath, label)
resolveSuitePath(relativePath, label)
resolveRepoPath(relativePath, label)
relativeToRepo(absolutePath)
relativeToSuite(absolutePath)
relativeToResults(absolutePath)
```
