"use client";

import { useEffect, useMemo, useState, useTransition, useRef } from "react";
import type { Question } from "@/data/questions";
import { gradeSession, recordAttempt, type AnswerMap } from "@/lib/exam";
import {
  buildCompetitiveReport,
  recordCompetitiveAttempt,
  type CompetitiveReport,
} from "@/lib/metrics";
import { mirExamSpec } from "@/data/cto-method";
import { ResultsReveal } from "@/components/ResultsReveal";
import { useFocusMode } from "@/components/FocusMode";

type Props = {
  questions: Question[];
  label: string;
  mode?: "practice" | "exam" | "simulacro";
  subjectNames?: Record<string, string>;
  durationSec?: number;
  competitive?: boolean;
};

export function PracticeSession({
  questions,
  label,
  mode = "practice",
  subjectNames = {},
  durationSec,
  competitive = false,
}: Props) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState(durationSec ?? 0);
  const [report, setReport] = useState<CompetitiveReport | null>(null);
  const [, startTransition] = useTransition();
  const answersRef = useRef(answers);
  const finishedRef = useRef(false);
  const { setFocus } = useFocusMode();
  const isArena = mode === "simulacro" || mode === "exam";

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    if (!isArena) return;
    setFocus(true);
    return () => setFocus(false);
  }, [isArena, setFocus]);

  function doFinish(finalAnswers: AnswerMap) {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setFinished(true);
    recordAttempt(questions, finalAnswers, label);
    if (competitive || mode === "simulacro") {
      setReport(recordCompetitiveAttempt(questions, finalAnswers, label));
    } else if (mode === "exam") {
      setReport(buildCompetitiveReport(questions, finalAnswers));
    }
  }

  useEffect(() => {
    if (finished) return;
    const id = window.setInterval(() => {
      setSeconds((s) => s + 1);
      if (durationSec != null) {
        setRemaining((r) => Math.max(0, r - 1));
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [finished, durationSec]);

  useEffect(() => {
    if (durationSec != null && remaining === 0 && seconds > 0 && !finished) {
      doFinish(answersRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, finished, durationSec, seconds]);

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

  function clearAnswer() {
    if (!current || finished) return;
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[current.id];
      return next;
    });
    setRevealed(false);
  }

  function next() {
    setRevealed(false);
    if (index >= questions.length - 1) {
      doFinish(answers);
      return;
    }
    setIndex((i) => i + 1);
  }

  function prev() {
    setRevealed(false);
    setIndex((i) => Math.max(0, i - 1));
  }

  function resetSession() {
    finishedRef.current = false;
    setFinished(false);
    setReviewing(false);
    setReport(null);
    setAnswers({});
    setIndex(0);
    setRevealed(false);
    setSeconds(0);
    setRemaining(durationSec ?? 0);
  }

  function formatTime(total: number) {
    const h = String(Math.floor(total / 3600)).padStart(2, "0");
    const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
    const s = String(total % 60).padStart(2, "0");
    return durationSec != null && durationSec >= 3600
      ? `${h}:${m}:${s}`
      : `${m}:${s}`;
  }

  const answeredCount = Object.values(answers).filter(Boolean).length;
  const wrapClass = isArena ? "px-4 py-6 md:px-8 md:py-8" : "mx-auto max-w-3xl animate-rise";

  if (!current && !finished) {
    return (
      <div className={wrapClass}>
        <div className="panel p-8">
          <p>No hay preguntas para esta sesión.</p>
        </div>
      </div>
    );
  }

  if (finished && result) {
    const competitiveView = report ?? buildCompetitiveReport(questions, answers);

    if (!reviewing) {
      return (
        <div className={isArena ? "" : "mx-auto max-w-4xl"}>
          <ResultsReveal
            report={competitiveView}
            label={label}
            seconds={seconds}
            questionCount={questions.length}
            onReview={() => setReviewing(true)}
            onAgain={resetSession}
            onExitHref="/campus"
          />
        </div>
      );
    }

    return (
      <div className={`${isArena ? "px-4 py-8 md:px-8" : ""} mx-auto max-w-4xl animate-rise space-y-6`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="chip mb-2">Revisión</p>
            <h1 className="display text-3xl">{label}</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Tiempo {formatTime(seconds)} · scoring MIR (+
              {mirExamSpec.scoring.correct} / {mirExamSpec.scoring.wrong} /{" "}
              {mirExamSpec.scoring.blank})
            </p>
          </div>
          <button type="button" className="btn btn-secondary" onClick={() => setReviewing(false)}>
            Volver al resultado
          </button>
        </div>

        <div className="panel p-6">
          <h2 className="display mb-4 text-2xl">Informe por asignatura</h2>
          <div className="space-y-3">
            {competitiveView.bySubject.map((s) => (
              <div key={s.subjectId}>
                <div className="mb-1 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="font-semibold">
                    {s.name}{" "}
                    <span className="text-[var(--muted)]">
                      ·{" "}
                      {s.verdict === "fuerte"
                        ? "fuerte"
                        : s.verdict === "debil"
                          ? "débil"
                          : "medio"}
                    </span>
                  </span>
                  <span className="text-[var(--muted)]">
                    p{s.percentile} · netos {s.nets} · {s.accuracy}% acierto
                  </span>
                </div>
                <div className="progress-bar">
                  <span style={{ width: `${s.percentile}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
          {competitiveView.weak.length ? (
            <p className="mt-4 text-sm text-[var(--ink-soft)]">
              Prioriza mañana:{" "}
              <strong>{competitiveView.weak.map((w) => w.name).join(", ")}</strong>
            </p>
          ) : null}
        </div>

        <div className="space-y-4">
          {questions.map((q, i) => {
            const ans = answers[q.id];
            const ok = Boolean(q.correctId && ans === q.correctId);
            return (
              <article key={q.id} className="panel p-5">
                <p className="mb-2 text-xs font-semibold text-[var(--muted)]">
                  Pregunta {i + 1}
                  {q.officialNumber ? ` · oficial #${q.officialNumber}` : ""} ·{" "}
                  {subjectNames[q.subjectId] ?? q.subjectId}
                  {!q.correctId
                    ? " · sin plantilla"
                    : ans
                      ? ok
                        ? " · Acertada"
                        : " · Fallada"
                      : " · En blanco"}
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
  const clock = durationSec != null ? remaining : seconds;
  const urgent = durationSec != null && remaining < 600;

  return (
    <div className={wrapClass}>
      <div className={isArena ? "mx-auto max-w-3xl" : ""}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
              {label}
            </p>
            <p className="font-semibold">
              Pregunta {index + 1} / {questions.length}
              {mode === "simulacro" ? ` · contestadas ${answeredCount}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span
              className={`chip ${urgent ? "!bg-[rgba(180,35,24,0.18)] !text-[#ffb4ae]" : ""}`}
            >
              {formatTime(clock)}
            </span>
            <span className="chip">
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
            {current.year ? ` · MIR ${current.year}` : ""}
            {current.officialNumber ? ` · #${current.officialNumber}` : ""} ·
            dificultad {"●".repeat(current.difficulty)}
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
                  <span className="mr-2 font-bold uppercase text-[var(--signal)]">
                    {choice.id}.
                  </span>
                  {choice.text}
                </button>
              );
            })}
          </div>

          {mode !== "practice" ? (
            <button
              type="button"
              className="mt-3 text-sm font-semibold text-[var(--muted)]"
              onClick={clearAnswer}
            >
              Dejar en blanco
            </button>
          ) : null}

          {showFeedback ? (
            <div className="mt-6 rounded-2xl bg-[rgba(10,107,114,0.1)] p-4 animate-fade">
              <p className="font-semibold">Comentario</p>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">{current.explanation}</p>
              {current.pearl ? (
                <p className="mt-3 text-sm">
                  <strong>Perla:</strong> {current.pearl}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap justify-between gap-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={prev}
              disabled={index === 0}
            >
              Anterior
            </button>
            <div className="flex gap-2">
              {mode === "simulacro" || mode === "exam" ? (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => doFinish(answers)}
                >
                  Entregar
                </button>
              ) : null}
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

        {mode === "simulacro" ? (
          <div className="mt-4 flex flex-wrap gap-1">
            {questions.map((q, i) => {
              const state = answers[q.id] ? "answered" : "blank";
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    setIndex(i);
                    setRevealed(false);
                  }}
                  className={`h-7 w-7 rounded text-[10px] font-bold ${
                    i === index
                      ? "bg-[var(--signal)] text-white"
                      : state === "answered"
                        ? "bg-[var(--brand-soft)] text-[var(--brand-deep)]"
                        : "bg-white/20 text-[var(--muted)]"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
