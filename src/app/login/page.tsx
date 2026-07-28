"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error de acceso");
        setLoading(false);
        return;
      }
      if (data.user?.role === "admin") router.push("/admin");
      else router.push("/campus");
      router.refresh();
    } catch {
      setError("No se pudo conectar");
      setLoading(false);
    }
  }

  return (
    <div className="landing-hero flex min-h-screen items-center justify-center px-5 py-16">
      <div className="noise" />
      <div className="relative z-10 w-full max-w-md animate-rise">
        <Link href="/" className="mb-8 flex items-center gap-3 text-white">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--signal)] text-sm font-extrabold">
            P
          </span>
          <span className="display text-2xl">PuertoMir</span>
        </Link>
        <form onSubmit={onSubmit} className="panel !bg-white/10 !text-white p-8">
          <h1 className="display text-3xl">Entrar</h1>
          <p className="mt-2 text-sm text-white/65">
            Accede al campus o al panel de administración.
          </p>
          <label className="mt-6 block text-xs font-bold uppercase tracking-[0.16em] text-white/55">
            Email
            <input
              className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </label>
          <label className="mt-4 block text-xs font-bold uppercase tracking-[0.16em] text-white/55">
            Contraseña
            <input
              className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          {error ? <p className="mt-4 text-sm text-[#ffb4ae]">{error}</p> : null}
          <button type="submit" className="btn btn-primary mt-6 w-full" disabled={loading}>
            {loading ? "Entrando…" : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
