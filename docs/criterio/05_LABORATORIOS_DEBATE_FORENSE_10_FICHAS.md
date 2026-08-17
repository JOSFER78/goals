# 🔬 CATÁLOGO MAESTRO DE 10 LABORATORIOS DE DEBATE FORENSE Y VERIFICACIÓN DIGITAL
## GOALS Criterio — Protocolos Científicos, Fichas de Casos Reales y Análisis OSINT Educativo (6 a 15 Años)

**Marco Forense:** Stanford Civic Online Reasoning (SHEG), Manifiestos C2PA / Content Credentials (X.509), Cronolocalización Solar (SunCalc API), Argumentación Formal Toulmin / Argdown.  
**Garantía:** Casos y herramientas 100% reales (Cero Mocks).

---

### ÍNDICE DE LOS 10 LABORATORIOS
1. **LAB-01 (6–7 años):** *El Misterio del Monstruo de la Foto* (Distinción hecho/opinión y perspectiva).
2. **LAB-02 (6–7 años):** *La Fábula del Lobo y la Noticia Rápida* (Rumores y verificación visual).
3. **LAB-03 (8–9 años):** *El Detective del Anuncio de Galletas* (Publicidad engañosa y afirmaciones sin prueba).
4. **LAB-04 (8–9 años):** *El Cazador de Titulares Trampa (Clickbait)* (Sensacionalismo y fuentes).
5. **LAB-05 (10–11 años):** *El Caso de la Luna Verde de Marte* (Lectura Lateral y búsqueda de autoría).
6. **LAB-06 (10–11 años):** *El Experimento de la Vitamina Milagrosa* (Falacia post hoc y ensayos clínicos).
7. **LAB-07 (12–13 años):** *La Foto del Atardecer en la Playa* (Cronolocalización solar con SunCalc $\tan \gamma = h/s$).
8. **LAB-08 (12–13 años):** *Detección de Deepfakes en Audio y Vídeo* (Espectrogramas y artefactos C2PA).
9. **LAB-09 (14–15 años):** *El Mapeo de la Controversia Nuclear con Argdown* (Grafo lógico de premisas y objeciones).
10. **LAB-10 (14–15 años):** *El Juicio al Algoritmo Discriminador* (Simulación judicial bajo el EU AI Act).

---

## ☀️ FICHA DETALLADA LAB-07: CRONOLOCALIZACIÓN SOLAR CON SUNCALC
- **Tramo:** 12–13 años (Tramo 4).
- **Problema:** Una publicación viral afirma que una foto de una manifestación se tomó a las 12:00 del mediodía en Madrid un 21 de junio.
- **Herramienta Forense:** Cálculo trigonométrico de sombras y consulta matemática a SunCalc:
  $$\tan(\gamma) = \frac{h_{\text{objeto}}}{s_{\text{sombra}}}$$
- **Protocolo de Resolución:**
  1. El alumno mide la altura de una farola ($h = 4.0\text{ m}$) y la longitud de su sombra ($s = 6.9\text{ m}$) en la imagen.
  2. Calcula el ángulo de elevación solar: $\gamma = \arctan(4.0 / 6.9) \approx 30.1^\circ$.
  3. Ejecuta la consulta a SunCalc para Madrid el 21 de junio: a las 12:00 el sol está a $72^\circ$ de elevación. Una elevación de $30^\circ$ solo ocurre a las 08:30 de la mañana o a las 19:15 de la tarde.
  4. **Conclusión Forense:** La afirmación de que la foto se tomó a mediodía es matemáticamente falsa.

---

## 🕵️ FICHA DETALLADA LAB-08: ANÁLISIS FORENSE DE DEEPFAKES Y C2PA
- **Tramo:** 12–13 años (Tramo 4).
- **Problema:** Un archivo de audio muestra a un director escolar suspendiendo las clases, pero la voz suena ligeramente metálica.
- **Herramienta Forense:** Análisis espectrográfico de formantes y verificación de manifiesto criptográfico JUMBF C2PA.
- **Protocolo:**
  1. Cargar el audio en el analizador de espectro Web Audio API en cliente.
  2. Inspeccionar la continuidad armónica en frecuencias superiores a $4.000\text{ Hz}$ (los modelos de clonación TTS suelen presentar cortes abruptos en altas frecuencias).
  3. Comprobar la firma digital X.509 de la Content Authenticity Initiative. Si el contenedor carece de firma o ha sido modificado tras la firma, se declara como "Origen No Verificado".
