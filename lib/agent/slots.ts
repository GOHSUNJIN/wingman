import type { Category } from "@/lib/catalog/types";

/** The catalog slots a look is built from. No dependencies: the browser imports it. */
export const SLOTS = ["top", "outerwear"] as const satisfies readonly Category[];
export type Slot = (typeof SLOTS)[number];
