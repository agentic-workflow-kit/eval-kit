# Config reference

Default path:

```text
evals/eval-kit.config.json
```

## Minimal config

```json
{
  "$schema": "../node_modules/@agentic-workflow-kit/eval-kit/schemas/eval-kit.config.schema.json",
  "schema_version": "eval-kit.config.v1",
  "suite_id": "generic",
  "suite_root": ".",
  "results_root": "results",
  "adapter": "adapter.mjs",
  "cases": {
    "root": "cases",
    "include": ["*"]
  },
  "methods": {
    "deterministic": {
      "enabled": true,
      "grader": "generic-keyword",
      "reporter": "generic-markdown"
    },
    "generate": {
      "enabled": false
    },
    "judge_coverage": {
      "enabled": false
    },
    "judge_pairwise": {
      "enabled": false
    },
    "report": {
      "enabled": true
    }
  }
}
```

## Fields

| Field              | Meaning                                                       |
| ------------------ | ------------------------------------------------------------- |
| `$schema`          | Editor schema path.                                           |
| `schema_version`   | Must be `eval-kit.config.v1`.                                 |
| `suite_id`         | Stable ID for the consumer suite.                             |
| `suite_root`       | Root for suite-local files, resolved from config directory.   |
| `results_root`     | Directory for result bundles, resolved from config directory. |
| `adapter`          | Consumer adapter module path, resolved from `suite_root`.     |
| `cases.root`       | Case directory root, resolved from `suite_root`.              |
| `cases.include`    | Immediate case-directory include globs.                       |
| `cases.exclude`    | Immediate case-directory exclude globs.                       |
| `methods`          | Enabled commands and method-specific settings.                |
| `prompt_templates` | Optional overrides for bundled Promptfoo prompts.             |

## Method categories

Method settings do not decide CI policy by themselves. Consumers should map commands into these
lanes:

- `doctor`, `list-cases`, `validate-fixtures`, adapter import/syntax checks, static schema/docs
  validation, and local grader/helper unit tests are suitable for `pnpm check` when they stay fast
  and offline.
- `run-case` is deterministic local on-demand evidence for semantic case portfolios. Run it before
  significant changes, but do not make long run-producing portfolios a default CI gate.
- `generate`, `judge_coverage`, and `judge_pairwise` are manual/advisory model-assisted methods.
  They require explicit local setup, must be explicitly enabled in the selected config, and must not
  require auth, network, Promptfoo provider calls, Codex/OpenAI calls, LLM judging, or manual
  calibration in `pnpm check`.
- Run-producing commands fail closed before Codex auth checks, Promptfoo execution, model provider
  calls, adapter hooks, or result artifact writes when disabled. Model-assisted commands also fail
  closed unless their method's `enabled` flag is explicitly `true`.

## Path rules

- Config path is resolved from the current working directory.
- `suite_root`, `results_root`, and adapter paths resolve from the config directory or suite root as documented by the loader.
- Case artifact paths are relative to the case manifest directory.
- Suite and result paths must stay contained by the detected repository root.
- Run IDs and case IDs are IDs, not paths.
