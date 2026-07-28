import { cookies } from "next/headers";
import { userFromToken, type UserRole } from "@/lib/store";

export const SESSION_COOKIE = "puertomir_session";

export async function getSessionUser() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  return userFromToken(token);
}

export async function requireUser(roles?: UserRole[]) {
  const user = await getSessionUser();
  if (!user) return null;
  if (roles && !roles.includes(user.role)) return null;
  return user;
}
