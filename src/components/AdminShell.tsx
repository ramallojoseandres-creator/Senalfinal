"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type User = { id: string; email: string; name: string; role: string };

const links = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/usuarios", label: "Usuarios" },
  { href: "/admin/calificaciones", label: "Calificaciones" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(async (r) => {
        if (!r.ok) throw new Error("auth");
        return r.json();
      })
      .then((d) => {
        if (d.user?.role !== "admin") throw new Error("role");
        setUser(d.user);
      })
      .catch(() => router.replace("/login"))
      .finally(() => setReady(true));
  }, [router]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  if (!ready || !user) {
    return (
      <div className="grid min-h-screen place-items-center text-[var(--muted)]">
        Cargando panel…
      </div>
    );
  }

  return (
    <div className="min-h-screen md:grid md:grid-cols-[220px_1fr]">
      <aside className="border-b border-[var(--line)] bg-white/60 md:border-b-0 md:border-r">
        <div className="px-5 py-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--brand)] text-sm font-bold text-white">
              P
            </span>
            <div>
              <p className="display text-lg leading-none">PuertoMir</p>
              <p className="text-[11px] text-[var(--muted)]">Admin</p>
            </div>
          </Link>
        </div>
        <nav className="space-y-1 px-3 pb-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav-link ${pathname === l.href ? "active" : ""}`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/campus" className="nav-link">
            Ir al campus
          </Link>
        </nav>
        <div className="border-t border-[var(--line)] px-4 py-4 text-sm">
          <p className="font-semibold">{user.name}</p>
          <p className="text-xs text-[var(--muted)]">{user.email}</p>
          <button type="button" className="btn btn-ghost mt-3 w-full !py-2 text-sm" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="px-5 py-6 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
