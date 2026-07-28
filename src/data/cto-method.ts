/** Pilares metodológicos estilo CTO: vueltas, rentabilidad y ritmo dictado. */

export type VueltaId = "v1" | "v2" | "v3" | "v4";

export type Vuelta = {
  id: VueltaId;
  name: string;
  phase: string;
  goal: string;
  focus: string;
  memory: string;
  status: "done" | "active" | "locked";
  progress: number;
  weeks: string;
  evaluationCadence: string;
};

export const vueltas: Vuelta[] = [
  {
    id: "v1",
    name: "1ª Vuelta",
    phase: "Contacto",
    goal: "Familiarización con el material y clases de base",
    focus: "Mapa del temario · primeras baterías · no memorizar al detalle",
    memory: "Reconocimiento",
    status: "done",
    progress: 100,
    weeks: "Inicio del curso",
    evaluationCadence: "Simulacros mensuales",
  },
  {
    id: "v2",
    name: "2ª Vuelta",
    phase: "Estudio intensivo",
    goal: "Estudio profundo, esquematización y memorización fuerte",
    focus: "Guías diarias · intocables · test del día 50+50",
    memory: "Consolidación",
    status: "active",
    progress: 58,
    weeks: "Fase dura del curso",
    evaluationCadence: "Simulacros quincenales",
  },
  {
    id: "v3",
    name: "3ª Vuelta",
    phase: "Repaso",
    goal: "Memoria a medio plazo y foco en lo muy preguntado",
    focus: "Alta rentabilidad · fallos crónicos · desgloses",
    memory: "Medio plazo",
    status: "locked",
    progress: 0,
    weeks: "Consolidación",
    evaluationCadence: "Simulacros semanales (arranque)",
  },
  {
    id: "v4",
    name: "4ª Vuelta",
    phase: "Cierre",
    goal: "Memoria a corto plazo, fotográfica y dudas crónicas",
    focus: "Sprint final · plantillas · perlas · imágenes",
    memory: "Corto plazo",
    status: "locked",
    progress: 0,
    weeks: "Semanas previas al MIR",
    evaluationCadence: "Simulacros semanales (sábados)",
  },
];

export type YieldMark = {
  topic: string;
  subjectId: string;
  mirHits: number;
  hours: number;
  priority: "alta" | "media" | "baja";
};

/** Rentabilidad histórica aproximada (peso × recurrencia). */
export const yieldMarks: YieldMark[] = [
  { topic: "Síndromes coronarios", subjectId: "cardio", mirHits: 18, hours: 4, priority: "alta" },
  { topic: "Insuficiencia cardíaca", subjectId: "cardio", mirHits: 14, hours: 3.5, priority: "alta" },
  { topic: "Ictus", subjectId: "neuro", mirHits: 16, hours: 3.5, priority: "alta" },
  { topic: "Epilepsia", subjectId: "neuro", mirHits: 9, hours: 2, priority: "media" },
  { topic: "EPOC / Asma", subjectId: "neumo", mirHits: 12, hours: 2.5, priority: "alta" },
  { topic: "TEP", subjectId: "neumo", mirHits: 8, hours: 2, priority: "media" },
  { topic: "Cirrosis / Hepatitis", subjectId: "digestivo", mirHits: 13, hours: 3, priority: "alta" },
  { topic: "Diabetes", subjectId: "endo", mirHits: 11, hours: 2.5, priority: "alta" },
  { topic: "IRA / electrolitos", subjectId: "nefro", mirHits: 10, hours: 2.5, priority: "alta" },
  { topic: "Sepsis / antibióticos", subjectId: "infec", mirHits: 15, hours: 3, priority: "alta" },
  { topic: "Anemias", subjectId: "heme", mirHits: 7, hours: 1.5, priority: "media" },
  { topic: "AR / LES", subjectId: "reuma", mirHits: 8, hours: 2, priority: "media" },
  { topic: "Preeclampsia / parto", subjectId: "gine", mirHits: 9, hours: 2, priority: "media" },
  { topic: "Neonatología / vacunas", subjectId: "pedia", mirHits: 10, hours: 2.5, priority: "alta" },
  { topic: "Depresión / urgencias", subjectId: "psiquiatria", mirHits: 6, hours: 1.5, priority: "baja" },
];

export type DayPlanType =
  | "estudio"
  | "test"
  | "simulacro"
  | "correccion"
  | "repaso"
  | "descanso";

export type DayPlan = {
  date: string;
  weekday: string;
  type: DayPlanType;
  subjectId?: string;
  subject?: string;
  topics: string[];
  hours: number;
  yieldLabel: string;
  dictated: string;
  tasks: { id: string; label: string; href: string; done?: boolean }[];
  why: string;
};

/**
 * Calendario milimétrico de la 2ª vuelta (dictado por la plataforma).
 * El alumno no decide qué estudiar: se lo marca el plan.
 */
export const dictatedWeek: DayPlan[] = [
  {
    date: "2026-07-27",
    weekday: "Lunes",
    type: "estudio",
    subjectId: "cardio",
    subject: "Cardiología",
    topics: ["Insuficiencia cardíaca", "Arritmias"],
    hours: 5,
    yieldLabel: "Alta rentabilidad · 14–18 hits MIR",
    dictated:
      "Guía CTO-style: IC-FEr (cuádruple terapia) + arritmias de QRS ancho. Esquematiza y marca intocables.",
    tasks: [
      { id: "g1", label: "Leer guía del día (IC + arritmias)", href: "/campus/asignaturas/cardiologia" },
      { id: "t1", label: "Test del día: 50 del tema + 50 aleatorias", href: "/campus/generador" },
      { id: "p1", label: "Marcar perlas e intocables", href: "/campus/asignaturas/cardiologia" },
    ],
    why: "Cardio concentra peso histórico alto; la 2ª vuelta exige memorización fuerte aquí.",
  },
  {
    date: "2026-07-28",
    weekday: "Martes",
    type: "estudio",
    subjectId: "neuro",
    subject: "Neurología",
    topics: ["Ictus", "Epilepsia"],
    hours: 5,
    yieldLabel: "Alta rentabilidad · 9–16 hits MIR",
    dictated:
      "Ictus (ventana trombólisis/trombectomía) + status epiléptico. Hoy toca esquema + test inmediato.",
    tasks: [
      { id: "g2", label: "Guía: ictus y epilepsia", href: "/campus/asignaturas/neurologia" },
      { id: "t2", label: "Test a la carta 50 preguntas Neuro", href: "/campus/generador" },
      { id: "d2", label: "Desglose oficiales de Neuro", href: "/campus/desgloses" },
    ],
    why: "Neuro suele ser punto débil relativo; el plan prioriza horas donde más netos se escapan.",
  },
  {
    date: "2026-07-29",
    weekday: "Miércoles",
    type: "simulacro",
    topics: ["Simulacro quincenal · distribución MIR"],
    hours: 4.5,
    yieldLabel: "Técnica de examen",
    dictated:
      "Simulacro oficial del ciclo: 200 + 10 reserva, 4 h 30 min, sin pausas. El objetivo es medir netos y percentil.",
    tasks: [
      { id: "s1", label: "Realizar Simulacro 25 (condiciones reales)", href: "/campus/simulacros/sim-25" },
    ],
    why: "En 2ª vuelta los simulacros pasan a quincenales para entrenar competitividad.",
  },
  {
    date: "2026-07-30",
    weekday: "Jueves",
    type: "correccion",
    subject: "Corrección de plantilla",
    topics: ["Fallos", "Blancos", "Imágenes"],
    hours: 4,
    yieldLabel: "Rentabilidad del error",
    dictated:
      "Corrección por plantilla: clasifica cada fallo (desconocimiento / confusión / precipitación) y genera repaso dirigido.",
    tasks: [
      { id: "c1", label: "Revisar plantilla del simulacro", href: "/campus/simulacros/sim-25" },
      { id: "c2", label: "Ver informe por asignatura", href: "/campus/estadisticas" },
      { id: "c3", label: "Test de refuerzo solo de fallos", href: "/campus/generador" },
    ],
    why: "El simulacro sin corrección diagnóstica no mueve percentil.",
  },
  {
    date: "2026-07-31",
    weekday: "Viernes",
    type: "estudio",
    subjectId: "digestivo",
    subject: "Digestivo",
    topics: ["Hepatología", "Páncreas"],
    hours: 4.5,
    yieldLabel: "Alta rentabilidad · 13 hits MIR",
    dictated:
      "Cirrosis (paracentesis + albúmina), pancreatitis biliar y colitis ulcerosa vs Crohn.",
    tasks: [
      { id: "g3", label: "Guía Digestivo del día", href: "/campus/asignaturas/digestivo" },
      { id: "t3", label: "100 preguntas videocomentadas (bloque)", href: "/campus/generador" },
    ],
    why: "Bloque con alto retorno histórico; se fija antes del simulacro de sábado.",
  },
  {
    date: "2026-08-01",
    weekday: "Sábado",
    type: "simulacro",
    topics: ["Simulacro semanal de rutina"],
    hours: 4.5,
    yieldLabel: "Rutina día MIR",
    dictated:
      "Simulacro sábado: misma hora mental que el examen real. 210 ítems, cuadernillo de imágenes, netos + percentil.",
    tasks: [
      { id: "s2", label: "Simulacro 26 — sábado", href: "/campus/simulacros/sim-26" },
    ],
    why: "Crear la rutina psicológica del día del MIR (cada vez más semanal al acercarse la 3ª/4ª vuelta).",
  },
  {
    date: "2026-08-02",
    weekday: "Domingo",
    type: "descanso",
    topics: ["Descanso activo"],
    hours: 1.5,
    yieldLabel: "Baja carga",
    dictated:
      "Solo flashcards/perlas ligeras. Sin temario nuevo. Protege la adherencia de la 2ª vuelta.",
    tasks: [
      { id: "r1", label: "Repaso ligero de perlas (opcional)", href: "/campus/asignaturas" },
    ],
    why: "Sin descarga semanal el intensivo se rompe.",
  },
];

export function getTodayPlan(isoDate = "2026-07-28"): DayPlan {
  return dictatedWeek.find((d) => d.date === isoDate) ?? dictatedWeek[1];
}

export function getActiveVuelta(): Vuelta {
  return vueltas.find((v) => v.status === "active") ?? vueltas[1];
}

export const mirExamSpec = {
  scoredQuestions: 200,
  reserveQuestions: 10,
  totalQuestions: 210,
  durationMin: 270,
  choices: 4,
  /** +3 acierto, −1 fallo, 0 blanco (equivale a −1/3 acierto). */
  scoring: { correct: 3, wrong: -1, blank: 0 },
  imageLinkedApprox: "30–35",
};
