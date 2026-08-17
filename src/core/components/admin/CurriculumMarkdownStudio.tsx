/**
 * CurriculumMarkdownStudio.tsx
 * Estudio Visual y Editor Split-Screen de Contenidos Markdown para Administradores y Divulgadores
 */

import React, { useState, useMemo } from 'react';
import { MarkdownCurriculumParser } from '../../pipeline/MarkdownCurriculumParser';
import { CurriculumValidator, ValidationReport } from '../../pipeline/CurriculumValidator';
import { curriculumService } from '../../services/CurriculumService';
import { useProgress } from '../../context/ProgressContext';
import { 
  Save, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Layers, 
  Eye, 
  Code2, 
  FileText, 
  HelpCircle, 
  Download,
  RotateCcw,
  BookOpen
} from 'lucide-react';

const SAMPLE_MARKDOWN_TEMPLATES: Record<string, string> = {
  'astro_01': `---
id: 1
discipline: "astro"
order: 1
title: "La Tierra, su Atmósfera y Satélites"
tag: "Tema 1 • 12.742 km • Nuestro Oasis Cósmico"
icon: "🌍"
heroImage: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80"
xpReward: 50
estimatedMinutes: 8
version: 1
status: "published"
updatedAt: "2026-08-14"
sources:
  - "NASA Earth Observatory (2026 Dataset)"
  - "ESA Earth Online Sentinel Missions"
---

# La Tierra, su Atmósfera y Satélites

## 1. La Canica Azul y su Escudo Protector

A 150 millones de kilómetros del Sol, la Tierra es el único planeta conocido con biosfera activa. Su atmósfera posee un grosor de apenas 100 km (Línea de Kármán) y está compuesta por 78% de Nitrógeno y 21% de Oxígeno, frenando meteoritos y reteniendo agua líquida y océanos.

> [!NOTE] 🤯 Dato WOW
> Si la Tierra fuera del tamaño de una manzana estándar, la atmósfera que nos mantiene vivos sería más fina que la piel de la fruta. 🍎

> [!TIP] 🚀 Actualidad Científica 2026
> En 2026, la red de satélites climáticos de NASA y ESA monitoriza en tiempo real la salud de la atmósfera, los océanos y los casquetes polares.

> [!IMPORTANT] 🌌 Escena 3D Vinculada
> - **Scene ID**: \`scene01_Earth\`

![Fotografía original "Earthrise" tomada desde órbita lunar](https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80)
*Crédito: NASA / William Anders (Apolo 8)*

---

## 2. La Estación Espacial Internacional (ISS)

A 418 km de altitud, la ISS es un laboratorio orbital del tamaño de un campo de fútbol que viaja a 27.600 km/h, completando una vuelta a la Tierra cada 92 minutos.

> [!NOTE] 🤯 Dato WOW
> Los astronautas a bordo de la ISS presencian 16 amaneceres y 16 atardeceres cada 24 horas terrestres.

> [!TIP] 🚀 Actualidad Científica 2026
> En 2026, las tripulaciones de larga duración prueban sistemas de soporte vital con 98% de reciclaje de agua para futuras misiones a Marte.

> [!IMPORTANT] 🌌 Escena 3D Vinculada
> - **Scene ID**: \`scene01_Earth\`

![La Tierra y su atmósfera azul vista desde la Estación Espacial Internacional](https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80)
*Crédito: NASA / ESA / ISS Expedition Crew*

---

## 🧠 Test de Evaluación

### Q1: ¿Cuáles son los dos gases principales que componen más del 99% de la atmósfera terrestre? (choice)
- [x] Nitrógeno (78%) y Oxígeno (21%)
- [ ] Dióxido de Carbono (80%) y Metano (19%)
- [ ] Hidrógeno (75%) y Helio (24%)
- [ ] Oxígeno (50%) y Vapor de Agua (50%)

### Q2: ¿A qué velocidad aproximada se desplaza la ISS en su órbita baja terrestre? (choice)
- [x] ~27.600 km/h (da una vuelta cada 92 minutos)
- [ ] ~1.000 km/h (como un avión comercial)
- [ ] ~100.000 km/h (velocidad de la luz)
- [ ] 100 km/h (como un automóvil)

### Q3: Ordena los siguientes objetos según su distancia o altitud desde la superficie terrestre: (order)
1. Línea de Kármán (~100 km)
2. Estación Espacial Internacional ISS (~418 km)
3. Telescopio Espacial Hubble (~535 km)
4. Telescopio Espacial James Webb L2 (~1.500.000 km)
`,
  'lang_01': `---
id: "en_travel_01"
discipline: "languages"
order: 1
title: "Airport & Flight Essentials"
tag: "Unit 1 • Navigating International Terminals"
icon: "✈️"
heroImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80"
xpReward: 50
estimatedMinutes: 6
version: 1
status: "published"
updatedAt: "2026-08-14"
sources:
  - "CEFR Language Standards"
---

# Airport & Flight Essentials

## 1. Check-in Counter

When arriving at the international airport terminal, approach the check-in desk. Common phrases include *"May I see your passport?"* and *"Did you pack these bags yourself?"*.

> [!NOTE] 🤯 Dato WOW
> In American English it is called "carry-on luggage", while British English uses "hand luggage".

---

## 🧠 Test de Evaluación

### Q1: What is the correct response to "Did you pack your bags yourself?" (choice)
- [x] "Yes, I packed them myself."
- [ ] "I want a window seat."
- [ ] "Flight departs at gate 4."
- [ ] "Coffee please."
`,
  'school_01': `---
id: "eso_fq_01"
discipline: "school"
order: 1
title: "Cinemática: MRU y MRUA"
tag: "Física y Química 3º ESO • Movimiento y Velocidad"
icon: "⚡"
heroImage: "https://images.unsplash.com/photo-1517976487507-5b3b4a45097c?auto=format&fit=crop&w=1200&q=80"
xpReward: 60
estimatedMinutes: 8
version: 1
status: "published"
updatedAt: "2026-08-14"
sources:
  - "Currículo Oficial LOMLOE"
---

# Cinemática: Movimiento Rectilíneo Uniforme

## 1. Posición, Velocidad y MRU

El Movimiento Rectilíneo Uniforme (MRU) describe el desplazamiento de un cuerpo con velocidad constante ($v = \\text{cte}$). La posición se calcula como:

$$x(t) = x_0 + v \\cdot t$$

> [!NOTE] 🤯 Dato WOW
> La luz viaja a $300.000\\text{ km/s}$ y tarda solo 1,28 segundos en llegar de la Luna a la Tierra.

---

## 🧠 Test de Evaluación

### Q1: Si un móvil se desplaza a 20 m/s durante 15 segundos en MRU, ¿qué distancia recorre? (choice)
- [x] 300 metros
- [ ] 150 metros
- [ ] 35 metros
- [ ] 600 metros
`
};

export const CurriculumMarkdownStudio: React.FC = () => {
  const { showToast } = useProgress();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('astro_01');
  const [markdown, setMarkdown] = useState<string>(SAMPLE_MARKDOWN_TEMPLATES['astro_01']);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [syncing, setSyncing] = useState<boolean>(false);

  const parsedDoc = useMemo(() => {
    try {
      return MarkdownCurriculumParser.parse(markdown);
    } catch {
      return null;
    }
  }, [markdown]);

  const validationReport: ValidationReport = useMemo(() => {
    if (!parsedDoc) {
      return {
        isValid: false,
        score: 0,
        criticalErrors: [{ severity: 'critical', code: 'PARSE_ERROR', field: 'markdown', message: 'Error de sintaxis Markdown.' }],
        warnings: [],
        infos: [],
        summary: 'Error al parsear el documento.'
      };
    }
    return CurriculumValidator.validate(parsedDoc);
  }, [parsedDoc]);

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    setMarkdown(SAMPLE_MARKDOWN_TEMPLATES[templateKey] || '');
  };

  const handleDeployToFirestore = async () => {
    if (!parsedDoc || !validationReport.isValid) {
      showToast('⚠️ Corrige los errores críticos antes de publicar');
      return;
    }

    setSyncing(true);
    try {
      await curriculumService.saveLesson(parsedDoc.lesson.disciplineId, parsedDoc.lesson);
      showToast('🎉 ¡Lección y Test sincronizados con éxito en Firestore!');
    } catch (err: any) {
      showToast(`❌ Error al sincronizar: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${parsedDoc?.lesson.id || 'curriculum'}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('⬇️ Archivo Markdown descargado');
  };

  const insertSnippet = (snippet: string) => {
    setMarkdown(prev => prev + '\n' + snippet);
  };

  return (
    <div className="flex flex-col h-full space-y-3 text-white animate-in fade-in duration-200">
      {/* BARRA SUPERIOR DE HERRAMIENTAS */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-white">Curriculum Markdown Studio</h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                validationReport.isValid 
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40' 
                  : 'bg-rose-950/60 text-rose-400 border-rose-500/40'
              }`}>
                {validationReport.score}/100 Pts
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">Fuente Única de la Verdad (SSOT) & Ingesta Automática</p>
          </div>
        </div>

        {/* SELECTOR DE PLANTILLA Y BOTONES */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedTemplate}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="astro_01">🌌 Astronomía: 01 Tierra & Satélites</option>
            <option value="lang_01">✈️ Idiomas: 01 Airport Essentials</option>
            <option value="school_01">⚡ Colegio ESO: 01 Cinemática MRU</option>
          </select>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'editor' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 inline mr-1" /> Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'preview' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5 inline mr-1" /> Vista Previa
            </button>
          </div>

          <button
            onClick={handleDownload}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
            title="Descargar Markdown .md"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleDeployToFirestore}
            disabled={!validationReport.isValid || syncing}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-lg ${
              validationReport.isValid && !syncing
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 cursor-pointer active:scale-95 shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{syncing ? 'Sincronizando...' : 'Publicar a Firestore'}</span>
          </button>
        </div>
      </div>

      {/* SNIPPETS RÁPIDOS */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-white/5 text-[11px] overflow-x-auto scrollbar-none">
        <span className="text-slate-500 font-mono font-bold uppercase text-[9px] mr-1">Insertar:</span>
        <button
          onClick={() => insertSnippet(`## 3. Título del Nuevo Paso\n\nTexto explicativo del paso...\n\n> [!NOTE] 🤯 Dato WOW\n> Curiosidad asombrosa...\n\n`)}
          className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all font-mono"
        >
          + Paso Teórico
        </button>
        <button
          onClick={() => insertSnippet(`> [!NOTE] 🤯 Dato WOW\n> Analogía memorable o hecho impactante...\n`)}
          className="px-2 py-0.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-800/50 transition-all font-mono"
        >
          + Dato WOW
        </button>
        <button
          onClick={() => insertSnippet(`> [!TIP] 🚀 Actualidad Científica 2026\n> Misiones de la NASA / ESA activas en 2026...\n`)}
          className="px-2 py-0.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/50 transition-all font-mono"
        >
          + Actualidad 2026
        </button>
        <button
          onClick={() => insertSnippet(`### QX: ¿Enunciado de la pregunta? (choice)\n- [x] Opción Correcta A\n- [ ] Opción B\n- [ ] Opción C\n- [ ] Opción D\n`)}
          className="px-2 py-0.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-800/50 transition-all font-mono"
        >
          + Pregunta Choice
        </button>
        <button
          onClick={() => insertSnippet(`### QX: Ordena la siguiente secuencia: (order)\n1. Primer paso\n2. Segundo paso\n3. Tercer paso\n4. Cuarto paso\n`)}
          className="px-2 py-0.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-800/50 transition-all font-mono"
        >
          + Pregunta Order
        </button>
      </div>

      {/* ÁREA DE TRABAJO (SPLIT VIEW O SINGLE) */}
      <div className="flex-1 min-h-[420px] grid grid-cols-1 lg:grid-cols-2 gap-3 overflow-hidden">
        {/* PANEL IZQUIERDO: EDITOR DE TEXTO MARKDOWN */}
        <div className={`h-full flex flex-col rounded-2xl bg-slate-950/90 border border-white/10 overflow-hidden ${
          activeTab === 'preview' ? 'hidden lg:flex' : 'flex'
        }`}>
          <div className="px-4 py-2 bg-slate-900/80 border-b border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Editor Markdown (.md)</span>
            <span>{markdown.length} caracteres</span>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="flex-1 w-full bg-slate-950 text-slate-200 font-mono text-xs p-4 resize-none focus:outline-none leading-relaxed scrollbar-thin"
            placeholder="Escribe tu lección e investigaciones en Markdown..."
            spellCheck={false}
          />
        </div>

        {/* PANEL DERECHO: VISTA PREVIA REACTIVA Y CONTROL DE CALIDAD */}
        <div className={`h-full flex flex-col rounded-2xl bg-slate-900/60 border border-white/10 overflow-hidden ${
          activeTab === 'editor' ? 'hidden lg:flex' : 'flex'
        }`}>
          <div className="px-4 py-2 bg-slate-900/80 border-b border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Inspector AST y Validación en Vivo</span>
            <span className={validationReport.isValid ? 'text-emerald-400' : 'text-rose-400'}>
              {validationReport.summary}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin text-xs">
            {/* INFORME DE ERRORES / ADVERTENCIAS */}
            {validationReport.criticalErrors.length > 0 && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-1 text-rose-300">
                <span className="font-bold flex items-center gap-1 text-rose-400">
                  <XCircle className="w-4 h-4" /> Errores Críticos:
                </span>
                <ul className="list-disc pl-4 space-y-0.5">
                  {validationReport.criticalErrors.map((e, idx) => (
                    <li key={idx}><strong>[{e.field}]</strong> {e.message}</li>
                  ))}
                </ul>
              </div>
            )}

            {validationReport.warnings.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-1 text-amber-300">
                <span className="font-bold flex items-center gap-1 text-amber-400">
                  <AlertTriangle className="w-4 h-4" /> Advertencias de Calidad:
                </span>
                <ul className="list-disc pl-4 space-y-0.5">
                  {validationReport.warnings.map((w, idx) => (
                    <li key={idx}>{w.message}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* FICHA RESUMEN DE LA LECCIÓN PARSEADA */}
            {parsedDoc && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 flex items-center gap-3">
                  <span className="text-3xl p-2 rounded-xl bg-slate-900 border border-slate-800">{parsedDoc.lesson.icon}</span>
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">{parsedDoc.lesson.tag}</span>
                    <h4 className="font-bold text-sm text-white">{parsedDoc.lesson.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      +{parsedDoc.lesson.xpReward} XP • ~{parsedDoc.lesson.estimatedMinutes} min
                    </span>
                  </div>
                </div>

                {/* PASOS TEÓRICOS */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-300 font-mono block">
                    Pasos Teóricos ({parsedDoc.lesson.steps.length}):
                  </span>
                  {parsedDoc.lesson.steps.map((step, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
                        <span>{idx + 1}. {step.title}</span>
                        <span className="text-[10px] font-mono text-slate-500">{step.type}</span>
                      </div>
                      <p className="text-slate-300 line-clamp-2">{step.content}</p>
                      {step.wowFact && (
                        <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-500/20 text-amber-300 text-[11px]">
                          <strong>🤯 WOW:</strong> {step.wowFact}
                        </div>
                      )}
                      {step.photo && (
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <span>📸 {step.photo.caption || 'Foto'}</span>
                          <span className="text-cyan-300/80">({step.photo.credit || 'NASA'})</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* PREGUNTAS DEL TEST */}
                <div className="space-y-2 pt-2">
                  <span className="font-bold text-slate-300 font-mono block">
                    Banco de Preguntas ({parsedDoc.test.questions.length}):
                  </span>
                  {parsedDoc.test.questions.map((q, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                      <div className="flex items-center justify-between font-bold text-white text-xs">
                        <span>Q{idx + 1}: {q.prompt}</span>
                        <span className="text-[10px] font-mono text-emerald-400">+{q.xp} XP</span>
                      </div>
                      {q.type === 'choice' && q.options && (
                        <ul className="space-y-0.5 pl-3 text-slate-400">
                          {q.options.map((opt, oIdx) => (
                            <li key={oIdx} className={oIdx === q.correctAnswer ? 'text-emerald-400 font-bold' : ''}>
                              {oIdx === q.correctAnswer ? '✓ ' : '• '} {opt}
                            </li>
                          ))}
                        </ul>
                      )}
                      {q.type === 'order' && q.orderItems && (
                        <ol className="space-y-0.5 pl-3 list-decimal text-cyan-300">
                          {q.orderItems.map((item, iIdx) => (
                            <li key={iIdx}>{item.label}</li>
                          ))}
                        </ol>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
