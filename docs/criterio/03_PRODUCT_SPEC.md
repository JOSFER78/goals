# 03 · ESPECIFICACIÓN DE PRODUCTO (FASE 2 — PRODUCT SPEC)
**Producto**: CRITERIO · Aprender a Informarse  
**Identificador en Core GOALS**: `verify` (o `criterio` con retrocompatibilidad `verify`)  
**Ecosistema**: GOALS Educational Platform  
**Target**: Estudiantes de 8 a 18 años, Docentes, Familias  
**Versión**: 3.0.0  

---

## 1. NOMBRE VISIBLE, IDENTIDAD Y PROPUESTA DE VALOR

### 1.1. Nombre y Tagline Oficial
- **Nombre Principal**: **CRITERIO**
- **Subtítulo / Tagline**: *Aprender a Informarse en la Era Digital y de la IA*
- **Pregunta Insignia**: *«¿Y tú cómo lo sabes?»*
- **Keywords de Identidad**: *Fuentes · Algoritmos · IA · Matiz · Pensamiento Autónomo*

### 1.2. Propuestas de Valor Segmentadas
| Segmento | Propuesta de Valor Central |
| :--- | :--- |
| **Niño (8–12 años)** | Un juego de misterio e investigación interactivo donde aprendes a que no te engañen con vídeos trucados, sorteos trampa o rumores en el cole, ganando XP y desbloqueando insignias de detective digital. |
| **Adolescente (13–18 años)** | El kit definitivo de autonomía mental: entender cómo funcionan los algoritmos que controlan tu feed de TikTok/Instagram, detectar alucinaciones de ChatGPT, cazar deepfakes y aprender a contrastar información para debatir con datos sólidos sin que nadie decida por ti. |
| **Familias y Docentes** | Una herramienta pedagógica rigurosa, sin sesgos partidistas, alineada con el marco europeo DigComp y la UNESCO, que transforma el tiempo de pantalla pasivo en un entrenamiento práctico de pensamiento crítico, seguridad ante la IA y responsabilidad digital. |

---

## 2. QUÉ SE HEREDA Y QUÉ SE DESCARTA

### 2.1. Heredado de Proyectos Previos (VPS / contradesinformacion2 / MATIZA)
- ✅ El rigor documental del estudio Newtral-UGR y los casos judiciales reales (FTC, Fox-Dominion, Torre-Pacheco, DANA).
- ✅ El marco conductual del **Método PAUSA**.
- ✅ La biblioteca de situaciones cotidianas y preguntas pedagógicas (ampliada y optimizada a 60 escenarios).
- ✅ La tecnología de análisis estructurado de afirmaciones de **MATIZA**.
- ✅ La jerarquía de fuentes primarias (BOE, NASA, ESA, CSIC, revisiones académicas).

### 2.2. Descartado o Sustituido
- ❌ **Descartado el fact-checking binario**: Eliminar pantallas tipo "Verifica si este titular es Falso o Verdadero". Sustituido por análisis de matices, grados de evidencia e incertidumbre.
- ❌ **Descartada la terminología sobrecargada**: Se eliminan expresiones densas como "vectorización patogénica" o "topología de redes" que alienaban al alumno.
- ❌ **Descartado el tono acusatorio o defensivo**: Se elimina cualquier inicio tipo "Te están manipulando", adoptando el enfoque de empoderamiento "Aprende a comprobar".
- ❌ **Descartados componentes monolíticos gigantes**: Toda la interfaz se diseña en componentes React modulares, accesibles y optimizados para móvil (390px).

---

## 3. EL ROL EXACTO DE MATIZA DENTRO DE GOALS

**MATIZA NO es la miniapp; es una herramienta integrada dentro de CRITERIO.**
- Funciona como una **estación de trabajo / laboratorio de contraste** a la que el alumno puede acudir en cualquier momento:
  1. El alumno introduce una afirmación o pega un titular/texto.
  2. El motor MATIZA (potenciado por IA y fuentes) descompone el texto en:
     - **Afirmación central detectada**.
     - **Puntos respaldados por evidencia sólida**.
     - **Puntos dudosos, especulativos o sin respaldo**.
     - **Contexto faltante indispensable**.
     - **Fuentes recomendadas para lectura lateral**.
     - **Conclusión matizada con nivel de certeza**.
- Se presenta como una pestaña/modal táctil dentro de CRITERIO (`Laboratorio MATIZA`), complementando los 12 módulos de aprendizaje y las misiones gamificadas.

---

## 4. EL ROL EXACTO DE LA INTELIGENCIA ARTIFICIAL

1. **Tutor Socrático Adaptativo**: La IA no da la respuesta correcta directamente. Cuando el alumno duda, la IA hace una contrapregunta orientativa (*"¿Te has fijado en si la noticia incluye la fecha exacta del suceso o solo dice 'ocurrió ayer'?"*).
2. **Simulador de Escenarios Dinámicos**: Genera variaciones de noticias y publicaciones de redes según los intereses del alumno configurados en su perfil (`ChildLearningProfile`).
3. **Objeto de Estudio Forense**: La IA se somete a prueba dentro de la app para que el alumno descubra cómo se equivoca, cómo alucina citas bibliográficas y cómo detectar texto e imágenes generadas artificialmente.

---

## 5. MÉTRICAS DE ÉXITO Y APRENDIZAJE

- **Tasa de Lectura Lateral (TLR)**: % de alumnos que consultan una segunda fuente antes de emitir un juicio en una misión.
- **Índice de Detección de Matiz (IDM)**: Capacidad de identificar información incompleta o fuera de contexto (no solo bulos burdos).
- **Adopción del Método PAUSA**: Reducción en la velocidad de respuesta impulsiva (tiempo de lectura > 15 segundos por caso).
- **Progresión de XP y Retención**: Completitud de los 12 módulos y racha diaria activa en el core de GOALS.
