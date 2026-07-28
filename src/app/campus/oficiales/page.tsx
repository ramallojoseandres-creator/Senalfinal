"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { officialBanks } from "@/data/oficiales";
import { PracticeSession } from "@/components/PracticeSession";
import type { Question } from "@/data/questions";

export default function OficialesPage() {
  const [year, setYear] = useState(2025);
  const [started, setStarted] = useState(false);
  const [limit, setLimit] = useState(20);

  const bank = useMemo(
    () => officialBanks.find((b) => b.questions.some((q) => q.year === year)),
    [year],
  );

  const pool = useMemo(() => {
    if (!bank) return [] as Question[];
    return bank.questions.filter((q) => q.correctId && !q.annulled);
  }, [bank]);

  const session = useMemo(() => pool.slice(0, limit), [pool, limit]);

  if (started && session.length) {
    return (
      <div>
        <button
          type="button"
          className="btn btn-secondary mb-4 !py-2 !px-3 text-sm"
          onClick={() => setStarted(false)}
        >
          ← Volver a oficiales
        </button>
        <PracticeSession
          questions={session}
          label={`Oficial MIR ${year}`}
          mode="exam"
          subjectNames={{ oficial: "Oficial MIR" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-rise">
      <div>
        <p className="chip mb-3">Cuadernillos oficiales</p>
        <h1 className="display text-4xl">Exámenes MIR oficiales</h1>
        <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
          Preguntas parseadas desde los PDF oficiales compilados en{" "}
          <a
            href="https://mirial.es/examen-mir/24-examen-mir/174-descarga-todos-los-examen-mir-en-pdf"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[var(--brand)] underline"
          >
            Mirial
          </a>
          . Corrección con plantilla definitiva del Ministerio cuando está
          disponible.
        </p>
      </div>

      <div className="grid gap-4">
        {officialBanks.map((b) => {
          const y = b.questions[0]?.year ?? 0;
          const active = y === year;
          return (
            <article
              key={b.meta.label}
              className={`panel p-6 ${active ? "ring-2 ring-[var(--brand)]" : ""}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="display text-2xl">{b.meta.label}</h2>
                  <p className="mt-1 text-sm text-[var(--ink-soft)]">
                    {b.meta.parsed} preguntas parseadas · {b.meta.gradable}{" "}
                    corregibles
                    {b.meta.annulled?.length
                      ? ` · ${b.meta.annulled.length} anuladas`
                      : ""}
                  </p>
                  {b.meta.note ? (
                    <p className="mt-2 text-xs text-[var(--muted)]">{b.meta.note}</p>
                  ) : null}
                  {b.meta.missingNumbers?.length ? (
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      No parseadas aún: {b.meta.missingNumbers.join(", ")} (suele
                      deberse a formato multi-columna o imágenes).
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={b.meta.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary !py-2 !px-3 text-sm"
                  >
                    PDF oficial
                  </a>
                  <button
                    type="button"
                    className="btn btn-primary !py-2 !px-3 text-sm"
                    disabled={b.meta.gradable === 0}
                    onClick={() => {
                      setYear(y);
                      setStarted(false);
                    }}
                  >
                    Seleccionar
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {bank && bank.meta.gradable > 0 ? (
        <section className="panel p-6">
          <h2 className="display mb-3 text-2xl">Practicar {bank.meta.label}</h2>
          <label className="mb-4 block text-sm font-bold">
            Nº de preguntas: {limit}
            <input
              type="range"
              min={5}
              max={Math.min(100, pool.length)}
              value={Math.min(limit, pool.length)}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="mt-2 block w-full"
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="btn btn-accent"
              onClick={() => setStarted(true)}
            >
              Empezar bloque oficial ({Math.min(limit, pool.length)})
            </button>
            <Link href="/campus/generador" className="btn btn-secondary">
              Usar en generador
            </Link>
          </div>
        </section>
      ) : (
        <section className="panel p-6">
          <p className="text-[var(--ink-soft)]">
            Este cuadernillo está importado, pero aún falta vincular la plantilla
            oficial para corrección automática. Mientras tanto puedes abrir el PDF.
          </p>
        </section>
      )}
    </div>
  );
}
