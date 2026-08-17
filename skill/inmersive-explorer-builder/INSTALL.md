# Installation in Hermes

This archive intentionally contains **one skill folder** and does not place loose files into Hermes.

## 1. Copy the folder

Place the `immersive-explorer-builder` folder under your Hermes user skills directory:

`~/.hermes/skills/immersive-explorer-builder/`

Keep the internal structure intact.

## 2. Verify

Run:

`python ~/.hermes/skills/immersive-explorer-builder/scripts/validate_skill.py`

Then start a new Hermes session, because installed skills are loaded into the session skill list when the session starts.

## 3. Invoke

Use:

`/immersive-explorer-builder <your project brief>`

or ask Hermes in natural language to use the skill.

## 4. Important

This skill does not automatically install MCP servers. It instructs Hermes to discover existing capabilities first and only propose additional MCPs when a concrete need exists.
