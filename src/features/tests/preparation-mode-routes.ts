import type { PreparationMode } from "@/lib/schemas";

export const preparationModeSlugs: Record<PreparationMode, string> = {
  CEFR_GRAMMAR: "cefr-grammar",
  TEF_CANADA_PRACTICE: "tef-canada",
  TCF_CANADA_PRACTICE: "tcf-canada",
  WRITING_PRACTICE: "writing",
  SPEAKING_PRACTICE: "speaking",
  MIXED_GRAMMAR_VOCABULARY: "grammar-vocabulary",
  FULL_MOCK_EXAM: "full-mock"
};

export function preparationModeFromSlug(slug: string): PreparationMode | null {
  const match = Object.entries(preparationModeSlugs).find(([, value]) => value === slug);

  return match ? (match[0] as PreparationMode) : null;
}
