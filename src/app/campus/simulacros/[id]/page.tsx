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
    const official = getGradableOfficialQuestions(2025);
    const demo = buildExam({
      count: 80,
      mode: "simulacro",
      officialOnly: false,
    });
    // Prefer official bank; fill with demo to approach MIR length in demo mode
    const merged: Question[] = [];
    const seen = new Set<string>();
    for (const q of [...official, ...demo]) {
      if (seen.has(q.id) || !q.correctId) continue;
      seen.add(q.id);
      merged.push(q);
      if (merged.length >= 60) break; // demo length (full 210 when bank grows)
    }
    // Mark last 5 as "reserva" in topic label for pedagogy
    return merged.map((q, i) =>
      i >= merged.length - 5
        ? { ...q, topic: `${q.topic} · RESERVA` }
        : q,
    );
  }, []);

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
            <li>
              · Formato objetivo MIR: {mirExamSpec.scoredQuestions} +{" "}
              {mirExamSpec.reserveQuestions} reserva
            </li>
            <li>· Duración: {mirExamSpec.durationMin} minutos improrrogables</li>
            <li>· 4 opciones · solo 1 correcta · blancos no penalizan</li>
            <li>· Penalización: 3 fallos anulan 1 acierto (+3 / −1 / 0)</li>
            <li>· Tras entregar: netos, percentil de cohorte e informe por asignatura</li>
          </ul>

          <p className="mt-4 rounded-xl bg-[rgba(196,92,38,0.1)] px-4 py-3 text-sm">
            Demo técnica: este intento usa {exam.length} preguntas del banco
            (oficiales + demo) con temporizador proporcional. En producción serían
            exactamente 210.
          </p>

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

  // Proportional timer: full MIR 270 min for 210 Q → scale for demo length
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
        durationSec={Math.max(durationSec, 20 * 60)}
        subjectNames={subjectNames}
      />
    </div>
  );
}
