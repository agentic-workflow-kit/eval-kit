import fs from "node:fs";
import path from "node:path";

import { loadConfig } from "./config.mjs";
import { assertSafeId, toPosixPath } from "./paths.mjs";
import {
  configuredCaseManifestPaths,
  discoverCaseIds,
  resolveCaseManifest,
  validateFixtures,
} from "./sdk.mjs";

export const DEFAULT_CONFIG_PATH = "evals/eval-kit.config.json";

const jsonText = (value) => `${JSON.stringify(value, null, 2)}\n`;

const genericConfig = {
  $schema:
    "../node_modules/@agentic-workflow-kit/eval-kit/schemas/eval-kit.config.schema.json",
  schema_version: "eval-kit.config.v1",
  suite_id: "generic",
  suite_root: ".",
  results_root: "results",
  adapter: "adapter.mjs",
  cases: {
    root: "cases",
    include: ["*"],
  },
  methods: {
    deterministic: {
      enabled: true,
      grader: "generic-keyword",
      reporter: "generic-markdown",
    },
    generate: {
      enabled: false,
    },
    judge_coverage: {
      enabled: false,
    },
    judge_pairwise: {
      enabled: false,
    },
    report: {
      enabled: true,
    },
  },
};

const genericAdapter = `export const gradeCandidate = ({ candidateText, expectedItems }) => {
  const items = expectedItems.items ?? [];
  const findings = items.map((item) => {
    const requiredText = item.required_text ?? "";
    const covered = requiredText.length > 0 && candidateText.includes(requiredText);
    return {
      id: item.id,
      kind: item.kind ?? "generic",
      severity: item.severity ?? "medium",
      verdict: covered ? "covered" : "missing",
      evidence: covered
        ? \`found \${requiredText}\`
        : \`missing \${requiredText || item.id}\`,
    };
  });

  return {
    findings,
    verdict: findings.every((finding) => finding.verdict === "covered")
      ? "green"
      : "red",
  };
};

export const renderDeterministicReport = ({ caseId, grades, findings }) =>
  [
    \`# Eval Report: \${caseId}\`,
    "",
    \`Verdict: \${grades.verdict}\`,
    "",
    ...findings.map(
      (finding) =>
        \`- \${finding.id} (\${finding.kind}, \${finding.severity}): \${finding.verdict} - \${finding.evidence}\`,
    ),
  ].join("\\n");

export const validateFixtures = async ({ manifests }) => {
  for (const item of manifests) {
    const hasGraderInput = item.manifest.artifacts.some(
      (artifact) => artifact.role === "grader_input",
    );
    if (!hasGraderInput) {
      throw new Error(\`\${item.relativePath} is missing a grader_input artifact\`);
    }
  }
};
`;

const initFilesForSuite = (suite) => {
  if (suite !== "generic") {
    throw new Error(`unsupported suite ${suite}; supported suites: generic`);
  }
  return [
    {
      relativePath: DEFAULT_CONFIG_PATH,
      content: jsonText(genericConfig),
    },
    {
      relativePath: "evals/adapter.mjs",
      content: genericAdapter,
    },
    {
      relativePath: "evals/cases/README.md",
      content: [
        "# Eval Cases",
        "",
        "Each case directory owns consumer-specific inputs, expected fixture data, rubrics, and a `case-manifest.json`.",
        "Use `eval-kit scaffold-case --case <id>` to create a generic deterministic case skeleton.",
        "",
      ].join("\n"),
    },
    {
      relativePath: "evals/results/README.md",
      content: [
        "# Eval Results",
        "",
        "Generated evaluation result bundles are written here. Keep durable summaries, but do not commit bulky transient outputs unless your repo policy requires them.",
        "",
      ].join("\n"),
    },
  ];
};

const writeFiles = ({ repoRoot, files, dryRun, force }) => {
  const existing = files.filter((file) =>
    fs.existsSync(path.join(repoRoot, file.relativePath)),
  );
  if (existing.length > 0 && !force) {
    const list = existing.map((file) => file.relativePath).join(", ");
    throw new Error(`refusing to overwrite existing files: ${list}`);
  }

  for (const file of files) {
    const target = path.join(repoRoot, file.relativePath);
    if (dryRun) {
      console.log(`Would write ${file.relativePath}`);
      continue;
    }
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, file.content);
    console.log(
      `${existing.includes(file) ? "Overwrote" : "Wrote"} ${file.relativePath}`,
    );
  }
};

export const initSuite = ({
  cwd = process.cwd(),
  suite,
  dryRun = false,
  force = false,
}) => {
  const files = initFilesForSuite(suite);
  writeFiles({ repoRoot: cwd, files, dryRun, force });
  if (!dryRun) {
    console.log("Run `eval-kit doctor` to validate the generated suite.");
  }
};

const genericCaseFiles = (caseId, caseRelativeDir) => [
  {
    relativePath: path.join(caseRelativeDir, "case-manifest.json"),
    content: jsonText({
      schema_version: "eval-kit.case.v1",
      case_id: caseId,
      case_type: "generic-deterministic",
      artifacts: [
        {
          role: "generation_visible",
          path: "input.md",
        },
        {
          role: "grader_input",
          path: "expected-items.json",
        },
        {
          role: "rubric",
          path: "rubric.md",
        },
      ],
      metadata: {
        purpose: "Generic deterministic eval case",
      },
    }),
  },
  {
    relativePath: path.join(caseRelativeDir, "input.md"),
    content: [
      "# Case Input",
      "",
      "Describe the task, source material, or expected output context for this case.",
      "",
    ].join("\n"),
  },
  {
    relativePath: path.join(caseRelativeDir, "expected-items.json"),
    content: jsonText({
      items: [
        {
          id: "expected-item-1",
          kind: "generic",
          severity: "medium",
          required_text: "replace this required text",
        },
      ],
    }),
  },
  {
    relativePath: path.join(caseRelativeDir, "rubric.md"),
    content: [
      "# Rubric",
      "",
      "Document consumer-owned grading expectations for this case.",
      "",
    ].join("\n"),
  },
];

export const scaffoldCase = async ({
  configPath = DEFAULT_CONFIG_PATH,
  caseId,
  dryRun = false,
  force = false,
}) => {
  const safeCaseId = assertSafeId(caseId, "case id");
  const config = loadConfig(configPath);
  const casesRoot = config.raw.cases?.root;
  if (!casesRoot) {
    throw new Error("config must define cases.root to scaffold cases");
  }
  const casesRootAbsolute = config.pathResolver.resolveSuitePath(
    casesRoot,
    "cases.root",
  );
  const caseDir = path.join(casesRootAbsolute, safeCaseId);
  const caseRelativeDir = config.pathResolver.relativeToRepo(caseDir);
  const files = genericCaseFiles(safeCaseId, caseRelativeDir);
  writeFiles({
    repoRoot: config.pathResolver.repoRoot,
    files,
    dryRun,
    force,
  });
};

const writeProbe = (directory) => {
  fs.mkdirSync(directory, { recursive: true });
  const probePath = path.join(directory, ".eval-kit-doctor-write-test");
  fs.writeFileSync(probePath, "ok\n");
  fs.rmSync(probePath, { force: true });
};

const promptfooEnabled = (config) =>
  ["generate", "judge_coverage", "judge_pairwise"].some(
    (method) => config.raw.methods?.[method]?.enabled === true,
  );

export const runDoctor = async ({ configPath = DEFAULT_CONFIG_PATH }) => {
  const config = loadConfig(configPath);
  const checks = [];
  const pass = (message) => {
    checks.push(message);
    console.log(`ok - ${message}`);
  };

  pass(`config loaded: ${toPosixPath(configPath)}`);

  if (!fs.existsSync(config.pathResolver.suiteRoot)) {
    throw new Error(
      `suite root does not exist: ${config.pathResolver.suiteRoot}`,
    );
  }
  pass(
    `suite root exists: ${config.pathResolver.relativeToRepo(config.pathResolver.suiteRoot)}`,
  );

  writeProbe(config.pathResolver.resultsRoot);
  pass(
    `results root writable: ${config.pathResolver.relativeToRepo(config.pathResolver.resultsRoot)}`,
  );

  if (config.raw.adapter ?? config.raw.hooks?.module) {
    await config.loadModule(
      config.raw.adapter ?? config.raw.hooks.module,
      "adapter",
    );
    pass("adapter imports");
  }

  const manifestPaths = configuredCaseManifestPaths(config);
  for (const manifestPath of manifestPaths) {
    const manifest = resolveCaseManifest(
      config,
      JSON.parse(
        fs.readFileSync(
          config.pathResolver.resolveSuitePath(manifestPath, "case manifest"),
          "utf8",
        ),
      ).case_id,
    );
    pass(
      `case manifest valid: ${config.pathResolver.relativeToSuite(manifest.manifestPath)}`,
    );
  }

  await validateFixtures({ config });
  pass(`case discovery completed: ${discoverCaseIds(config).length} case(s)`);

  if (promptfooEnabled(config)) {
    const promptfooBin = path.join(
      config.pathResolver.repoRoot,
      "node_modules",
      ".bin",
      "promptfoo",
    );
    if (!fs.existsSync(promptfooBin)) {
      throw new Error(
        "Promptfoo-enabled methods require node_modules/.bin/promptfoo",
      );
    }
    pass("Promptfoo available for enabled methods");
  } else {
    pass("Promptfoo not required by enabled methods");
  }

  console.log(`Doctor passed (${checks.length} checks).`);
};

export const listCases = ({ configPath = DEFAULT_CONFIG_PATH }) => {
  const config = loadConfig(configPath);
  const caseIds = discoverCaseIds(config);
  if (caseIds.length === 0) {
    console.log("No cases found.");
    return caseIds;
  }
  for (const caseId of caseIds) {
    console.log(caseId);
  }
  return caseIds;
};
