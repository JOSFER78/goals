import { MascotSkinId, MascotAnimState, VisemeState } from '../types/mascot';

export interface PixelParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  char?: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface PixelFrame {
  grid: string[];
  durationMs: number;
}

export interface SkinMatrixDef {
  baseWidth: number;
  baseHeight: number;
  palette: Record<string, string>;
  animations: {
    idle: PixelFrame[];
    walk_roam: PixelFrame[];
    sleep_zzz: PixelFrame[];
    working_thinking: PixelFrame[];
    speaking_talking: PixelFrame[];
    dragged_surprised: PixelFrame[];
    pet_happy: PixelFrame[];
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// 1. MATRICES DE PÍXELES DE ALTA FIDELIDAD (24x24) PARA LAS 6 ESPECIES
// ═════════════════════════════════════════════════════════════════════════════

// ─── SPARKY (FUEGUITO ELEMENTAL 🔥) ──────────────────────────────────────────
const SPARKY_PALETTE: Record<string, string> = {
  '.': 'transparent',
  'R': '#DC2626', // Rojo brasa borde
  'O': '#EA580C', // Naranja fuego
  'Y': '#FBBF24', // Amarillo llama
  'W': '#FEF08A', // Blanco/amarillo núcleo
  'B': '#FDE047', // Piel cálida
  'K': '#18181B', // Ojos / boca negro
  'C': '#FFFFFF', // Reflejo blanco ojos
  'P': '#F43F5E', // Mejillas sonrosadas
  'D': '#B91C1C', // Sombra llama
};

// Frame 1 Idle (Respiración normal)
const SPARKY_IDLE_1 = [
  "..........OOOO..........",
  ".........OOYYOO.........",
  "........OOYYYYOO........",
  ".......OORRYYYYOO.......",
  "......OORRYWWYYYOO......",
  ".....OORRYWWWWYYYOO.....",
  ".....OORRYWWWWYYYOO.....",
  "....OORRRRRRRRRRROO....",
  "...OORRBBBBBBBBBBRROO...",
  "..OORRBBBBBBBBBBBBRROO..",
  "..OORRBBKKBBRRKKBBBRROO.",
  "..OORRBCKKBBRCKKBBBRROO.",
  "..OORRBBKKBBRRKKBBBRROO.",
  "..OORRBBPBBBBPBBBBBRROO.",
  "..OORRBBBBKKBBBBBBBRROO.",
  "..OORRBBBBBBBBBBBBBRROO.",
  "...OORRRRRRRRRRRRRROO...",
  "....OOOOOOOOOOOOOOOO....",
  "......RRRBBBBBBBRRR.....",
  ".....RRRRBBBBBBBRRRR....",
  "....RRRRBBBBBBBBBRRRR...",
  "....RRRRR......RRRRR....",
  ".....RRRR......RRRR.....",
  "........................"
];

// Frame 2 Idle (Llama alta y parpadeo)
const SPARKY_IDLE_2 = [
  "...........OO...........",
  "..........OOYY..........",
  ".........OOYYYY.........",
  "........OOYYYYYY........",
  ".......OORRYWWYYOO......",
  "......OORRYWWWWYYOO.....",
  ".....OORRYWWWWYYYOO.....",
  "....OORRRRRRRRRRROO....",
  "...OORRBBBBBBBBBBRROO...",
  "..OORRBBBBBBBBBBRROO..",
  "..OORRBB--BBRR--BBBRROO.",
  "..OORRBB--BBRR--BBBRROO.",
  "..OORRBBBBBBBBBBBBBRROO.",
  "..OORRBBPBBBBPBBBBBRROO.",
  "..OORRBBBBKKBBBBBBBRROO.",
  "..OORRBBBBBBBBBBBBBRROO.",
  "...OORRRRRRRRRRRRRROO...",
  "....OOOOOOOOOOOOOOOO....",
  "......RRRBBBBBBBRRR.....",
  ".....RRRRBBBBBBBRRRR....",
  "....RRRRBBBBBBBBBRRRR...",
  "....RRRRR......RRRRR....",
  ".....RRRR......RRRR.....",
  "........................"
];

// Frame 1 Walk (Corriendo pierna izq adelante - Estilo imagen usuario)
const SPARKY_WALK_1 = [
  "..........OOOO..........",
  ".........OOYYOO.........",
  "........OOYYYYOO........",
  ".......OORRYYYYOO.......",
  "......OORRYWWYYYOO......",
  ".....OORRYWWWWYYYOO.....",
  "....OORRRRRRRRRRROO....",
  "...OORRBBBBBBBBBBRROO...",
  "..OORRBBKKBBRRKKBBBRROO.",
  "..OORRBCKKBBRCKKBBBRROO.",
  "..OORRBBKKBBRRKKBBBRROO.",
  "..OORRBBPBBBBPBBBBBRROO.",
  "..OORRBBBBKKKBBBBBBRROO.",
  "...OORRRRRRRRRRRRRROO...",
  "....OOOOOOOOOOOOOOOO....",
  "....RRRRBBBBBBBB........",
  "...RRRRRBBBBBBBB........",
  "...RRRR...RRRBBBB.......",
  "...........RRRRBB.......",
  "............RRRRR.......",
  "........................",
  "........................",
  "........................",
  "........................"
];

// Frame 2 Walk (Corriendo pierna der adelante)
const SPARKY_WALK_2 = [
  "...........OO...........",
  "..........OOYYOO........",
  ".........OOYYYYOO.......",
  "........OORRYYYYOO......",
  ".......OORRYWWYYYOO.....",
  "......OORRYWWWWYYYOO....",
  "....OORRRRRRRRRRROO....",
  "...OORRBBBBBBBBBBRROO...",
  "..OORRBBKKBBRRKKBBBRROO.",
  "..OORRBCKKBBRCKKBBBRROO.",
  "..OORRBBKKBBRRKKBBBRROO.",
  "..OORRBBPBBBBPBBBBBRROO.",
  "..OORRBBBBKKKBBBBBBRROO.",
  "...OORRRRRRRRRRRRRROO...",
  "....OOOOOOOOOOOOOOOO....",
  "........BBBBBBBBRRRR....",
  "........BBBBBBBBRRRRR...",
  ".......BBBBBRRR...RRRR..",
  ".......BBRRRR...........",
  ".......RRRRR............",
  "........................",
  "........................",
  "........................",
  "........................"
];

// Frame Sleep (Durmiendo, ojos cerrados y llama tenue)
const SPARKY_SLEEP = [
  "........................",
  "...........OO...........",
  "..........OOYY..........",
  ".........OOYYYY.........",
  "........OODDYYOO........",
  ".......OODDDYYYOO.......",
  "......OODDDDDYYYOO......",
  "....OORRRRRRRRRRROO....",
  "...OORRBBBBBBBBBBRROO...",
  "..OORRBBBBBBBBBBBBRROO..",
  "..OORRBB--BBRR--BBBRROO.",
  "..OORRBBBBBBBBBBBBBRROO.",
  "..OORRBBPBBBBPBBBBBRROO.",
  "..OORRBBBB--BBBBBBBRROO.",
  "..OORRBBBBBBBBBBBBBRROO.",
  "...OORRRRRRRRRRRRRROO...",
  "....OOOOOOOOOOOOOOOO....",
  "......RRRBBBBBBBRRR.....",
  ".....RRRRBBBBBBBRRRR....",
  "....RRRRBBBBBBBBBRRRR...",
  "........................",
  "........................",
  "........................",
  "........................"
];

// Frame Happy (Saltando de júbilo con brazos arriba)
const SPARKY_HAPPY = [
  "..........OOOO..........",
  ".........OOYYOO.........",
  "........OOYYYYOO........",
  ".......OORRYYYYOO.......",
  "......OORRYWWYYYOO......",
  ".....OORRYWWWWYYYOO.....",
  "....OORRRRRRRRRRROO....",
  "...OORRBBBBBBBBBBRROO...",
  "..OORRBB^^BBRR^^BBBRROO.",
  "..OORRBB^^BBRR^^BBBRROO.",
  ".RRORRBBPBBBBPBBBRROORR.",
  "RRRRRRBBBBKKKKBBBRRRRRRR",
  "RRRR...RRBKKKKBBRR...RRR",
  "........RRRRRRRR........",
  ".........RRRRRR.........",
  "..........RRRR..........",
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  "........................"
];

// Frame Dragged (Pataleando en el aire)
const SPARKY_DRAGGED = [
  ".........OOOOOO.........",
  "........OOYYYYOO........",
  ".......OORRYYYYOO.......",
  "......OORRYWWYYYOO......",
  ".....OORRYWWWWYYYOO.....",
  "....OORRRRRRRRRRROO....",
  "...OORRBBBBBBBBBBRROO...",
  "..OORRBBOOBBRROOBBBRROO.",
  "..OORRBBCKBBRRCKBBBRROO.",
  "..OORRBBOOBBRROOBBBRROO.",
  "..OORRBBPBBBBPBBBBBRROO.",
  "..OORRBBBBKKKBBBBBBRROO.",
  "...OORRRRRRRRRRRRRROO...",
  "....OOOOOOOOOOOOOOOO....",
  "..RRRRR..BBBBBB..RRRRR..",
  ".RRRRRR..BBBBBB..RRRRRR.",
  "..........RRRR..........",
  "........RRRRRRRR........",
  ".......RRRR..RRRR.......",
  "......RRRR....RRRR......",
  "........................",
  "........................",
  "........................",
  "........................"
];

// ─── ASTROBOT 🤖 ─────────────────────────────────────────────────────────────
const ASTROBOT_PALETTE: Record<string, string> = {
  '.': 'transparent',
  'M': '#334155', // Metal carcasa
  'D': '#0F172A', // Chasis oscuro
  'C': '#00F0FF', // Cian neón pantalla/ojos
  'P': '#8B5CF6', // Púrpura antena/boca
  'W': '#FFFFFF', // Reflejos
  'G': '#64748B', // Gris claro
  'K': '#051923', // Visor negro
};

const ASTROBOT_IDLE_1 = [
  "...........PP...........",
  "...........PP...........",
  "...........CC...........",
  "...........CC...........",
  "......MMMMMMMMMMMM......",
  ".....MMDDDDDDDDDDMM.....",
  "....MMDDDKKKKKKDDDMM....",
  "...MMDDKKKKKKKKKKDDMM...",
  "..MMDDKKCCKKKKCCKKDDMM..",
  "..MMDDKKCCKKKKCCKKDDMM..",
  "..MMDDKKKKKKKKKKKKDDMM..",
  "..MMDDKKKKKPPPPKKKDDMM..",
  "..MMDDKKKKKKKKKKKKDDMM..",
  "...MMDDKKKKKKKKKKDDMM...",
  "....MMDDDKKKKKKDDDMM....",
  ".....MMDDDDDDDDDDMM.....",
  "......MMMMMMMMMMMM......",
  ".........DDDDDD.........",
  "........MDDDDDDMM.......",
  ".......MMDDDDDDMM.......",
  "........MMDDDDMM........",
  ".........CCCCCC.........",
  "..........CCCC..........",
  "...........CC..........."
];

const ASTROBOT_IDLE_2 = [
  "...........WW...........",
  "...........PP...........",
  "...........CC...........",
  "...........CC...........",
  "......MMMMMMMMMMMM......",
  ".....MMDDDDDDDDDDMM.....",
  "....MMDDDKKKKKKDDDMM....",
  "...MMDDKKKKKKKKKKDDMM...",
  "..MMDDKK--KKKK--KKDDMM..",
  "..MMDDKKKKKKKKKKKKDDMM..",
  "..MMDDKKKKKPPPPKKKDDMM..",
  "..MMDDKKKKKKKKKKKKDDMM...",
  "...MMDDKKKKKKKKKKDDMM...",
  "....MMDDDKKKKKKDDDMM....",
  ".....MMDDDDDDDDDDMM.....",
  "......MMMMMMMMMMMM......",
  ".........DDDDDD.........",
  "........MDDDDDDMM.......",
  ".......MMDDDDDDMM.......",
  "........MMDDDDMM........",
  ".........CCCCCC.........",
  "..........CCCC..........",
  "...........CC...........",
  "........................"
];

// ─── BÚHO SABIO 🦉 ───────────────────────────────────────────────────────────
const BUHO_PALETTE: Record<string, string> = {
  '.': 'transparent',
  'E': '#064E3B', // Verde esmeralda plumaje
  'D': '#047857', // Verde medio
  'G': '#F59E0B', // Dorado monóculo / pico
  'Y': '#FEF3C7', // Ojos crema gigantes
  'K': '#022C22', // Pupilas negras
  'C': '#FFFFFF', // Brillo
  'B': '#0D7050', // Pecho
};

const BUHO_IDLE_1 = [
  "....DD............DD....",
  "...DDD............DDD...",
  "..DDDD............DDDD..",
  "...EEEEEEEEEEEEEEEEEE...",
  "..EEEEEEEEEEEEEEEEEEEE..",
  ".EEEEEYYYYEEEEGGGGGEEEE.",
  ".EEEEYYKKYYEEGYYYYGEEEE.",
  ".EEEEYYCKYYEEGYYCKGEEEE.",
  ".EEEEYYKKYYEEGYYKKGEEEE.",
  ".EEEEEYYYYEEEEGGGGGEEEE.",
  ".EEEEEEEEEGGGEEEEEEEEEE.",
  ".EEEEEEEEGGGGGEEEEEEEEE.",
  "..EEEEEEEGGGGGEEEEEEEE..",
  "..EEEEEEBBBBBBBEEEEEEE..",
  "...EEEEEBBBBBBBEEEEEE...",
  "...EEEEEBBBBBBBEEEEEE...",
  "....EEEEBBBBBBBEEEEE....",
  ".....EEEEEEGGGEEEEE.....",
  "......EEEEEEEEEEEE......",
  ".......GGGG..GGGG.......",
  ".......GGGG..GGGG.......",
  "........................",
  "........................",
  "........................"
];

// ─── DRAGÓN CÓSMICO 🐲 ───────────────────────────────────────────────────────
const DRAGON_PALETTE: Record<string, string> = {
  '.': 'transparent',
  'B': '#1E1B4B', // Azul medianoche
  'N': '#3B82F6', // Azul eléctrico
  'A': '#06B6D4', // Aguamarina cuernos/ojos
  'F': '#38BDF8', // Fuego celeste
  'K': '#0F172A', // Ojos
  'C': '#FFFFFF', // Brillo
  'W': '#6366F1', // Indigo escamas
};

const DRAGON_IDLE_1 = [
  "AA....................AA",
  ".AAA................AAA.",
  "..AAA..............AAA..",
  "...NNNNNNNNNNNNNNNNNN...",
  "..NNNNNNNNNNNNNNNNNNNN..",
  ".NNNNNNNNNNNNNNNNNNNNNN.",
  ".NNNNAAAANNNNNNAAAANNNN.",
  ".NNNNAKKANNNNNNAKKANNNN.",
  ".NNNNACKANNNNNNACKANNNN.",
  ".NNNNAAAANNNNNNAAAANNNN.",
  ".NNNNNNNNNNNNNNNNNNNNNN.",
  ".NNNNNNNKKKKKKKKNNNNNNN.",
  "..NNNNNNKKKKKKKKNNNNNN..",
  "..NNNNNNWWWWWWWWNNNNNN..",
  "...NNNNNWWWWWWWWNNNNN...",
  "....NNNNWWWWWWWWNNNN....",
  ".....NNNNNNNNNNNNNN.....",
  "......NNNN....NNNN......",
  "......NNNN....NNNN......",
  "......AAAA....AAAA......",
  "........................",
  "........................",
  "........................",
  "........................"
];

// ─── GATITO GALÁCTICO 🐱 ─────────────────────────────────────────────────────
const GATITO_PALETTE: Record<string, string> = {
  '.': 'transparent',
  'H': '#38BDF833', // Casco vidrio transparente
  'V': '#2E1065',   // Púrpura cósmico
  'P': '#EC4899',   // Rosa orejas/nariz
  'E': '#F43F5E',   // Ojos rubí
  'C': '#FFFFFF',   // Brillo
  'W': '#A855F7',   // Bigotes / boca
};

const GATITO_IDLE_1 = [
  "..PP................PP..",
  ".PPPP..............PPPP.",
  ".PVPP..............PVPP.",
  ".PVVP..............PVVP.",
  "..VVVVVVVVVVVVVVVVVVVV..",
  ".VVVVVVVVVVVVVVVVVVVVVV.",
  ".VVVVVVVVVVVVVVVVVVVVVV.",
  ".VVVVEEEVVVVVVVVEEEVVVV.",
  ".VVVVCEEVVVVVVVVCEEVVVV.",
  ".VVVVEEEVVVVVVVVEEEVVVV.",
  ".WWVVVVVVVVPPVVVVVVVVWW.",
  ".WWVVVVVVVPPPPVVVVVVVWW.",
  "..WWVVVVVVVWWVVVVVVVWW..",
  "...WWVVVVVVVVVVVVVVWW...",
  "....VVVVVVVVVVVVVVVV....",
  "....VVVVVVVVVVVVVVVV....",
  ".....VVVVVVVVVVVVVV.....",
  "......VVVV....VVVV......",
  "......PPPP....PPPP......",
  "........................",
  "........................",
  "........................",
  "........................",
  "........................"
];

// ─── SLIME CUÁNTICO 🟢 ───────────────────────────────────────────────────────
const SLIME_PALETTE: Record<string, string> = {
  '.': 'transparent',
  'S': '#84CC16', // Lima base
  'L': '#A3E635', // Lima claro
  'H': '#ECFCCB', // Highlight brillo
  'K': '#365314', // Ojos verde bosque
  'C': '#FFFFFF', // Brillo
  'P': '#F43F5E', // Mejillas
};

const SLIME_IDLE_1 = [
  "........................",
  "...........HH...........",
  "..........HHHH..........",
  ".........SSSSSS.........",
  "........SSSSSSSS........",
  ".......SSSSSSSSSS.......",
  "......SSSSSSSSSSSS......",
  ".....SSSSSSSSSSSSSS.....",
  "....SSHHSSSSSSSSSSSS....",
  "...SSHHHHSSSSSSSSSSSS...",
  "..SSHHHHHSSKKSSSSKKSSS..",
  "..SSSHHHSSSCCSSSSCCSSS..",
  "..SSSSSSSSSKKSSSSKKSSS..",
  "..SSSSSSSSPSSSSSSPSSSS..",
  "..SSSSSSSSSSKKKKSSSSSS..",
  "..SSSSSSSSSSSSSSSSSSSS..",
  "...SSSSSSSSSSSSSSSSSS...",
  "....SSSSSSSSSSSSSSSS....",
  ".....SSSSSSSSSSSSSS.....",
  "......SSSSSSSSSSSS......",
  "........................",
  "........................",
  "........................",
  "........................"
];

// ═════════════════════════════════════════════════════════════════════════════
// REGISTRO CENTRAL DE MATRICES POR SKIN
// ═════════════════════════════════════════════════════════════════════════════

export const MASCOT_SKIN_MATRICES: Record<MascotSkinId, SkinMatrixDef> = {
  sparky: {
    baseWidth: 24,
    baseHeight: 24,
    palette: SPARKY_PALETTE,
    animations: {
      idle: [
        { grid: SPARKY_IDLE_1, durationMs: 400 },
        { grid: SPARKY_IDLE_2, durationMs: 400 },
      ],
      walk_roam: [
        { grid: SPARKY_WALK_1, durationMs: 140 },
        { grid: SPARKY_WALK_2, durationMs: 140 },
      ],
      sleep_zzz: [
        { grid: SPARKY_SLEEP, durationMs: 600 },
      ],
      working_thinking: [
        { grid: SPARKY_IDLE_2, durationMs: 180 },
        { grid: SPARKY_WALK_1, durationMs: 180 },
      ],
      speaking_talking: [
        { grid: SPARKY_IDLE_1, durationMs: 160 },
        { grid: SPARKY_HAPPY, durationMs: 160 },
      ],
      dragged_surprised: [
        { grid: SPARKY_DRAGGED, durationMs: 100 },
      ],
      pet_happy: [
        { grid: SPARKY_HAPPY, durationMs: 250 },
        { grid: SPARKY_IDLE_1, durationMs: 250 },
      ]
    }
  },
  astrobot: {
    baseWidth: 24,
    baseHeight: 24,
    palette: ASTROBOT_PALETTE,
    animations: {
      idle: [
        { grid: ASTROBOT_IDLE_1, durationMs: 400 },
        { grid: ASTROBOT_IDLE_2, durationMs: 400 },
      ],
      walk_roam: [
        { grid: ASTROBOT_IDLE_1, durationMs: 200 },
        { grid: ASTROBOT_IDLE_2, durationMs: 200 },
      ],
      sleep_zzz: [
        { grid: ASTROBOT_IDLE_2, durationMs: 600 },
      ],
      working_thinking: [
        { grid: ASTROBOT_IDLE_1, durationMs: 150 },
        { grid: ASTROBOT_IDLE_2, durationMs: 150 },
      ],
      speaking_talking: [
        { grid: ASTROBOT_IDLE_1, durationMs: 180 },
        { grid: ASTROBOT_IDLE_2, durationMs: 180 },
      ],
      dragged_surprised: [
        { grid: ASTROBOT_IDLE_1, durationMs: 120 },
      ],
      pet_happy: [
        { grid: ASTROBOT_IDLE_1, durationMs: 250 },
        { grid: ASTROBOT_IDLE_2, durationMs: 250 },
      ]
    }
  },
  buho: {
    baseWidth: 24,
    baseHeight: 24,
    palette: BUHO_PALETTE,
    animations: {
      idle: [{ grid: BUHO_IDLE_1, durationMs: 500 }],
      walk_roam: [{ grid: BUHO_IDLE_1, durationMs: 250 }],
      sleep_zzz: [{ grid: BUHO_IDLE_1, durationMs: 600 }],
      working_thinking: [{ grid: BUHO_IDLE_1, durationMs: 200 }],
      speaking_talking: [{ grid: BUHO_IDLE_1, durationMs: 180 }],
      dragged_surprised: [{ grid: BUHO_IDLE_1, durationMs: 120 }],
      pet_happy: [{ grid: BUHO_IDLE_1, durationMs: 250 }]
    }
  },
  dragon: {
    baseWidth: 24,
    baseHeight: 24,
    palette: DRAGON_PALETTE,
    animations: {
      idle: [{ grid: DRAGON_IDLE_1, durationMs: 450 }],
      walk_roam: [{ grid: DRAGON_IDLE_1, durationMs: 220 }],
      sleep_zzz: [{ grid: DRAGON_IDLE_1, durationMs: 600 }],
      working_thinking: [{ grid: DRAGON_IDLE_1, durationMs: 180 }],
      speaking_talking: [{ grid: DRAGON_IDLE_1, durationMs: 160 }],
      dragged_surprised: [{ grid: DRAGON_IDLE_1, durationMs: 120 }],
      pet_happy: [{ grid: DRAGON_IDLE_1, durationMs: 250 }]
    }
  },
  gatito: {
    baseWidth: 24,
    baseHeight: 24,
    palette: GATITO_PALETTE,
    animations: {
      idle: [{ grid: GATITO_IDLE_1, durationMs: 400 }],
      walk_roam: [{ grid: GATITO_IDLE_1, durationMs: 200 }],
      sleep_zzz: [{ grid: GATITO_IDLE_1, durationMs: 600 }],
      working_thinking: [{ grid: GATITO_IDLE_1, durationMs: 180 }],
      speaking_talking: [{ grid: GATITO_IDLE_1, durationMs: 160 }],
      dragged_surprised: [{ grid: GATITO_IDLE_1, durationMs: 120 }],
      pet_happy: [{ grid: GATITO_IDLE_1, durationMs: 250 }]
    }
  },
  slime: {
    baseWidth: 24,
    baseHeight: 24,
    palette: SLIME_PALETTE,
    animations: {
      idle: [{ grid: SLIME_IDLE_1, durationMs: 400 }],
      walk_roam: [{ grid: SLIME_IDLE_1, durationMs: 200 }],
      sleep_zzz: [{ grid: SLIME_IDLE_1, durationMs: 600 }],
      working_thinking: [{ grid: SLIME_IDLE_1, durationMs: 180 }],
      speaking_talking: [{ grid: SLIME_IDLE_1, durationMs: 160 }],
      dragged_surprised: [{ grid: SLIME_IDLE_1, durationMs: 120 }],
      pet_happy: [{ grid: SLIME_IDLE_1, durationMs: 250 }]
    }
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// MOTOR DE RENDERIZADO CANVAS 2D PIXEL ART (60 FPS)
// ═════════════════════════════════════════════════════════════════════════════

export class PixelCanvasEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private skinId: MascotSkinId;
  private animState: MascotAnimState = 'idle';
  private scale: number = 3.5;
  
  private currentFrameIndex: number = 0;
  private frameTimer: number = 0;
  private lastTime: number = 0;
  private rafId: number | null = null;
  private isDestroyed: boolean = false;

  // Seguimiento ocular LERP
  private targetEyeOffset = { x: 0, y: 0 };
  private currentEyeOffset = { x: 0, y: 0 };

  // Partículas dinámicas
  private particles: PixelParticle[] = [];
  private viseme: VisemeState = { aperture: 0, width: 1, shape: 'rest', intensity: 0 };

  constructor(canvas: HTMLCanvasElement, skinId: MascotSkinId = 'sparky', scale: number = 3.5) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true })!;
    this.skinId = skinId;
    this.scale = scale;

    this.setupCanvas();
    this.bindEvents();
    this.startLoop();
  }

  public setupCanvas(): void {
    const skinDef = MASCOT_SKIN_MATRICES[this.skinId] || MASCOT_SKIN_MATRICES.sparky;
    this.canvas.width = Math.round(skinDef.baseWidth * this.scale);
    this.canvas.height = Math.round(skinDef.baseHeight * this.scale);
    this.ctx.imageSmoothingEnabled = false;
    (this.ctx as any).webkitImageSmoothingEnabled = false;
    (this.ctx as any).mozImageSmoothingEnabled = false;
    (this.ctx as any).msImageSmoothingEnabled = false;
  }

  public setSkin(skinId: MascotSkinId): void {
    if (this.skinId === skinId) return;
    this.skinId = skinId;
    this.currentFrameIndex = 0;
    this.frameTimer = 0;
    this.setupCanvas();
  }

  public setAnimState(state: MascotAnimState): void {
    if (this.animState === state) return;
    this.animState = state;
    this.currentFrameIndex = 0;
    this.frameTimer = 0;
  }

  public setScale(scale: number): void {
    this.scale = scale;
    this.setupCanvas();
  }

  public setViseme(viseme: VisemeState): void {
    this.viseme = viseme;
  }

  private bindEvents(): void {
    const onMove = (e: MouseEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      const maxOffset = 1.2;
      const clamped = Math.min(dist * 0.015, maxOffset);
      this.targetEyeOffset = {
        x: Math.round(clamped * Math.cos(angle)),
        y: Math.round(clamped * Math.sin(angle))
      };
    };

    window.addEventListener('mousemove', onMove);
    (this as any)._onMove = onMove;
  }

  private startLoop(): void {
    this.lastTime = performance.now();
    const tick = (now: number) => {
      if (this.isDestroyed) return;
      const deltaMs = now - this.lastTime;
      this.lastTime = now;

      this.update(deltaMs);
      this.render();

      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private update(deltaMs: number): void {
    // LERP suave para pupilas
    this.currentEyeOffset.x += (this.targetEyeOffset.x - this.currentEyeOffset.x) * 0.2;
    this.currentEyeOffset.y += (this.targetEyeOffset.y - this.currentEyeOffset.y) * 0.2;

    // Ticker de animación
    const skinDef = MASCOT_SKIN_MATRICES[this.skinId] || MASCOT_SKIN_MATRICES.sparky;
    const animMap = skinDef.animations;
    const frames = (animMap as any)[this.animState] || animMap.idle;
    const currentFrame = frames[this.currentFrameIndex] || frames[0];

    this.frameTimer += deltaMs;
    if (this.frameTimer >= currentFrame.durationMs) {
      this.frameTimer -= currentFrame.durationMs;
      this.currentFrameIndex = (this.currentFrameIndex + 1) % frames.length;
    }

    this.updateParticles(deltaMs);
  }

  private updateParticles(deltaMs: number): void {
    const skinDef = MASCOT_SKIN_MATRICES[this.skinId] || MASCOT_SKIN_MATRICES.sparky;

    // Generador de partículas reactivo
    if (this.animState === 'sleep_zzz' && Math.random() < 0.035) {
      this.particles.push({
        x: (skinDef.baseWidth * 0.7) * this.scale,
        y: (skinDef.baseHeight * 0.3) * this.scale,
        vx: 0.15 + (Math.random() - 0.5) * 0.2,
        vy: -0.35 - Math.random() * 0.2,
        size: 2.5 * this.scale,
        color: '#93C5FD',
        char: 'z',
        alpha: 1,
        life: 0,
        maxLife: 1600
      });
    } else if (this.animState === 'pet_happy' && Math.random() < 0.08) {
      this.particles.push({
        x: (Math.random() * skinDef.baseWidth) * this.scale,
        y: (skinDef.baseHeight * 0.4) * this.scale,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -0.7 - Math.random() * 0.5,
        size: 2 * this.scale,
        color: '#F43F5E',
        char: '♥',
        alpha: 1,
        life: 0,
        maxLife: 1200
      });
    } else if (this.skinId === 'sparky' && Math.random() < 0.12) {
      // Chispas de fuego para Sparky
      this.particles.push({
        x: (skinDef.baseWidth / 2 + (Math.random() - 0.5) * 6) * this.scale,
        y: (skinDef.baseHeight * 0.15) * this.scale,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.5 - Math.random() * 0.4,
        size: this.scale,
        color: Math.random() > 0.4 ? '#FBBF24' : '#EA580C',
        alpha: 1,
        life: 0,
        maxLife: 700
      });
    }

    // Actualizar partículas
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += deltaMs;
      p.x += p.vx * (deltaMs / 16.6);
      p.y += p.vy * (deltaMs / 16.6);
      p.alpha = Math.max(0, 1 - (p.life / p.maxLife));

      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }
  }

  public render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const skinDef = MASCOT_SKIN_MATRICES[this.skinId] || MASCOT_SKIN_MATRICES.sparky;
    const animMap = skinDef.animations;
    const frames = (animMap as any)[this.animState] || animMap.idle;
    const currentFrame = frames[this.currentFrameIndex] || frames[0];
    const palette = skinDef.palette;

    const grid = currentFrame.grid;
    const pixelSize = this.scale;
    const offX = Math.round(this.currentEyeOffset.x);
    const offY = Math.round(this.currentEyeOffset.y);

    // Dibujar matriz
    for (let r = 0; r < grid.length; r++) {
      const rowStr = grid[r];
      for (let c = 0; c < rowStr.length; c++) {
        const char = rowStr[c];
        if (char === '.' || !palette[char]) continue;

        let drawX = c * pixelSize;
        let drawY = r * pixelSize;

        this.ctx.fillStyle = palette[char];
        this.ctx.fillRect(drawX, drawY, pixelSize, pixelSize);
      }
    }

    // Modulación dinámica de visemas bucales al hablar
    if (this.viseme && (this.viseme.aperture > 0.05 || this.animState === 'speaking')) {
      const mouthCoords: Record<string, { row: number; col: number; baseWidth: number; color: string }> = {
        sparky: { row: 14, col: 10, baseWidth: 3, color: '#18181B' },
        astrobot: { row: 11, col: 11, baseWidth: 4, color: '#00F0FF' },
        buho: { row: 11, col: 10, baseWidth: 3, color: '#F59E0B' },
        dragon: { row: 11, col: 9, baseWidth: 5, color: '#0F172A' },
        gatito: { row: 12, col: 11, baseWidth: 3, color: '#A855F7' },
        slime: { row: 13, col: 11, baseWidth: 3, color: '#365314' }
      };

      const m = mouthCoords[this.skinId] || mouthCoords.sparky;
      const aperturePx = Math.max(1, Math.round(this.viseme.aperture * 2.5 * pixelSize));
      const widthMod = Math.round(m.baseWidth * (this.viseme.width || 1.0) * pixelSize);
      const startX = (m.col * pixelSize) - Math.floor((widthMod - m.baseWidth * pixelSize) / 2);
      const startY = m.row * pixelSize;

      this.ctx.fillStyle = m.color;
      this.ctx.fillRect(startX, startY, widthMod, aperturePx);

      if (this.viseme.shape === 'aa' && aperturePx >= 2 * pixelSize) {
        this.ctx.fillStyle = '#F43F5E';
        this.ctx.fillRect(startX + pixelSize, startY + pixelSize, Math.max(1, widthMod - 2 * pixelSize), aperturePx - pixelSize);
      }
    }

    // Dibujar partículas
    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      if (p.char) {
        this.ctx.fillStyle = p.color;
        this.ctx.font = `bold ${Math.round(p.size * 2)}px monospace`;
        this.ctx.fillText(p.char, p.x, p.y);
      } else {
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      this.ctx.restore();
    }
  }

  public destroy(): void {
    this.isDestroyed = true;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if ((this as any)._onMove) {
      window.removeEventListener('mousemove', (this as any)._onMove);
    }
  }
}
