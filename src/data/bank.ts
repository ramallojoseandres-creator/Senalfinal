import bankExtra from "@/data/bank-extra.json";
import type { Question } from "@/data/questions";

// Keep original demo stems in questions.ts; merge here for the full pool helpers.
export const extraQuestions = bankExtra as Question[];

export function allDemoQuestions(base: Question[]): Question[] {
  return [...base, ...extraQuestions];
}
