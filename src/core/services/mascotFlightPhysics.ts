/**
 * src/core/services/mascotFlightPhysics.ts
 * Cálculo de trayectoria Bézier, aceleración, rotación de alabeo y partículas stardust
 */

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxLife: number;
  life: number;
  color: string;
}

export class MascotFlightPhysics {
  /**
   * Calcula la posición (x, y) sobre la curva Bézier para el parámetro t [0, 1]
   */
  public static evaluateBezier(
    p0: { x: number; y: number },
    p1: { x: number; y: number },
    t: number
  ): { x: number; y: number; dx: number; dy: number } {
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;
    const dist = Math.hypot(dx, dy);

    // Altura del arco parabólico (vuelo cinematográfico)
    const arcHeight = Math.min(180, Math.max(50, dist * 0.28));
    const midY = Math.min(p0.y, p1.y) - arcHeight;

    const ctrl1 = { x: p0.x + dx * 0.25, y: midY };
    const ctrl2 = { x: p0.x + dx * 0.75, y: midY * 0.95 };

    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    // Ecuación cúbica
    const x = uuu * p0.x + 3 * uu * t * ctrl1.x + 3 * u * tt * ctrl2.x + ttt * p1.x;
    const y = uuu * p0.y + 3 * uu * t * ctrl1.y + 3 * u * tt * ctrl2.y + ttt * p1.y;

    // Derivada primera (velocidad tangencial para calcular el ángulo de alabeo)
    const dX =
      3 * uu * (ctrl1.x - p0.x) + 6 * u * t * (ctrl2.x - ctrl1.x) + 3 * tt * (p1.x - ctrl2.x);
    const dY =
      3 * uu * (ctrl1.y - p0.y) + 6 * u * t * (ctrl2.y - ctrl1.y) + 3 * tt * (p1.y - ctrl2.y);

    return { x, y, dx: dX, dy: dY };
  }

  /**
   * Función de suavizado Ease-In-Out Cúbica
   */
  public static easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /**
   * Crea una ráfaga de partículas de polvo de estrellas en la posición de la estela
   */
  public static createStardustCluster(
    x: number,
    y: number,
    glowColor: string = '#38bdf8',
    count: number = 4
  ): Particle[] {
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.5 + 0.5;
      particles.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 16,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 0.3,
        size: Math.random() * 3.5 + 1.5,
        alpha: 1.0,
        maxLife: Math.floor(Math.random() * 25 + 20),
        life: 0,
        color: glowColor,
      });
    }
    return particles;
  }

  /**
   * Actualiza el ciclo de vida de las partículas
   */
  public static updateParticles(particles: Particle[]): Particle[] {
    return particles
      .map((p) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.vy += 0.05;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);
        return p;
      })
      .filter((p) => p.life < p.maxLife && p.alpha > 0.01);
  }
}
