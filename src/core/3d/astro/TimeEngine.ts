/**
 * GOALS 3D Cosmos Engine - TimeEngine
 * Controlador de Tiempo Cósmico, Aceleración Temporal y Épocas Históricas
 */

export interface HistoricalEvent {
  id: string;
  name: string;
  date: Date;
  description: string;
  focusTarget: string;
}

export const HISTORICAL_EVENTS: HistoricalEvent[] = [
  {
    id: 'present',
    name: 'Tiempo Presente (En Vivo)',
    date: new Date(),
    description: 'Efemérides astronómicas en tiempo real sincronizadas con UTC.',
    focusTarget: 'earth'
  },
  {
    id: 'apollo11',
    name: 'Apolo 11: Alunizaje Histórico',
    date: new Date('1969-07-20T20:17:40Z'),
    description: 'El módulo lunar Eagle se posa en el Mar de la Tranquilidad.',
    focusTarget: 'moon'
  },
  {
    id: 'iss_first_module',
    name: 'Lanzamiento del Módulo Zarya (ISS)',
    date: new Date('1998-11-20T06:40:00Z'),
    description: 'Despegue del primer módulo presurizado de la Estación Espacial.',
    focusTarget: 'iss'
  },
  {
    id: 'jwst_launch',
    name: 'Lanzamiento del Telescopio James Webb',
    date: new Date('2021-12-25T12:20:00Z'),
    description: 'Despegue en el cohete Ariane 5 rumbo al punto de Lagrange L2.',
    focusTarget: 'jwst'
  }
];

export class TimeEngine {
  public simDate: Date;
  public timeScale: number = 1.0; // Multiplicador de velocidad (1s real = 1s * timeScale)
  public isPaused: boolean = false;

  private onTickCallbacks: Array<(simDate: Date, timeScale: number, isPaused: boolean) => void> = [];

  constructor(initialDate: Date = new Date()) {
    this.simDate = new Date(initialDate.getTime());
  }

  /**
   * Avanza el reloj de la simulación según el delta de tiempo real en segundos
   */
  public update(realDeltaSec: number): Date {
    if (!this.isPaused && realDeltaSec > 0) {
      const advancedMs = realDeltaSec * this.timeScale * 1000.0;
      this.simDate = new Date(this.simDate.getTime() + advancedMs);
    }

    this.onTickCallbacks.forEach(cb => cb(this.simDate, this.timeScale, this.isPaused));
    return this.simDate;
  }

  public setTimeScale(scale: number) {
    this.timeScale = Math.max(0.1, scale);
    if (this.isPaused) this.isPaused = false;
  }

  public togglePause(): boolean {
    this.isPaused = !this.isPaused;
    return this.isPaused;
  }

  public setDate(date: Date) {
    this.simDate = new Date(date.getTime());
  }

  public setHistoricEvent(eventId: string): HistoricalEvent | undefined {
    const event = HISTORICAL_EVENTS.find(e => e.id === eventId);
    if (event) {
      if (event.id === 'present') {
        this.setDate(new Date());
      } else {
        this.setDate(event.date);
      }
    }
    return event;
  }

  public onTick(callback: (simDate: Date, timeScale: number, isPaused: boolean) => void) {
    this.onTickCallbacks.push(callback);
  }

  /**
   * Formato ISO legible para la interfaz astronómica
   */
  public formatUTC(): string {
    const d = this.simDate;
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    
    const day = pad(d.getUTCDate());
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const month = months[d.getUTCMonth()];
    const year = d.getUTCFullYear();
    
    const hours = pad(d.getUTCHours());
    const mins = pad(d.getUTCMinutes());
    const secs = pad(d.getUTCSeconds());

    return `${day} ${month} ${year} • ${hours}:${mins}:${secs} UTC`;
  }
}
