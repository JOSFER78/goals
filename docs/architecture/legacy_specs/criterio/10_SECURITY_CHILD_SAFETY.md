# 10 · SEGURIDAD INFANTIL, PRIVACIDAD Y ÉTICA EDUCATIVA (FASE 3 — CHILD SAFETY)
**Mini App**: CRITERIO · Aprender a Informarse (GOALS)  
**Marco de Cumplimiento**: COPPA, GDPR-K, Protocolos de Protección del Menor y Ética en IA  

---

## 1. GUARDRAILS DE CONTENIDO Y PROTECCIÓN DEL MENOR

1. **Cero Contenido Adulto, Violento o Traumático**:
   - Para enseñar a detectar bulos o desinformación, **NUNCA** se emplean imágenes gráficas explícitas de violencia, catástrofes extremas o temas inapropiados para la infancia.
   - Todos los ejemplos giran en torno a situaciones escolares, deportes, inventos, naturaleza, ciencia, videojuegos, astronomía y redes sociales familiares.
2. **Neutralidad Absoluta y No Partidismo**:
   - La plataforma nunca adoctrina ni toma partido en disputas políticas coyunturales.
   - Se enseña a examinar la solidez de las pruebas y la transparencia metodológica de cualquier afirmación, sin importar quién la emita.
3. **Privacidad por Diseño (Privacy by Design)**:
   - No se solicitan ni almacenan datos personales identificables innecesarios (PII) de los menores.
   - Las consultas realizadas a la IA se anonimizan y no se utilizan para entrenar modelos públicos externos.
4. **Protección contra la Fatiga y la Dependencia**:
   - Se promueve la desconexión saludable mediante el Método PAUSA.
   - La plataforma no implementa patrones oscuros (*dark patterns*) de retención infinita.

---

## 2. FILTRADO DE ENTRADAS Y SALIDAS EN EL SERVICIO DE IA

- Toda interacción con el endpoint LLM pasa por una capa de sanitización previa que bloquea intentos de *jailbreak*, lenguaje ofensivo o peticiones fuera del ámbito educativo.
- En caso de detectar contenido inapropiado o potencialmente dañino, la IA emite un mensaje de seguridad cordial y reconduce la sesión hacia actividades constructivas.
