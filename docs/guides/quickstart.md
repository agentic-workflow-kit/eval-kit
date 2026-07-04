# Quickstart

This guide adds a generic deterministic eval suite to a consumer repo.

## 1. Add dependency

```json
{
  "devDependencies": {
    "@agentic-workflow-kit/eval-kit": "github:agentic-workflow-kit/eval-kit#v0.1.7"
  }
}
```

Run:

```bash
pnpm install
```

## 2. Bootstrap files

```bash
pnpm exec eval-kit init --suite generic --dry-run
pnpm exec eval-kit init --suite generic
```

## 3. Validate setup

```bash
pnpm exec eval-kit doctor
```

## 4. Create a case

```bash
pnpm exec eval-kit scaffold-case --case case-example-v1
pnpm exec eval-kit list-cases
pnpm exec eval-kit doctor
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
pnpm exec eval-kit run-case \
  --case case-example-v1 \
  --candidate path/to/candidate.md \
  --run-id verify-example
```

Results are written under the configured results root.

Deterministic case runs are local on-demand evidence. Consumers should run the documented semantic
case portfolio before significant changes, but run-producing evals are not default CI gates.

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

Package scripts may call the local binary as `eval-kit`. Interactive shell examples use
`pnpm exec eval-kit` so consumers run the pinned dependency from their repo.
