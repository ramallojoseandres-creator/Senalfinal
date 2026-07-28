import type { Question } from "@/data/questions";
import { subjects } from "@/data/subjects";
import type { AnswerMap, SessionResult } from "@/lib/exam";
import { gradeSession } from "@/lib/exam";

export type SubjectReport = {
  subjectId: string;
  name: string;
  color: string;
  asked: number;
  correct: number;
  wrong: number;
  blank: number;
  accuracy: number;
  nets: number;
  percentile: number;
  verdict: "fuerte" | "medio" | "debil";
};

export type CompetitiveReport = {
  result: SessionResult;
  percentile: number;
  cohortSize: number;
  rankApprox: number;
  bySubject: SubjectReport[];
  weak: SubjectReport[];
  strong: SubjectReport[];
  message: string;
};

/** Distribución demo de netos de cohorte (media ~55% del máximo). */
export function estimatePercentile(net: number, maxNet: number): number {
  if (maxNet <= 0) return 50;
  const ratio = Math.max(0, Math.min(1, net / maxNet));
  // Curva logística suave → percentil competitivo
  const z = (ratio - 0.52) / 0.14;
  const cdf = 1 / (1 + Math.exp(-1.4 * z));
  return Math.round(Math.max(1, Math.min(99, cdf * 100)));
}

export function buildCompetitiveReport(
  qs: Question[],
  answers: AnswerMap,
  cohortSize = 10000,
): CompetitiveReport {
  const result = gradeSession(qs, answers);
  const maxNet = qs.filter((q) => q.correctId).length * 3;
  const percentile = estimatePercentile(result.net, maxNet);
  const rankApprox = Math.max(1, Math.round(((100 - percentile) / 100) * cohortSize));

  const map = new Map<string, { correct: number; wrong: number; blank: number; asked: number }>();
  for (const q of qs) {
    if (!q.correctId) continue;
    const row = map.get(q.subjectId) ?? { correct: 0, wrong: 0, blank: 0, asked: 0 };
    row.asked += 1;
    const a = answers[q.id];
    if (!a) row.blank += 1;
    else if (a === q.correctId) row.correct += 1;
    else row.wrong += 1;
    map.set(q.subjectId, row);
  }

  const bySubject: SubjectReport[] = [...map.entries()].map(([subjectId, row]) => {
    const sub = subjects.find((s) => s.id === subjectId);
    const accuracy =
      row.correct + row.wrong > 0
        ? Math.round((row.correct / (row.correct + row.wrong)) * 100)
        : 0;
    const nets = row.correct * 3 - row.wrong;
    const max = row.asked * 3;
    const percentileSub = estimatePercentile(nets, max);
    const verdict: SubjectReport["verdict"] =
      percentileSub >= 70 ? "fuerte" : percentileSub >= 40 ? "medio" : "debil";
    return {
      subjectId,
      name: sub?.name ?? (subjectId === "oficial" ? "Oficial MIR" : subjectId),
      color: sub?.color ?? "#0b5f63",
      asked: row.asked,
      correct: row.correct,
      wrong: row.wrong,
      blank: row.blank,
      accuracy,
      nets,
      percentile: percentileSub,
      verdict,
    };
  });

  bySubject.sort((a, b) => a.percentile - b.percentile);
  const weak = bySubject.filter((s) => s.verdict === "debil").slice(0, 3);
  const strong = [...bySubject].filter((s) => s.verdict === "fuerte").reverse().slice(0, 3);

  const message =
    percentile >= 75
      ? `Vas por encima del ${percentile}% de la cohorte. Mantén simulacros y cierra puntos débiles.`
      : percentile >= 50
        ? `Percentil ${percentile}: estás en la mitad competitiva. El informe marca dónde recuperar netos.`
        : `Percentil ${percentile}: toca priorizar asignaturas débiles y técnica de blancos/fallos.`;

  return {
    result,
    percentile,
    cohortSize,
    rankApprox,
    bySubject,
    weak,
    strong,
    message,
  };
}

const METRICS_KEY = "senal-mir-metrics-v1";

export type MetricsStore = {
  simulacros: {
    id: string;
    date: string;
    label: string;
    net: number;
    total: number;
    percentile: number;
    bySubject: SubjectReport[];
  }[];
  lastReport?: CompetitiveReport & { label: string; date: string };
};

export function emptyMetrics(): MetricsStore {
  return { simulacros: [] };
}

export function loadMetrics(): MetricsStore {
  if (typeof window === "undefined") return emptyMetrics();
  try {
    const raw = localStorage.getItem(METRICS_KEY);
    if (!raw) return emptyMetrics();
    return { ...emptyMetrics(), ...JSON.parse(raw) };
  } catch {
    return emptyMetrics();
  }
}

export function saveMetrics(store: MetricsStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(METRICS_KEY, JSON.stringify(store));
}

export function recordCompetitiveAttempt(
  qs: Question[],
  answers: AnswerMap,
  label: string,
  id = `att-${Date.now()}`,
) {
  const report = buildCompetitiveReport(qs, answers);
  const store = loadMetrics();
  store.simulacros = [
    {
      id,
      date: new Date().toISOString(),
      label,
      net: report.result.net,
      total: report.result.total,
      percentile: report.percentile,
      bySubject: report.bySubject,
    },
    ...store.simulacros,
  ].slice(0, 30);
  store.lastReport = {
    ...report,
    label,
    date: new Date().toISOString(),
  };
  saveMetrics(store);
  return report;
}
