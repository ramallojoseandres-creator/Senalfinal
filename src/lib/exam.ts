import { questions, type Question } from "@/data/questions";
import { getGradableOfficialQuestions } from "@/data/oficiales";

export type ExamConfig = {
  subjectIds?: string[];
  count: number;
  difficulty?: 1 | 2 | 3;
  officialOnly?: boolean;
  officialYear?: number;
  mode: "practice" | "exam" | "simulacro";
};

export type AnswerMap = Record<string, string | null>;

export type SessionResult = {
  total: number;
  answered: number;
  correct: number;
  blank: number;
  wrong: number;
  score: number;
  net: number;
};

export function buildExam(config: ExamConfig): Question[] {
  const official = getGradableOfficialQuestions(config.officialYear);
  let pool: Question[] = config.officialOnly
    ? [...official]
    : [...questions, ...official];

  if (!config.officialOnly && config.subjectIds?.length) {
    pool = pool.filter((q) => config.subjectIds!.includes(q.subjectId));
  }
  if (config.difficulty && !config.officialOnly) {
    pool = pool.filter((q) => q.difficulty === config.difficulty);
  }
  pool = pool.filter((q) => Boolean(q.correctId));

  // shuffle
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const count = Math.min(config.count, pool.length);
  return pool.slice(0, count);
}

export function gradeSession(qs: Question[], answers: AnswerMap): SessionResult {
  let correct = 0;
  let wrong = 0;
  let blank = 0;

  for (const q of qs) {
    const a = answers[q.id];
    if (!q.correctId) {
      blank += 1;
      continue;
    }
    if (!a) {
      blank += 1;
    } else if (a === q.correctId) {
      correct += 1;
    } else {
      wrong += 1;
    }
  }

  const answered = correct + wrong;
  // MIR scoring: +3 correct, -1 wrong, 0 blank
  const net = correct * 3 - wrong;
  const max = qs.length * 3;
  const score = max > 0 ? Math.round((net / max) * 100) : 0;

  return {
    total: qs.length,
    answered,
    correct,
    blank,
    wrong,
    score: Math.max(0, score),
    net,
  };
}

const STORAGE_KEY = "puertomir-progress-v1";

export type ProgressStore = {
  attempts: number;
  correct: number;
  wrong: number;
  blank: number;
  bySubject: Record<string, { correct: number; wrong: number; total: number }>;
  history: { date: string; net: number; total: number; label: string }[];
  lastSession?: {
    questionIds: string[];
    answers: AnswerMap;
    label: string;
    mode: string;
  };
};

export function emptyProgress(): ProgressStore {
  return {
    attempts: 0,
    correct: 0,
    wrong: 0,
    blank: 0,
    bySubject: {},
    history: [],
  };
}

export function loadProgress(): ProgressStore {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    return { ...emptyProgress(), ...JSON.parse(raw) };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(store: ProgressStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function recordAttempt(
  qs: Question[],
  answers: AnswerMap,
  label: string,
) {
  const store = loadProgress();
  const result = gradeSession(qs, answers);

  store.attempts += 1;
  store.correct += result.correct;
  store.wrong += result.wrong;
  store.blank += result.blank;

  for (const q of qs) {
    const entry = store.bySubject[q.subjectId] ?? {
      correct: 0,
      wrong: 0,
      total: 0,
    };
    entry.total += 1;
    const a = answers[q.id];
    if (a === q.correctId) entry.correct += 1;
    else if (a) entry.wrong += 1;
    store.bySubject[q.subjectId] = entry;
  }

  store.history = [
    {
      date: new Date().toISOString(),
      net: result.net,
      total: result.total,
      label,
    },
    ...store.history,
  ].slice(0, 20);

  store.lastSession = {
    questionIds: qs.map((q) => q.id),
    answers,
    label,
    mode: "practice",
  };

  saveProgress(store);
  return result;
}
