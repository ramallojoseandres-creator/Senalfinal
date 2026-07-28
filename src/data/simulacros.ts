import type { Simulacro } from "./simulacro-types";

export type { Simulacro } from "./simulacro-types";

export const simulacros: Simulacro[] = [
  {
    id: "sim-24",
    title: "Simulacro 24 — Blanco oficial",
    date: "2026-07-12",
    durationMin: 270,
    scoredQuestions: 200,
    reserveQuestions: 10,
    questionCount: 210,
    status: "completed",
    score: 142,
    nets: 368,
    percentile: 72,
    cadence: "quincenal",
    vuelta: "v2",
    description:
      "Réplica MIR: 200 + 10 reserva, 4 h 30 min, cuadernillo de imágenes. Corregido con plantilla y percentil de cohorte.",
  },
  {
    id: "sim-25",
    title: "Simulacro 25 — Miércoles quincenal",
    date: "2026-07-29",
    durationMin: 270,
    scoredQuestions: 200,
    reserveQuestions: 10,
    questionCount: 210,
    status: "available",
    cadence: "quincenal",
    vuelta: "v2",
    description:
      "Simulacro de 2ª vuelta. Distribución por peso MIR. Mide netos, percentil y puntos débiles.",
  },
  {
    id: "sim-26",
    title: "Simulacro 26 — Sábado rutina",
    date: "2026-08-01",
    durationMin: 270,
    scoredQuestions: 200,
    reserveQuestions: 10,
    questionCount: 210,
    status: "upcoming",
    cadence: "semanal",
    vuelta: "v2",
    description:
      "Entrena la rutina del día del examen (sábado). Disponible el sábado a las 09:00.",
  },
  {
    id: "sim-27",
    title: "Simulacro 27 — Intensivo imágenes",
    date: "2026-08-08",
    durationMin: 270,
    scoredQuestions: 200,
    reserveQuestions: 10,
    questionCount: 210,
    status: "upcoming",
    cadence: "semanal",
    vuelta: "v3",
    description:
      "Bloque reforzado de imágenes (≈30–35 ligadas). Prepara 3ª vuelta.",
  },
];
