import { CriterioModule } from '../../types';
import { CRITERIO_MODULES } from '../modulesData';
import { TRAMO_1_MODULES } from './tramo1_6_7';
import { TRAMO_2_MODULES } from './tramo2_8_9';
import { TRAMO_3_MODULES } from './tramo3_10_11';
import { TRAMO_4_MODULES } from './tramo4_12_13';
import { TRAMO_5_MODULES } from './tramo5_14_15';

/**
 * ÍNDICE UNIFICADO DEL CURRÍCULO CRITERIO (SSOT docs/criterio/00_MASTER_PLAN_CURRICULAR.md)
 *
 * 35 unidades LOMLOE en 5 tramos de edad (6-7, 8-9, 10-11, 12-13, 14-15)
 * + módulos legacy transversales (8-18) que siguen vigentes.
 *
 * Orden: tramos por edad ascendente, legacy al final.
 * Cada módulo suma a la gamificación global GOALS vía addXP(xp, 'criterio', ...)
 * → XP cósmico + moneda Synapse + rangos + Master Key (ProgressContext).
 */
export const ALL_CRITERIO_MODULES: CriterioModule[] = [
  ...TRAMO_1_MODULES,
  ...TRAMO_2_MODULES,
  ...TRAMO_3_MODULES,
  ...TRAMO_4_MODULES,
  ...TRAMO_5_MODULES,
  ...CRITERIO_MODULES,
];

export const TRAMOS_INFO = [
  { bracket: '6-7' as const, label: '6–7 años', nombre: 'El Explorador Curioso', curso: '1.º–2.º Primaria', modulos: TRAMO_1_MODULES },
  { bracket: '8-9' as const, label: '8–9 años', nombre: 'El Constructor de Maestría', curso: '3.º–4.º Primaria', modulos: TRAMO_2_MODULES },
  { bracket: '10-11' as const, label: '10–11 años', nombre: 'El Constructor de Maestría', curso: '5.º–6.º Primaria', modulos: TRAMO_3_MODULES },
  { bracket: '12-13' as const, label: '12–13 años', nombre: 'El Estratega Autónomo', curso: '1.º–2.º ESO', modulos: TRAMO_4_MODULES },
  { bracket: '14-15' as const, label: '14–15 años', nombre: 'El Estratega Autónomo', curso: '3.º–4.º ESO', modulos: TRAMO_5_MODULES },
];
