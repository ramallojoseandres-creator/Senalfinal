"use client";

import { useEffect, useState } from "react";
import type { CompetitiveReport } from "@/lib/metrics";

type Props = {
  report: CompetitiveReport;
  label: string;
  seconds: number;
  questionCount: number;
  onReview?: () => void;
  onAgain?: () => void;
  onExitHref?: string;
};

export function ResultsReveal({
  report,
  label,
  seconds,
  questionCount,
  onReview,
  onAgain,
  onExitHref = "/campus",
}: Props) {
  const [stage, setStage] = useState(0);
  const { result } = report;
  const accuracy =
    result.correct + result.wrong > 0
      ? Math.round((result.correct / (result.correct + result.wrong)) * 100)
      : 0;
  const avgSec =
    questionCount > 0 ? Math.round(seconds / questionCount) : 0;

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setStage(1), 280),
      window.setTimeout(() => setStage(2), 900),
      window.setTimeout(() => setStage(3), 1600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const tone =
    report.percentile >= 90
      ? "elite"
      : report.percentile >= 70
        ? "strong"
        : report.percentile >= 50
          ? "mid"
          : "work";

  return (
    <div className="reveal-stage px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-display text-[0.7rem] font-bold uppercase tracking-[0.28em] text-[var(--signal)]">
          Resultado competitivo
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">{label}</p>

        <div
          className={`mt-8 transition-all duration-700 ${
            stage >= 1 ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <p className="text-sm text-[var(--muted)]">Percentil estimado vs cohorte</p>
          <p
            className={`mt-2 font-display animate-count text-[clamp(4.5rem,16vw,8rem)] font-extrabold leading-none tracking-tight ${
              tone === "elite"
                ? "text-[var(--signal)]"
                : tone === "strong"
                  ? "text-[var(--ok)]"
                  : tone === "mid"
                    ? "text-[var(--ink)]"
                    : "text-[var(--warn)]"
            }`}
          >
            P{report.percentile}
          </p>
          <p className="mt-3 text-sm text-[var(--muted)]">
            {report.message}
          </p>
          <p className="mt-2 text-xs text-[var(--muted)]">
            ~{report.cohortSize.toLocaleString("es-ES")} alumnos · puesto aprox.{" "}
            {report.rankApprox.toLocaleString("es-ES")}
          </p>
        </div>

        <div
          className={`mt-10 grid gap-3 sm:grid-cols-3 transition-all duration-700 ${
            stage >= 2 ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <Metric label="Netos" value={String(result.net)} accent />
          <Metric label="Aciertos" value={`${accuracy}%`} />
          <Metric label="Tiempo / pregunta" value={`${avgSec}s`} />
        </div>

        <div
          className={`mt-4 grid gap-3 sm:grid-cols-3 transition-all duration-700 ${
            stage >= 3 ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <Metric label="Correctas" value={String(result.correct)} />
          <Metric label="Incorrectas" value={String(result.wrong)} />
          <Metric label="En blanco" value={String(result.blank)} />
        </div>

        <div
          className={`mt-10 flex flex-wrap justify-center gap-3 transition-all duration-700 ${
            stage >= 3 ? "opacity-100" : "opacity-0"
          }`}
        >
          {onReview ? (
            <button type="button" onClick={onReview} className="btn btn-primary">
              Revisar fallos
            </button>
          ) : null}
          {onAgain ? (
            <button type="button" onClick={onAgain} className="btn btn-secondary">
              Repetir sesión
            </button>
          ) : null}
          <a href={onExitHref} className="btn btn-ghost">
            Volver al campus
          </a>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] px-4 py-5">
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
        {label}
      </p>
      <p
        className={`mt-2 font-display text-3xl font-bold ${
          accent ? "text-[var(--signal)]" : "text-[var(--ink)]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
