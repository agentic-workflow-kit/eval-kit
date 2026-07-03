# Eval Kit Examples

These examples use a generic consumer layout. Suite-specific expected schemas, prompts, rubrics, and
case semantics live in the consuming repo.

## Minimal Consumer Layout

```text
evals/
  eval-kit.config.json
  adapter.mjs
  cases/
    case-alpha/
      case-manifest.json
      input.md
      expected-items.json
      candidate.md
  results/
```

## Deterministic Case

```bash
pnpm exec eval-kit run-case \
  --config evals/eval-kit.config.json \
  --case case-alpha \
  --candidate evals/cases/case-alpha/candidate.md \
  --run-id verify-alpha
```

Expected files:

```text
evals/results/verify-alpha/
  manifest.json
  grades.json
  report.md
  cases/case-alpha/candidate.md
  cases/case-alpha/grader-output.json
```

## Minimal Grader

```js
export const gradeCandidate = ({ candidateText, expectedItems }) => {
  const findings = expectedItems.items.map((item) => {
    const covered = candidateText.includes(item.required_text);
    return {
      id: item.id,
      kind: item.kind,
      severity: item.severity,
      verdict: covered ? "covered" : "missing",
      evidence: covered
        ? `found ${item.required_text}`
        : `missing ${item.required_text}`,
    };
  });

  return {
    verdict: findings.every((finding) => finding.verdict === "covered")
      ? "green"
      : "red",
    findings,
  };
};
```

## Minimal Reporter

```js
export const renderReport = ({ caseId, grades, findings }) => {
  return [
    `# Eval Report: ${caseId}`,
    "",
    `Verdict: ${grades.verdict}`,
    "",
    ...findings.map(
      (finding) =>
        `- ${finding.id} (${finding.severity}): ${finding.verdict} - ${finding.evidence}`,
    ),
  ].join("\n");
};
```

## Fixture Validation

```bash
pnpm exec eval-kit validate-fixtures --config evals/eval-kit.config.json
```

The kit validates discovered case manifests first. If `adapter.validateFixtures` exists, the kit
calls it with:

```js
{
  config,
  manifests: [
    {
      manifest,
      fullPath,
      relativePath,
    },
  ],
}
```

## Programmatic Use

```js
import {
  discoverCaseIds,
  loadConfig,
  runCase,
} from "@agentic-workflow-kit/eval-kit";

const config = loadConfig("evals/eval-kit.config.json");
const cases = discoverCaseIds(config);

await runCase({
  config,
  caseId: cases[0],
  candidatePath: "evals/cases/case-alpha/candidate.md",
  runId: "programmatic-run",
});
```

## Model-Assisted Commands

`generate`, `judge-coverage`, and `judge-pairwise` are optional Promptfoo-backed commands. They
require a consumer adapter that returns the variables expected by the selected prompt template.
Consumers can use the bundled generic prompts or set `prompt_templates` to suite-owned prompts.
Treat these as manual/advisory runs, not default CI gates.

```bash
pnpm exec eval-kit judge-coverage \
  --config evals/eval-kit.config.json \
  --case case-alpha \
  --candidate evals/cases/case-alpha/candidate.md \
  --model gpt-5.4 \
  --provider openai \
  --effort medium \
  --run-id alpha-pointwise
```

## Safe Paths

```js
import { createPathResolver } from "@agentic-workflow-kit/eval-kit";

const resolver = createPathResolver({
  repoRoot: process.cwd(),
  configDir: `${process.cwd()}/evals`,
  suiteRoot: ".",
  resultsRoot: "results",
});

const runDir = resolver.resolveRunDir("example-run");
const manifestPath = resolver.resolveResultArtifact(
  runDir,
  "manifest.json",
  "manifest",
);
```

`resolveRunDir("../bad")` throws because run ids must be ids, not paths.
