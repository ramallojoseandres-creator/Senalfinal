export type Simulacro = {
  id: string;
  title: string;
  date: string;
  durationMin: number;
  questionCount: number;
  status: "upcoming" | "available" | "completed";
  score?: number;
  percentile?: number;
  description: string;
};

export const simulacros: Simulacro[] = [
  {
    id: "sim-24",
    title: "Simulacro 24 — Blanco oficial",
    date: "2026-07-26",
    durationMin: 270,
    questionCount: 210,
    status: "completed",
    score: 142,
    percentile: 68,
    description: "Distribución oficial MIR. Corrección con plantilla y vídeo-comentario.",
  },
  {
    id: "sim-25",
    title: "Simulacro 25 — Miércoles",
    date: "2026-07-29",
    durationMin: 270,
    questionCount: 210,
    status: "available",
    description: "Simulacro semanal. Enfocado en cardio, neuro e infecciosas.",
  },
  {
    id: "sim-26",
    title: "Simulacro 26 — Sábado",
    date: "2026-08-01",
    durationMin: 270,
    questionCount: 210,
    status: "upcoming",
    description: "Próximo simulacro del ciclo. Disponible el sábado a las 09:00.",
  },
  {
    id: "sim-27",
    title: "Simulacro 27 — Intensivo",
    date: "2026-08-05",
    durationMin: 270,
    questionCount: 210,
    status: "upcoming",
    description: "Simulacro de alta dificultad con bloque de imágenes.",
  },
];

export type CalendarDay = {
  date: string;
  label: string;
  type: "estudio" | "simulacro" | "repaso" | "descanso";
  subject?: string;
  detail: string;
};

export const weekPlan: CalendarDay[] = [
  {
    date: "2026-07-27",
    label: "Lunes",
    type: "estudio",
    subject: "Cardiología",
    detail: "Guía: SCA + IC. 50 preguntas del día + 50 aleatorias.",
  },
  {
    date: "2026-07-28",
    label: "Martes",
    type: "estudio",
    subject: "Neurología",
    detail: "Ictus y epilepsia. Recuerdas + test intocables.",
  },
  {
    date: "2026-07-29",
    label: "Miércoles",
    type: "simulacro",
    detail: "Simulacro 25 completo (210 preguntas).",
  },
  {
    date: "2026-07-30",
    label: "Jueves",
    type: "repaso",
    subject: "Corrección",
    detail: "Corrección plantilla + vídeo de fallos del simulacro.",
  },
  {
    date: "2026-07-31",
    label: "Viernes",
    type: "estudio",
    subject: "Digestivo",
    detail: "Hepatología y páncreas. 100 preguntas videocomentadas.",
  },
  {
    date: "2026-08-01",
    label: "Sábado",
    type: "simulacro",
    detail: "Simulacro 26 — ciclo semanal.",
  },
  {
    date: "2026-08-02",
    label: "Domingo",
    type: "descanso",
    detail: "Descanso activo. Solo perlas y flashcards ligeras.",
  },
];

export type Vuelta = {
  id: string;
  name: string;
  progress: number;
  focus: string;
  status: "done" | "active" | "locked";
};

export const vueltas: Vuelta[] = [
  {
    id: "v1",
    name: "1ª Vuelta",
    progress: 100,
    focus: "Estudio razonado por guías diarias",
    status: "done",
  },
  {
    id: "v2",
    name: "2ª Vuelta",
    progress: 62,
    focus: "Consolidación + simulacros semanales",
    status: "active",
  },
  {
    id: "v3",
    name: "3ª Vuelta",
    progress: 0,
    focus: "Sprint final personalizado pre-MIR",
    status: "locked",
  },
];
