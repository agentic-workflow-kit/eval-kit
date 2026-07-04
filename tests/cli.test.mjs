import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { afterEach, describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const packageRoot = path.resolve(path.dirname(__filename), "..");
const configPath = path.join(
  packageRoot,
  "tests",
  "fixtures",
  "fake-suite",
  "eval-kit.config.json",
);
const cliPath = path.resolve(packageRoot, "bin/eval-kit.mjs");
const tempDirs = [];

const writeConfigWithDisabledMethod = (methodKey) => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "eval-kit-cli-"));
  tempDirs.push(tempDir);

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  config.methods = {
    ...config.methods,
    [methodKey]: {
      ...(config.methods?.[methodKey] ?? {}),
      enabled: false,
    },
  };

  const tempConfigPath = path.join(tempDir, "eval-kit.config.json");
  fs.writeFileSync(tempConfigPath, `${JSON.stringify(config, null, 2)}\n`);
  return tempConfigPath;
};

const writeConfigOmittingMethod = (methodKey) => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "eval-kit-cli-"));
  tempDirs.push(tempDir);

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  delete config.methods[methodKey];

  const tempConfigPath = path.join(tempDir, "eval-kit.config.json");
  fs.writeFileSync(tempConfigPath, `${JSON.stringify(config, null, 2)}\n`);
  return tempConfigPath;
};

const writeConfigWithMethodWithoutEnabled = (methodKey) => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "eval-kit-cli-"));
  tempDirs.push(tempDir);

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  config.methods = {
    ...config.methods,
    [methodKey]: {},
  };

  const tempConfigPath = path.join(tempDir, "eval-kit.config.json");
  fs.writeFileSync(tempConfigPath, `${JSON.stringify(config, null, 2)}\n`);
  return tempConfigPath;
};

const runCli = (args) =>
  spawnSync(process.execPath, [cliPath, ...args], {
    cwd: packageRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

describe("eval-kit CLI", () => {
  afterEach(() => {
    for (const tempDir of tempDirs.splice(0)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("fails closed when pairwise judging is disabled by config", () => {
    const result = runCli(["judge-pairwise", "--config", configPath]);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("judge-pairwise is disabled");
  });

  it.each([
    ["run-case", "deterministic"],
    ["generate", "generate"],
    ["judge-coverage", "judge_coverage"],
    ["report", "report"],
  ])(
    "fails closed when %s is disabled before requiring run arguments",
    (commandName, methodKey) => {
      const disabledConfigPath = writeConfigWithDisabledMethod(methodKey);

      const result = runCli([commandName, "--config", disabledConfigPath]);

      expect(result.status).toBe(1);
      expect(result.stderr).toContain(`${commandName} is disabled`);
      expect(result.stderr).toContain(`methods.${methodKey}.enabled=false`);
      expect(result.stderr).not.toContain("missing required argument");
    },
  );

  it.each([
    ["generate", "generate"],
    ["judge-coverage", "judge_coverage"],
    ["judge-pairwise", "judge_pairwise"],
  ])(
    "fails closed when %s method config is omitted",
    (commandName, methodKey) => {
      const omittedConfigPath =
        methodKey in JSON.parse(fs.readFileSync(configPath, "utf8")).methods
          ? writeConfigOmittingMethod(methodKey)
          : configPath;

      const result = runCli([commandName, "--config", omittedConfigPath]);

      expect(result.status).toBe(1);
      expect(result.stderr).toContain(
        `${commandName} requires methods.${methodKey}.enabled=true`,
      );
      expect(result.stderr).not.toContain("missing required argument");
    },
  );

  it.each([
    ["generate", "generate"],
    ["judge-coverage", "judge_coverage"],
    ["judge-pairwise", "judge_pairwise"],
  ])(
    "fails closed when %s method config omits enabled",
    (commandName, methodKey) => {
      const missingEnabledConfigPath =
        writeConfigWithMethodWithoutEnabled(methodKey);

      const result = runCli([
        commandName,
        "--config",
        missingEnabledConfigPath,
      ]);

      expect(result.status).toBe(1);
      expect(result.stderr).toContain(
        `${commandName} requires methods.${methodKey}.enabled=true`,
      );
      expect(result.stderr).not.toContain("missing required argument");
    },
  );
});
