/**
 * scripts/generateMarkdownFromLessons.ts
 * Genera los 12 archivos Markdown (.md) en content/curriculum/astro/ a partir de las lecciones atómicas existentes
 */

import * as fs from 'fs';
import * as path from 'path';
import { LESSONS } from '../src/experiences/astro/data/lessonsData';

const CONTENT_ASTRO_DIR = path.join(process.cwd(), 'content', 'curriculum', 'astro');
fs.mkdirSync(CONTENT_ASTRO_DIR, { recursive: true });

LESSONS.forEach((lesson) => {
  const pad = String(lesson.id).padStart(2, '0');
  const safeName = lesson.title
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  const fileName = `${pad}_${safeName}.md`;
  const filePath = path.join(CONTENT_ASTRO_DIR, fileName);

  let md = `---\n`;
  md += `id: ${lesson.id}\n`;
  md += `discipline: "astro"\n`;
  md += `order: ${lesson.id}\n`;
  md += `title: "${lesson.title}"\n`;
  md += `tag: "${lesson.tag}"\n`;
  md += `icon: "${lesson.icon}"\n`;
  md += `heroImage: "${lesson.hero || ''}"\n`;
  md += `xpReward: 50\n`;
  md += `estimatedMinutes: 8\n`;
  md += `version: 1\n`;
  md += `status: "published"\n`;
  md += `updatedAt: "${new Date().toISOString().split('T')[0]}"\n`;
  md += `sources:\n`;
  md += `  - "NASA Planetary Data System & JPL Solar System Dynamics"\n`;
  md += `  - "ESA Science & Technology Hub"\n`;
  md += `---\n\n`;

  md += `# ${lesson.title}\n\n`;

  // Pasos
  lesson.steps.forEach((step, idx) => {
    md += `## ${idx + 1}. ${step.t}\n\n`;
    md += `${step.text}\n\n`;

    if (step.wow) {
      md += `> [!NOTE] 🤯 Dato WOW\n> ${step.wow}\n\n`;
    }

    if (step.now) {
      md += `> [!TIP] 🚀 Actualidad Científica 2026\n> ${step.now}\n\n`;
    }

    if (step.scene) {
      md += `> [!IMPORTANT] 🌌 Escena 3D Vinculada\n> - **Scene ID**: \`${step.scene}\`\n\n`;
    }

    if (step.photo && step.photo.url) {
      md += `![${step.photo.caption || step.t}](${step.photo.url})\n`;
      if (step.photo.credit) {
        md += `*Crédito: ${step.photo.credit}*\n\n`;
      } else {
        md += `\n`;
      }
    }

    md += `---\n\n`;
  });

  // Test
  md += `## 🧠 Test de Evaluación\n\n`;

  lesson.test.forEach((q: any, qIdx: number) => {
    if (q.type === 'order') {
      md += `### Q${qIdx + 1}: ${q.question} (order)\n\n`;
      q.correctOrder.forEach((item: string, i: number) => {
        md += `${i + 1}. ${item}\n`;
      });
      md += `\n`;
    } else {
      md += `### Q${qIdx + 1}: ${q.question} (choice)\n\n`;
      q.options.forEach((opt: string, optIdx: number) => {
        const isCorrect = optIdx === q.answer;
        md += `- [${isCorrect ? 'x' : ' '}] ${opt}\n`;
      });
      md += `\n`;
    }
  });

  fs.writeFileSync(filePath, md, 'utf-8');
  console.log(`✅ Creado: ${fileName}`);
});

console.log('🎉 12 Archivos Markdown creados con éxito en content/curriculum/astro/');
