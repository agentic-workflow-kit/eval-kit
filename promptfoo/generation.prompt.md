# Candidate Generation Prompt

Prompt version: `generation-prompt-v1`.

Generate one candidate artifact for the requested eval case.

Inputs:

- Case id: `{{case_id}}`
- Source material: `{{source_material}}`
- Candidate instructions: `{{candidate_instructions}}`
- Output format: `{{output_format}}`

Use only the visible source material and candidate instructions. Do not infer requirements from
hidden reference artifacts, grader notes, or prior runs. Preserve explicit goals, constraints,
non-goals, and source-visible boundaries. When evidence is missing, name the uncertainty instead of
inventing facts.

Return only the candidate artifact in the requested output format.
