/**
 * GOALS 3D Cosmos - Catálogo Modular de las 12 Escenas Astronómicas
 */
import { CosmosSceneModule } from './types';
import { scene01_Earth } from './scene01_Earth';
import { scene02_Eclipses } from './scene02_Eclipses';
import { scene03_DayNight } from './scene03_DayNight';
import { scene04_Orbit } from './scene04_Orbit';
import { scene05_Seasons } from './scene05_Seasons';
import { scene06_SolarSystem } from './scene06_SolarSystem';
import { scene07_OortVoyager } from './scene07_OortVoyager';
import { scene08_NearbyStars } from './scene08_NearbyStars';
import { scene09_MilkyWay } from './scene09_MilkyWay';
import { scene10_LocalGroup } from './scene10_LocalGroup';
import { scene11_Laniakea } from './scene11_Laniakea';
import { scene12_Universe } from './scene12_Universe';

export * from './types';
export {
  scene01_Earth,
  scene02_Eclipses,
  scene03_DayNight,
  scene04_Orbit,
  scene05_Seasons,
  scene06_SolarSystem,
  scene07_OortVoyager,
  scene08_NearbyStars,
  scene09_MilkyWay,
  scene10_LocalGroup,
  scene11_Laniakea,
  scene12_Universe
};

export const COSMOS_SCENES: CosmosSceneModule[] = [
  scene01_Earth,
  scene02_Eclipses,
  scene03_DayNight,
  scene04_Orbit,
  scene05_Seasons,
  scene06_SolarSystem,
  scene07_OortVoyager,
  scene08_NearbyStars,
  scene09_MilkyWay,
  scene10_LocalGroup,
  scene11_Laniakea,
  scene12_Universe
];
