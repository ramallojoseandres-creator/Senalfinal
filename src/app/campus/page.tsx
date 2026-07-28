import Link from "next/link";
import { subjects } from "@/data/subjects";
import { simulacros, weekPlan, vueltas } from "@/data/simulacros";
import { questions } from "@/data/questions";

export default function CampusDashboard() {
  const nextSim = simulacros.find((s) => s.status === "available");
  const today = weekPlan.find((d) => d.date === "2026-07-28") ?? weekPlan[1];
  const weak = subjects.slice(0, 3);

  return (
    <div className="space-y-6">
      <section className="animate-rise">
        <p className="chip mb-3">Buen estudio</p>
        <h1 className="display text-4xl md:text-5xl">Tu campus MIR</h1>
        <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
          Hoy toca {today.subject ?? today.type}: {today.detail}
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="panel p-6 lg:col-span-2 animate-rise animate-delay-1">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                Plan de hoy
              </p>
              <h2 className="display text-3xl">{today.label}</h2>
            </div>
            <span className="chip">{today.type}</span>
          </div>
          <p className="mb-6 text-[var(--ink-soft)]">{today.detail}</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/campus/generador" className="btn btn-primary">
              Lanzar evaluación del día
            </Link>
            <Link href="/campus/calendario" className="btn btn-secondary">
              Ver semana
            </Link>
          </div>
        </article>

        <article className="panel p-6 animate-rise animate-delay-2">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
            Próximo simulacro
          </p>
          <h2 className="display mt-1 text-2xl">
            {nextSim?.title ?? "Sin simulacro"}
          </h2>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            {nextSim?.description}
          </p>
          <div className="mt-5 flex gap-4 text-sm">
            <div>
              <p className="text-[var(--muted)]">Preguntas</p>
              <p className="font-bold">{nextSim?.questionCount}</p>
            </div>
            <div>
              <p className="text-[var(--muted)]">Duración</p>
              <p className="font-bold">{nextSim?.durationMin} min</p>
            </div>
          </div>
          <Link
            href={`/campus/simulacros/${nextSim?.id ?? ""}`}
            className="btn btn-accent mt-6 w-full"
          >
            Empezar simulacro
          </Link>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {vueltas.map((v) => (
          <article key={v.id} className="panel p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="display text-xl">{v.name}</h3>
              <span className="chip">
                {v.status === "done"
                  ? "Hecha"
                  : v.status === "active"
                    ? "Activa"
                    : "Bloqueada"}
              </span>
            </div>
            <p className="mb-4 text-sm text-[var(--ink-soft)]">{v.focus}</p>
            <div className="progress-bar">
              <span style={{ width: `${v.progress}%` }} />
            </div>
            <p className="mt-2 text-xs text-[var(--muted)]">{v.progress}%</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="panel p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="display text-2xl">Asignaturas clave</h2>
            <Link href="/campus/asignaturas" className="text-sm font-semibold text-[var(--brand)]">
              Ver todas
            </Link>
          </div>
          <div className="space-y-3">
            {subjects.slice(0, 6).map((s) => {
              const count = questions.filter((q) => q.subjectId === s.id).length;
              return (
                <Link
                  key={s.id}
                  href={`/campus/asignaturas/${s.slug}`}
                  className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-white/40 px-4 py-3 transition hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ background: s.color }}
                    />
                    <div>
                      <p className="font-semibold">{s.name}</p>
                      <p className="text-xs text-[var(--muted)]">
                        Peso MIR ~{s.weight}% · {count} preguntas demo
                      </p>
                    </div>
                  </div>
                  <span className="text-[var(--brand)]">→</span>
                </Link>
              );
            })}
          </div>
        </article>

        <article className="panel p-6">
          <h2 className="display mb-4 text-2xl">Refuerzo IA</h2>
          <p className="mb-4 text-sm text-[var(--ink-soft)]">
            Priorizamos bloques donde más netos se te escapan. Empieza por:
          </p>
          <ul className="space-y-3">
            {weak.map((s, i) => (
              <li
                key={s.id}
                className="rounded-2xl bg-[rgba(196,92,38,0.08)] px-4 py-3"
              >
                <p className="text-xs font-bold text-[var(--accent)]">
                  Prioridad {i + 1}
                </p>
                <p className="font-semibold">{s.name}</p>
                <p className="text-xs text-[var(--muted)]">
                  {s.topics.slice(0, 2).join(" · ")}
                </p>
              </li>
            ))}
          </ul>
          <Link href="/campus/generador" className="btn btn-secondary mt-5 w-full">
            Generar test de refuerzo
          </Link>
        </article>
      </section>
    </div>
  );
}
