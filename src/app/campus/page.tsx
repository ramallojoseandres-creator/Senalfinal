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
import { questions } from "@/data/questions";
import { getGradableOfficialQuestions } from "@/data/oficiales";

export default function CampusDashboard() {
  const today = getTodayPlan("2026-07-28");
  const active = getActiveVuelta();
  const nextSim = simulacros.find((s) => s.status === "available");
  const topYield = yieldMarks.filter((y) => y.priority === "alta").slice(0, 5);
  const bankSize = questions.length + getGradableOfficialQuestions().length;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(145deg,#061015_0%,#0c1c22_45%,#0a2a30_100%)] px-6 py-10 text-white md:px-10 md:py-14 animate-rise">
        <div className="noise opacity-[0.06]" />
        <div className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-[var(--signal)]/20 blur-3xl signal-orb" />
        <p className="relative text-[0.7rem] font-bold uppercase tracking-[0.28em] text-[var(--signal)]">
          {active.name} · {active.phase} · {bankSize}+ preguntas
        </p>
        <h1 className="relative display mt-4 max-w-3xl text-4xl md:text-6xl">
          Hoy no eliges: estudias esto
        </h1>
        <p className="relative mt-4 max-w-xl text-base text-white/70 md:text-lg">
          {today.dictated}
        </p>
        <div className="relative mt-8 flex flex-wrap items-end gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">Asignatura</p>
            <p className="display mt-1 text-3xl">{today.subject ?? today.type}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">Bloque</p>
            <p className="mt-1 text-xl font-semibold">
              {today.hours} h · {today.yieldLabel}
            </p>
          </div>
          <Link
            href={today.tasks[0]?.href ?? "/campus/generador"}
            className="btn btn-primary ml-auto sweep-shine"
          >
            Empezar bloque de hoy
          </Link>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <article className="animate-rise animate-delay-1">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
            Secuencia dictada · {today.weekday} {today.date}
          </p>
          <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
            <strong>Por qué hoy:</strong> {today.why}
          </p>
          <ol className="mt-6 space-y-3">
            {today.tasks.map((task, i) => (
              <li key={task.id}>
                <Link
                  href={task.href}
                  className="group flex items-center gap-4 border-b border-[var(--line)] py-4 transition hover:pl-1"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--brand)] text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="font-semibold group-hover:text-[var(--brand)]">
                    {task.label}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/campus/calendario" className="btn btn-secondary">
              Ver semana dictada
            </Link>
            <Link href="/campus/oficiales" className="btn btn-ghost">
              Oficiales MIR
            </Link>
          </div>
        </article>

        <div className="space-y-5 animate-rise animate-delay-2">
          <div className="border-t border-[var(--line)] pt-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
              Banco PuertoMir
            </p>
            <h2 className="display mt-2 text-3xl">{bankSize}+</h2>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              Preguntas corregibles: demo ampliado + oficiales 2024/2025 con plantilla.
            </p>
          </div>

          <div className="border-t border-[var(--line)] pt-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
              Vuelta activa
            </p>
            <h2 className="display mt-2 text-3xl">{active.name}</h2>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">{active.goal}</p>
            <div className="progress-bar mt-4">
              <span style={{ width: `${active.progress}%` }} />
            </div>
            <p className="mt-2 text-xs text-[var(--muted)]">
              {active.progress}% · {active.evaluationCadence}
            </p>
          </div>

          <div className="border-t border-[var(--line)] pt-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
              Próximo simulacro
            </p>
            <h2 className="display mt-2 text-2xl">{nextSim?.title}</h2>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">{nextSim?.description}</p>
            <div className="mt-4 flex gap-6 text-sm">
              <div>
                <p className="font-bold">{mirExamSpec.totalQuestions}</p>
                <p className="text-[var(--muted)]">preguntas</p>
              </div>
              <div>
                <p className="font-bold">{mirExamSpec.durationMin}m</p>
                <p className="text-[var(--muted)]">tiempo</p>
              </div>
              <div>
                <p className="font-bold">+3/−1</p>
                <p className="text-[var(--muted)]">netos</p>
              </div>
            </div>
            <Link
              href={`/campus/simulacros/${nextSim?.id ?? ""}`}
              className="btn btn-accent mt-5 w-full"
            >
              Entrar al arena
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-4">
        {vueltas.map((v) => (
          <article key={v.id} className="border-t border-[var(--line)] pt-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="display text-xl">{v.name}</h3>
              <span className="chip text-[10px]">
                {v.status === "done"
                  ? "Hecha"
                  : v.status === "active"
                    ? "Activa"
                    : "Bloqueada"}
              </span>
            </div>
            <p className="text-xs font-bold text-[var(--signal)]">{v.phase}</p>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">{v.focus}</p>
            <div className="progress-bar mt-3">
              <span style={{ width: `${v.progress}%` }} />
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <article>
          <h2 className="display text-3xl">Alta rentabilidad</h2>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            Más horas donde más hits MIR históricos hay.
          </p>
          <div className="mt-5 space-y-1">
            {topYield.map((y) => (
              <div
                key={y.topic}
                className="flex items-center justify-between gap-3 border-b border-[var(--line)] py-3"
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

        <article>
          <h2 className="display text-3xl">Semana dictada</h2>
          <ul className="mt-5 space-y-1">
            {dictatedWeek.map((d) => (
              <li
                key={d.date}
                className={`border-b border-[var(--line)] px-1 py-2.5 text-sm ${
                  d.date === today.date ? "font-semibold text-[var(--brand)]" : ""
                }`}
              >
                <span className="text-[var(--muted)]">{d.weekday}:</span>{" "}
                {d.subject ?? d.type} · {d.topics[0]}
              </li>
            ))}
          </ul>
          <Link href="/campus/estadisticas" className="btn btn-secondary mt-6 w-full">
            Ver percentiles e informes
          </Link>
        </article>
      </section>
    </div>
  );
}
