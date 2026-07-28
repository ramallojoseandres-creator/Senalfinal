export type Simulacro = {
  id: string;
  title: string;
  date: string;
  durationMin: number;
  scoredQuestions: number;
  reserveQuestions: number;
  questionCount: number;
  status: "upcoming" | "available" | "completed";
  score?: number;
  nets?: number;
  percentile?: number;
  cadence: "mensual" | "quincenal" | "semanal";
  vuelta: "v1" | "v2" | "v3" | "v4";
  description: string;
};
