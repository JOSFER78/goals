export interface ChildLearningProfile {
  childName: string;
  age: number;
  schoolName: string;
  grade: string;
  favoriteSubjects: string[];
  weakSubjects: string[];
  extracurriculars: string[];
  interests: string[];
  learningStyle: 'visual' | 'auditivo' | 'practico' | 'general';
  specialNotes?: string;
}

export const DEFAULT_CHILD_PROFILE: ChildLearningProfile = {
  childName: 'Estudiante',
  age: 8,
  schoolName: '',
  grade: '3º de Primaria',
  favoriteSubjects: ['Ciencias Naturales', 'Inglés'],
  weakSubjects: ['Matemáticas'],
  extracurriculars: ['Robótica y Código 🤖', 'Ajedrez ♟️'],
  interests: ['Espacio y Astronomía 🚀', 'Minecraft 🎮', 'Lego y Construcción 🧱'],
  learningStyle: 'visual',
  specialNotes: ''
};

export const AVAILABLE_GRADES = [
  '1º de Primaria', '2º de Primaria', '3º de Primaria', '4º de Primaria', '5º de Primaria', '6º de Primaria',
  '1º de ESO', '2º de ESO', '3º de ESO', '4º de ESO',
  '1º de Bachillerato', '2º de Bachillerato'
];

export const AVAILABLE_SUBJECTS = [
  'Matemáticas', 'Lengua y Literatura', 'Ciencias Naturales', 'Ciencias Sociales / Historia',
  'Inglés', 'Física y Química', 'Tecnología / Informática', 'Educación Física', 'Música', 'Plástica / Arte'
];

export const AVAILABLE_EXTRACURRICULARS = [
  'Robótica y Código 🤖', 'Fútbol ⚽', 'Piano / Música 🎹', 'Ajedrez ♟️',
  'Pintura y Dibujo 🎨', 'Natación 🏊', 'Baloncesto 🏀', 'Inglés Extra 🇬🇧',
  'Teatro y Danza 🎭', 'Gimnasia / Artes Marciales 🥋'
];

export const AVAILABLE_INTERESTS = [
  'Minecraft 🎮', 'Espacio y Astronomía 🚀', 'Dinosaurios 🦖', 'Lego y Construcción 🧱',
  'Ciencia Ficción y Robots 🛸', 'Superhéroes y Cómics 🦸', 'Animales y Naturaleza 🐾',
  'Manga y Anime 🦊', 'Inventos y Experimentos 🧪', 'Cine y Animación 🎬'
];
