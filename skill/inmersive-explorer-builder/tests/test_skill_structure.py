from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def test_skill_exists():
    assert (ROOT / "SKILL.md").exists()


def test_core_references_exist():
    names = [
        "experience-brief.md",
        "evidence-and-provenance.md",
        "explorer-model.md",
        "scale-engine.md",
        "architecture-patterns.md",
        "delegation-playbook.md",
        "verification.md",
    ]
    for name in names:
        assert (ROOT / "references" / name).exists()


def test_domain_packs_exist():
    for name in ["space", "geography", "human-anatomy", "cell-biology", "machinery", "historical-world"]:
        assert (ROOT / "domains" / name / "README.md").exists()


def test_template_variable_is_present():
    text = (ROOT / "SKILL.md").read_text(encoding="utf-8")
    assert "${HERMES_SKILL_DIR}" in text
