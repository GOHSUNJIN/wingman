"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { CatalogProduct } from "@/app/catalog/page";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "top", label: "Tops" },
  { id: "outerwear", label: "Outerwear" },
];

const TIERS = [
  { id: "all", label: "Any price" },
  { id: "budget", label: "Budget" },
  { id: "mid", label: "Mid" },
  { id: "luxury", label: "Luxury" },
];

const T = "#ECEBE8";
const M = "#9C978E";
const S = "#141416";
const SR = "#1C1C1F";
const G = "#C8A96A";
const B = "#0A0A0B";

function sgd(price: number) {
  return `S$${price.toLocaleString("en-SG", { minimumFractionDigits: 0 })}`;
}

export function CatalogClient({ products }: { products: CatalogProduct[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [tier, setTier] = useState("all");
  const [store, setStore] = useState("all");

  const stores = useMemo(() => {
    const names = [...new Set(products.map((p) => p.store_name))].sort();
    return [{ id: "all", label: "All stores" }, ...names.map((n) => ({ id: n, label: n }))];
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (tier !== "all" && p.tier !== tier) return false;
      if (store !== "all" && p.store_name !== store) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.store_name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, query, category, tier, store]);

  const hasFilter = category !== "all" || tier !== "all" || store !== "all" || query.trim().length > 0;

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: B,
        color: T,
        fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          height: 64,
          background: S,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          position: "sticky",
          top: 0,
          zIndex: 20,
          flexShrink: 0,
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-dm-serif), Georgia, serif",
            fontSize: 20,
            letterSpacing: "0.2em",
            color: T,
            textDecoration: "none",
          }}
        >
          WINGMAN
        </Link>
        <nav style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 14 }}>
          <Link href="/" style={{ color: M, textDecoration: "none" }}>Home</Link>
          <Link href="/catalog" style={{ color: T, textDecoration: "none" }}>Catalog</Link>
          <Link
            href="/style"
            style={{
              background: G,
              color: B,
              padding: "9px 20px",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Style Me
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
              <path d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </Link>
        </nav>
      </header>

      {/* Page title */}
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "48px 40px 0", boxSizing: "border-box" }}>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-dm-serif), Georgia, serif",
            fontWeight: 400,
            fontSize: "clamp(36px, 4.5vw, 64px)",
            lineHeight: 1,
            letterSpacing: "-0.015em",
          }}
        >
          The Catalog
        </h1>
        <p style={{ margin: "10px 0 0", fontSize: 14, color: M }}>
          {products.length} pieces across {stores.length - 1} Singapore stores
        </p>
      </div>

      {/* Filter bar */}
      <div
        style={{
          position: "sticky",
          top: 64,
          zIndex: 10,
          background: B,
          borderBottom: "1px solid #1C1C1F",
          marginTop: 32,
        }}
      >
        <div
          style={{
            maxWidth: 1360,
            margin: "0 auto",
            padding: "16px 40px",
            boxSizing: "border-box",
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
          }}
        >
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 240px", minWidth: 200, maxWidth: 320 }}>
            <svg
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
              width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={M} strokeWidth={2} aria-hidden
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              placeholder="Search pieces or stores"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: "100%",
                height: 40,
                background: SR,
                border: 0,
                paddingLeft: 40,
                paddingRight: 14,
                fontSize: 14,
                color: T,
                fontFamily: "inherit",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          {/* Category chips */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {CATEGORIES.map((c) => {
              const on = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  style={{
                    height: 36,
                    padding: "0 14px",
                    background: on ? T : SR,
                    color: on ? B : M,
                    border: 0,
                    fontSize: 13,
                    fontWeight: on ? 600 : 400,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* Tier chips */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {TIERS.map((t) => {
              const on = tier === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTier(t.id)}
                  style={{
                    height: 36,
                    padding: "0 14px",
                    background: on ? G : SR,
                    color: on ? B : M,
                    border: 0,
                    fontSize: 13,
                    fontWeight: on ? 600 : 400,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Store select */}
          <select
            value={store}
            onChange={(e) => setStore(e.target.value)}
            style={{
              height: 36,
              background: SR,
              color: store === "all" ? M : T,
              border: 0,
              padding: "0 12px",
              fontSize: 13,
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            {stores.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>

          {/* Clear */}
          {hasFilter && (
            <button
              type="button"
              onClick={() => { setQuery(""); setCategory("all"); setTier("all"); setStore("all"); }}
              style={{
                background: "none",
                border: 0,
                color: M,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
                textDecoration: "underline",
                textUnderlineOffset: 3,
                padding: 0,
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Result count */}
        <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 40px 12px", boxSizing: "border-box" }}>
          <span style={{ fontSize: 13, color: M }}>
            {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
            {hasFilter ? " found" : ""}
          </span>
        </div>
      </div>

      {/* Product grid */}
      <div
        style={{
          maxWidth: 1360,
          margin: "0 auto",
          padding: "32px 40px 80px",
          boxSizing: "border-box",
        }}
      >
        {filtered.length === 0 ? (
          <div
            style={{
              padding: "80px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              color: M,
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} aria-hidden>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <p style={{ margin: 0, fontSize: 16 }}>No pieces match those filters.</p>
            <button
              type="button"
              onClick={() => { setQuery(""); setCategory("all"); setTier("all"); setStore("all"); }}
              style={{ background: "none", border: 0, color: T, fontSize: 14, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline", textUnderlineOffset: 3 }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 2,
            }}
          >
            {filtered.map((p) => (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  flexDirection: "column",
                  background: S,
                  transition: "background 160ms ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = SR)}
                onMouseLeave={(e) => (e.currentTarget.style.background = S)}
              >
                <div
                  style={{
                    aspectRatio: "1 / 1",
                    background: SR,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(min-width: 1360px) 220px, (min-width: 768px) 20vw, 45vw"
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div style={{ padding: "12px 14px 14px", display: "flex", flexDirection: "column", gap: 3 }}>
                  <span style={{ fontSize: 13, lineHeight: 1.35, color: T }}>{p.name}</span>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginTop: 2 }}>
                    <span style={{ fontSize: 12, color: M }}>{p.store_name}</span>
                    <span style={{ fontSize: 13, color: T, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
                      {sgd(p.price)}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: p.tier === "budget" ? "#C4875A" : p.tier === "luxury" ? "#B8B0A6" : G,
                      marginTop: 2,
                      textTransform: "capitalize",
                    }}
                  >
                    {p.tier}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
