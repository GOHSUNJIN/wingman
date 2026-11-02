import { describe, expect, it } from "vitest";
import type { LookItems } from "@/lib/agent/pick/candidates";
import { colourMatch, nameWords, resolveTier, tierPickErrors, tierPool } from "@/lib/agent/pick/match";
import type { TierPick } from "@/lib/agent/schemas";
import type { Product } from "@/lib/catalog/types";

function product(id: string, overrides: Partial<Product> = {}): Product {
  return {
    id,
    store: "duxton.com",
    storeName: "DUXTON",
    name: `Item ${id}`,
    price: 100,
    currency: "SGD",
    tier: "mid",
    category: "top",
    originalPrice: 100,
    originalCurrency: "SGD",
    colour: "white",
    formality: "smart-casual",
    occasions: ["date"],
    image: "https://cdn.shopify.com/x.jpg",
    images: [],
    url: "https://duxton.com/products/x",
    variants: [{ id: 1, size: "M", available: true }],
    updatedAt: "2026-10-28T00:00:00Z",
    ...overrides,
  };
}

const look: LookItems = {
  top: product("top-mid", { name: "Napoli Linen Shirt", colour: "white" }),
  outerwear: product("out-mid", { category: "outerwear", name: "Linen Blazer", colour: "white" }),
};

const catalog: Product[] = [
  product("t-polo", { tier: "budget", name: "Pique Polo", colour: "navy" }),
  product("t-linen", { tier: "budget", name: "Linen Shirts", colour: "white" }),
  product("t-oos", { tier: "budget", name: "Linen Shirt", colour: "white", variants: [{ id: 2, size: "M", available: false }] }),
  product("t-lux", { tier: "luxury", name: "Linen Shirt", colour: "white" }),
  product("o-blazer", { tier: "budget", category: "outerwear", name: "Cotton Blazer", colour: "white" }),
  product("o-linen", { tier: "budget", category: "outerwear", name: "Linen Jacket", colour: "light beige" }),
];

const pick = (overrides: Partial<TierPick> = {}): TierPick => ({
  tier: "budget",
  top: "t-linen",
  outerwear: "o-blazer",
  note: "Cheaper cloth.",
  ...overrides,
});

describe("nameWords and colourMatch", () => {
  it("folds plurals and drops short and filler words", () => {
    expect([...nameWords("The Linen Shirts for Men")]).toEqual(["linen", "shirt"]);
  });

  it("scores exact colours above shared words, and unrelated colours zero", () => {
    expect(colourMatch("Navy", "navy")).toBe(1);
    expect(colourMatch("navy blue", "navy")).toBe(0.5);
    expect(colourMatch("navy", "olive")).toBe(0);
  });
});

describe("tierPool", () => {
  const pool = tierPool(look, catalog, "budget", "photo");

  it("only offers in-stock pieces from the target tier, in the look's slots", () => {
    expect(pool.top?.map((p) => p.id)).not.toContain("t-oos");
    expect(pool.top?.map((p) => p.id)).not.toContain("t-lux");
  });

  it("ranks the same colour and cut first", () => {
    expect(pool.top?.[0].id).toBe("t-linen");
    expect(pool.outerwear?.[0].id).toBe("o-blazer");
  });
});

describe("tierPickErrors", () => {
  const pool = tierPool(look, catalog, "budget", "photo");

  it("accepts listed candidates for every slot the look fills", () => {
    expect(tierPickErrors(pick(), pool)).toEqual([]);
  });

  it("flags unknown ids, missing slots and slots the look doesn't have", () => {
    expect(tierPickErrors(pick({ top: "t-lux" }), pool)).toEqual(['budget: "t-lux" is not in the budget top list.']);
    expect(tierPickErrors(pick({ outerwear: null }), pool)).toEqual(["budget: outerwear is required."]);
  });
});

describe("resolveTier", () => {
  const pool = tierPool(look, catalog, "budget", "photo");

  it("uses valid picks and falls back to the closest candidate for invalid ones", () => {
    const items = resolveTier(look, pool, pick({ outerwear: "o-linen", top: "nope" }));
    expect(items.top?.id).toBe("t-linen");
    expect(items.outerwear?.id).toBe("o-linen");
  });

  it("keeps the original piece when the tier has nothing in that category", () => {
    const items = resolveTier(look, tierPool(look, [], "luxury", "photo"));
    expect(items.outerwear?.id).toBe("out-mid");
  });
});
