---
id: "know_astro_04_orbit"
slug: "astronomy.kepler_orbit.overview"
domain: "astronomy"
subject: "Mecánica Celeste"
topic: "Leyes de Kepler y Traslación Anual"
title: "Traslación Anual Kepleriana, Velocidad Orbital y Afelio/Perihelio"
summary: "La Tierra describe una órbita elíptica kepleriana (excentricidad e=0,0167) alrededor del Sol con un periodo de 365,25 días. La conservación del momento angular impone que en el perihelio (enero, 147,1 Mkm) el planeta alcance su velocidad máxima de 30,29 km/s, y en el afelio (julio, 152,1 Mkm) su velocidad mínima de 29,29 km/s."
concepts:
  - "primera_ley_kepler_elipses"
  - "segunda_ley_kepler_velocidad_areolar"
  - "tercera_ley_kepler_periodos"
  - "perihelio_vs_afelio"
  - "velocidad_orbital_tierra"
  - "sondas_perihelio_parker"
ageMin: 6
ageMax: 99
difficulty: "intermediate"
version: "2.5.0"
status: "published"
createdAt: 1786686000000
updatedAt: 1786686000000
sources:
  - sourceId: "src_nasa_jpl_horizons"
    name: "NASA JPL Solar System Dynamics & Horizons Ephemerides"
    url: "https://ssd.jpl.nasa.gov/"
    authority: "ephemeris_service"
    dateAccessed: "2026-08-14"
  - sourceId: "src_iau_minor_planet_center"
    name: "International Astronomical Union (IAU) Minor Planet Center"
    url: "https://minorplanetcenter.net/"
    authority: "standards_body"
    dateAccessed: "2026-08-14"
facts:
  - fact: "La órbita de la Tierra no es un círculo perfecto, sino una elipse casi circular con una excentricidad e = 0,0167."
    verified: true
    wowFactor: "A principios de enero (perihelio) estamos 5 millones de kilómetros más cerca del Sol que en julio (afelio), demostrando que la distancia no causa el invierno."
  - fact: "La velocidad orbital media de la Tierra es de 29,78 km/s (unos 107.200 km/h)."
    verified: true
    wowFactor: "En el tiempo que tardas en leer esta frase (5 segundos), la Tierra te ha transportado 150 kilómetros a través del espacio."
  - fact: "La Segunda Ley de Kepler establece que la línea Sol-Tierra barre áreas iguales en tiempos iguales (velocidad areolar constante)."
    verified: true
    wowFactor: "La Tierra viaja 1.000 km/h más rápido en enero que en julio para conservar su momento angular."
---

# Traslación Anual Kepleriana y Afelio/Perihelio

## 1. La Elipse Orbital y la 1ª Ley de Kepler

Johannes Kepler descubrió en 1609 que los planetas no giran en círculos perfectos, sino en **órbitas elípticas** con el Sol situado en uno de sus focos. La distancia media Tierra-Sol define **1 Unidad Astronómica (1 UA $\approx 149.597.870\text{ km}$)**. La excentricidad terrestre es muy baja ($e = 0,0167$), pero suficiente para marcar una diferencia de 5 millones de kilómetros entre sus puntos extremos.

> [!NOTE] 🤯 Dato WOW
> Durante el perihelio (3-4 de enero), la Tierra está a 147,1 millones de km del Sol; durante el afelio (4-5 de julio), se aleja hasta 152,1 millones de km.

![Órbita elíptica de un planeta con el Sol en uno de los focos](https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80)
*Crédito: NASA / JPL-Caltech*

---

## 2. Conservación del Momento Angular: La 2ª Ley de Kepler

La velocidad areolar del planeta es rigurosamente constante: $\frac{dA}{dt} = \frac{|\vec{L}|}{2m} = \text{constante}$. Por tanto, cuando la Tierra está más cerca del Sol se acelera hasta **$30,29\text{ km/s}$ ($109.000\text{ km/h}$)**, mientras que al alejarse en julio se ralentiza hasta **$29,29\text{ km/s}$ ($105.400\text{ km/h}$)**.

> [!NOTE] 🤯 Dato WOW
> El invierno boreal dura unos 89 días mientras que el verano boreal dura 93 días, debido a que la Tierra recorre más rápido el tramo de perihelio en los meses de invierno.

---

## 3. Armonía Cósmica: La 3ª Ley de Kepler ($P^2 = a^3$)

El cuadrado del periodo orbital ($P$) es proporcional al cubo del semieje mayor de la órbita ($a$): $\frac{P^2}{a^3} = \frac{4\pi^2}{G(M_\odot + m_\oplus)}$. En unidades de años y UA, para cualquier objeto del Sistema Solar se cumple $P^2 = a^3$.

![El Sol radiante en el foco orbital](https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=1200&q=80)
*Crédito: NASA / SDO*

---

## 4. Práctica 2026: Sondas a Velocidades Récord

En 2026, la sonda **Parker Solar Probe** aprovecha la mecánica kepleriana para batir todos los récords de la humanidad: en su perihelio pasa a solo 6,1 millones de km de la superficie solar a la descomunal velocidad de **$692.000\text{ km/h}$ ($192\text{ km/s}$)**.
