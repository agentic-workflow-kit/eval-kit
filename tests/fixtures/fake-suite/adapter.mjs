import fs from "node:fs";
import path from "node:path";

export const gradeCandidate = ({ candidateText, expectedItems }) => {
  const findings = expectedItems.items.map((item) => {
    const covered = candidateText.includes(item.required_text);
    return {
      id: item.id,
      kind: item.kind,
      severity: item.severity,
      verdict: covered ? "covered" : "missing",
      evidence: covered
        ? `found ${item.required_text}`
        : `missing ${item.required_text}`,
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
    `# Eval Report: ${caseId}`,
    "",
    `Verdict: ${grades.verdict}`,
    "",
    ...findings.map(
      (finding) =>
        `- ${finding.id} (${finding.kind}, ${finding.severity}): ${finding.verdict} - ${finding.evidence}`,
    ),
  ].join("\n");

export const validateFixtures = async ({ manifests }) => {
  for (const item of manifests) {
    const hasExpectedItems = item.manifest.artifacts.some(
      (artifact) => artifact.role === "grader_input",
    );
    if (!hasExpectedItems) {
      throw new Error(
        `${item.relativePath} is missing a grader_input artifact`,
      );
    }
  }
};

export const compileReport = async ({ runs, resultDir, resolver }) => {
  const artifacts = [];
  const outputFiles = [];
  const reportParts = [`# Manual Combined Report`, ""];
  const caseIds = new Set();

  if (runs.deterministic) {
    const sourceRunDir = resolver.resolveRunDir(runs.deterministic);
    const grades = JSON.parse(
      fs.readFileSync(path.join(sourceRunDir, "grades.json"), "utf8"),
    );
    const report = fs.readFileSync(
      path.join(sourceRunDir, "report.md"),
      "utf8",
    );
    caseIds.add(grades.case_id);
    reportParts.push("## Deterministic Run results", "", report, "");

    const gradesPath = "deterministic_grades.json";
    fs.writeFileSync(
      path.join(resultDir, gradesPath),
      `${JSON.stringify(grades, null, 2)}\n`,
    );
    artifacts.push({
      role: "deterministic_grades",
      path: gradesPath,
      mediaType: "application/json",
    });
    outputFiles.push(gradesPath);
  }

  return {
    reportContent: reportParts.join("\n"),
    caseIds: [...caseIds],
    artifacts,
    outputFiles,
  };
};
