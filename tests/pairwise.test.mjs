import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { afterEach, describe, expect, it } from "vitest";

import { judgePairwise, loadConfig } from "@agentic-workflow-kit/eval-kit";

const __filename = fileURLToPath(import.meta.url);
const packageRoot = path.resolve(path.dirname(__filename), "..");

const writeFile = (filePath, content, mode) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, mode ? { mode } : undefined);
};

const writeJson = (filePath, value) => {
  writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
};

const createPairwiseSuite = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "eval-kit-pairwise-"));
  fs.mkdirSync(path.join(root, ".git"));
  fs.mkdirSync(path.join(root, "node_modules/.bin"), { recursive: true });

  writeFile(path.join(root, "a.md"), "original candidate A\n");
  writeFile(path.join(root, "b.md"), "original candidate B\n");
  writeFile(
    path.join(root, "pairwise.prompt.md"),
    [
      "# Pairwise Prompt",
      "",
      "Prompt version: `pairwise-test-prompt-v1`.",
      "",
      "Rubric version: `pairwise-test-rubric-v1`.",
      "",
      "{{candidate_a}}",
      "{{candidate_b}}",
    ].join("\n"),
  );
  writeJson(path.join(root, "eval-kit.config.json"), {
    schema_version: "eval-kit.config.v1",
    suite_id: "pairwise-suite",
    suite_root: ".",
    results_root: "results",
    adapter: "adapter.mjs",
    cases: {
      root: "cases",
      include: ["case-*"],
    },
    prompt_templates: {
      pairwise_judge: "pairwise.prompt.md",
    },
    methods: {
      judge_pairwise: {
        enabled: true,
      },
    },
  });
  writeFile(
    path.join(root, "adapter.mjs"),
    `
export const resolvePairwiseVars = async ({
  caseId,
  candidateAContent,
  candidateBContent,
  candidateAPath,
  candidateBPath,
  promptVersion,
  rubricVersion,
  model,
  provider,
  randomizedOrder,
  resolver,
}) => ({
  case_id: caseId,
  model,
  provider,
  prompt_version: promptVersion,
  rubric_version: rubricVersion,
  source_material: "source",
  case_rubric: "rubric",
  expected_items: "items",
  candidate_a: candidateAContent,
  candidate_b: candidateBContent,
  candidate_a_path: resolver.relativeToRepo(candidateAPath),
  candidate_b_path: resolver.relativeToRepo(candidateBPath),
  randomization_method: randomizedOrder.method,
  randomization_seed: randomizedOrder.seed,
  original_order: randomizedOrder.original_order.join(", "),
  candidate_order: randomizedOrder.candidate_order.join(", "),
});
`,
  );
  writeJson(path.join(root, "cases/case-pair/case-manifest.json"), {
    schema_version: "pairwise-suite.case.v1",
    case_id: "case-pair",
    artifacts: [{ role: "input", path: "input.md" }],
  });
  writeFile(path.join(root, "cases/case-pair/input.md"), "input\n");
  writeFile(
    path.join(root, "node_modules/.bin/promptfoo"),
    `#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const configPath = process.argv[process.argv.indexOf("-c") + 1];
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
if (config.prompts[0].endsWith(".md")) {
  console.error("prompt path was passed instead of prompt text");
  process.exit(2);
}
const vars = config.tests[0].vars;
const output = {
  case_id: vars.case_id,
  model: vars.model,
  provider: vars.provider,
  rubric_version: vars.rubric_version,
  prompt_version: vars.prompt_version,
  candidate_order: ["candidate_b", "candidate_a"],
  randomization: {
    method: vars.randomization_method,
    seed: vars.randomization_seed,
    original_order: ["candidate_a", "candidate_b"],
    candidate_order: ["candidate_b", "candidate_a"]
  },
  winner: "candidate_a",
  criteria: ["Coverage"],
  evidence: [vars.candidate_a],
  explanation: "Displayed candidate A wins.",
  confidence: "high"
};
fs.writeFileSync(config.outputPath[0], JSON.stringify({ results: [{ response: { output: JSON.stringify(output) } }] }, null, 2));
fs.writeFileSync(config.outputPath[1], "<html></html>\\n");
`,
    0o755,
  );
  writeFile(
    path.join(root, "fake-bin/codex"),
    "#!/usr/bin/env sh\necho 'chatgpt logged in'\n",
    0o755,
  );

  return root;
};

describe("pairwise judge runner", () => {
  let tempRoot;
  let originalPath;

  afterEach(() => {
    if (originalPath) process.env.PATH = originalPath;
    if (tempRoot) fs.rmSync(tempRoot, { recursive: true, force: true });
  });

  it("loads prompt text and maps randomized display winners back to original keys", async () => {
    tempRoot = createPairwiseSuite();
    originalPath = process.env.PATH;
    process.env.PATH = `${path.join(tempRoot, "fake-bin")}${path.delimiter}${originalPath}`;

    const config = loadConfig(path.join(tempRoot, "eval-kit.config.json"));
    const result = await judgePairwise({
      config,
      caseId: "case-pair",
      candidateAPath: "a.md",
      candidateBPath: "b.md",
      model: "gpt-5.4",
      provider: "openai",
      effort: "medium",
      seed: 0,
      runId: "pairwise-run",
    });

    const promptfooConfig = JSON.parse(
      fs.readFileSync(
        path.join(result.resultDir, "promptfooconfig.json"),
        "utf8",
      ),
    );
    const pairwiseResult = JSON.parse(
      fs.readFileSync(
        path.join(result.resultDir, "pairwise-result.json"),
        "utf8",
      ),
    );

    expect(promptfooConfig.prompts[0]).toContain("# Pairwise Prompt");
    expect(promptfooConfig.tests[0].vars.candidate_a).toContain(
      "original candidate B",
    );
    expect(promptfooConfig.tests[0].vars.candidate_b).toContain(
      "original candidate A",
    );
    expect(pairwiseResult.randomization.candidate_order).toEqual([
      "candidate_b",
      "candidate_a",
    ]);
    expect(pairwiseResult.winner).toBe("candidate_b");
  });
});
