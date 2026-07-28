import Link from "next/link";
import {
  dictatedWeek,
  getActiveVuelta,
  getTodayPlan,
  mirExamSpec,
  vueltas,
  yieldMarks,
} from "@/data/cto-method";
import { simulacros } from "@/data/simulacros";

export default function CampusDashboard() {
  const today = getTodayPlan("2026-07-28");
  const active = getActiveVuelta();
  const nextSim = simulacros.find((s) => s.status === "available");
  const topYield = yieldMarks.filter((y) => y.priority === "alta").slice(0, 5);

  return (
    <div className="space-y-6">
      <section className="animate-rise">
        <p className="chip mb-3">
          {active.name} · {active.phase} · la plataforma dicta el ritmo
        </p>
        <h1 className="display text-4xl md:text-5xl">Hoy no eliges: estudias esto</h1>
        <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
          Metodología tipo CTO: calendario milimétrico, material de alta
          rentabilidad, simulacros idénticos al MIR y métricas competitivas
          (netos + percentil).
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
        <article className="panel p-6 md:p-8 animate-rise animate-delay-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                Plan dictado · {today.weekday} {today.date}
              </p>
              <h2 className="display text-3xl md:text-4xl">
                {today.subject ?? today.type}
              </h2>
            </div>
            <span className="chip">{today.type}</span>
          </div>

          <p className="mb-2 text-sm font-semibold text-[var(--accent)]">
            {today.yieldLabel} · {today.hours} h
          </p>
          <p className="mb-4 text-[var(--ink-soft)]">{today.dictated}</p>
          <p className="mb-6 rounded-2xl bg-[rgba(11,95,99,0.08)] px-4 py-3 text-sm">
            <strong>Por qué hoy:</strong> {today.why}
          </p>

          <ol className="mb-6 space-y-3">
            {today.tasks.map((task, i) => (
              <li key={task.id}>
                <Link
                  href={task.href}
                  className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-white/45 px-4 py-3 transition hover:-translate-y-0.5"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--brand)] text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="font-semibold">{task.label}</span>
                </Link>
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap gap-3">
            <Link href={today.tasks[0]?.href ?? "/campus/generador"} className="btn btn-primary">
              Empezar bloque de hoy
            </Link>
            <Link href="/campus/calendario" className="btn btn-secondary">
              Ver semana dictada
            </Link>
          </div>
        </article>

        <div className="space-y-4">
          <article className="panel p-5 animate-rise animate-delay-2">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Vuelta activa
            </p>
            <h2 className="display mt-1 text-2xl">{active.name}</h2>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">{active.goal}</p>
            <div className="progress-bar mt-4">
              <span style={{ width: `${active.progress}%` }} />
            </div>
            <p className="mt-2 text-xs text-[var(--muted)]">
              {active.progress}% · {active.evaluationCadence}
            </p>
          </article>

          <article className="panel p-5 animate-rise animate-delay-3">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Próximo simulacro MIR
            </p>
            <h2 className="display mt-1 text-xl">{nextSim?.title}</h2>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">{nextSim?.description}</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl bg-[rgba(11,95,99,0.08)] p-2">
                <p className="font-bold">{mirExamSpec.totalQuestions}</p>
                <p className="text-[var(--muted)]">preguntas</p>
              </div>
              <div className="rounded-xl bg-[rgba(11,95,99,0.08)] p-2">
                <p className="font-bold">{mirExamSpec.durationMin}m</p>
                <p className="text-[var(--muted)]">tiempo</p>
              </div>
              <div className="rounded-xl bg-[rgba(11,95,99,0.08)] p-2">
                <p className="font-bold">+3/−1</p>
                <p className="text-[var(--muted)]">netos</p>
              </div>
            </div>
            <Link
              href={`/campus/simulacros/${nextSim?.id ?? ""}`}
              className="btn btn-accent mt-4 w-full"
            >
              Entrar al simulacro
            </Link>
          </article>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {vueltas.map((v) => (
          <article key={v.id} className="panel p-5">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="display text-lg">{v.name}</h3>
              <span className="chip text-[10px]">
                {v.status === "done" ? "Hecha" : v.status === "active" ? "Activa" : "Bloqueada"}
              </span>
            </div>
            <p className="text-xs font-bold text-[var(--accent)]">{v.phase}</p>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">{v.focus}</p>
            <div className="progress-bar mt-3">
              <span style={{ width: `${v.progress}%` }} />
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="panel p-6">
          <h2 className="display mb-2 text-2xl">Alta rentabilidad esta semana</h2>
          <p className="mb-4 text-sm text-[var(--ink-soft)]">
            El esfuerzo se concentra en lo que más se pregunta. Temas con más hits
            MIR históricos reciben más horas.
          </p>
          <div className="space-y-3">
            {topYield.map((y) => (
              <div
                key={y.topic}
                className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-white/40 px-4 py-3"
              >
                <div>
                  <p className="font-semibold">{y.topic}</p>
                  <p className="text-xs text-[var(--muted)]">
                    ~{y.mirHits} hits MIR · {y.hours} h asignadas
                  </p>
                </div>
                <span className="chip">prioridad {y.priority}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel p-6">
          <h2 className="display mb-2 text-2xl">Semana dictada</h2>
          <ul className="space-y-2">
            {dictatedWeek.map((d) => (
              <li
                key={d.date}
                className={`rounded-xl px-3 py-2 text-sm ${
                  d.date === today.date
                    ? "bg-[var(--brand-soft)] font-semibold"
                    : "bg-white/35"
                }`}
              >
                <span className="text-[var(--muted)]">{d.weekday}:</span>{" "}
                {d.subject ?? d.type} · {d.topics[0]}
              </li>
            ))}
          </ul>
          <Link href="/campus/estadisticas" className="btn btn-secondary mt-5 w-full">
            Ver percentiles e informes
          </Link>
        </article>
      </section>
    </div>
  );
}
