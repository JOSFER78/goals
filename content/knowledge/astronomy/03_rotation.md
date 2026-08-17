---
id: "know_astro_03_rotation"
slug: "astronomy.rotation_and_timezones.overview"
domain: "astronomy"
subject: "Cinemática Terrestre"
topic: "Rotación y Husos Horarios"
title: "Rotación Terrestre, Día/Noche y Husos Horarios"
summary: "El giro inercial de la Tierra de Oeste a Este sobre su eje polar engendra la alternancia de día y noche, el viaje del terminador solar y la división del globo en 24 meridianos horarios de 15° (UTC). La diferencia entre el día sidéreo (23h 56m) y el día solar (24h) surge del avance orbital diario."
concepts:
  - "rotacion_eje_polar"
  - "terminador_solar"
  - "dia_sidereo_vs_dia_solar"
  - "husos_horarios_utc"
  - "punto_subsolar_eratóstenes"
  - "crepusculos_atmosfericos"
ageMin: 6
ageMax: 99
difficulty: "beginner"
version: "2.5.0"
status: "published"
createdAt: 1786686000000
updatedAt: 1786686000000
sources:
  - sourceId: "src_iers_earth_rotation"
    name: "International Earth Rotation and Reference Systems Service (IERS)"
    url: "https://www.iers.org/"
    authority: "geodesy_service"
    dateAccessed: "2026-08-14"
  - sourceId: "src_bipm_time_section"
    name: "Bureau International des Poids et Mesures (BIPM - UTC Time)"
    url: "https://www.bipm.org/"
    authority: "standards_body"
    dateAccessed: "2026-08-14"
facts:
  - fact: "En el ecuador terrestre, la velocidad tangencial de rotación es de aproximadamente 1.670 km/h (464 m/s), reduciéndose a cero en los polos."
    verified: true
    wowFactor: "No sentimos el tremendo giro de 1.670 km/h porque la atmósfera, los océanos y nosotros mismos nos movemos juntos a velocidad constante inercial."
  - fact: "Un giro completo de 360° respecto a las estrellas lejanas (Día Sidéreo) dura 23 horas, 56 minutos y 4 segundos."
    verified: true
    wowFactor: "Debido a que la Tierra avanza ~1° al día alrededor del Sol, debe girar 4 minutos adicionales para que el Sol vuelva a estar en el cenit (Día Solar de 24h)."
  - fact: "La Tierra está dividida en 24 husos horarios estándar de 15° de longitud cada uno (360° / 24h = 15°/hora)."
    verified: true
    wowFactor: "En la Línea Internacional de Cambio de Fecha en el Pacífico (meridiano 180°), dar un paso hacia el oeste te hace viajar mágicamente al día de mañana."
---

# Rotación Terrestre, Día/Noche y Husos Horarios

## 1. El Giro Inercial y el Terminador Solar

La Tierra rota sobre su eje polar de Oeste a Este, completando una vuelta cada 24 horas. Esta rotación proyecta una frontera continua de luz y sombra llamada **Terminador Solar**. En el ecuador, la superficie viaja a $1.670\text{ km/h}$; en latitudes medias como España o Estados Unidos, a unos $1.280\text{ km/h}$.

> [!NOTE] 🤯 Dato WOW
> Eratóstenes calculó la circunferencia terrestre en el 240 a.C. con un error menor al 2% utilizando únicamente la longitud de la sombra de dos estacas en Alejandría y Siena.

![La Tierra nocturna "Black Marble" con luces urbanas y terminador solar](https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80)
*Crédito: NASA Earth Observatory / NOAA*

---

## 2. Día Sidéreo ($23\text{h }56\text{m}$) vs Día Solar ($24\text{h }00\text{m}$)

Existe una diferencia física crucial entre los dos modos de medir el día:
- **Día Sidéreo**: Tiempo que tarda la Tierra en dar $360^\circ$ exactos respecto a las estrellas distantes: $23\text{ horas, } 56\text{ minutos y } 4\text{ segundos}$.
- **Día Solar Medio**: Tiempo entre dos pasos sucesivos del Sol por el meridiano local: $24\text{ horas, } 00\text{ minutos y } 00\text{ segundos}$.
Dado que la Tierra se desplaza $\approx 0,9856^\circ$ cada día en su órbita alrededor del Sol, debe girar $\approx 360,9856^\circ$ para volver a encarar al astro rey.

---

## 3. Los 24 Husos Horarios UTC y Crepúsculos

La esfera de $360^\circ$ se divide entre 24 horas: $15^\circ$ de longitud equivalen a 1 hora de diferencia. El meridiano de referencia es el Meridiano de Greenwich ($0^\circ$, UTC). La atmósfera dispersa la luz solar creando los crepúsculos civil ($0^\circ$ a $-6^\circ$), náutico ($-6^\circ$ a $-12^\circ$) y astronómico ($-12^\circ$ a $-18^\circ$).

![Puesta de sol y crepúsculo atmosférico visto desde el espacio](https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80)
*Crédito: NASA / ISS Expedition Crew*

---

## 4. Práctica 2026: Geodesia Satelital y Redefinición del Tiempo Atómico

En 2026, el servicio IERS y las redes globales GNSS (GPS, Galileo) monitorean las microvariaciones de la duración del día ($LOD$), donde las corrientes oceánicas y la redistribución de hielos aceleran milisegundos el giro neto del planeta, coordinando los relojes atómicos internacionales.
