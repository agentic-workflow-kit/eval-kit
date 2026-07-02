import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

const packageRoot = path.resolve(import.meta.dirname, "..");
const cliPath = path.join(packageRoot, "bin", "eval-kit.mjs");
const tempRoots = [];

const makeConsumer = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "eval-kit-consumer-"));
  fs.mkdirSync(path.join(root, ".git"));
  tempRoots.push(root);
  return root;
};

const runCli = (cwd, args) =>
  spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));

describe("bootstrap CLI", () => {
  afterEach(() => {
    for (const root of tempRoots.splice(0)) {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  it("dry-runs generic init without writing files", () => {
    const root = makeConsumer();
    const result = runCli(root, ["init", "--suite", "generic", "--dry-run"]);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Would write evals/eval-kit.config.json");
    expect(fs.existsSync(path.join(root, "evals"))).toBe(false);
  });

  it("writes a generic skeleton compatible with doctor and list-cases", () => {
    const root = makeConsumer();
    const init = runCli(root, ["init", "--suite", "generic"]);

    expect(init.status).toBe(0);
    expect(
      readJson(path.join(root, "evals", "eval-kit.config.json")),
    ).toMatchObject({
      schema_version: "eval-kit.config.v1",
      suite_id: "generic",
      suite_root: ".",
      results_root: "results",
      adapter: "adapter.mjs",
      cases: {
        root: "cases",
      },
    });

    const doctor = runCli(root, ["doctor"]);
    expect(doctor.status).toBe(0);
    expect(doctor.stdout).toContain("Doctor passed");

    const list = runCli(root, ["list-cases"]);
    expect(list.status).toBe(0);
    expect(list.stdout).toContain("No cases found.");
  });

  it("refuses to overwrite init files unless forced", () => {
    const root = makeConsumer();
    expect(runCli(root, ["init", "--suite", "generic"]).status).toBe(0);

    const refused = runCli(root, ["init", "--suite", "generic"]);
    expect(refused.status).toBe(1);
    expect(refused.stderr).toContain("refusing to overwrite");

    const forced = runCli(root, ["init", "--suite", "generic", "--force"]);
    expect(forced.status).toBe(0);
  });

  it("scaffolds a discoverable generic case and refuses duplicate writes", () => {
    const root = makeConsumer();
    expect(runCli(root, ["init", "--suite", "generic"]).status).toBe(0);

    const scaffold = runCli(root, [
      "scaffold-case",
      "--case",
      "case-example-v1",
    ]);
    expect(scaffold.status).toBe(0);

    const manifest = readJson(
      path.join(
        root,
        "evals",
        "cases",
        "case-example-v1",
        "case-manifest.json",
      ),
    );
    expect(manifest).toMatchObject({
      schema_version: "eval-kit.case.v1",
      case_id: "case-example-v1",
      case_type: "generic-deterministic",
    });

    const list = runCli(root, ["list-cases"]);
    expect(list.status).toBe(0);
    expect(list.stdout).toContain("case-example-v1");

    const doctor = runCli(root, ["doctor"]);
    expect(doctor.status).toBe(0);

    const duplicate = runCli(root, [
      "scaffold-case",
      "--case",
      "case-example-v1",
    ]);
    expect(duplicate.status).toBe(1);
    expect(duplicate.stderr).toContain("refusing to overwrite");
  });

  it("validates artifact paths from each discovered manifest path", () => {
    const root = makeConsumer();
    expect(runCli(root, ["init", "--suite", "generic"]).status).toBe(0);
    expect(runCli(root, ["scaffold-case", "--case", "case-alpha"]).status).toBe(
      0,
    );
    expect(runCli(root, ["scaffold-case", "--case", "case-beta"]).status).toBe(
      0,
    );

    const betaManifestPath = path.join(
      root,
      "evals",
      "cases",
      "case-beta",
      "case-manifest.json",
    );
    const betaManifest = readJson(betaManifestPath);
    fs.writeFileSync(
      betaManifestPath,
      `${JSON.stringify(
        {
          ...betaManifest,
          case_id: "case-alpha",
          artifacts: [
            {
              role: "grader_input",
              path: "missing-expected-items.json",
            },
          ],
        },
        null,
        2,
      )}\n`,
    );

    const doctor = runCli(root, ["doctor"]);
    expect(doctor.status).toBe(1);
    expect(doctor.stderr).toContain("missing-expected-items.json");
  });

  it("fails doctor on duplicate case ids", () => {
    const root = makeConsumer();
    expect(runCli(root, ["init", "--suite", "generic"]).status).toBe(0);
    expect(runCli(root, ["scaffold-case", "--case", "case-alpha"]).status).toBe(
      0,
    );
    expect(runCli(root, ["scaffold-case", "--case", "case-beta"]).status).toBe(
      0,
    );

    const betaManifestPath = path.join(
      root,
      "evals",
      "cases",
      "case-beta",
      "case-manifest.json",
    );
    const betaManifest = readJson(betaManifestPath);
    fs.writeFileSync(
      betaManifestPath,
      `${JSON.stringify(
        {
          ...betaManifest,
          case_id: "case-alpha",
        },
        null,
        2,
      )}\n`,
    );

    const doctor = runCli(root, ["doctor"]);
    expect(doctor.status).toBe(1);
    expect(doctor.stderr).toContain("duplicate case id");
  });

  it("rejects path-shaped case ids", () => {
    const root = makeConsumer();
    expect(runCli(root, ["init", "--suite", "generic"]).status).toBe(0);

    const result = runCli(root, [
      "scaffold-case",
      "--case",
      "../case-example-v1",
    ]);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("case id must be an id");
  });
});
