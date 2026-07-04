# Release process

Eval-kit currently releases through Git tags, not npm.

Consumers depend on tags like:

```json
{
  "@agentic-workflow-kit/eval-kit": "github:agentic-workflow-kit/eval-kit#v0.1.0"
}
```

## Release checklist

```text
- [ ] Decide version: patch or minor.
- [ ] Update package.json version.
- [ ] Update CHANGELOG.md.
- [ ] Update docs that mention the current version/tag.
- [ ] Add migration notes for breaking or compatibility-sensitive changes.
- [ ] Run pnpm install if lockfile changes are needed.
- [ ] Run pnpm install --frozen-lockfile.
- [ ] Run pnpm check.
- [ ] Open and merge a release PR.
- [ ] Create an annotated tag on the merge commit.
- [ ] Push the tag.
- [ ] Verify the tag dereferences to the intended commit.
- [ ] Optionally create a GitHub Release with notes.
- [ ] Open consumer bump PRs.
```

## Release PR

Title:

```text
chore(release): v0.1.4
```

Required changes:

```text
package.json
CHANGELOG.md
docs/reference/release-process.md if process changed
other docs with version references if needed
```

Verification:

```bash
pnpm install --frozen-lockfile
pnpm check
git diff --check
```

## Tagging

After release PR merges:

```bash
git checkout main
git pull --ff-only
git rev-parse HEAD

git tag -a v0.1.4 -m "v0.1.4"
git push origin v0.1.4
```

Verify:

```bash
git rev-parse v0.1.4^{}
git show --no-patch --decorate v0.1.4
```

`v0.1.4^{}` must point to the release commit. With an annotated tag, `git rev-parse v0.1.4`
returns the tag object; `^{}` dereferences to the commit.

## GitHub Release

Recommended but optional while private:

1. Create a GitHub Release for the tag.
2. Copy the relevant `CHANGELOG.md` section.
3. Include migration notes and consumer bump instructions.

## Consumer bump PRs

For each consumer repo:

1. Update dependency spec:

```json
{
  "@agentic-workflow-kit/eval-kit": "github:agentic-workflow-kit/eval-kit#v0.1.4"
}
```

2. Run:

```bash
pnpm install
pnpm install --frozen-lockfile
pnpm check
```

3. Run consumer smoke commands, for example in `technical-design`:

```bash
pnpm eval:case -- --case case-tiny-laundry-pickup-v1 --candidate evals/cases/case-tiny-laundry-pickup-v1/reference-design.md --run-id verify-eval-kit-v0.1.4
```

4. Open a PR with dependency, lockfile, and any compatibility fixes.

## When a tag is bad

Do not move the tag.

Create a new patch release:

```text
v0.1.4 -> v0.1.5
```

Then open consumer bump PRs.

## What else releases should include

Besides version and tag, do not forget:

- changelog entry;
- migration notes;
- docs update for changed CLI/config/adapter behavior;
- GitHub Release notes if using releases;
- consumer bump PRs;
- lockfile updates in consumers;
- tag verification;
- no npm publish unless a later decision changes release mode.
