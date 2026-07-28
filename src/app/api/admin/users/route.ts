import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { createUser, listUsers } from "@/lib/store";

export async function GET() {
  const admin = await requireUser(["admin"]);
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return NextResponse.json({ users: await listUsers() });
}

export async function POST(req: Request) {
  const admin = await requireUser(["admin"]);
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const user = await createUser({
      email: String(body.email ?? ""),
      name: String(body.name ?? ""),
      password: String(body.password ?? ""),
      role: body.role === "admin" ? "admin" : "student",
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error al crear usuario" },
      { status: 400 },
    );
  }
}
