"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

type User = { id: string; name: string; email: string; role: string };

export function CampusShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { focus } = useFocusMode();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setUser(d?.user ?? null))
      .catch(() => setUser(null));
  }, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
    router.refresh();
  }

  if (focus) {
    return <div className="min-h-screen arena">{children}</div>;
  }

  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-[var(--line)] bg-[rgba(255,255,255,0.55)] backdrop-blur md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-5 py-5 md:block">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--brand)] text-sm font-bold text-white">
              P
            </span>
            <div>
              <p className="display text-lg leading-none">PuertoMir</p>
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
          {user?.role === "admin" ? (
            <Link href="/admin" className="nav-link whitespace-nowrap">
              <span className="opacity-70">⚙</span>
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="mt-auto hidden space-y-3 p-4 md:block">
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
          {user ? (
            <div className="px-1 text-sm">
              <p className="font-semibold">{user.name}</p>
              <button type="button" className="mt-1 text-xs font-semibold text-[var(--brand)]" onClick={logout}>
                Cerrar sesión
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn btn-secondary w-full !py-2 text-sm">
              Iniciar sesión
            </Link>
          )}
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
          <div className="flex items-center gap-2">
            {!user ? (
              <Link href="/login" className="btn btn-secondary !py-2.5 !px-4 text-sm">
                Login
              </Link>
            ) : null}
            <Link href="/campus/generador" className="btn btn-primary !py-2.5 !px-4 text-sm">
              Test a la carta
            </Link>
          </div>
        </header>
        <main className="px-5 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
