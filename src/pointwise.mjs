export const POINTWISE_VERDICTS = [
  "covered",
  "partial",
  "missing",
  "contradicted",
  "unknown",
];

const pointwiseVerdictSet = new Set(POINTWISE_VERDICTS);

const requiredString = (value, label) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`pointwise run metadata missing ${label}`);
  }
  return value;
};

const requireEqual = (actual, expected, label) => {
  requiredString(actual, label);
  if (expected !== undefined && actual !== expected) {
    throw new Error(
      `pointwise run metadata ${label} mismatch: expected ${expected}, got ${actual}`,
    );
  }
};

export const countPointwiseVerdicts = (items) => {
  if (!Array.isArray(items)) {
    throw new Error("pointwise items must be an array");
  }
  const counts = Object.fromEntries(
    POINTWISE_VERDICTS.map((verdict) => [verdict, 0]),
  );
  for (const item of items) {
    if (!pointwiseVerdictSet.has(item?.verdict)) {
      throw new Error(`unknown pointwise verdict: ${item?.verdict}`);
    }
    counts[item.verdict] += 1;
  }
  return counts;
};

export const formatPointwiseVerdictCounts = (counts) =>
  POINTWISE_VERDICTS.map(
    (verdict) => `- ${verdict}: ${counts?.[verdict] ?? 0}`,
  );

export const formatPointwiseCalibrationSummary = ({
  title = "Advisory Pointwise Model-Judge Summary",
  counts,
  fixtureLabel = "not recorded",
  expectedOutcome = "not recorded",
  falsePass = "not reviewed",
  falseFail = "not reviewed",
  notes = "not reviewed",
} = {}) =>
  [
    `## ${title}`,
    "",
    "Model-judge evidence is manual and advisory. It cannot upgrade deterministic red or yellow results.",
    "",
    "### Verdict Counts",
    "",
    ...formatPointwiseVerdictCounts(counts),
    "",
    "### Calibration Record",
    "",
    `- fixture label: ${fixtureLabel}`,
    `- expected outcome: ${expectedOutcome}`,
    `- false pass: ${falsePass}`,
    `- false fail: ${falseFail}`,
    `- notes: ${notes}`,
  ].join("\n");

const validateRelativeArtifactPath = (relativePath, label) => {
  requiredString(relativePath, label);
  if (relativePath.trim() !== relativePath) {
    throw new Error(
      `pointwise run metadata ${label} must not contain surrounding whitespace`,
    );
  }
  if (relativePath.includes("\\")) {
    throw new Error(
      `pointwise run metadata ${label} must use POSIX separators`,
    );
  }
  if (relativePath.startsWith("/") || relativePath.startsWith("../")) {
    throw new Error(
      `pointwise run metadata ${label} must be a relative contained path`,
    );
  }
  if (
    relativePath
      .split("/")
      .some((segment) => segment === "." || segment === "..")
  ) {
    throw new Error(
      `pointwise run metadata ${label} must not contain . or .. path segments`,
    );
  }
  if (
    relativePath === "." ||
    relativePath === ".." ||
    relativePath.includes("/../") ||
    relativePath.includes("//")
  ) {
    throw new Error(`pointwise run metadata ${label} must be normalized`);
  }
  if (relativePath.startsWith("./")) {
    throw new Error(`pointwise run metadata ${label} must not start with ./`);
  }
  return relativePath;
};

const requireArtifactPaths = (manifest, requiredRoles) => {
  if (!Array.isArray(manifest.artifacts) || manifest.artifacts.length === 0) {
    throw new Error("pointwise run metadata missing artifacts");
  }
  const artifactPaths = new Set();
  const roles = new Set();
  for (const artifact of manifest.artifacts) {
    requiredString(artifact?.role, "artifact role");
    validateRelativeArtifactPath(
      artifact?.path,
      `artifact path for ${artifact.role}`,
    );
    roles.add(artifact.role);
    artifactPaths.add(artifact.path);
  }
  for (const role of requiredRoles) {
    if (!roles.has(role)) {
      throw new Error(`pointwise run metadata missing artifact role ${role}`);
    }
  }
  if (!Array.isArray(manifest.output_files)) {
    throw new Error("pointwise run metadata missing output_files");
  }
  const outputFiles = new Set(
    manifest.output_files.map((outputPath, index) =>
      validateRelativeArtifactPath(outputPath, `output_files[${index}]`),
    ),
  );
  if (!outputFiles.has("manifest.json")) {
    throw new Error("pointwise run metadata missing manifest.json output file");
  }
  for (const artifactPath of artifactPaths) {
    if (!outputFiles.has(artifactPath)) {
      throw new Error(
        `pointwise run metadata output_files missing artifact path ${artifactPath}`,
      );
    }
  }
};

export const validatePointwiseRunMetadata = ({
  manifest,
  expected = {},
} = {}) => {
  if (!manifest || typeof manifest !== "object") {
    throw new Error("pointwise run metadata manifest is required");
  }
  requireEqual(manifest.run_id, expected.runId, "run_id");
  requireEqual(manifest.run_type, "judge-coverage", "run_type");
  if (!Array.isArray(manifest.case_ids) || manifest.case_ids.length !== 1) {
    throw new Error("pointwise run metadata must contain exactly one case id");
  }
  requireEqual(manifest.case_ids[0], expected.caseId, "case_id");
  requireEqual(manifest.model, expected.model, "model");
  requireEqual(manifest.provider, expected.provider, "provider");
  if (
    expected.effort !== undefined ||
    manifest.reasoning_effort !== undefined
  ) {
    requireEqual(
      manifest.reasoning_effort,
      expected.effort,
      "reasoning_effort",
    );
  }
  requireEqual(
    manifest.prompt_version,
    expected.promptVersion,
    "prompt_version",
  );
  requireEqual(
    manifest.rubric_version,
    expected.rubricVersion,
    "rubric_version",
  );
  requireEqual(
    manifest.runner?.version,
    expected.runnerVersion,
    "runner.version",
  );
  requireArtifactPaths(
    manifest,
    expected.requiredArtifactRoles ?? [
      "report",
      "pointwise_result",
      "promptfoo_config",
      "raw_promptfoo_results",
      "promptfoo_html_report",
    ],
  );
  return manifest;
};
