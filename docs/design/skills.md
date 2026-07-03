# Skills design

Eval-kit skills guide agents through the CLI and repository boundary rules.

## Skills

```text
skills/bootstrap-eval-suite
skills/author-eval-case
skills/review-eval-suite
skills/run-eval-suite
```

## Skill rule

Skills do not replace executable commands. They should tell the agent what to inspect, what command to run, what evidence to report, and which boundary not to cross.

## bootstrap-eval-suite

Use when adding eval-kit to a consumer repo.

Must guide:

- read repo instructions;
- add dependency;
- run `pnpm exec eval-kit init --suite generic --dry-run`;
- inspect planned files;
- run `pnpm exec eval-kit init --suite generic`;
- run `pnpm exec eval-kit doctor`;
- report remaining consumer decisions.

Must not:

- add technical-design semantics;
- install Promptfoo by default;
- add eval-kit to repo-template.

## author-eval-case

Use when creating a new eval case.

Must guide:

- define case purpose;
- define what the case must not test;
- choose deterministic versus model-assisted checks;
- keep expected items source-visible;
- avoid hidden answer keys.

## review-eval-suite

Use when reviewing eval quality.

Must detect:

- hidden requirements in reference outputs;
- vague rubrics;
- model judges used as hard gates without calibration;
- run-producing semantic portfolios treated as default CI gates;
- cases too large to debug;
- consumer semantics leaking into eval-kit.

## run-eval-suite

Use when executing evals.

Must report:

- commands run;
- result bundle path;
- deterministic verdict;
- blocker findings;
- model-assisted results separately from deterministic gates.
