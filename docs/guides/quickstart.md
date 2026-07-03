# Quickstart

This guide adds a generic deterministic eval suite to a consumer repo.

## 1. Add dependency

```json
{
  "devDependencies": {
    "@agentic-workflow-kit/eval-kit": "github:agentic-workflow-kit/eval-kit#v0.1.1"
  }
}
```

Run:

```bash
pnpm install
```

## 2. Bootstrap files

```bash
eval-kit init --suite generic --dry-run
eval-kit init --suite generic
```

## 3. Validate setup

```bash
eval-kit doctor
```

## 4. Create a case

```bash
eval-kit scaffold-case --case case-example-v1
eval-kit list-cases
eval-kit doctor
```

## 5. Replace placeholders

Edit:

```text
evals/cases/case-example-v1/input.md
evals/cases/case-example-v1/expected-items.json
evals/cases/case-example-v1/rubric.md
evals/adapter.mjs
```

The generated adapter checks for exact required text. That is a starter, not a philosophy.

## 6. Run deterministic eval

Create or choose a candidate file, then run:

```bash
eval-kit run-case \
  --case case-example-v1 \
  --candidate path/to/candidate.md \
  --run-id verify-example
```

Results are written under the configured results root.

## 7. Add scripts

Recommended scripts:

```json
{
  "scripts": {
    "eval:doctor": "eval-kit doctor --config evals/eval-kit.config.json",
    "eval:list": "eval-kit list-cases --config evals/eval-kit.config.json",
    "eval:case": "eval-kit run-case --config evals/eval-kit.config.json"
  }
}
```
