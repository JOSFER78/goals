#!/usr/bin/env python3
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
errors = []

skill = ROOT / "SKILL.md"
if not skill.exists():
    errors.append("SKILL.md missing")
else:
    text = skill.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        errors.append("SKILL.md must start with YAML frontmatter")
    for heading in ["## When to Use", "## Prerequisites", "## How to Run", "## Procedure", "## Pitfalls", "## Verification"]:
        if heading not in text:
            errors.append(f"Missing section: {heading}")
    if "${HERMES_SKILL_DIR}" not in text:
        errors.append("Expected Hermes skill-dir template variable")

for rel in [
    "references/experience-brief.md",
    "references/evidence-and-provenance.md",
    "references/explorer-model.md",
    "references/scale-engine.md",
    "references/architecture-patterns.md",
    "references/delegation-playbook.md",
    "references/verification.md",
    "templates/project-plan.md",
    "templates/source-matrix.csv",
    "templates/domain-config.yaml",
]:
    if not (ROOT / rel).exists():
        errors.append(f"Missing required support file: {rel}")

if errors:
    print("SKILL INVALID")
    for e in errors:
        print(f"- {e}")
    sys.exit(1)

print("SKILL OK")
print(f"Root: {ROOT}")
