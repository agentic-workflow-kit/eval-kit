import { describe, expect, it } from "vitest";

import {
  countPointwiseVerdicts,
  formatPointwiseCalibrationSummary,
  validatePointwiseRunMetadata,
} from "../src/index.mjs";

const pointwiseManifest = (overrides = {}) => ({
  schema_version: "eval-kit.result-manifest.v2",
  run_id: "provider-20260704-case-good",
  run_type: "judge-coverage",
  runner: {
    id: "suite-pointwise-judge",
    version: "0.1.8",
  },
  case_ids: ["case-alpha"],
  started_at: "2026-07-04T00:00:00.000Z",
  ended_at: "2026-07-04T00:00:01.000Z",
  duration_ms: 1000,
  status: "completed",
  git: {
    commit: "abc123",
  },
  command: "pnpm eval:judge:coverage",
  tool_versions: {
    node: "v26.4.0",
  },
  model: "gpt-5.4",
  provider: "openai:codex-app-server",
  model_provider: "openai:codex-app-server:gpt-5.4",
  reasoning_effort: "medium",
  prompt_version: "pointwise-v1",
  rubric_version: "rubric-v1",
  artifacts: [
    { role: "report", path: "report.md" },
    { role: "pointwise_result", path: "pointwise-result.json" },
    { role: "promptfoo_config", path: "promptfooconfig.json" },
    { role: "raw_promptfoo_results", path: "promptfoo-results.json" },
    { role: "promptfoo_html_report", path: "promptfoo-report.html" },
  ],
  output_files: [
    "manifest.json",
    "report.md",
    "pointwise-result.json",
    "promptfooconfig.json",
    "promptfoo-results.json",
    "promptfoo-report.html",
  ],
  ...overrides,
});

const expectedMetadata = {
  runId: "provider-20260704-case-good",
  caseId: "case-alpha",
  model: "gpt-5.4",
  provider: "openai:codex-app-server",
  effort: "medium",
  promptVersion: "pointwise-v1",
  rubricVersion: "rubric-v1",
  runnerVersion: "0.1.8",
};

describe("pointwise model-judge helpers", () => {
  it("counts verdicts and formats a calibration summary with adverse categories", () => {
    const counts = countPointwiseVerdicts([
      { verdict: "covered" },
      { verdict: "partial" },
      { verdict: "missing" },
      { verdict: "contradicted" },
      { verdict: "unknown" },
      { verdict: "unknown" },
    ]);

    expect(counts).toEqual({
      covered: 1,
      partial: 1,
      missing: 1,
      contradicted: 1,
      unknown: 2,
    });

    const summary = formatPointwiseCalibrationSummary({
      counts,
      fixtureLabel: "expected-bad",
      expectedOutcome: "adverse on targeted defect",
      falsePass: "not observed",
      falseFail: "not applicable",
      notes: "bad fixture remained adverse",
    });

    expect(summary).toContain("Model-judge evidence is manual and advisory");
    expect(summary).toContain("- covered: 1");
    expect(summary).toContain("- unknown: 2");
    expect(summary).toContain("- fixture label: expected-bad");
    expect(summary).toContain("- false pass: not observed");
  });

  it("fails closed when pointwise run metadata is missing or mismatched", () => {
    expect(() =>
      validatePointwiseRunMetadata({
        manifest: pointwiseManifest(),
        expected: expectedMetadata,
      }),
    ).not.toThrow();

    expect(() =>
      validatePointwiseRunMetadata({
        manifest: pointwiseManifest({ run_id: "" }),
        expected: expectedMetadata,
      }),
    ).toThrow(/missing run_id/);

    expect(() =>
      validatePointwiseRunMetadata({
        manifest: pointwiseManifest({ model: "gpt-5.5" }),
        expected: expectedMetadata,
      }),
    ).toThrow(/model mismatch/);

    expect(() =>
      validatePointwiseRunMetadata({
        manifest: pointwiseManifest({
          artifacts: [{ role: "report", path: "report.md" }],
        }),
        expected: expectedMetadata,
      }),
    ).toThrow(/missing artifact role pointwise_result/);

    expect(() =>
      validatePointwiseRunMetadata({
        manifest: pointwiseManifest({
          output_files: ["manifest.json", "report.md"],
        }),
        expected: expectedMetadata,
      }),
    ).toThrow(/output_files missing artifact path pointwise-result.json/);

    expect(() =>
      validatePointwiseRunMetadata({
        manifest: pointwiseManifest({
          artifacts: [
            { role: "report", path: "../report.md" },
            { role: "pointwise_result", path: "/tmp/pointwise-result.json" },
            { role: "promptfoo_config", path: "promptfooconfig.json" },
            { role: "raw_promptfoo_results", path: "promptfoo-results.json" },
            { role: "promptfoo_html_report", path: "promptfoo-report.html" },
          ],
          output_files: [
            "manifest.json",
            "../report.md",
            "/tmp/pointwise-result.json",
            "promptfooconfig.json",
            "promptfoo-results.json",
            "promptfoo-report.html",
          ],
        }),
        expected: expectedMetadata,
      }),
    ).toThrow(/relative contained path/);

    expect(() =>
      validatePointwiseRunMetadata({
        manifest: pointwiseManifest({
          output_files: [
            "manifest.json",
            "report.md",
            "pointwise-result.json",
            "./promptfooconfig.json",
            "promptfoo-results.json",
            "promptfoo-report.html",
          ],
        }),
        expected: expectedMetadata,
      }),
    ).toThrow(/must not contain \. or \.\. path segments/);

    expect(() =>
      validatePointwiseRunMetadata({
        manifest: pointwiseManifest({
          artifacts: [
            { role: "report", path: "reports/.." },
            { role: "pointwise_result", path: "pointwise-result.json" },
            { role: "promptfoo_config", path: "promptfooconfig.json" },
            { role: "raw_promptfoo_results", path: "promptfoo-results.json" },
            { role: "promptfoo_html_report", path: "promptfoo-report.html" },
          ],
          output_files: [
            "manifest.json",
            "reports/..",
            "pointwise-result.json",
            "promptfooconfig.json",
            "promptfoo-results.json",
            "promptfoo-report.html",
          ],
        }),
        expected: expectedMetadata,
      }),
    ).toThrow(/must not contain \. or \.\. path segments/);

    expect(() =>
      validatePointwiseRunMetadata({
        manifest: pointwiseManifest({
          output_files: [
            "manifest.json",
            "report.md",
            "pointwise-result.json",
            "promptfoo/./config.json",
            "promptfoo-results.json",
            "promptfoo-report.html",
          ],
        }),
        expected: expectedMetadata,
      }),
    ).toThrow(/must not contain \. or \.\. path segments/);
  });
});
