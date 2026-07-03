# Versioning policy

Eval-kit is pre-1.0 and private-tag consumed.

## Version format

Use SemVer-style versions:

```text
0.1.0
0.1.1
0.2.0
```

## Patch version

Use patch for:

- documentation fixes;
- bug fixes;
- test improvements;
- compatible CLI behavior;
- compatible adapter-contract clarifications;
- consumer compatibility fixes.

Example:

```text
0.1.0 -> 0.1.1
```

## Minor version

Use minor for:

- new commands;
- new schema versions;
- new optional adapter hooks;
- changed bootstrap file layout;
- breaking changes while pre-1.0.

Example:

```text
0.1.1 -> 0.2.0
```

## Major version

Do not use `1.0.0` until:

- at least two consumer repos have adopted eval-kit;
- release process is stable;
- adapter/config/result schemas have migration notes;
- maintainers are comfortable supporting compatibility.

## Compatibility surfaces

Treat these as versioned:

- CLI commands and flags;
- config schema;
- case manifest schema;
- result manifest schema;
- adapter exports and hook input/output shapes;
- bundled prompt variable names;
- generated bootstrap files.

## Tag immutability

Never move a published tag. If a tag is wrong, create a new patch version.
