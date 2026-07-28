"use client";

import { FormEvent, useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "admin">("student");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.users) setUsers(data.users);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  async function reload() {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    if (res.ok) setUsers(data.users);
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    setOk("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "No se pudo crear");
      return;
    }
    setOk(`Usuario ${data.user.email} creado`);
    setName("");
    setEmail("");
    setPassword("");
    setRole("student");
    await reload();
  }

  async function toggleActive(user: User) {
    await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !user.active }),
    });
    await reload();
  }

  return (
    <div className="space-y-8 animate-rise">
      <div>
        <h1 className="display text-4xl">Usuarios</h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          Crea alumnos con email y contraseña. Sus evaluaciones quedarán ligadas a su cuenta.
        </p>
      </div>

      <form onSubmit={onCreate} className="grid max-w-2xl gap-4 border-t border-[var(--line)] pt-6">
        <h2 className="display text-2xl">Crear usuario</h2>
        <label className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
          Nombre
          <input
            className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
          Email
          <input
            type="email"
            className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
          Contraseña
          <input
            type="password"
            className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={4}
          />
        </label>
        <label className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
          Rol
          <select
            className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3"
            value={role}
            onChange={(e) => setRole(e.target.value as "student" | "admin")}
          >
            <option value="student">Alumno</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
        {ok ? <p className="text-sm text-[var(--ok)]">{ok}</p> : null}
        <button type="submit" className="btn btn-primary w-fit">
          Crear usuario
        </button>
      </form>

      <section>
        <h2 className="display text-2xl">Listado</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
              <tr>
                <th className="py-2">Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-[var(--line)]">
                  <td className="py-3 font-semibold">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.active ? "Activo" : "Desactivado"}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-ghost !py-1.5 !px-3 text-xs"
                      onClick={() => toggleActive(u)}
                    >
                      {u.active ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
