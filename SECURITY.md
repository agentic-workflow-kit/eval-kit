# Security policy

## Supported versions

`eval-kit` is currently pre-1.0 and consumed by Git tag. The supported version is the latest released tag unless a consumer repo pins an older tag deliberately.

| Version    | Supported   |
| ---------- | ----------- |
| latest tag | yes         |
| older tags | best effort |

## Reporting a vulnerability

Open a private report through GitHub security advisories if enabled on the repository. If that is not available, contact the maintainers through the organization’s normal private channel.

Do not open public issues for secrets, token exposure, path traversal, command injection, or private-data leakage.

## Security-sensitive areas

`eval-kit` should be conservative around:

- path containment;
- run IDs and case IDs;
- writing generated files;
- reading consumer artifacts;
- Promptfoo command execution;
- report artifact redaction;
- local auth checks;
- avoiding committed secrets or private data in fixtures.

## Redaction posture

Result bundles may include candidate text, grader output, model outputs, prompt variables, and source material. Consumer repos must decide what is safe to commit. By default, treat `evals/results/` as local generated output unless the consumer explicitly commits curated summaries.

## Dependency intake

Follow the org pnpm baseline:

- use the pinned package manager;
- keep the lockfile committed;
- review build-script dependencies before allowing them;
- do not commit registry tokens or credential placeholders.
