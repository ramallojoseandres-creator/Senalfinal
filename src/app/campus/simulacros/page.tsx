import Link from "next/link";
import { simulacros } from "@/data/simulacros";

export default function SimulacrosPage() {
  return (
    <div className="space-y-6 animate-rise">
      <div>
        <p className="chip mb-3">Miércoles y sábados</p>
        <h1 className="display text-4xl">Simulacros</h1>
        <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
          Pruebas con distribución MIR, corrección por plantilla y seguimiento de
          posición relativa. El día del examen debe sentirse como un simulacro más.
        </p>
      </div>

      <div className="grid gap-4">
        {simulacros.map((sim) => (
          <article key={sim.id} className="panel p-6 md:flex md:items-center md:justify-between md:gap-6">
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
              </div>
              <p className="text-sm text-[var(--ink-soft)]">{sim.description}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm">
                <span>{sim.date}</span>
                <span>{sim.questionCount} preguntas</span>
                <span>{sim.durationMin} min</span>
                {sim.score != null ? (
                  <span className="font-semibold text-[var(--brand)]">
                    {sim.score} aciertos · p{sim.percentile}
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
                <Link
                  href={`/campus/simulacros/${sim.id}`}
                  className="btn btn-primary"
                >
                  {sim.status === "completed" ? "Revisar" : "Realizar"}
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
