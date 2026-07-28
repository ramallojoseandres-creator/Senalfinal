import Link from "next/link";
import { simulacros } from "@/data/simulacros";
import { getActiveVuelta, mirExamSpec } from "@/data/cto-method";

export default function SimulacrosPage() {
  const active = getActiveVuelta();

  return (
    <div className="space-y-6 animate-rise">
      <div>
        <p className="chip mb-3">Réplicas exactas del MIR</p>
        <h1 className="display text-4xl">Simulacros</h1>
        <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
          {mirExamSpec.scoredQuestions} preguntas + {mirExamSpec.reserveQuestions}{" "}
          de reserva · {mirExamSpec.durationMin} minutos · 4 opciones · scoring{" "}
          +3/−1/0 · ~{mirExamSpec.imageLinkedApprox} con imagen. Cadencia actual (
          {active.name}): {active.evaluationCadence}.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Inicio / 1ª vuelta", "Mensuales"],
          ["2ª vuelta intensiva", "Quincenales"],
          ["3ª–4ª vuelta", "Semanales (sábados)"],
        ].map(([k, v]) => (
          <div key={k} className="panel p-4">
            <p className="text-xs uppercase text-[var(--muted)]">{k}</p>
            <p className="font-bold">{v}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4">
        {simulacros.map((sim) => (
          <article
            key={sim.id}
            className="panel p-6 md:flex md:items-center md:justify-between md:gap-6"
          >
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h2 className="display text-2xl">{sim.title}</h2>
                <span className="chip">
                  {sim.status === "completed"
                    ? "Corregido"
                    : sim.status === "available"
                      ? "Disponible"
                      : "Próximo"}
                </span>
                <span className="chip !bg-[var(--accent-soft)] !text-[var(--accent)]">
                  {sim.cadence}
                </span>
              </div>
              <p className="text-sm text-[var(--ink-soft)]">{sim.description}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm">
                <span>{sim.date}</span>
                <span>
                  {sim.scoredQuestions}+{sim.reserveQuestions} = {sim.questionCount}
                </span>
                <span>{sim.durationMin} min</span>
                {sim.percentile != null ? (
                  <span className="font-semibold text-[var(--brand)]">
                    netos {sim.nets} · p{sim.percentile}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              {sim.status === "upcoming" ? (
                <button type="button" className="btn btn-secondary" disabled>
                  Bloqueado
                </button>
              ) : (
                <Link href={`/campus/simulacros/${sim.id}`} className="btn btn-primary">
                  {sim.status === "completed" ? "Revisar / repetir" : "Realizar"}
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
