---
id: "eso_fq_01"
discipline: "school"
order: 1
title: "Cinemática: MRU y MRUA"
subtitle: "Ecuaciones de Posición, Velocidad y Aceleración en Línea Recta"
tag: "Física y Química 3º/4º ESO • Cinemática Clásica"
icon: "⚡"
heroImage: "https://images.unsplash.com/photo-1517976487507-5b3b4a45097c?auto=format&fit=crop&w=1200&q=80"
xpReward: 60
estimatedMinutes: 9
version: 2
status: "published"
updatedAt: "2026-08-14"
sources:
  - "Currículo Oficial LOMLOE - Real Decreto 217/2022"
  - "CERN Educational Physics Resources"
---

# Cinemática: Movimiento Rectilíneo Uniforme y Acelerado

## 1. Posición, Velocidad y el MRU

El Movimiento Rectilíneo Uniforme (MRU) describe el desplazamiento de un cuerpo a lo largo de una línea recta con velocidad constante ($v = \text{cte}$), por lo que su aceleración es nula ($a = 0$). La posición en cada instante $t$ se rige por:

$$x(t) = x_0 + v \cdot (t - t_0)$$

Donde $x$ es la posición final en metros ($\text{m}$), $x_0$ la posición inicial y $v$ la velocidad en metros por segundo ($\text{m/s}$).

> [!NOTE] 🤯 Dato WOW
> Un fotón de luz viaja a $300.000\text{ km/s}$ con MRU en el vacío y tarda exactamente **1,28 segundos** en viajar desde la superficie de la Luna hasta la Tierra.

![Tren de levitación magnética de alta velocidad sobre vía rectilínea](https://images.unsplash.com/photo-1517976487507-5b3b4a45097c?auto=format&fit=crop&w=1200&q=80)
*Crédito: Unsplash / Physics Archive*

---

## 2. Aceleración y el MRUA

Cuando la velocidad de un objeto cambia a ritmo constante en el tiempo, estamos ante un Movimiento Rectilíneo Uniformemente Acelerado (MRUA). La aceleración ($a$) se define como:

$$a = \frac{v_f - v_0}{t - t_0} \quad \Longrightarrow \quad v(t) = v_0 + a \cdot t$$

La ecuación de posición para el MRUA es cuadrática respecto al tiempo:

$$x(t) = x_0 + v_0 \cdot t + \frac{1}{2} a \cdot t^2$$

> [!NOTE] 🤯 Dato WOW
> En caída libre en el vacío (sin rozamiento del aire), una pluma y una bola de plomo caen exactamente con la misma aceleración gravitatoria: $g = 9,8\text{ m/s}^2$.

---

## 3. Gráficas Cinemáticas ($x-t$ y $v-t$) y Aplicación Real

Las gráficas revelan el comportamiento dinámico del móvil:
- En MRU: La gráfica $x-t$ es una **recta inclinada** cuya pendiente es la velocidad, y la gráfica $v-t$ es una **recta horizontal plana**.
- En MRUA: La gráfica $x-t$ es una **parábola**, y la gráfica $v-t$ es una **recta inclinada** cuya pendiente es la aceleración. El área bajo la curva $v-t$ representa la distancia total recorrida ($\Delta x$).

> [!TIP] 🚀 Actualidad Científica 2026
> Los sensores inerciales MEMS en cohetes y coches autónomos en 2026 muestrean la aceleración 1.000 veces por segundo para calcular la posición con precisión milimétrica.

> [!CASE] Caso de Estudio de Física
> Un tren de alta velocidad que viaja a $300\text{ km/h}$ ($83,3\text{ m/s}$) frena con una desaceleración constante de $a = -1,5\text{ m/s}^2$. Tarda $t = 83,3 / 1,5 = 55,5\text{ segundos}$ en detenerse por completo, recorriendo una distancia de frenado de $x = \frac{1}{2}(83,3)(55,5) \approx 2.311\text{ metros}$.

![Gráfica de aceleración y telemetría de frenado en ingeniería](https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80)
*Crédito: CERN / Engineering Physics*

---

## 🧠 Test de Evaluación

### Q1: Si un móvil se desplaza con MRU a una velocidad constante de 20 m/s durante 15 segundos, ¿qué distancia total recorre? (choice)
- [x] 300 metros (x = 20 m/s × 15 s)
- [ ] 35 metros
- [ ] 150 metros
- [ ] 600 metros

### Q2: Un coche parte del reposo (v0 = 0) y acelera a 3 m/s² durante 4 segundos. ¿Qué velocidad alcanza al final del intervalo? (choice)
- [x] 12 m/s (v = 0 + 3 × 4)
- [ ] 7 m/s
- [ ] 24 m/s
- [ ] 1 m/s

### Q3: ¿Qué representa la pendiente de la gráfica velocidad-tiempo (v-t) en cinemática? (choice)
- [x] La aceleración del móvil
- [ ] La masa del cuerpo
- [ ] La fuerza gravitatoria
- [ ] La energía cinética

### Q4: Ordena las etapas del movimiento de un cohete espacial desde el encendido de motores: (order)
1. Reposo en plataforma de lanzamiento (v = 0, x = 0)
2. Aceleración positiva constante (MRUA ascendente con empuje de motores)
3. Apagado de motores y ascenso por inercia desacelerada (a = -g)
4. Alcanza el punto de máxima altitud o apogeo (v = 0 instantáneo)
