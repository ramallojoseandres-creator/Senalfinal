"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { simulacros } from "@/data/simulacros";
import { subjects } from "@/data/subjects";
import { buildExam } from "@/lib/exam";
import { PracticeSession } from "@/components/PracticeSession";

export default function SimulacroDetailPage() {
  const params = useParams<{ id: string }>();
  const sim = simulacros.find((s) => s.id === params.id);

  const subjectNames = useMemo(
    () => Object.fromEntries(subjects.map((s) => [s.id, s.name])),
    [],
  );

  const exam = useMemo(
    () =>
      buildExam({
        count: Math.min(20, 40),
        mode: "simulacro",
      }),
    [],
  );

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

  return (
    <div>
      <div className="mb-6">
        <Link href="/campus/simulacros" className="text-sm font-semibold text-[var(--brand)]">
          ← Simulacros
        </Link>
        <h1 className="display mt-2 text-3xl">{sim.title}</h1>
        <p className="text-sm text-[var(--ink-soft)]">
          Demo reducida ({exam.length} preguntas) con scoring MIR. En producción:
          210 ítems y plantilla completa.
        </p>
      </div>
      <PracticeSession
        questions={exam}
        label={sim.title}
        mode="exam"
        subjectNames={subjectNames}
      />
    </div>
  );
}
