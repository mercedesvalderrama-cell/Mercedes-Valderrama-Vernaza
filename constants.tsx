
import { PhaseType, PhaseInfo, ChartDataPoint } from './types';

export const GLOSSARY = [
  {
    term: 'Cromosomas Homólogos',
    definition: 'Pareja de cromosomas (uno de origen materno y otro paterno) que tienen la misma estructura y portan información para los mismos caracteres biológicos.',
    icon: '🧬'
  },
  {
    term: 'Cromatina',
    definition: 'El complejo de ADN y proteínas que se encuentra en el núcleo celular. Durante la interfase (G1, S, G2), el ADN está en este estado relajado y filamentoso.',
    icon: '🧶'
  },
  {
    term: 'Cromátidas Hermanas',
    definition: 'Dos copias idénticas de un solo cromosoma duplicado, unidas por el centrómero. Se separan finalmente durante la Anafase.',
    icon: '♊'
  },
  {
    term: 'ADN',
    definition: 'Ácido Desoxirribonucleico. La molécula que almacena las instrucciones genéticas. En la Fase S, esta molécula se replica para asegurar que cada célula hija tenga el código completo.',
    icon: '🔬'
  },
  {
    term: 'Huso Mitótico',
    definition: 'Estructura de microtúbulos que organiza y mueve los cromosomas durante la mitosis. Actúa como los "cables" que tiran de las cromátidas hacia los polos.',
    icon: '🕸️'
  }
];

export const PHASES: Record<PhaseType, PhaseInfo> = {
  [PhaseType.G1]: {
    type: PhaseType.G1,
    name: 'Fase G1 (Crecimiento)',
    description: 'La célula aumenta su tamaño y sintetiza proteínas. Los cromosomas existen como filamentos individuales de cromatina.',
    sportsAnalogy: 'Fase de recuperación post-entrenamiento e hipertrofia inicial. Reparación de microlesiones.',
    color: '#22c55e', // Green-500
    duration: '10h',
    keyProcess: 'Síntesis y Crecimiento'
  },
  [PhaseType.S]: {
    type: PhaseType.S,
    name: 'Fase S (Síntesis)',
    description: 'Punto crítico: el ADN se replica. Cada cromosoma individual se duplica para formar dos cromátidas hermanas idénticas.',
    sportsAnalogy: 'Duplicación de los planos de construcción. El cuerpo crea una copia exacta de la información para las nuevas células.',
    color: '#3b82f6', // Blue-500
    duration: '8h',
    keyProcess: 'Duplicación Cromosómica'
  },
  [PhaseType.G2]: {
    type: PhaseType.G2,
    name: 'Fase G2 (Preparación)',
    description: 'La célula verifica que el ADN se haya duplicado correctamente y acumula energía para la división inminente.',
    sportsAnalogy: 'Carga final de glucógeno. Control de calidad biológico antes del gran esfuerzo de división.',
    color: '#f59e0b', // Amber-500
    duration: '4h',
    keyProcess: 'Control y Energía'
  },
  [PhaseType.PROPHASE]: {
    type: PhaseType.PROPHASE,
    name: 'Profase (Mitosis)',
    description: 'Los cromosomas duplicados se condensan en forma de X. La membrana nuclear comienza a fragmentarse.',
    sportsAnalogy: 'Calentamiento específico. El material genético se "empaqueta" para ser transportado sin enredos.',
    color: '#a855f7', // Purple-500
    duration: '0.5h',
    keyProcess: 'Condensación de X'
  },
  [PhaseType.METAPHASE]: {
    type: PhaseType.METAPHASE,
    name: 'Metafase (Mitosis)',
    description: 'Los cromosomas (X) se alinean perfectamente en el ecuador. El huso mitótico se engancha a los centrómeros.',
    sportsAnalogy: 'Alineación en los bloques de salida. Máxima tensión y precisión técnica antes de la separación.',
    color: '#ec4899', // Pink-500
    duration: '0.3h',
    keyProcess: 'Alineación Central'
  },
  [PhaseType.ANAPHASE]: {
    type: PhaseType.ANAPHASE,
    name: 'Anafase (Mitosis)',
    description: '¡Separación! Las cromátidas hermanas se separan y migran a polos opuestos. Cada polo recibe una copia de cada color.',
    sportsAnalogy: 'El sprint explosivo. Las fuerzas se dividen equitativamente para asegurar que ambas partes ganen.',
    color: '#f97316', // Orange-500
    duration: '0.2h',
    keyProcess: 'Separación de Cromátidas'
  },
  [PhaseType.TELOPHASE]: {
    type: PhaseType.TELOPHASE,
    name: 'Telofase (Mitosis)',
    description: 'Los cromosomas llegan a los polos y nuevas membranas nucleares comienzan a rodear los dos nuevos juegos de ADN.',
    sportsAnalogy: 'Cruzando la meta. La estructura celular se reorganiza para establecer el nuevo orden físico.',
    color: '#fb7185', // Rose-400
    duration: '0.5h',
    keyProcess: 'Reforma de Núcleos'
  },
  [PhaseType.CYTOKINESIS]: {
    type: PhaseType.CYTOKINESIS,
    name: 'Citocinesis',
    description: 'El citoplasma se divide físicamente. El resultado son dos células independientes con ADN idéntico.',
    sportsAnalogy: 'Regeneración completada. Una fibra muscular se ha convertido oficialmente en dos fibras nuevas.',
    color: '#ef4444', // Red-500
    duration: '0.5h',
    keyProcess: 'Partición Final'
  },
  [PhaseType.G0]: {
    type: PhaseType.G0,
    name: 'Fase G0 (Reposo)',
    description: 'Estado de mantenimiento funcional fuera del ciclo activo. Estabilidad celular.',
    sportsAnalogy: 'Día de descanso total. Necesario para que la maquinaria celular no sufra fatiga crónica.',
    color: '#64748b', // Slate-500
    duration: 'Variable',
    keyProcess: 'Mantenimiento'
  }
};

export const MOCK_CHART_DATA: ChartDataPoint[] = [
  { time: 0, energy: 40, dna: 50, protein: 20, phase: PhaseType.G1 },
  { time: 10, energy: 80, dna: 50, protein: 85, phase: PhaseType.G1 },
  { time: 11, energy: 70, dna: 75, protein: 80, phase: PhaseType.S },
  { time: 18, energy: 60, dna: 100, protein: 75, phase: PhaseType.S },
  { time: 19, energy: 95, dna: 100, protein: 95, phase: PhaseType.G2 },
  { time: 22, energy: 100, dna: 100, protein: 100, phase: PhaseType.G2 },
  { time: 23, energy: 50, dna: 100, protein: 40, phase: PhaseType.PROPHASE },
  { time: 23.3, energy: 45, dna: 100, protein: 35, phase: PhaseType.METAPHASE },
  { time: 23.6, energy: 40, dna: 100, protein: 30, phase: PhaseType.ANAPHASE },
  { time: 23.8, energy: 35, dna: 100, protein: 25, phase: PhaseType.TELOPHASE },
  { time: 24, energy: 30, dna: 50, protein: 20, phase: PhaseType.CYTOKINESIS },
];
