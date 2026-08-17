# PROMPT DE INICIO PARA HERMES

Quiero que uses la skill `immersive-explorer-builder` para convertir una intención humana en una experiencia interactiva de conocimiento de gran calidad.

## Cómo debes trabajar

No empieces programando.

Primero interpreta lo que te diga y clasifica:
- qué quiero representar;
- quién lo va a usar;
- qué quiero que aprenda o pueda hacer;
- qué nivel de realismo necesito;
- qué escalas hay que recorrer;
- qué interacción imagino;
- si existe una dimensión temporal/histórica;
- qué datos deben ser reales;
- qué recursos/assets serán necesarios.

Después:

1. AUDITA el proyecto existente si ya hay código.
2. INVESTIGA el dominio y las soluciones existentes.
3. INVESTIGA fuentes primarias y datos fiables.
4. INVESTIGA assets y sus licencias.
5. INVESTIGA tecnologías que ya resuelvan parte del problema.
6. PROPÓN la arquitectura.
7. DEFINE el modelo de datos, escalas, cámara y niveles de detalle.
8. DEFINE qué agentes/subagentes y qué herramientas/MCP serían útiles.
9. CONSTRUYE un tracer bullet de la parte técnicamente más difícil.
10. VERIFICA antes de ampliar.
11. CONSTRUYE el resto por fases pequeñas.
12. HAZ QA visual, funcional, de datos, rendimiento y accesibilidad.

## Regla fundamental

No quiero que conviertas mi petición en una única página HTML improvisada si el concepto necesita un motor reutilizable.

Para experiencias que deban crecer —por ejemplo:
- espacio,
- mapas,
- historia,
- anatomía,
- células,
- maquinaria,
- ingeniería,
- arquitectura,
- ciencia—

debes evaluar primero una arquitectura de **Explorer Engine + datos/configuración de dominio + experiencia educativa**.

HTML puede ser la superficie final de despliegue. No asumas que un único HTML es la arquitectura correcta.

## Quiero reutilización

Si construimos primero un explorador espacial y posteriormente uno del cuerpo humano, quiero que el motor común pueda reutilizar conceptos como:
- selección;
- foco;
- navegación;
- zoom multiescala;
- LOD;
- capas;
- anotaciones;
- timeline;
- mediciones;
- comparación;
- paneles contextuales;
- misiones educativas;
- procedencia de datos.

El dominio debe cambiar los datos y las reglas específicas, no obligarnos a reconstruir el motor completo.

## Investigación y herramientas

Tienes acceso a varias herramientas y posiblemente MCPs. No uses herramientas por inercia.

Antes de instalar o añadir un MCP:
1. define exactamente qué operación necesitas;
2. comprueba si Hermes ya puede hacerlo;
3. comprueba si existe un MCP ya conectado que cubra la necesidad;
4. sólo entonces propón uno nuevo.

Nunca inventes nombres de herramientas, endpoints o paquetes.

## Agentes

Cuando sea útil, divide el trabajo en especialistas con entregables claros, por ejemplo:

- investigación del dominio;
- investigación de assets/licencias;
- arquitectura técnica;
- UX/educación;
- implementación;
- QA.

No hagas que varios agentes editen simultáneamente los mismos archivos críticos.

## Antes de programar

Quiero una primera respuesta que contenga únicamente:

### A. Qué has entendido
### B. Qué necesita investigar
### C. Qué partes técnicas son difíciles
### D. Qué arquitectura propones
### E. Qué herramientas/MCP usarías y por qué
### F. Qué agentes propones
### G. Qué tracer bullet construirías primero
### H. Qué riesgos detectas
### I. Qué necesitas que confirme yo, si es que necesitas algo

Y después ESPERA.

No escribas código hasta que la arquitectura esté clara, salvo que yo te diga expresamente que puedes proceder.

## Criterio de calidad

No considero éxito que “se vea bonito”.

Considero éxito que la experiencia:
- sea realmente navegable;
- permita acercarse e inspeccionar;
- tenga datos y unidades coherentes;
- diferencie realidad de reconstrucción y simplificación;
- cargue detalle progresivamente;
- mantenga buen rendimiento;
- tenga información contextual;
- y pueda crecer sin convertirse en una colección de páginas aisladas.

Empieza analizando la intención que te voy a dar y usa la skill `immersive-explorer-builder`.
