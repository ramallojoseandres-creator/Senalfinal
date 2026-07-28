"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getSubject } from "@/data/subjects";
import { questions } from "@/data/questions";
import { PracticeSession } from "@/components/PracticeSession";

export default function AsignaturaDetailPage() {
  const params = useParams<{ slug: string }>();
  const subject = getSubject(params.slug);
  const [started, setStarted] = useState(false);

  const pool = useMemo(
    () => questions.filter((q) => q.subjectId === subject?.id),
    [subject?.id],
  );

  if (!subject) {
    return (
      <div className="panel p-8">
        <p>Asignatura no encontrada.</p>
        <Link href="/campus/asignaturas" className="btn btn-secondary mt-4">
          Volver
        </Link>
      </div>
    );
  }

  if (started) {
    return (
      <div>
        <button
          type="button"
          className="btn btn-secondary mb-4 !py-2 !px-3 text-sm"
          onClick={() => setStarted(false)}
        >
          ← Volver a {subject.name}
        </button>
        <PracticeSession
          questions={pool}
          label={`Guía · ${subject.name}`}
          mode="practice"
          subjectNames={{ [subject.id]: subject.name }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-rise">
      <div>
        <Link href="/campus/asignaturas" className="text-sm font-semibold text-[var(--brand)]">
          ← Asignaturas
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="display text-4xl">{subject.name}</h1>
          <span
            className="rounded-full px-3 py-1 text-xs font-bold text-white"
            style={{ background: subject.color }}
          >
            Peso ~{subject.weight}%
          </span>
        </div>
        <p className="mt-2 text-[var(--ink-soft)]">
          Guía de estudio / Recuerdas con temas nucleares e intocables.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="panel p-6">
          <h2 className="display mb-4 text-2xl">Temas de la guía</h2>
          <ol className="space-y-3">
            {subject.topics.map((topic, i) => (
              <li
                key={topic}
                className="flex items-start gap-3 rounded-2xl border border-[var(--line)] bg-white/40 px-4 py-3"
              >
                <span className="font-bold text-[var(--brand)]">0{i + 1}</span>
                <div>
                  <p className="font-semibold">{topic}</p>
                  <p className="text-xs text-[var(--muted)]">
                    Recuerda + perlas + 10 intocables sugeridos
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </article>

        <article className="panel p-6">
          <h2 className="display mb-4 text-2xl">Evaluación del bloque</h2>
          <p className="mb-4 text-sm text-[var(--ink-soft)]">
            {pool.length} preguntas demo disponibles. En campus completo: 50 del
            día + 50 aleatorias.
          </p>
          <ul className="mb-6 space-y-2 text-sm">
            <li>• Lectura de guía / subrayado activo</li>
            <li>• Test inmediato con vídeo-comentario</li>
            <li>• Marcado de fallos para 2ª vuelta</li>
          </ul>
          <button
            type="button"
            className="btn btn-primary w-full"
            onClick={() => setStarted(true)}
            disabled={pool.length === 0}
          >
            Practicar {subject.short}
          </button>
        </article>
      </section>
    </div>
  );
}
