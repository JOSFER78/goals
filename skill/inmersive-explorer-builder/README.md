# Immersive Explorer Builder

A reusable Hermes Agent skill for building evidence-grounded, multiscale, interactive learning explorers.

Examples:
- Solar System / spacecraft explorer
- world map and historical map explorer
- human anatomy / nervous system
- cell biology
- engines and machines
- architecture and engineering

The skill uses progressive disclosure: the main `SKILL.md` contains the always-needed behavior, while references/templates/domain packs are loaded when relevant.

## Contents

- `SKILL.md` — main Hermes skill.
- `references/` — reusable engineering and research guidance.
- `domains/` — domain routing packs.
- `templates/` — project planning/data templates.
- `scripts/` — local validation utilities.
- `tests/` — simple structural tests.
- `HERMES_START_PROMPT.md` — the prompt to paste into Hermes to initiate a project using the skill.
- `INSTALL.md` — how to install the whole folder as one Hermes skill.
