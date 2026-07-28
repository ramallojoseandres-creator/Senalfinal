"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFocusMode } from "@/components/FocusMode";

const links = [
  { href: "/campus", label: "Hoy dictado", icon: "◈" },
  { href: "/campus/calendario", label: "Calendario", icon: "▦" },
  { href: "/campus/simulacros", label: "Simulacros", icon: "◎" },
  { href: "/campus/generador", label: "Test a la carta", icon: "⎇" },
  { href: "/campus/oficiales", label: "Oficiales MIR", icon: "§" },
  { href: "/campus/desgloses", label: "Desgloses", icon: "≡" },
  { href: "/campus/asignaturas", label: "Guías", icon: "▣" },
  { href: "/campus/estadisticas", label: "Percentiles", icon: "◔" },
];

export function CampusShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { focus } = useFocusMode();

  if (focus) {
    return <div className="min-h-screen arena">{children}</div>;
  }

  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-[var(--line)] bg-[rgba(255,255,255,0.55)] backdrop-blur md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-5 py-5 md:block">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--brand)] text-sm font-bold text-white">
              S
            </span>
            <div>
              <p className="display text-lg leading-none">Señal MIR</p>
              <p className="text-[11px] text-[var(--muted)]">Campus alumno</p>
            </div>
          </Link>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:block md:space-y-1 md:overflow-visible md:px-3 md:pb-0">
          {links.map((link) => {
            const active =
              link.href === "/campus"
                ? pathname === "/campus"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link whitespace-nowrap ${active ? "active" : ""}`}
              >
                <span className="opacity-70">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto hidden p-4 md:block">
          <div className="panel p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Vuelta activa
            </p>
            <p className="display mt-1 text-xl">2ª Vuelta</p>
            <div className="progress-bar mt-3">
              <span style={{ width: "62%" }} />
            </div>
            <p className="mt-2 text-xs text-[var(--muted)]">62% completada</p>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="flex items-center justify-between gap-4 border-b border-[var(--line)] px-5 py-4 md:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Método por vueltas · netos + percentil
            </p>
            <p className="font-semibold text-[var(--ink-soft)]">
              No eliges qué estudiar: el plan diario te lo dicta
            </p>
          </div>
          <Link href="/campus/generador" className="btn btn-primary !py-2.5 !px-4 text-sm">
            Test a la carta
          </Link>
        </header>
        <main className="px-5 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
