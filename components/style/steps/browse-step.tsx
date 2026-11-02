"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { RAW_IMG_PROPS } from "@/components/style/flow-shell";
import { ProductImage } from "@/components/style/product-image";
import type { BrowseItem, BrowsePage, Look, LookItem } from "@/lib/agent/events";
import { displayName } from "@/lib/catalog/names";
import { TIERS } from "@/lib/catalog/types";
import { TIER_LABELS } from "@/lib/occasions";
import { sgd } from "@/lib/utils/format";

export type BrowseFilters = {
  category: LookItem["slot"];
  tier?: string;
  price?: string;
  colour?: string;
  size?: string;
  store?: string;
  sort: "featured" | "price-asc" | "price-desc";
};

const SORTS: Record<BrowseFilters["sort"], { label: string; next: BrowseFilters["sort"] }> = {
  featured: { label: "Sorted by fit", next: "price-asc" },
  "price-asc": { label: "Price: low to high", next: "price-desc" },
  "price-desc": { label: "Price: high to low", next: "featured" },
};

const CATEGORIES: { value: LookItem["slot"]; label: string }[] = [
  { value: "top", label: "Tops" },
  { value: "outerwear", label: "Layers" },
];

const PRICES = [
  { value: "under-100", label: "Under S$100" },
  { value: "100-250", label: "S$100–250" },
  { value: "250-500", label: "S$250+" },
];

const SLOT_NAMES: Record<LookItem["slot"], string> = {
  top: "Tops",
  outerwear: "Layers",
};

/** The whole in-stock catalog with filters. */
export function BrowseStep({
  filters,
  onFilters,
  looks,
  inCart,
  onAddToLook,
  onAddToCart,
  onBack,
  backLabel = "Back to your looks",
}: {
  filters: BrowseFilters;
  onFilters: (filters: BrowseFilters) => void;
  looks: Look[];
  inCart: Set<string>;
  onAddToLook: (look: number, item: BrowseItem) => void;
  onAddToCart: (item: BrowseItem) => void;
  onBack: () => void;
  backLabel?: string;
}) {
  const [page, setPage] = useState<BrowsePage | null>(null);
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");
  const [more, setMore] = useState(false);
  const [selected, setSelected] = useState<BrowseItem | null>(null);
  const key = JSON.stringify(filters);
  const loaded = useRef<string | null>(null);

  const query = (offset: number) => {
    const params = new URLSearchParams({ offset: String(offset) });
    for (const [k, v] of Object.entries(filters)) if (v) params.set(k, v);
    return `/api/browse?${params}`;
  };

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    fetch(query(0), { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: BrowsePage) => {
        setPage(data);
        setStatus("done");
        loaded.current = key;
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus("error");
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const loadMore = async () => {
    if (!page) return;
    setMore(true);
    try {
      const res = await fetch(query(page.items.length));
      const next = (await res.json()) as BrowsePage;
      setPage((p) => (p ? { ...p, items: [...p.items, ...next.items] } : next));
    } finally {
      setMore(false);
    }
  };

  const set = (patch: Partial<BrowseFilters>) => onFilters({ ...filters, ...patch });
  const facets = page?.facets;

  return (
    <div
      style={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#0A0A0B",
        color: "#ECEBE8",
        fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
      }}
    >
      {/* ── Header ── */}
      <header
        style={{
          height: 64,
          flexShrink: 0,
          background: "#141416",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-dm-serif), serif",
            fontSize: 20,
            letterSpacing: "0.2em",
            color: "#ECEBE8",
            textDecoration: "none",
          }}
        >
          WINGMAN
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <WmDots current={4} />
          <span style={{ fontSize: 12, letterSpacing: "0.02em", color: "#9C978E" }}>04 · Browse every piece</span>
        </div>
      </header>

      {/* ── Main ── */}
      <main style={{ flex: 1, display: "flex", minHeight: 0, position: "relative" }}>

        {/* ── Left: filter sidebar ── */}
        <aside
          aria-label="Filters"
          style={{
            width: 260,
            flexShrink: 0,
            background: "#141416",
            padding: "28px 28px 32px",
            boxSizing: "border-box",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 26,
          }}
        >
          {/* Count */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{ fontFamily: "var(--font-dm-serif), serif", fontSize: 30, lineHeight: 1 }}
            >
              {status === "done" && page ? page.total : "..."}
            </span>
            <span style={{ fontSize: 12, color: "#9C978E" }}>
              {status === "done" && page
                ? `${page.total === 1 ? "piece" : "pieces"} across stores`
                : status === "loading" ? "Loading…" : "Couldn't load"}
            </span>
          </div>

          {/* Category */}
          <FilterGroup label="Category">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {CATEGORIES.map((c) => {
                const on = filters.category === c.value;
                return (
                  <FilterChip
                    key={c.value}
                    on={on}
                    onClick={() =>
                      onFilters({ category: c.value, sort: filters.sort, tier: filters.tier, price: filters.price, store: filters.store })
                    }
                  >
                    {c.label}
                  </FilterChip>
                );
              })}
            </div>
          </FilterGroup>

          {/* Budget */}
          <FilterGroup label="Budget">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {TIERS.map((t) => {
                const on = filters.tier === t;
                return (
                  <FilterChip key={t} on={on} onClick={() => set({ tier: on ? undefined : t })}>
                    {TIER_LABELS[t]}
                  </FilterChip>
                );
              })}
            </div>
          </FilterGroup>

          {/* Price */}
          <FilterGroup label="Price">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {PRICES.map((p) => {
                const on = filters.price === p.value;
                return (
                  <FilterChip key={p.value} on={on} onClick={() => set({ price: on ? undefined : p.value })}>
                    {p.label}
                  </FilterChip>
                );
              })}
            </div>
          </FilterGroup>

          {/* Colour */}
          {(facets?.colours ?? []).length > 0 && (
            <FilterGroup label="Colour">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(facets?.colours ?? []).map((c) => {
                  const on = filters.colour === c.value;
                  return (
                    <FilterChip key={c.value} on={on} onClick={() => set({ colour: on ? undefined : c.value })}>
                      {c.value}
                      {c.count != null && (
                        <span style={{ marginLeft: 6, opacity: 0.6, fontVariantNumeric: "tabular-nums" }}>{c.count}</span>
                      )}
                    </FilterChip>
                  );
                })}
              </div>
            </FilterGroup>
          )}

          {/* Size */}
          {(facets?.sizes ?? []).length > 0 && (
            <FilterGroup label="Size">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 6 }}>
                {(facets?.sizes ?? []).map((s) => {
                  const on = filters.size === s.value;
                  return (
                    <FilterChip key={s.value} on={on} onClick={() => set({ size: on ? undefined : s.value })}>
                      {s.value}
                    </FilterChip>
                  );
                })}
              </div>
            </FilterGroup>
          )}

          {/* Store */}
          {(facets?.stores ?? []).length > 0 && (
            <FilterGroup label="Store">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(facets?.stores ?? []).map((s) => {
                  const on = filters.store === s.value;
                  return (
                    <FilterChip key={s.value} on={on} onClick={() => set({ store: on ? undefined : s.value })}>
                      {s.label}
                    </FilterChip>
                  );
                })}
              </div>
            </FilterGroup>
          )}
        </aside>

        {/* ── Center: product grid ── */}
        <section
          style={{
            flex: 1,
            minWidth: 0,
            overflowY: "auto",
            padding: "32px 48px 48px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                type="button"
                onClick={onBack}
                style={{
                  background: "none",
                  border: 0,
                  padding: 0,
                  color: "#9C978E",
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                }}
              >
                ← {backLabel}
              </button>
              <h1
                style={{
                  margin: 0,
                  fontFamily: "var(--font-dm-serif), serif",
                  fontWeight: 400,
                  fontSize: 44,
                  lineHeight: 1,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.02em",
                }}
              >
                Every Piece
              </h1>
            </div>
            <button
              type="button"
              onClick={() => set({ sort: SORTS[filters.sort].next })}
              style={{
                background: "none",
                border: 0,
                padding: 0,
                color: "#9C978E",
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
              aria-label={`Sorted by ${SORTS[filters.sort].label.toLowerCase()}. Change sort order`}
            >
              {SORTS[filters.sort].label}
            </button>
          </div>

          {/* Empty state */}
          {page && page.total === 0 && status === "done" && (
            <div style={{ marginTop: 32 }}>
              <p style={{ fontSize: 14, color: "#9C978E" }}>
                Nothing matches all of those. Try a wider price range or another colour or clear the filters.
              </p>
              <button
                type="button"
                onClick={() => onFilters({ category: filters.category, sort: filters.sort })}
                style={{
                  marginTop: 8,
                  background: "none",
                  border: 0,
                  padding: 0,
                  color: "#ECEBE8",
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textDecoration: "underline",
                  textUnderlineOffset: 4,
                }}
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Product grid */}
          <div
            style={{
              marginTop: 28,
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "32px 24px",
              opacity: status === "loading" ? 0.5 : 1,
              transition: "opacity 0.15s",
            }}
          >
            {page?.items.map((item) => {
              const isSelected = selected?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelected(item)}
                  style={{
                    background: "none",
                    border: 0,
                    padding: 0,
                    textAlign: "left",
                    color: "#ECEBE8",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    fontFamily: "inherit",
                  }}
                >
                  <div
                    style={{
                      aspectRatio: "1 / 1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: isSelected ? "#26262A" : "#141416",
                      outline: isSelected ? "1px solid #ECEBE8" : "none",
                      outlineOffset: -1,
                      overflow: "hidden",
                    }}
                  >
                    <ProductImage
                      src={item.image}
                      sizes="(min-width: 1024px) 15rem, (min-width: 640px) 30vw, 45vw"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <span style={{ fontSize: 15 }}>{displayName(item.name, item.storeName)}</span>
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 13,
                        color: "#9C978E",
                      }}
                    >
                      <span>{item.storeName}</span>
                      <span style={{ color: "#ECEBE8", fontVariantNumeric: "tabular-nums" }}>{sgd(item.price)}</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Load more */}
          {page && page.items.length < page.total && (
            <button
              type="button"
              onClick={loadMore}
              disabled={more}
              style={{
                marginTop: 40,
                width: "100%",
                height: 44,
                background: "#1C1C1F",
                color: "#ECEBE8",
                border: 0,
                fontSize: 14,
                cursor: more ? "default" : "pointer",
                fontFamily: "inherit",
                opacity: more ? 0.5 : 1,
              }}
            >
              {more ? "Loading…" : `Show more (${page.total - page.items.length} left)`}
            </button>
          )}
        </section>

        {/* ── Right: slide-in item panel ── */}
        {selected && (
          <>
            {/* Backdrop */}
            <div
              aria-hidden
              onClick={() => setSelected(null)}
              style={{
                position: "absolute",
                top: 0,
                left: 260,
                right: 0,
                bottom: 0,
                background: "rgba(10,10,11,0.55)",
              }}
            />
            <ItemPanel
              item={selected}
              looks={looks}
              inCart={inCart.has(selected.id)}
              onAddToLook={(i) => onAddToLook(i, selected)}
              onAddToCart={() => {
                onAddToCart(selected);
                setSelected(null);
              }}
              onClose={() => setSelected(null)}
            />
          </>
        )}
      </main>
    </div>
  );
}

function ItemPanel({
  item,
  looks,
  inCart,
  onAddToLook,
  onAddToCart,
  onClose,
}: {
  item: BrowseItem;
  looks: Look[];
  inCart: boolean;
  onAddToLook: (look: number) => void;
  onAddToCart: () => void;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const name = displayName(item.name, item.storeName);
  const slot = SLOT_NAMES[item.slot];
  const [targetLook, setTargetLook] = useState(0);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-label={name}
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        width: 460,
        background: "#1C1C1F",
        padding: "28px 44px 32px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        animation: "wmReveal 0.45s cubic-bezier(0.2, 0.7, 0.2, 1) both",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#9C978E" }}>{slot}</span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          style={{
            background: "none",
            border: 0,
            padding: 0,
            color: "#9C978E",
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "inherit",
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          Close
        </button>
      </div>

      {/* Large image */}
      <div
        style={{
          marginTop: 18,
          height: 300,
          flexShrink: 0,
          background: "#26262A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <ProductImage src={item.image} sizes="400px" className="h-full w-full object-contain" />
      </div>

      {/* Item info */}
      <h2
        style={{
          margin: "24px 0 0",
          fontFamily: "var(--font-dm-serif), serif",
          fontWeight: 400,
          fontSize: 30,
          lineHeight: 1.1,
        }}
      >
        {name}
      </h2>
      <div
        style={{
          marginTop: 8,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 15,
        }}
      >
        <span style={{ color: "#9C978E" }}>{item.storeName}</span>
        <span style={{ fontVariantNumeric: "tabular-nums" }}>{sgd(item.price)}</span>
      </div>
      <a
        href={item.url}
        target="_blank"
        rel="noopener"
        style={{ marginTop: 6, display: "inline-block", fontSize: 13, color: "#9C978E", textDecoration: "underline", textUnderlineOffset: 3 }}
      >
        See it at {item.storeName} ↗
      </a>

      {/* Add to which look */}
      {looks.length > 0 && (
        <fieldset style={{ margin: "22px 0 0", padding: 0, border: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          <legend style={{ padding: 0, marginBottom: 10, fontSize: 12, color: "#9C978E" }}>
            Add to which look
          </legend>
          {looks.map((look, i) => {
            const current = look.items.find((it) => it.slot === item.slot);
            const on = targetLook === i;
            return (
              <label
                key={i}
                style={{
                  height: 44,
                  padding: "0 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontSize: 14,
                  cursor: "pointer",
                  background: on ? "#26262A" : "transparent",
                }}
              >
                <input
                  type="radio"
                  name="look"
                  checked={on}
                  onChange={() => setTargetLook(i)}
                  style={{ accentColor: "#ECEBE8", margin: 0 }}
                />
                <span style={{ flex: 1 }}>
                  {look.name}
                  {current && (
                    <span style={{ display: "block", fontSize: 12, color: "#9C978E" }}>
                      Replaces: {displayName(current.name, current.storeName)}
                    </span>
                  )}
                </span>
                <span style={{ color: "#9C978E", fontVariantNumeric: "tabular-nums" }}>
                  {look.fitCheck ? look.fitCheck.score.toFixed(1) : "…"}
                </span>
              </label>
            );
          })}
          <button
            type="button"
            onClick={() => onAddToLook(targetLook)}
            style={{
              marginTop: 4,
              height: 44,
              background: "#26262A",
              color: "#ECEBE8",
              border: 0,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Add to Look {targetLook + 1}
          </button>
        </fieldset>
      )}

      {/* CTA */}
      <button
        type="button"
        onClick={onAddToCart}
        disabled={inCart}
        style={{
          marginTop: "auto",
          paddingTop: looks.length > 0 ? 0 : 22,
          height: 52,
          flexShrink: 0,
          background: inCart ? "#1C1C1F" : "#C8A96A",
          color: inCart ? "#9C978E" : "#0A0A0B",
          border: 0,
          fontSize: 15,
          fontWeight: 600,
          cursor: inCart ? "default" : "pointer",
          fontFamily: "inherit",
        }}
      >
        {inCart ? "Already in cart" : `Add to Cart · ${sgd(item.price)}`}
      </button>
    </aside>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset style={{ border: 0, margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 0 }}>
      <legend style={{ padding: 0, marginBottom: 10, fontSize: 12, color: "#9C978E" }}>{label}</legend>
      {children}
    </fieldset>
  );
}

function FilterChip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      style={{
        height: 30,
        padding: "0 12px",
        border: 0,
        background: on ? "#ECEBE8" : "#1C1C1F",
        color: on ? "#0A0A0B" : "#ECEBE8",
        fontSize: 13,
        fontWeight: on ? 600 : 400,
        cursor: "pointer",
        fontFamily: "inherit",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

function WmDots({ current }: { current: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }} aria-label={`Step ${current} of 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const done = n < current;
        const active = n === current;
        return (
          <span
            key={n}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: done || active ? "#C8A96A" : "#3A3A3F",
              display: "block",
              flexShrink: 0,
              animation: active ? "wmPulse 1.6s ease-in-out infinite" : "none",
            }}
          />
        );
      })}
    </div>
  );
}
