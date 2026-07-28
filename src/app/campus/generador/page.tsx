"use client";

import { useMemo, useState, useTransition } from "react";
import { subjects } from "@/data/subjects";
import { buildExam } from "@/lib/exam";
import { PracticeSession } from "@/components/PracticeSession";

export default function GeneradorPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState<0 | 1 | 2 | 3>(0);
  const [officialOnly, setOfficialOnly] = useState(false);
  const [mode, setMode] = useState<"practice" | "exam">("practice");
  const [started, setStarted] = useState(false);
  const [seed, setSeed] = useState(0);
  const [pending, startTransition] = useTransition();

  const subjectNames = useMemo(
    () => Object.fromEntries(subjects.map((s) => [s.id, s.name])),
    [],
  );

  const exam = useMemo(
    () =>
      buildExam({
        subjectIds: selected.length ? selected : undefined,
        count,
        difficulty: difficulty || undefined,
        officialOnly,
        mode,
      }),
    // seed forces reshuffle
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selected, count, difficulty, officialOnly, mode, seed],
  );

  function toggleSubject(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
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
          ← Volver al generador
        </button>
        <PracticeSession
          questions={exam}
          label="Generador de exámenes"
          mode={mode}
          subjectNames={subjectNames}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-rise">
      <div>
        <p className="chip mb-3">Herramienta clásica CTO</p>
        <h1 className="display text-4xl">Generador de exámenes</h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          Personaliza por asignatura, dificultad y modo. Ideal para la evaluación
          diaria (50+50) o bloques de refuerzo.
        </p>
      </div>

      <section className="panel p-6">
        <h2 className="mb-4 font-bold">Asignaturas</h2>
        <div className="flex flex-wrap gap-2">
          {subjects.map((s) => {
            const on = selected.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleSubject(s.id)}
                className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                  on
                    ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-deep)]"
                    : "border-[var(--line)] bg-white/40 text-[var(--ink-soft)]"
                }`}
              >
                {s.short}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-[var(--muted)]">
          Sin selección = banco completo ({exam.length ? "pool disponible" : "—"})
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <label className="panel block p-5">
          <span className="mb-2 block text-sm font-bold">Nº de preguntas</span>
          <input
            type="range"
            min={5}
            max={40}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full"
          />
          <span className="mt-2 inline-block text-2xl font-bold">{count}</span>
        </label>

        <label className="panel block p-5">
          <span className="mb-2 block text-sm font-bold">Dificultad</span>
          <select
            className="w-full rounded-xl border border-[var(--line)] bg-white/70 px-3 py-2"
            value={difficulty}
            onChange={(e) => setDifficulty(Number(e.target.value) as 0 | 1 | 2 | 3)}
          >
            <option value={0}>Todas</option>
            <option value={1}>Básica</option>
            <option value={2}>Media</option>
            <option value={3}>Alta</option>
          </select>
        </label>

        <label className="panel block p-5">
          <span className="mb-2 block text-sm font-bold">Modo</span>
          <select
            className="w-full rounded-xl border border-[var(--line)] bg-white/70 px-3 py-2"
            value={mode}
            onChange={(e) => setMode(e.target.value as "practice" | "exam")}
          >
            <option value="practice">Práctica (feedback inmediato)</option>
            <option value="exam">Examen (corrección al final)</option>
          </select>
        </label>
      </section>

      <label className="panel flex items-center gap-3 p-5">
        <input
          type="checkbox"
          checked={officialOnly}
          onChange={(e) => setOfficialOnly(e.target.checked)}
        />
        <span>
          <strong>Solo estilo desglose / convocatoria</strong>
          <span className="block text-sm text-[var(--muted)]">
            Preguntas con año MIR asociado
          </span>
        </span>
      </label>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="btn btn-primary"
          disabled={pending || exam.length === 0}
          onClick={() =>
            startTransition(() => {
              setSeed((s) => s + 1);
              setStarted(true);
            })
          }
        >
          Generar y empezar ({exam.length})
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setSelected([]);
            setCount(10);
            setDifficulty(0);
            setOfficialOnly(false);
            setMode("practice");
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
