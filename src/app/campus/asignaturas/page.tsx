import Link from "next/link";
import { subjects } from "@/data/subjects";
import { questions } from "@/data/questions";

export default function AsignaturasPage() {
  return (
    <div className="space-y-6 animate-rise">
      <div>
        <p className="chip mb-3">Guías de estudio</p>
        <h1 className="display text-4xl">Asignaturas</h1>
        <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
          Accede a temas, peso relativo MIR, recuerdas e intocables por materia —
          el eje del estudio diario de la 1ª y 2ª vuelta.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {subjects.map((s) => {
          const count = questions.filter((q) => q.subjectId === s.id).length;
          return (
            <Link
              key={s.id}
              href={`/campus/asignaturas/${s.slug}`}
              className="panel block p-5 transition hover:-translate-y-1"
            >
              <div className="mb-4 flex items-center justify-between">
                <span
                  className="rounded-full px-3 py-1 text-xs font-bold text-white"
                  style={{ background: s.color }}
                >
                  ~{s.weight}%
                </span>
                <span className="text-xs text-[var(--muted)]">{count} tests</span>
              </div>
              <h2 className="display text-2xl">{s.name}</h2>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">
                {s.topics.join(" · ")}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
