# CLI reference

Run:

```bash
eval-kit <command> [options]
```

## `init`

Create a deterministic generic eval skeleton.

```bash
eval-kit init --suite generic [--dry-run] [--force]
```

Options:

| Option            | Required | Description                                        |
| ----------------- | -------- | -------------------------------------------------- |
| `--suite generic` | no       | Suite template. Defaults to `generic`.             |
| `--dry-run`       | no       | Print planned writes without writing files.        |
| `--force`         | no       | Overwrite existing generated files. Use carefully. |

## `scaffold-case`

Create a generic deterministic case skeleton.

```bash
eval-kit scaffold-case --case <id> [--config <path>] [--dry-run] [--force]
```

Options:

| Option            | Required | Description                                            |
| ----------------- | -------- | ------------------------------------------------------ |
| `--case <id>`     | yes      | Path-safe case ID.                                     |
| `--config <path>` | no       | Config path. Defaults to `evals/eval-kit.config.json`. |
| `--dry-run`       | no       | Print planned writes without writing files.            |
| `--force`         | no       | Overwrite existing case files.                         |

## `doctor`

Validate suite setup.

```bash
eval-kit doctor [--config <path>]
```

## `list-cases`

List discovered case IDs.

```bash
eval-kit list-cases [--config <path>]
```

## `run-case`

Run a deterministic case.

```bash
eval-kit run-case \
  --case <id> \
  --candidate <path> \
  [--run-id <id>] \
  [--config <path>]
```

Exits non-zero when the deterministic verdict is `red`.

## `validate-fixtures`

Validate case manifests and call the consumer `validateFixtures` hook when present.

```bash
eval-kit validate-fixtures [--config <path>]
```

## `generate`

Run Promptfoo-backed candidate generation.

```bash
eval-kit generate \
  --case <id> \
  --model <name> \
  --provider <openai|openai:codex-app-server> \
  --effort <low|medium|high> \
  --run-id <id> \
  [--config <path>]
```

Requires Promptfoo and local Codex auth.

## `judge-coverage`

Run Promptfoo-backed pointwise coverage judging.

```bash
eval-kit judge-coverage \
  --case <id> \
  --candidate <path> \
  --model <name> \
  --provider <openai|openai:codex-app-server> \
  --effort <low|medium|high> \
  [--run-id <id>] \
  [--config <path>]
```

## `judge-pairwise`

Run Promptfoo-backed pairwise comparison.

Eval-kit randomizes which original CLI candidate is displayed as Candidate A or Candidate B before
calling the consumer adapter. The adapter receives displayed Candidate A/B content and paths plus
`randomizedOrder`, which records the original-to-displayed mapping. Adapters should not apply their
own second randomization pass.

```bash
eval-kit judge-pairwise \
  --case <id> \
  --candidate-a <path> \
  --candidate-b <path> \
  --model <name> \
  --provider <openai|openai:codex-app-server> \
  --effort <low|medium|high> \
  --seed <number> \
  --run-id <id> \
  [--config <path>]
```

Fails closed when `methods.judge_pairwise.enabled` is explicitly `false`.

## `report`

Compile existing run bundles into a unified report through the consumer hook.

```bash
eval-kit report \
  --run-id <id> \
  [--generate <id>] \
  [--deterministic <id>] \
  [--judge-coverage <id>] \
  [--judge <id>] \
  [--outcome <id>] \
  [--config <path>]
```
