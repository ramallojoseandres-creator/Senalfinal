import type { Question } from "@/data/questions";
import mir2025 from "./mir-2025.json";
import mir2024 from "./mir-2024.json";

export type OfficialBank = {
  meta: {
    label: string;
    pdfUrl: string;
    sourcePage: string;
    parsed: number;
    gradable: number;
    annulled?: number[];
    missingNumbers?: number[];
    note?: string;
  };
  questions: Array<
    Question & {
      officialNumber: number;
      annulled?: boolean;
      source?: string;
      needsPlantilla?: boolean;
    }
  >;
};

export const officialBanks: OfficialBank[] = [
  mir2025 as OfficialBank,
  mir2024 as OfficialBank,
];

export function getOfficialBank(year: number) {
  return officialBanks.find((b) =>
    b.questions.some((q) => q.year === year),
  );
}

export function getGradableOfficialQuestions(year?: number): Question[] {
  return officialBanks
    .flatMap((b) => b.questions)
    .filter((q) => {
      if (!q.correctId) return false;
      if (q.annulled) return false;
      if (year && q.year !== year) return false;
      return true;
    });
}
