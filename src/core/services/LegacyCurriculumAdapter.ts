/**
 * src/core/services/LegacyCurriculumAdapter.ts
 * Adaptador bidireccional y puente de compatibilidad entre las 12 lecciones clásicas
 * de Astronomía y el nuevo modelo universal `CurriculumUnit`.
 * Garantiza 100% de retrocompatibilidad sin romper la experiencia 3D actual.
 */

import { CurriculumUnit, AgeTranche } from '../types/adaptiveCurriculum';
import { CurriculumStep, CurriculumTest } from '../types/curriculum';
import { LESSONS } from '../../experiences/astro/data/lessonsData';
import { Lesson, LessonStep, Question } from '../../experiences/astro/types';

// Mapeo semántico de tramos y conceptos para las 12 lecciones de Astro
const ASTRO_METADATA_MAP: Record<number, {
  canonicalId: string;
  ageTranche: AgeTranche;
  targetAge: number;
  knowledgeSlugs: string[];
  coreConcepts: string[];
  prerequisites: string[];
  lomloeCompetency: string;
}> = {
  1: {
    canonicalId: 'astro_u01_earth_atmosphere',
    ageTranche: '6-7',
    targetAge: 7,
    knowledgeSlugs: ['astronomy.earth.atmosphere', 'astronomy.satellites.iss'],
    coreConcepts: ['atmosfera_terrestre', 'linea_karman', 'estacion_espacial_internacional'],
    prerequisites: [],
    lomloeCompetency: 'LOMLOE.CN.1.1 (Observación de la Tierra y la atmósfera)'
  },
  2: {
    canonicalId: 'astro_u02_eclipses',
    ageTranche: '8-9',
    targetAge: 8,
    knowledgeSlugs: ['astronomy.moon.eclipses', 'astronomy.eclipse_2026_spain'],
    coreConcepts: ['eclipse_solar', 'eclipse_lunar', 'umbra_penumbra', 'nodos_orbitales'],
    prerequisites: ['astro_u01_earth_atmosphere'],
    lomloeCompetency: 'LOMLOE.CN.2.3 (Alineaciones Sol-Tierra-Luna)'
  },
  3: {
    canonicalId: 'astro_u03_rotation_day_night',
    ageTranche: '6-7',
    targetAge: 7,
    knowledgeSlugs: ['astronomy.earth.rotation', 'astronomy.earth.timezones'],
    coreConcepts: ['rotacion_terrestre', 'ciclo_dia_noche', 'husos_horarios'],
    prerequisites: ['astro_u01_earth_atmosphere'],
    lomloeCompetency: 'LOMLOE.CN.1.2 (Ciclo día y noche)'
  },
  4: {
    canonicalId: 'astro_u04_orbit_kepler',
    ageTranche: '10-11',
    targetAge: 10,
    knowledgeSlugs: ['astronomy.earth.orbit', 'astronomy.physics.kepler_laws'],
    coreConcepts: ['traslacion_terrestre', 'orbita_eliptica', 'afelio_perihelio'],
    prerequisites: ['astro_u03_rotation_day_night'],
    lomloeCompetency: 'LOMLOE.CN.3.1 (Movimiento de traslación orbital)'
  },
  5: {
    canonicalId: 'astro_u05_seasons_obliquity',
    ageTranche: '8-9',
    targetAge: 9,
    knowledgeSlugs: ['astronomy.earth.seasons', 'astronomy.earth.axial_tilt'],
    coreConcepts: ['inclinacion_axial_23_44', 'estaciones_del_ano', 'solsticios_equinoccios'],
    prerequisites: ['astro_u04_orbit_kepler'],
    lomloeCompetency: 'LOMLOE.CN.2.4 (Causas de las estaciones climáticas)'
  },
  6: {
    canonicalId: 'astro_u06_solar_system_planets',
    ageTranche: '8-9',
    targetAge: 9,
    knowledgeSlugs: ['astronomy.solar_system.planets', 'astronomy.solar_system.asteroids'],
    coreConcepts: ['planetas_rocosos', 'gigantes_gaseosos', 'cinturon_asteroides'],
    prerequisites: ['astro_u05_seasons_obliquity'],
    lomloeCompetency: 'LOMLOE.CN.2.1 (Estructura del Sistema Solar)'
  },
  7: {
    canonicalId: 'astro_u07_oort_cloud_voyager',
    ageTranche: '10-11',
    targetAge: 11,
    knowledgeSlugs: ['astronomy.solar_system.oort_cloud', 'astronomy.missions.voyager_1'],
    coreConcepts: ['nube_oort', 'heliopausa', 'sonda_voyager_1', 'limites_sistema_solar'],
    prerequisites: ['astro_u06_solar_system_planets'],
    lomloeCompetency: 'LOMLOE.CN.3.4 (Fronteras planetarias y exploración)'
  },
  8: {
    canonicalId: 'astro_u08_nearby_stars_centauri',
    ageTranche: '12-13',
    targetAge: 12,
    knowledgeSlugs: ['astronomy.stars.alpha_centauri', 'astronomy.exoplanets.proxima_b'],
    coreConcepts: ['anos_luz', 'alfa_centauri', 'proxima_centauri', 'exoplanetas_habitables'],
    prerequisites: ['astro_u07_oort_cloud_voyager'],
    lomloeCompetency: 'LOMLOE.BG.1.3 (Sistemas estelares y exoplanetas)'
  },
  9: {
    canonicalId: 'astro_u09_milky_way_black_hole',
    ageTranche: '12-13',
    targetAge: 13,
    knowledgeSlugs: ['astronomy.galaxies.milky_way', 'astronomy.black_holes.sagittarius_a'],
    coreConcepts: ['via_lactea', 'brazos_espirales', 'sagitario_a_estrella', 'agujero_negro_supermasivo'],
    prerequisites: ['astro_u08_nearby_stars_centauri'],
    lomloeCompetency: 'LOMLOE.BG.1.4 (Estructura de la galaxia y centros galácticos)'
  },
  10: {
    canonicalId: 'astro_u10_local_group_andromeda',
    ageTranche: '14-15',
    targetAge: 14,
    knowledgeSlugs: ['astronomy.galaxies.local_group', 'astronomy.galaxies.andromeda_m31'],
    coreConcepts: ['grupo_local', 'andromeda_m31', 'colision_milkomeda', 'galaxias_satelite'],
    prerequisites: ['astro_u09_milky_way_black_hole'],
    lomloeCompetency: 'LOMLOE.FQ.3.2 (Gravedad a escala intergaláctica)'
  },
  11: {
    canonicalId: 'astro_u11_laniakea_great_attractor',
    ageTranche: '14-15',
    targetAge: 15,
    knowledgeSlugs: ['astronomy.cosmology.laniakea', 'astronomy.cosmology.great_attractor'],
    coreConcepts: ['supercumulo_laniakea', 'gran_atractor', 'red_cosmica', 'filamentos_galacticos'],
    prerequisites: ['astro_u10_local_group_andromeda'],
    lomloeCompetency: 'LOMLOE.FQ.4.1 (Estructura a gran escala del Cosmos)'
  },
  12: {
    canonicalId: 'astro_u12_observable_universe_cmb',
    ageTranche: '14-15',
    targetAge: 15,
    knowledgeSlugs: ['astronomy.cosmology.observable_universe', 'astronomy.cosmology.cmb_radiation'],
    coreConcepts: ['universo_observable', 'fondo_radiacion_cosmica_cmb', 'expansion_espacio_big_bang'],
    prerequisites: ['astro_u11_laniakea_great_attractor'],
    lomloeCompetency: 'LOMLOE.FQ.4.4 (Cosmología moderna y origen del Universo)'
  }
};

export class LegacyCurriculumAdapter {
  /**
   * Transforma una lección clásica a una unidad `CurriculumUnit` universal
   */
  public static adaptLessonToUnit(lesson: Lesson): CurriculumUnit {
    const meta = ASTRO_METADATA_MAP[lesson.id] || {
      canonicalId: `astro_u${String(lesson.id).padStart(2, '0')}`,
      ageTranche: '8-9' as AgeTranche,
      targetAge: 9,
      knowledgeSlugs: [`astronomy.lesson_${lesson.id}`],
      coreConcepts: [`concepto_astro_${lesson.id}`],
      prerequisites: lesson.id > 1 ? [`astro_u${String(lesson.id - 1).padStart(2, '0')}`] : [],
      lomloeCompetency: 'LOMLOE.CN.General'
    };

    const steps: CurriculumStep[] = (lesson.steps || []).map((s: LessonStep, idx: number) => ({
      stepNumber: idx + 1,
      type: 'concept',
      title: s.t,
      subtitle: '',
      content: s.text,
      icon: lesson.icon,
      badge: '',
      wowFact: s.wow,
      media: s.photo ? {
        type: 'image',
        url: s.photo.url,
        caption: s.photo.caption,
        credit: s.photo.credit
      } : undefined,
      model3d: s.scene ? { sceneId: s.scene, objectId: s.scene } : undefined
    }));

    const questions = (lesson.test || []).map((q: Question, qIdx: number) => {
      if (q.type === 'order') {
        const orderItems = (q.items || []).map((itemStr: string, itemIdx: number) => ({
          id: `item_${itemIdx + 1}`,
          label: itemStr
        }));
        return {
          id: qIdx + 1,
          type: 'order' as const,
          prompt: q.question,
          explanation: q.explanation || 'Comprende el orden físico observando distancias o tiempos.',
          difficulty: 'medium' as const,
          xp: 25,
          orderItems,
          correctOrder: (q.correctOrder || []).map((_, cIdx) => `item_${cIdx + 1}`)
        };
      }
      return {
        id: qIdx + 1,
        type: 'choice' as const,
        prompt: q.question,
        explanation: q.explanation || 'Comprende el fenómeno observando la alineación y escala física.',
        difficulty: 'medium' as const,
        xp: 25,
        options: q.options || [],
        correctAnswer: q.answer
      };
    });

    const test: CurriculumTest = {
      id: `test_astro_${lesson.id}`,
      lessonId: meta.canonicalId,
      disciplineId: 'astro',
      title: `Evaluación: ${lesson.title}`,
      passScorePercent: 75,
      xpReward: 50,
      questions,
      version: 1,
      status: 'published',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    return {
      id: meta.canonicalId,
      canonicalNumber: lesson.id,
      disciplineId: 'astro',
      ageTranche: meta.ageTranche,
      targetAge: meta.targetAge,
      title: lesson.title,
      subtitle: lesson.tag || `Tema ${lesson.id} • ASTRONOMÍA 3D`,
      tag: lesson.tag || `Tema ${lesson.id} • ASTRONOMÍA 3D`,
      icon: lesson.icon,
      heroImage: lesson.hero || null,
      xpReward: 50,
      estimatedMinutes: Math.max(5, (lesson.steps?.length || 5) * 2),
      knowledgeSlugs: meta.knowledgeSlugs,
      competencies: [{
        code: meta.lomloeCompetency.split(' ')[0],
        title: meta.lomloeCompetency,
        description: `Competencia curricular oficial de ciencias espaciales`,
        stage: meta.ageTranche.startsWith('6') || meta.ageTranche.startsWith('8') || meta.ageTranche.startsWith('10')
          ? 'primaria_2_ciclo'
          : 'eso_1_ciclo'
      }],
      prerequisites: meta.prerequisites,
      coreConcepts: meta.coreConcepts,
      steps,
      linkedTestId: test.id,
      test,
      version: 1,
      status: 'published',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  /**
   * Obtiene todas las 12 lecciones clásicas adaptadas al nuevo formato de unidades
   */
  public static getAllAdaptedUnits(): CurriculumUnit[] {
    return LESSONS.map(lesson => this.adaptLessonToUnit(lesson));
  }

  public static getAllUnits(): CurriculumUnit[] {
    return this.getAllAdaptedUnits();
  }

  /**
   * Traduce un ID canónico ('astro_u03_rotation_day_night' o 'astro_u03') a su ID numérico clásico (3)
   */
  public static canonicalToNumericId(canonicalId: string): number {
    const match = canonicalId.match(/astro_u?0*(\d+)/i) || canonicalId.match(/(\d+)/);
    if (match) {
      return parseInt(match[1], 10);
    }
    return 1;
  }

  /**
   * Traduce un ID numérico clásico (3) a su ID canónico ('astro_u03_rotation_day_night')
   */
  public static numericToCanonicalId(numId: number): string {
    return ASTRO_METADATA_MAP[numId]?.canonicalId || `astro_u${String(numId).padStart(2, '0')}`;
  }
}
