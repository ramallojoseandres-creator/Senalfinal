import { NextResponse } from "next/server";
import {
  createSession,
  findUserByEmail,
  verifyPassword,
} from "@/lib/store";
import { SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email ?? "").trim();
    const password = String(body.password ?? "");
    const user = await findUserByEmail(email);
    if (!user || !user.active || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { error: "Email o contraseña incorrectos" },
        { status: 401 },
      );
    }
    const token = await createSession(user.id);
    const res = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "No se pudo iniciar sesión" }, { status: 500 });
  }
}
