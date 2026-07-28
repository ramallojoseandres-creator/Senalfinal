import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { listAttempts, saveAttempt } from "@/lib/store";

export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const attempts =
    user.role === "admin" ? await listAttempts() : await listAttempts(user.id);
  return NextResponse.json({ attempts });
}

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const record = await saveAttempt(user.id, {
      label: String(body.label ?? "Sesión"),
      mode: String(body.mode ?? "practice"),
      net: Number(body.net ?? 0),
      total: Number(body.total ?? 0),
      correct: Number(body.correct ?? 0),
      wrong: Number(body.wrong ?? 0),
      blank: Number(body.blank ?? 0),
      score: Number(body.score ?? 0),
      percentile: Number(body.percentile ?? 0),
      questionCount: Number(body.questionCount ?? 0),
      durationSec: body.durationSec != null ? Number(body.durationSec) : undefined,
      bySubject: Array.isArray(body.bySubject) ? body.bySubject : undefined,
    });
    return NextResponse.json({ record }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "No se pudo guardar" }, { status: 500 });
  }
}
