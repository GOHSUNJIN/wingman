/** Model choices from CLAUDE.md section 2. Never inline model names elsewhere. */
export const LLM = {
  agent: { model: "claude-sonnet-4-6", maxTokens: 1500 },
  // The prep plan: short and text-only, where Haiku matched Sonnet in a side-by-side test (30 Oct).
  // Occasion parsing stays on Sonnet: Haiku picked a different formality for 2 of 9 sentences.
  light: { model: "claude-haiku-4-5-20251001", maxTokens: 1500 },
  // Bulk lookups: 2,000-token cap goes entirely to the answer.
  tagging: { model: "claude-haiku-4-5-20251001", maxTokens: 2000 },
} as const;

export type LlmTask = keyof typeof LLM;
