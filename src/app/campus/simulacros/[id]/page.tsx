"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { simulacros } from "@/data/simulacros";
import { subjects } from "@/data/subjects";
import { buildExam } from "@/lib/exam";
import { getGradableOfficialQuestions } from "@/data/oficiales";
import { PracticeSession } from "@/components/PracticeSession";
import { mirExamSpec } from "@/data/cto-method";
import type { Question } from "@/data/questions";
import { questions as demoBank } from "@/data/questions";

export default function SimulacroDetailPage() {
  const params = useParams<{ id: string }>();
  const sim = simulacros.find((s) => s.id === params.id);
  const [started, setStarted] = useState(false);

  const subjectNames = useMemo(
    () => ({
      ...Object.fromEntries(subjects.map((s) => [s.id, s.name])),
      oficial: "Oficial MIR",
    }),
    [],
  );

  const exam = useMemo(() => {
    if (!sim) return [] as Question[];

    if (sim.id === "sim-oficial-2025") {
      return getGradableOfficialQuestions(2025).slice(0, 210);
    }
    if (sim.id === "sim-oficial-2024") {
      return getGradableOfficialQuestions(2024).slice(0, 210);
    }
    if (sim.id === "sim-mixto-150") {
      return buildExam({ count: 150, mode: "simulacro" });
    }

    const official = getGradableOfficialQuestions();
    const demo = buildExam({
      count: 120,
      mode: "simulacro",
      officialOnly: false,
    });
    const merged: Question[] = [];
    const seen = new Set<string>();
    for (const q of [...official, ...demo, ...demoBank]) {
      if (seen.has(q.id) || !q.correctId) continue;
      seen.add(q.id);
      merged.push(q);
      if (merged.length >= Math.min(sim.questionCount, 180)) break;
    }
    return merged.map((q, i) =>
      i >= merged.length - 5 ? { ...q, topic: `${q.topic} · RESERVA` } : q,
    );
  }, [sim]);

  if (!sim) {
    return (
      <div className="panel p-8">
        <p>Simulacro no encontrado.</p>
        <Link href="/campus/simulacros" className="btn btn-secondary mt-4">
          Volver
        </Link>
      </div>
    );
  }

  if (sim.status === "upcoming") {
    return (
      <div className="panel mx-auto max-w-xl p-8 text-center">
        <p className="chip mx-auto mb-4">Aún no disponible</p>
        <h1 className="display text-3xl">{sim.title}</h1>
        <p className="mt-3 text-[var(--ink-soft)]">{sim.description}</p>
        <Link href="/campus/simulacros" className="btn btn-secondary mt-6">
          Volver a simulacros
        </Link>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 animate-rise">
        <Link href="/campus/simulacros" className="text-sm font-semibold text-[var(--brand)]">
          ← Simulacros
        </Link>
        <div className="panel p-8">
          <p className="chip mb-3">{sim.cadence} · {sim.vuelta}</p>
          <h1 className="display text-4xl">{sim.title}</h1>
          <p className="mt-3 text-[var(--ink-soft)]">{sim.description}</p>

          <ul className="mt-6 space-y-2 text-sm">
            <li>· Preguntas en este intento: {exam.length}</li>
            <li>
              · Formato scoring MIR: +{mirExamSpec.scoring.correct} /{" "}
              {mirExamSpec.scoring.wrong} / {mirExamSpec.scoring.blank}
            </li>
            <li>· Temporizador proporcional al tamaño del bloque</li>
            <li>· Resultado con netos, percentil e informe por asignatura</li>
            <li>· Si inicias sesión, la nota queda en tu expediente (visible para admin)</li>
          </ul>

          <button
            type="button"
            className="btn btn-accent mt-6 w-full sweep-shine"
            onClick={() => setStarted(true)}
            disabled={exam.length === 0}
          >
            Entrar al arena de examen
          </button>
        </div>
      </div>
    );
  }

  const durationSec = Math.round(
    (exam.length / mirExamSpec.totalQuestions) * mirExamSpec.durationMin * 60,
  );

  return (
    <div>
      <PracticeSession
        questions={exam}
        label={sim.title}
        mode="simulacro"
        competitive
        durationSec={Math.max(durationSec, 15 * 60)}
        subjectNames={subjectNames}
      />
    </div>
  );
}
