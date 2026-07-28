"use client";

import { useMemo, useState } from "react";
import { questions } from "@/data/questions";
import { subjects } from "@/data/subjects";
import { PracticeSession } from "@/components/PracticeSession";

export default function DesglosesPage() {
  const [subjectId, setSubjectId] = useState<string>("all");
  const [year, setYear] = useState<string>("all");
  const [started, setStarted] = useState(false);

  const years = useMemo(
    () =>
      Array.from(
        new Set(questions.filter((q) => q.year).map((q) => q.year as number)),
      ).sort((a, b) => b - a),
    [],
  );

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (!q.year) return false;
      if (subjectId !== "all" && q.subjectId !== subjectId) return false;
      if (year !== "all" && q.year !== Number(year)) return false;
      return true;
    });
  }, [subjectId, year]);

  const subjectNames = useMemo(
    () => Object.fromEntries(subjects.map((s) => [s.id, s.name])),
    [],
  );

  if (started) {
    return (
      <div>
        <button
          type="button"
          className="btn btn-secondary mb-4 !py-2 !px-3 text-sm"
          onClick={() => setStarted(false)}
        >
          ← Volver a desgloses
        </button>
        <PracticeSession
          questions={filtered}
          label="Desgloses comentados"
          mode="practice"
          subjectNames={subjectNames}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-rise">
      <div>
        <p className="chip mb-3">Oficiales por convocatoria</p>
        <h1 className="display text-4xl">Desgloses</h1>
        <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
          Preguntas de convocatorias agrupadas por asignatura, tema y año — con
          comentario tipo vídeo-profesor.
        </p>
      </div>

      <div className="panel grid gap-4 p-5 md:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-bold">Asignatura</span>
          <select
            className="w-full rounded-xl border border-[var(--line)] bg-white/70 px-3 py-2"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            <option value="all">Todas</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-2 block text-sm font-bold">Convocatoria</span>
          <select
            className="w-full rounded-xl border border-[var(--line)] bg-white/70 px-3 py-2"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="all">Todas</option>
            {years.map((y) => (
              <option key={y} value={y}>
                MIR {y}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[var(--muted)]">
          {filtered.length} preguntas en el filtro actual
        </p>
        <button
          type="button"
          className="btn btn-primary"
          disabled={filtered.length === 0}
          onClick={() => setStarted(true)}
        >
          Estudiar desglose
        </button>
      </div>

      <div className="space-y-3">
        {filtered.map((q) => (
          <article key={q.id} className="panel p-5">
            <p className="mb-2 text-xs font-semibold text-[var(--muted)]">
              MIR {q.year} · {subjectNames[q.subjectId]} · {q.topic}
            </p>
            <p className="font-semibold">{q.stem}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
