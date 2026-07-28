"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Stats = {
  totals: {
    users: number;
    students: number;
    attempts: number;
    avgPercentile: number;
  };
  byUser: {
    user: { id: string; name: string; email: string };
    attempts: number;
    avgNet: number;
    avgPercentile: number;
    lastAttempt: { label: string; date: string; net: number; percentile: number } | null;
  }[];
  recentAttempts: {
    id: string;
    label: string;
    net: number;
    percentile: number;
    date: string;
    user: { name: string; email: string };
  }[];
};

export default function AdminHomePage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => undefined);
  }, []);

  if (!stats) {
    return <p className="text-[var(--muted)]">Cargando estadísticas…</p>;
  }

  return (
    <div className="space-y-8 animate-rise">
      <div>
        <p className="chip mb-3">Panel administración</p>
        <h1 className="display text-4xl md:text-5xl">PuertoMir Admin</h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          Usuarios, calificaciones y rendimiento competitivo del campus.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Alumnos", String(stats.totals.students)],
          ["Usuarios", String(stats.totals.users)],
          ["Intentos", String(stats.totals.attempts)],
          ["Percentil medio", `P${stats.totals.avgPercentile}`],
        ].map(([k, v]) => (
          <div key={k} className="border-t border-[var(--line)] pt-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
              {k}
            </p>
            <p className="display mt-2 text-3xl text-[var(--signal)]">{v}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/usuarios" className="btn btn-primary">
          Crear / gestionar usuarios
        </Link>
        <Link href="/admin/calificaciones" className="btn btn-secondary">
          Ver calificaciones
        </Link>
      </div>

      <section>
        <h2 className="display text-2xl">Rendimiento por alumno</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
              <tr>
                <th className="py-2">Alumno</th>
                <th>Intentos</th>
                <th>Netos med.</th>
                <th>Percentil med.</th>
                <th>Última sesión</th>
              </tr>
            </thead>
            <tbody>
              {stats.byUser.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-[var(--muted)]">
                    Aún no hay alumnos. Créalos en Usuarios.
                  </td>
                </tr>
              ) : (
                stats.byUser.map((row) => (
                  <tr key={row.user.id} className="border-t border-[var(--line)]">
                    <td className="py-3">
                      <p className="font-semibold">{row.user.name}</p>
                      <p className="text-xs text-[var(--muted)]">{row.user.email}</p>
                    </td>
                    <td>{row.attempts}</td>
                    <td>{row.avgNet}</td>
                    <td>P{row.avgPercentile}</td>
                    <td className="text-[var(--muted)]">
                      {row.lastAttempt
                        ? `${row.lastAttempt.label} · P${row.lastAttempt.percentile}`
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="display text-2xl">Últimas calificaciones</h2>
        <ul className="mt-4 space-y-2">
          {stats.recentAttempts.length === 0 ? (
            <li className="text-[var(--muted)]">Sin intentos registrados todavía.</li>
          ) : (
            stats.recentAttempts.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] py-3 text-sm"
              >
                <div>
                  <p className="font-semibold">{a.user.name}</p>
                  <p className="text-[var(--muted)]">{a.label}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[var(--signal)]">
                    {a.net} netos · P{a.percentile}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {new Date(a.date).toLocaleString("es-ES")}
                  </p>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
