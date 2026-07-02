import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { afterEach, describe, expect, it } from "vitest";

import {
  discoverCaseIds,
  loadConfig,
  resolveCaseManifest,
  runCase,
  validateFixtures,
} from "@agentic-workflow-kit/eval-kit";

const __filename = fileURLToPath(import.meta.url);
const packageRoot = path.resolve(path.dirname(__filename), "..");
const fixtureRoot = path.join(packageRoot, "tests", "fixtures", "fake-suite");
const configPath = path.join(fixtureRoot, "eval-kit.config.json");
const runId = "unit-deterministic-run";

const removeRun = (config) => {
  fs.rmSync(config.pathResolver.resolveRunDir(runId), {
    recursive: true,
    force: true,
  });
};

describe("fake consumer suite", () => {
  afterEach(() => {
    removeRun(loadConfig(configPath));
  });

  it("loads config, imports the adapter, and discovers case manifests", async () => {
    const config = loadConfig(configPath);
    const adapter = await config.loadModule(config.raw.adapter, "adapter");

    expect(config.raw).toMatchObject({
      schema_version: "eval-kit.config.v1",
      suite_id: "fake-suite",
      suite_root: ".",
      results_root: "results",
      adapter: "adapter.mjs",
      cases: {
        root: "cases",
        include: ["case-*"],
      },
    });
    expect(typeof adapter.gradeCandidate).toBe("function");
    expect(discoverCaseIds(config)).toEqual(["case-alpha"]);
  });

  it("resolves case manifests and contained artifacts", () => {
    const config = loadConfig(configPath);
    const resolved = resolveCaseManifest(config, "case-alpha");

    expect(resolved.caseId).toBe("case-alpha");
    expect(resolved.manifest.schema_version).toBe("fake-suite.case.v1");
    expect(resolved.artifacts.map((artifact) => artifact.path)).toEqual([
      "input.md",
      "expected-items.json",
    ]);
    expect(resolved.artifacts.every((artifact) => artifact.absolutePath)).toBe(
      true,
    );
  });

  it("runs deterministic grading and writes a result bundle", async () => {
    const config = loadConfig(configPath);
    removeRun(config);

    const result = await runCase({
      config,
      caseId: "case-alpha",
      candidatePath: "tests/fixtures/fake-suite/cases/case-alpha/candidate.md",
      runId,
    });

    expect(result.verdict).toBe("green");

    const manifestPath = path.join(result.resultDir, "manifest.json");
    const gradesPath = path.join(result.resultDir, "grades.json");
    const reportPath = path.join(result.resultDir, "report.md");

    expect(fs.existsSync(manifestPath)).toBe(true);
    expect(fs.existsSync(gradesPath)).toBe(true);
    expect(fs.readFileSync(reportPath, "utf8")).toContain("Verdict: green");

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    expect(manifest.schema_version).toBe("eval-kit.result-manifest.v2");
    expect(manifest.case_ids).toEqual(["case-alpha"]);
    expect(manifest.output_files).toEqual([
      "manifest.json",
      "grades.json",
      "report.md",
      "cases/case-alpha/candidate.md",
      "cases/case-alpha/grader-output.json",
    ]);
  });

  it("runs the adapter-backed fixture validation hook", async () => {
    const config = loadConfig(configPath);

    await expect(validateFixtures({ config })).resolves.toBeUndefined();
  });
});
