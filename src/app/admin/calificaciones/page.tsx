"use client";

import { useEffect, useMemo, useState } from "react";

type Row = {
  user: { id: string; name: string; email: string };
  attempts: number;
  avgNet: number;
  avgPercentile: number;
  recent: {
    id: string;
    label: string;
    date: string;
    net: number;
    percentile: number;
    correct: number;
    wrong: number;
    blank: number;
    score: number;
    questionCount: number;
  }[];
};

export default function AdminGradesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => setRows(d.byUser ?? []))
      .catch(() => undefined);
  }, []);

  const visible = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.user.name.toLowerCase().includes(q) ||
        r.user.email.toLowerCase().includes(q),
    );
  }, [rows, filter]);

  return (
    <div className="space-y-8 animate-rise">
      <div>
        <h1 className="display text-4xl">Calificaciones</h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          Netos, percentil y detalle de cada evaluación por alumno.
        </p>
      </div>

      <input
        className="w-full max-w-md rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3"
        placeholder="Filtrar por nombre o email…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <div className="space-y-8">
        {visible.length === 0 ? (
          <p className="text-[var(--muted)]">No hay alumnos o no coinciden con el filtro.</p>
        ) : (
          visible.map((row) => (
            <section key={row.user.id} className="border-t border-[var(--line)] pt-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="display text-2xl">{row.user.name}</h2>
                  <p className="text-sm text-[var(--muted)]">{row.user.email}</p>
                </div>
                <p className="text-sm">
                  {row.attempts} intentos · netos med. {row.avgNet} · P{row.avgPercentile}
                </p>
              </div>
              {row.recent.length === 0 ? (
                <p className="mt-3 text-sm text-[var(--muted)]">Sin evaluaciones aún.</p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {row.recent.map((a) => (
                    <li
                      key={a.id}
                      className="grid gap-2 border-b border-[var(--line)] py-3 text-sm md:grid-cols-[1.4fr_1fr_auto]"
                    >
                      <div>
                        <p className="font-semibold">{a.label}</p>
                        <p className="text-xs text-[var(--muted)]">
                          {new Date(a.date).toLocaleString("es-ES")} · {a.questionCount} preguntas
                        </p>
                      </div>
                      <div className="text-[var(--muted)]">
                        {a.correct} aciertos · {a.wrong} fallos · {a.blank} blancos · score {a.score}%
                      </div>
                      <div className="font-bold text-[var(--signal)]">
                        {a.net} netos · P{a.percentile}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))
        )}
      </div>
    </div>
  );
}
