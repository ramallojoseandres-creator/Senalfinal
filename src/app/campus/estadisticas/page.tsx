"use client";

import { useSyncExternalStore } from "react";
import { subjects } from "@/data/subjects";
import { loadProgress, emptyProgress } from "@/lib/exam";

function subscribe() {
  return () => {};
}

export default function EstadisticasPage() {
  const progress = useSyncExternalStore(subscribe, loadProgress, emptyProgress);

  const totalAnswers = progress.correct + progress.wrong + progress.blank;
  const accuracy =
    progress.correct + progress.wrong > 0
      ? Math.round(
          (progress.correct / (progress.correct + progress.wrong)) * 100,
        )
      : 0;

  const subjectStats = subjects
    .map((s) => {
      const stat = progress.bySubject[s.id];
      const total = stat?.total ?? 0;
      const rate =
        total > 0 ? Math.round(((stat?.correct ?? 0) / total) * 100) : null;
      return { ...s, total, rate, wrong: stat?.wrong ?? 0 };
    })
    .sort((a, b) => (a.rate ?? 101) - (b.rate ?? 101));

  return (
    <div className="space-y-6 animate-rise">
      <div>
        <p className="chip mb-3">Evolución</p>
        <h1 className="display text-4xl">Estadísticas</h1>
        <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
          Curva de netos, blancos y asignaturas débiles — la base del calendario
          personalizado de la 3ª vuelta.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Sesiones", String(progress.attempts)],
          ["Respuestas", String(totalAnswers)],
          ["Aciertos", `${accuracy}%`],
          ["Blancos", String(progress.blank)],
        ].map(([label, value]) => (
          <article key={label} className="panel p-5">
            <p className="text-xs uppercase tracking-wide text-[var(--muted)]">
              {label}
            </p>
            <p className="display text-3xl">{value}</p>
          </article>
        ))}
      </section>

      <section className="panel p-6">
        <h2 className="display mb-4 text-2xl">Por asignatura</h2>
        {totalAnswers === 0 ? (
          <p className="text-[var(--ink-soft)]">
            Aún no hay datos. Completa un test en el generador o un simulacro para
            ver tu mapa de rendimiento.
          </p>
        ) : (
          <div className="space-y-4">
            {subjectStats
              .filter((s) => s.total > 0)
              .map((s) => (
                <div key={s.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-semibold">{s.name}</span>
                    <span className="text-[var(--muted)]">
                      {s.rate}% · {s.total} preg. · {s.wrong} fallos
                    </span>
                  </div>
                  <div className="progress-bar">
                    <span
                      style={{
                        width: `${s.rate ?? 0}%`,
                        background: s.color,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>

      <section className="panel p-6">
        <h2 className="display mb-4 text-2xl">Historial reciente</h2>
        {progress.history.length === 0 ? (
          <p className="text-[var(--ink-soft)]">Sin sesiones registradas todavía.</p>
        ) : (
          <ul className="space-y-3">
            {progress.history.map((h, i) => (
              <li
                key={`${h.date}-${i}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[var(--line)] bg-white/40 px-4 py-3"
              >
                <div>
                  <p className="font-semibold">{h.label}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {new Date(h.date).toLocaleString("es-ES")}
                  </p>
                </div>
                <p className="font-bold text-[var(--brand)]">
                  Netos {h.net} / {h.total * 3}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
