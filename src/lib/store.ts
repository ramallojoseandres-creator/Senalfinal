import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { promises as fs } from "fs";
import path from "path";

export type UserRole = "admin" | "student";

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  passwordHash: string;
  createdAt: string;
  active: boolean;
};

export type AttemptRecord = {
  id: string;
  userId: string;
  label: string;
  mode: string;
  date: string;
  net: number;
  total: number;
  correct: number;
  wrong: number;
  blank: number;
  score: number;
  percentile: number;
  questionCount: number;
  durationSec?: number;
  bySubject?: {
    subjectId: string;
    name: string;
    nets: number;
    accuracy: number;
    percentile: number;
  }[];
};

export type SessionToken = {
  token: string;
  userId: string;
  expiresAt: string;
};

type Store = {
  users: User[];
  attempts: AttemptRecord[];
  sessions: SessionToken[];
};

const STORE_DIR = path.join(process.cwd(), "data", "store");
const STORE_FILE = path.join(STORE_DIR, "puertomir-store.json");
const SESSION_DAYS = 14;

function hashPassword(password: string, salt?: string) {
  const usedSalt = salt ?? randomBytes(16).toString("hex");
  const hash = scryptSync(password, usedSalt, 64).toString("hex");
  return `${usedSalt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const next = scryptSync(password, salt, 64);
  const prev = Buffer.from(hash, "hex");
  if (prev.length !== next.length) return false;
  return timingSafeEqual(prev, next);
}

function seedAdmin(): User {
  return {
    id: "admin-1",
    email: "ramallojoseandres@gmail.com",
    name: "José Andrés Ramallo",
    role: "admin",
    passwordHash: hashPassword("151595"),
    createdAt: new Date().toISOString(),
    active: true,
  };
}

function emptyStore(): Store {
  return {
    users: [seedAdmin()],
    attempts: [],
    sessions: [],
  };
}

async function ensureStore(): Promise<Store> {
  await fs.mkdir(STORE_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(STORE_FILE, "utf8");
    const parsed = JSON.parse(raw) as Store;
    if (!parsed.users?.length) {
      parsed.users = [seedAdmin()];
    }
    // Ensure admin exists
    const adminEmail = "ramallojoseandres@gmail.com";
    if (!parsed.users.some((u) => u.email.toLowerCase() === adminEmail)) {
      parsed.users.unshift(seedAdmin());
    }
    parsed.attempts ??= [];
    parsed.sessions ??= [];
    return parsed;
  } catch {
    const store = emptyStore();
    await fs.writeFile(STORE_FILE, JSON.stringify(store, null, 2));
    return store;
  }
}

async function writeStore(store: Store) {
  await fs.mkdir(STORE_DIR, { recursive: true });
  await fs.writeFile(STORE_FILE, JSON.stringify(store, null, 2));
}

export function publicUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    active: user.active,
    createdAt: user.createdAt,
  };
}

export async function listUsers() {
  const store = await ensureStore();
  return store.users.map(publicUser);
}

export async function findUserByEmail(email: string) {
  const store = await ensureStore();
  return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function findUserById(id: string) {
  const store = await ensureStore();
  return store.users.find((u) => u.id === id) ?? null;
}

export async function createUser(input: {
  email: string;
  name: string;
  password: string;
  role?: UserRole;
}) {
  const store = await ensureStore();
  const email = input.email.trim().toLowerCase();
  if (!email || !input.password || !input.name.trim()) {
    throw new Error("Nombre, email y contraseña son obligatorios");
  }
  if (store.users.some((u) => u.email.toLowerCase() === email)) {
    throw new Error("Ya existe un usuario con ese email");
  }
  const user: User = {
    id: `u-${Date.now()}-${randomBytes(3).toString("hex")}`,
    email,
    name: input.name.trim(),
    role: input.role ?? "student",
    passwordHash: hashPassword(input.password),
    createdAt: new Date().toISOString(),
    active: true,
  };
  store.users.push(user);
  await writeStore(store);
  return publicUser(user);
}

export async function setUserActive(id: string, active: boolean) {
  const store = await ensureStore();
  const user = store.users.find((u) => u.id === id);
  if (!user) throw new Error("Usuario no encontrado");
  user.active = active;
  await writeStore(store);
  return publicUser(user);
}

export async function createSession(userId: string) {
  const store = await ensureStore();
  const token = randomBytes(32).toString("hex");
  const expires = new Date();
  expires.setDate(expires.getDate() + SESSION_DAYS);
  store.sessions = store.sessions.filter((s) => new Date(s.expiresAt) > new Date());
  store.sessions.push({
    token: createHash("sha256").update(token).digest("hex"),
    userId,
    expiresAt: expires.toISOString(),
  });
  await writeStore(store);
  return token;
}

export async function destroySession(rawToken: string | undefined) {
  if (!rawToken) return;
  const store = await ensureStore();
  const hashed = createHash("sha256").update(rawToken).digest("hex");
  store.sessions = store.sessions.filter((s) => s.token !== hashed);
  await writeStore(store);
}

export async function userFromToken(rawToken: string | undefined) {
  if (!rawToken) return null;
  const store = await ensureStore();
  const hashed = createHash("sha256").update(rawToken).digest("hex");
  const session = store.sessions.find(
    (s) => s.token === hashed && new Date(s.expiresAt) > new Date(),
  );
  if (!session) return null;
  const user = store.users.find((u) => u.id === session.userId && u.active);
  return user ? publicUser(user) : null;
}

export async function saveAttempt(
  userId: string,
  payload: Omit<AttemptRecord, "id" | "userId" | "date">,
) {
  const store = await ensureStore();
  const record: AttemptRecord = {
    id: `att-${Date.now()}-${randomBytes(2).toString("hex")}`,
    userId,
    date: new Date().toISOString(),
    ...payload,
  };
  store.attempts.unshift(record);
  store.attempts = store.attempts.slice(0, 5000);
  await writeStore(store);
  return record;
}

export async function listAttempts(userId?: string) {
  const store = await ensureStore();
  return userId
    ? store.attempts.filter((a) => a.userId === userId)
    : store.attempts;
}

export async function adminStats() {
  const store = await ensureStore();
  const students = store.users.filter((u) => u.role === "student");
  const attempts = store.attempts;
  const byUser = students.map((u) => {
    const userAttempts = attempts.filter((a) => a.userId === u.id);
    const avgNet =
      userAttempts.length > 0
        ? Math.round(
            (userAttempts.reduce((s, a) => s + a.net, 0) / userAttempts.length) * 10,
          ) / 10
        : 0;
    const avgPercentile =
      userAttempts.length > 0
        ? Math.round(
            userAttempts.reduce((s, a) => s + a.percentile, 0) / userAttempts.length,
          )
        : 0;
    const last = userAttempts[0] ?? null;
    return {
      user: publicUser(u),
      attempts: userAttempts.length,
      avgNet,
      avgPercentile,
      lastAttempt: last,
      recent: userAttempts.slice(0, 8),
    };
  });

  return {
    totals: {
      users: store.users.length,
      students: students.length,
      attempts: attempts.length,
      avgPercentile:
        attempts.length > 0
          ? Math.round(
              attempts.reduce((s, a) => s + a.percentile, 0) / attempts.length,
            )
          : 0,
    },
    byUser,
    recentAttempts: attempts.slice(0, 20).map((a) => ({
      ...a,
      user: publicUser(store.users.find((u) => u.id === a.userId) ?? seedAdmin()),
    })),
  };
}
