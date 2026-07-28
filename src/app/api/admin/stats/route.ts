import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { adminStats } from "@/lib/store";

export async function GET() {
  const admin = await requireUser(["admin"]);
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return NextResponse.json(await adminStats());
}
