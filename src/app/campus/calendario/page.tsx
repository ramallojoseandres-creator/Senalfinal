import { weekPlan, vueltas } from "@/data/simulacros";

const typeStyles: Record<string, string> = {
  estudio: "bg-[rgba(11,95,99,0.12)] text-[var(--brand-deep)]",
  simulacro: "bg-[rgba(196,92,38,0.14)] text-[var(--accent)]",
  repaso: "bg-[rgba(31,122,77,0.12)] text-[var(--success)]",
  descanso: "bg-[rgba(18,33,43,0.06)] text-[var(--muted)]",
};

export default function CalendarioPage() {
  return (
    <div className="space-y-6 animate-rise">
      <div>
        <p className="chip mb-3">Plan semanal</p>
        <h1 className="display text-4xl">Calendario</h1>
        <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
          Semana tipo de 2ª vuelta: estudio guiado, dos simulacros y corrección
          profunda de plantillas.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {vueltas.map((v) => (
          <article key={v.id} className="panel p-5">
            <h2 className="display text-xl">{v.name}</h2>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">{v.focus}</p>
            <div className="progress-bar mt-4">
              <span style={{ width: `${v.progress}%` }} />
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {weekPlan.map((day) => (
          <article key={day.date} className="panel p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-xs text-[var(--muted)]">{day.date}</p>
                <h3 className="display text-2xl">{day.label}</h3>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${typeStyles[day.type]}`}
              >
                {day.type}
              </span>
            </div>
            {day.subject ? (
              <p className="mb-2 font-semibold">{day.subject}</p>
            ) : null}
            <p className="text-sm text-[var(--ink-soft)]">{day.detail}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
