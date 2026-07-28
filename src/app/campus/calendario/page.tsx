import Link from "next/link";
import {
  dictatedWeek,
  getActiveVuelta,
  mirExamSpec,
  vueltas,
  yieldMarks,
} from "@/data/cto-method";

const typeStyles: Record<string, string> = {
  estudio: "bg-[rgba(11,95,99,0.12)] text-[var(--brand-deep)]",
  test: "bg-[rgba(11,95,99,0.12)] text-[var(--brand-deep)]",
  simulacro: "bg-[rgba(196,92,38,0.14)] text-[var(--accent)]",
  correccion: "bg-[rgba(31,122,77,0.12)] text-[var(--success)]",
  repaso: "bg-[rgba(31,122,77,0.12)] text-[var(--success)]",
  descanso: "bg-[rgba(18,33,43,0.06)] text-[var(--muted)]",
};

export default function CalendarioPage() {
  const active = getActiveVuelta();

  return (
    <div className="space-y-6 animate-rise">
      <div>
        <p className="chip mb-3">Calendario milimétrico</p>
        <h1 className="display text-4xl">La plataforma te dice qué estudiar</h1>
        <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
          No improvisas el día. Cada bloque tiene horas asignadas según
          rentabilidad histórica MIR. Ahora estás en {active.name} (
          {active.phase}): {active.evaluationCadence}.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        {vueltas.map((v) => (
          <article key={v.id} className="panel p-5">
            <p className="text-xs font-bold text-[var(--accent)]">{v.phase}</p>
            <h2 className="display text-xl">{v.name}</h2>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">{v.goal}</p>
            <p className="mt-3 text-xs text-[var(--muted)]">{v.evaluationCadence}</p>
            <div className="progress-bar mt-3">
              <span style={{ width: `${v.progress}%` }} />
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
        {dictatedWeek.map((day) => (
          <article key={day.date} className="panel p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs text-[var(--muted)]">{day.date}</p>
                <h3 className="display text-2xl">
                  {day.weekday}
                  {day.subject ? ` · ${day.subject}` : ""}
                </h3>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${typeStyles[day.type]}`}
              >
                {day.type}
              </span>
            </div>
            <p className="mt-2 text-sm font-semibold text-[var(--accent)]">
              {day.yieldLabel} · {day.hours} h
            </p>
            <p className="mt-2 text-[var(--ink-soft)]">{day.dictated}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Temas: {day.topics.join(" · ")}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {day.tasks.map((t) => (
                <Link key={t.id} href={t.href} className="btn btn-secondary !py-2 !px-3 text-sm">
                  {t.label}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="panel p-6">
        <h2 className="display mb-3 text-2xl">Rentabilidad del temario</h2>
        <p className="mb-4 text-sm text-[var(--ink-soft)]">
          Si un tema tiene poco peso histórico, recibe pocas horas. Spec MIR:{" "}
          {mirExamSpec.totalQuestions} preguntas ({mirExamSpec.scoredQuestions}+
          {mirExamSpec.reserveQuestions} reserva), {mirExamSpec.durationMin} min.
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {yieldMarks.map((y) => (
            <div
              key={y.topic}
              className="rounded-xl border border-[var(--line)] bg-white/40 px-3 py-2 text-sm"
            >
              <p className="font-semibold">{y.topic}</p>
              <p className="text-xs text-[var(--muted)]">
                {y.mirHits} hits · {y.hours} h · {y.priority}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
