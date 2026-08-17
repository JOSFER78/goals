# 🛠️ 06. HERRAMIENTAS REALES: ARGDOWN, MODELO TOULMIN, SUNCALC Y ESTÁNDAR C2PA
## Modelado de Argumentos en Grafos, Análisis de Redes Bayesianas y APIs Forenses en Cliente

**Especialidad:** Dialéctica Computacional y Verificación Digital  
**Integración:** Argdown Engine + SunCalc + C2PA SDK  

---

## 1. MODELO ARGUMENTATIVO DE TOULMIN (1958)
- **Pretensión (Claim):** La tesis a defender.
- **Datos (Data):** Evidencias empíricas y hechos observados.
- **Garantía (Warrant):** Principio lógico que conecta los Datos con la Pretensión.
- **Respaldo (Backing):** Leyes científicas, códigos legales o estadísticas consolidadas.
- **Calificador Modal (Qualifier):** Grado de certeza (*"probablemente"*, *"necesariamente"*).
- **Reserva (Rebuttal):** Excepciones y condiciones de refutación.

---

## 2. GRAFOS DIALÉCTICOS CON SINTAXIS ARGDOWN (CÓDIGO REAL)
```argdown
===
title: Debate sobre IA en la Educación
author: GOALS Criterio Engine
===

[Tesis]: La IA debe integrarse como tutor socrático en las escuelas.
  +> <Argumento Personalizacion>: Permite adaptar el ritmo de aprendizaje a cada estudiante.
  -> <Argumento Brecha>: Puede aumentar la desigualdad si no hay acceso universal.

<Argumento Personalizacion>: Cada cerebro tiene velocidades y estilos de procesamiento distintos.
  (1) La atención individualizada mejora la comprensión conceptual.
  (2) Los tutores de IA proporcionan feedback inmediato sin juicio punitivo.
  ----
  (3) Por tanto, el aprendizaje adaptativo optimiza el rendimiento académico.
  -> [Tesis]
```

---

## 3. HERRAMIENTAS FORENSES Y SUNCALC API
- **SunCalc API:** Coordenadas celestes solares para calcular altitud ($\gamma$) y acimut ($\alpha$) mediante sombras:
  $$\tan\gamma = \frac{h}{s} \implies \gamma = \arctan\left(\frac{h}{s}\right)$$
- **Wayback Machine CDX API:** Arqueología web para verificar ediciones silenciosas o declaraciones eliminadas.
- **Estándar C2PA / Content Credentials:** Extracción de metadatos criptográficos JUMBF embebidos en imágenes JPEG/PNG para auditar su procedencia (sensor físico vs modelo generativo).
