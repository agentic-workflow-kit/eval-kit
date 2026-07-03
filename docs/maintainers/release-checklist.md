# Maintainer release checklist

Use this when cutting a new eval-kit tag.

## Before release PR

```text
- [ ] All intended changes are merged to main or included in the release branch.
- [ ] Version type chosen: patch/minor.
- [ ] Breaking/compatibility-sensitive changes identified.
- [ ] Consumer impact known.
```

## Release PR

```text
- [ ] package.json version updated.
- [ ] CHANGELOG.md updated.
- [ ] Docs with version references updated.
- [ ] Migration notes added when needed.
- [ ] pnpm install --frozen-lockfile passes.
- [ ] pnpm check passes.
- [ ] PR merged.
```

## Tag

```bash
git checkout main
git pull --ff-only
git tag -a vX.Y.Z -m "vX.Y.Z"
git push origin vX.Y.Z
git rev-parse vX.Y.Z^{}
```

Record the dereferenced commit.

## Consumer follow-up

```text
- [ ] technical-design bump PR opened if needed.
- [ ] other consumer bump PRs opened if needed.
- [ ] consumer lockfiles updated.
- [ ] consumer checks pass.
- [ ] consumer smoke commands pass.
```
