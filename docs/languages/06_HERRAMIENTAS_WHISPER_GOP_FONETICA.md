# 🎙️ 06. HERRAMIENTAS REALES: WHISPER ONNX, MÉTRICA GOP Y FORMANTES F1/F2
## Pila Tecnológica de Audio en Navegador, Reconocimiento Privado en Cliente y Evaluación Fonética

**Especialidad:** Procesamiento de Voz en Tiempo Real y Fonética Acústica  
**Seguridad:** 100% In-Browser (Privacidad Infantil COPPA/GDPR Compliant) · Cero Servidores Externos de Voz  

---

## 1. PUTA DE PROCESAMIENTO DE AUDIO

```
[ MICRÓFONO ALUMNO (16 kHz Float32) ]
                  │
                  ▼
   [ Silero VAD (Detección de Voz) ]
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
 [ AnalyserNode FFT ]   [ Whisper-tiny.en ONNX ]
  Formantes F1 / F2      Transcripción y Timestamps
        │                   │
        ▼                   ▼
 [ Carta Vocálica IPA ] [ Forced Alignment Viterbi ]
                            │
                            ▼
                     [ Métrica GOP Fonema a Fonema ]
```

---

## 2. MÉTRICA GOP (GOODNESS OF PRONUNCIATION)

$$\text{GOP}(p_i) = \frac{1}{T_i} \sum_{t=t_s}^{t_e} \log \frac{P(o_t \mid p_i)}{\max_{q \in Q} P(o_t \mid q)}$$

- $\text{GOP} \ge -0.15 \implies$ **Fonema Nativo (Verde / Excelente)**
- $-0.50 \le \text{GOP} < -0.15 \implies$ **Acentuación Ligera (Amarillo / Aceptable)**
- $\text{GOP} < -0.50 \implies$ **Sustitución Fonética / Error Grave (Rojo / Revisión)**

---

## 3. FORMANTES DE RESONANCIA VOCÁLICA ($F_1$ Y $F_2$)
- **Formante 1 ($F_1$):** Inversamente proporcional a la altura de la lengua (Apertura mandibular). Rango: $250\text{ Hz}$ (/iː/) a $850\text{ Hz}$ (/æ/).
- **Formante 2 ($F_2$):** Directamente proporcional al avance lingual (Posición anterior). Rango: $800\text{ Hz}$ (/uː/) a $2400\text{ Hz}$ (/iː/).
