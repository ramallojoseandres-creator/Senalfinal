"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { Question } from "@/data/questions";
import { gradeSession, recordAttempt, type AnswerMap } from "@/lib/exam";

type Props = {
  questions: Question[];
  label: string;
  mode?: "practice" | "exam";
  subjectNames?: Record<string, string>;
};

export function PracticeSession({
  questions,
  label,
  mode = "practice",
  subjectNames = {},
}: Props) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (finished) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [finished]);

  const current = questions[index];
  const result = useMemo(
    () => (finished ? gradeSession(questions, answers) : null),
    [finished, questions, answers],
  );

  function selectChoice(choiceId: string) {
    if (!current || finished) return;
    startTransition(() => {
      setAnswers((prev) => ({ ...prev, [current.id]: choiceId }));
      if (mode === "practice") setRevealed(true);
    });
  }

  function next() {
    setRevealed(false);
    if (index >= questions.length - 1) {
      recordAttempt(questions, answers, label);
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
  }

  function prev() {
    setRevealed(false);
    setIndex((i) => Math.max(0, i - 1));
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  if (!current && !finished) {
    return (
      <div className="panel p-8">
        <p>No hay preguntas para esta sesión.</p>
      </div>
    );
  }

  if (finished && result) {
    return (
      <div className="mx-auto max-w-3xl animate-rise">
        <div className="panel p-8">
          <p className="chip mb-4">Sesión terminada</p>
          <h1 className="display mb-2 text-4xl">Resultado · {label}</h1>
          <p className="mb-8 text-[var(--ink-soft)]">
            Tiempo {mm}:{ss} · puntuación tipo MIR (+3 / −1 / 0)
          </p>
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              ["Netos", String(result.net)],
              ["Aciertos", String(result.correct)],
              ["Fallos", String(result.wrong)],
              ["Blancos", String(result.blank)],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-[rgba(11,95,99,0.08)] p-4">
                <p className="text-xs uppercase tracking-wide text-[var(--muted)]">{k}</p>
                <p className="display text-3xl">{v}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <div className="progress-bar h-3">
              <span style={{ width: `${result.score}%` }} />
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Rendimiento relativo: {result.score}%
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {questions.map((q, i) => {
            const ans = answers[q.id];
            const ok = ans === q.correctId;
            return (
              <article key={q.id} className="panel p-5">
                <p className="mb-2 text-xs font-semibold text-[var(--muted)]">
                  Pregunta {i + 1} · {subjectNames[q.subjectId] ?? q.subjectId}
                  {ans ? (ok ? " · Acertada" : " · Fallada") : " · En blanco"}
                </p>
                <p className="mb-3 font-semibold">{q.stem}</p>
                <p className="text-sm text-[var(--ink-soft)]">{q.explanation}</p>
                {q.pearl ? (
                  <p className="mt-3 rounded-xl bg-[var(--accent-soft)] px-3 py-2 text-sm">
                    <strong>Perla:</strong> {q.pearl}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    );
  }

  const selected = answers[current.id] ?? null;
  const showFeedback = mode === "practice" && revealed && selected;

  return (
    <div className="mx-auto max-w-3xl animate-rise">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
            {label}
          </p>
          <p className="font-semibold">
            Pregunta {index + 1} / {questions.length}
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="chip">{mm}:{ss}</span>
          <span className="chip !bg-[var(--accent-soft)] !text-[var(--accent)]">
            {subjectNames[current.subjectId] ?? current.subjectId}
          </span>
        </div>
      </div>

      <div className="progress-bar mb-5">
        <span style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>

      <div className="panel p-6 md:p-8">
        <p className="mb-2 text-xs font-semibold text-[var(--muted)]">
          {current.topic}
          {current.year ? ` · MIR ${current.year}` : ""} · dificultad{" "}
          {"●".repeat(current.difficulty)}
          {"○".repeat(3 - current.difficulty)}
        </p>
        <h2 className="mb-6 text-xl font-bold leading-snug md:text-2xl">
          {current.stem}
        </h2>

        <div className="space-y-3">
          {current.choices.map((choice) => {
            let cls = "choice";
            if (selected === choice.id) cls += " selected";
            if (showFeedback) {
              if (choice.id === current.correctId) cls += " correct";
              else if (selected === choice.id) cls += " wrong";
            }
            return (
              <button
                key={choice.id}
                type="button"
                className={cls}
                onClick={() => selectChoice(choice.id)}
              >
                <span className="mr-2 font-bold uppercase text-[var(--brand)]">
                  {choice.id}.
                </span>
                {choice.text}
              </button>
            );
          })}
        </div>

        {showFeedback ? (
          <div className="mt-6 rounded-2xl bg-[rgba(11,95,99,0.08)] p-4 animate-fade">
            <p className="font-semibold">Comentario</p>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">
              {current.explanation}
            </p>
            {current.pearl ? (
              <p className="mt-3 text-sm">
                <strong>Perla:</strong> {current.pearl}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap justify-between gap-3">
          <button type="button" className="btn btn-secondary" onClick={prev} disabled={index === 0}>
            Anterior
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={next}
            disabled={mode === "practice" && !selected}
          >
            {index >= questions.length - 1 ? "Terminar" : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
}
