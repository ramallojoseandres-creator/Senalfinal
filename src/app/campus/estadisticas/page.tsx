"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { emptyMetrics, loadMetrics } from "@/lib/metrics";
import { loadProgress, emptyProgress } from "@/lib/exam";
import { getActiveVuelta } from "@/data/cto-method";

function subscribe() {
  return () => {};
}

export default function EstadisticasPage() {
  const metrics = useSyncExternalStore(subscribe, loadMetrics, emptyMetrics);
  const progress = useSyncExternalStore(subscribe, loadProgress, emptyProgress);
  const active = getActiveVuelta();
  const last = metrics.lastReport;
  const history = metrics.simulacros;

  return (
    <div className="space-y-6 animate-rise">
      <div>
        <p className="chip mb-3">Métricas competitivas</p>
        <h1 className="display text-4xl">Netos, percentil e informe</h1>
        <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
          No buscamos un 10 académico: medimos competitividad frente a la
          cohorte. Estás en {active.name} — {active.evaluationCadence}.
        </p>
      </div>

      {last ? (
        <section className="panel p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
            Último informe · {last.label}
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Netos", String(last.result.net)],
              ["Percentil", `p${last.percentile}`],
              ["Puesto ~", last.rankApprox.toLocaleString("es-ES")],
              ["Cohorte", last.cohortSize.toLocaleString("es-ES")],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-[rgba(11,95,99,0.08)] p-4">
                <p className="text-xs uppercase text-[var(--muted)]">{k}</p>
                <p className="display text-3xl">{v}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-[var(--ink-soft)]">{last.message}</p>

          <h2 className="display mt-8 mb-4 text-2xl">Por asignatura</h2>
          <div className="space-y-3">
            {last.bySubject.map((s) => (
              <div key={s.subjectId}>
                <div className="mb-1 flex flex-wrap justify-between gap-2 text-sm">
                  <span className="font-semibold">
                    {s.name} · {s.verdict}
                  </span>
                  <span className="text-[var(--muted)]">
                    p{s.percentile} · netos {s.nets}
                  </span>
                </div>
                <div className="progress-bar">
                  <span style={{ width: `${s.percentile}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>

          {last.weak.length ? (
            <div className="mt-6 rounded-2xl bg-[rgba(196,92,38,0.1)] p-4">
              <p className="font-semibold">Puntos débiles (personaliza el repaso)</p>
              <p className="mt-1 text-sm">
                {last.weak.map((w) => w.name).join(" · ")}
              </p>
              <Link href="/campus/generador" className="btn btn-accent mt-3 !py-2 !px-3 text-sm">
                Test a la carta de refuerzo
              </Link>
            </div>
          ) : null}
        </section>
      ) : (
        <section className="panel p-8">
          <h2 className="display text-2xl">Aún no hay informe competitivo</h2>
          <p className="mt-2 text-[var(--ink-soft)]">
            Completa un simulacro o un examen para ver netos, percentil frente a
            cohorte e informe por asignatura.
          </p>
          <Link href="/campus/simulacros" className="btn btn-primary mt-5">
            Ir a simulacros
          </Link>
        </section>
      )}

      <section className="panel p-6">
        <h2 className="display mb-4 text-2xl">Evolución de simulacros</h2>
        {history.length === 0 ? (
          <p className="text-[var(--ink-soft)]">Sin simulacros registrados todavía.</p>
        ) : (
          <ul className="space-y-3">
            {history.map((h) => (
              <li
                key={h.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[var(--line)] bg-white/40 px-4 py-3"
              >
                <div>
                  <p className="font-semibold">{h.label}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {new Date(h.date).toLocaleString("es-ES")}
                  </p>
                </div>
                <p className="font-bold text-[var(--brand)]">
                  Netos {h.net} · p{h.percentile}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          ["Sesiones practice", String(progress.attempts)],
          ["Aciertos acumulados", String(progress.correct)],
          ["Fallos acumulados", String(progress.wrong)],
        ].map(([k, v]) => (
          <article key={k} className="panel p-5">
            <p className="text-xs uppercase text-[var(--muted)]">{k}</p>
            <p className="display text-3xl">{v}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
