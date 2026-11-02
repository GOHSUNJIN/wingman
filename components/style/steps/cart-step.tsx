"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductImage } from "@/components/style/product-image";
import { groupByStore, isOneSize, isSoldOut, MAX_QTY, pieceCount, type CartLine } from "@/lib/cart";
import { displayName } from "@/lib/catalog/names";
import { sgd } from "@/lib/utils/format";

function useWide() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setWide(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return wide;
}

export function CartStep({
  lines,
  onSize,
  onQty,
  onRemove,
  onRestore,
  onBack,
  backLabel = "Back to your looks",
}: {
  lines: CartLine[];
  onSize: (id: string, variantId: number) => void;
  onQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onRestore: (line: CartLine, index: number) => void;
  onBack: () => void;
  backLabel?: string;
}) {
  const stores = groupByStore(lines);
  const total = stores.reduce((sum, s) => sum + s.subtotal, 0);
  const count = pieceCount(lines.filter((l) => !isSoldOut(l)));
  const soldOutCount = lines.filter(isSoldOut).length;
  const [removed, setRemoved] = useState<{ line: CartLine; index: number } | null>(null);
  const wide = useWide();

  const remove = (id: string) => {
    const index = lines.findIndex((l) => l.id === id);
    if (index >= 0) setRemoved({ line: lines[index], index });
    onRemove(id);
  };

  // ── WIDE layout ──
  if (wide) {
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
            <WmDots current={5} />
            <span style={{ fontSize: 12, letterSpacing: "0.02em", color: "#9C978E" }}>05 · Cart</span>
          </div>
        </header>

        {/* ── Main ── */}
        <main style={{ flex: 1, display: "flex", minHeight: 0 }}>
          {/* Left: summary panel (40%) */}
          <section
            style={{
              width: "40%",
              background: "#141416",
              padding: "48px 72px 40px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
            }}
          >
            <button
              type="button"
              onClick={onBack}
              style={{
                color: "#9C978E",
                background: "none",
                border: 0,
                padding: 0,
                fontSize: 13,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "inherit",
                alignSelf: "flex-start",
              }}
            >
              ← {backLabel}
            </button>

            <span style={{ marginTop: 40, fontSize: 12, letterSpacing: "0.02em", color: "#9C978E" }}>
              Your total
            </span>
            <span
              style={{
                marginTop: 12,
                fontFamily: "var(--font-dm-serif), serif",
                fontSize: 96,
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {lines.length > 0 ? sgd(total) : "S$0"}
            </span>
            <span style={{ marginTop: 20, fontSize: 16 }}>
              {count} {count === 1 ? "piece" : "pieces"} · {stores.length}{" "}
              {stores.length === 1 ? "store" : "stores"}
            </span>

            {/* Payment info box */}
            <div
              style={{
                marginTop: 40,
                background: "#1C1C1F",
                padding: "20px 22px",
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ECEBE8"
                strokeWidth="1.25"
                aria-hidden
                style={{ flexShrink: 0, marginTop: 1 }}
              >
                <path d="M3 9h18l-1.5 11h-15z" />
                <path d="M8 9V6a4 4 0 0 1 8 0v3" />
              </svg>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 600 }}>You Pay at Each Store Directly</span>
                <span style={{ fontSize: 13, lineHeight: 1.55, color: "#9C978E" }}>
                  Each checkout opens the store&apos;s own site in a new tab, with your sizes already picked.
                  Wingman never takes payment.
                </span>
              </div>
            </div>

            {/* Sold-out warning */}
            {soldOutCount > 0 && (
              <p
                style={{
                  margin: "16px 0 0",
                  fontSize: 13,
                  color: "#E06C5F",
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E06C5F" strokeWidth="1.5" aria-hidden>
                  <path d="M12 3l10 18H2z" />
                  <path d="M12 10v5M12 18v.5" />
                </svg>
                {soldOutCount} sold-out {soldOutCount === 1 ? "piece" : "pieces"} left out of your total
              </p>
            )}

            {/* Undo removed */}
            {removed && (
              <div
                role="status"
                style={{
                  marginTop: 16,
                  background: "#1C1C1F",
                  padding: "10px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <span style={{ fontSize: 13, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  Removed {displayName(removed.line.name, removed.line.storeName)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onRestore(removed.line, removed.index);
                    setRemoved(null);
                  }}
                  style={{
                    background: "none",
                    border: 0,
                    color: "#C8A96A",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    flexShrink: 0,
                    fontFamily: "inherit",
                  }}
                >
                  Undo
                </button>
              </div>
            )}

            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 12, color: "#9C978E" }}>From</span>
              <span style={{ fontSize: 14 }}>Your Looks</span>
            </div>
          </section>

          {/* Right: cart */}
          <section
            style={{
              flex: 1,
              overflow: "hidden",
              padding: "32px 64px 36px 56px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            <h1
              style={{
                margin: 0,
                fontFamily: "var(--font-dm-serif), serif",
                fontWeight: 400,
                fontSize: 36,
                lineHeight: 1,
                textTransform: "uppercase" as const,
                letterSpacing: "0.02em",
              }}
            >
              Your Cart
            </h1>

            {lines.length === 0 && (
              <p style={{ fontSize: 15, color: "#9C978E", marginTop: -20 }}>
                Your cart is empty. Add a whole look or single pieces while you browse.
              </p>
            )}

            {stores.map((group) => {
              const missing = group.missingSizes;
              return (
                <section
                  key={group.store}
                  style={{
                    borderLeft: "2px solid #C8A96A",
                    paddingLeft: 28,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}
                  >
                    <h2
                      style={{
                        margin: 0,
                        fontFamily: "var(--font-dm-serif), serif",
                        fontWeight: 400,
                        fontSize: 28,
                      }}
                    >
                      {group.store}
                    </h2>
                    <span style={{ fontSize: 13, color: "#9C978E" }}>
                      {group.lines.length} {group.lines.length === 1 ? "piece" : "pieces"}
                    </span>
                  </div>

                  <ul
                    style={{
                      listStyle: "none",
                      margin: "14px 0 0",
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {group.lines.map((line) => {
                      const soldOut = isSoldOut(line);
                      const oneSize = isOneSize(line.sizes);
                      return (
                        <li
                          key={line.id}
                          style={{
                            display: "flex",
                            gap: 18,
                            alignItems: "center",
                            padding: "14px 0",
                            borderTop: "1px solid #2A2A2E",
                          }}
                        >
                          {/* Thumb */}
                          <div
                            style={{
                              width: 64,
                              height: 64,
                              flexShrink: 0,
                              background: "#1C1C1F",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              opacity: soldOut ? 0.45 : 1,
                            }}
                          >
                            <ProductImage src={line.image} sizes="64px" className="h-full w-full object-contain" />
                          </div>

                          {/* Name + size */}
                          <div
                            style={{
                              flex: 1,
                              minWidth: 0,
                              display: "flex",
                              flexDirection: "column",
                              gap: 8,
                            }}
                          >
                            <span
                              style={{ fontSize: 15, color: soldOut ? "#9C978E" : "#ECEBE8" }}
                            >
                              {displayName(line.name, line.storeName)}
                            </span>
                            {soldOut ? (
                              <span style={{ fontSize: 13, color: "#E06C5F" }}>
                                Sold out in your size · Not in your total
                              </span>
                            ) : (
                              !oneSize && (
                                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                                  {line.sizes
                                    .slice(0, 6)
                                    .map((v) => {
                                      const sel = v.variantId === line.variantId;
                                      return (
                                        <button
                                          key={v.variantId}
                                          type="button"
                                          aria-pressed={sel}
                                          onClick={() => onSize(line.id, v.variantId)}
                                          style={{
                                            height: 28,
                                            minWidth: 36,
                                            padding: "0 8px",
                                            border: 0,
                                            fontSize: 12,
                                            cursor: "pointer",
                                            fontFamily: "inherit",
                                            background: sel ? "#ECEBE8" : "#1C1C1F",
                                            color: sel ? "#0A0A0B" : "#9C978E",
                                            fontWeight: sel ? 600 : 400,
                                          }}
                                        >
                                          {v.size}
                                        </button>
                                      );
                                    })}
                                </div>
                              )
                            )}
                          </div>

                          {/* Qty */}
                          {!soldOut && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                background: "#141416",
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => onQty(line.id, Math.max(1, line.qty - 1))}
                                aria-label="Decrease quantity"
                                style={{
                                  width: 36,
                                  height: 36,
                                  border: 0,
                                  background: "none",
                                  color: "#ECEBE8",
                                  fontSize: 16,
                                  cursor: "pointer",
                                  fontFamily: "inherit",
                                }}
                              >
                                −
                              </button>
                              <span
                                style={{
                                  width: 28,
                                  textAlign: "center",
                                  fontSize: 14,
                                  fontVariantNumeric: "tabular-nums",
                                }}
                              >
                                {line.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => onQty(line.id, Math.min(MAX_QTY, line.qty + 1))}
                                aria-label="Increase quantity"
                                style={{
                                  width: 36,
                                  height: 36,
                                  border: 0,
                                  background: "none",
                                  color: "#ECEBE8",
                                  fontSize: 16,
                                  cursor: "pointer",
                                  fontFamily: "inherit",
                                }}
                              >
                                +
                              </button>
                            </div>
                          )}

                          {/* Price + remove */}
                          <div
                            style={{
                              width: 96,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-end",
                              gap: 6,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 15,
                                color: soldOut ? "#9C978E" : "#ECEBE8",
                                textDecoration: soldOut ? "line-through" : "none",
                                fontVariantNumeric: "tabular-nums",
                              }}
                            >
                              {sgd(line.price * (soldOut ? 1 : line.qty))}
                            </span>
                            <button
                              type="button"
                              onClick={() => remove(line.id)}
                              style={{
                                background: "none",
                                border: 0,
                                padding: 0,
                                fontSize: 12,
                                cursor: "pointer",
                                color: "#9C978E",
                                textDecoration: "underline",
                                textUnderlineOffset: 4,
                                fontFamily: "inherit",
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Subtotal + checkout */}
                  <div
                    style={{
                      marginTop: 10,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 24,
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontSize: 12, color: "#9C978E" }}>Subtotal</span>
                      <span
                        style={{
                          fontFamily: "var(--font-dm-serif), serif",
                          fontSize: 24,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {sgd(group.subtotal)}
                      </span>
                    </div>
                    {group.checkoutUrl ? (
                      <a
                        href={group.checkoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          height: 48,
                          padding: "0 24px",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          background: "#C8A96A",
                          color: "#0A0A0B",
                          textDecoration: "none",
                          fontSize: 14,
                          fontWeight: 600,
                          fontFamily: "inherit",
                        }}
                      >
                        Check Out at {group.store} ↗
                      </a>
                    ) : (
                      <span style={{ fontSize: 13, color: "#9C978E" }}>
                        Pick a size for each piece first
                      </span>
                    )}
                  </div>
                </section>
              );
            })}
          </section>
        </main>
      </div>
    );
  }

  // ── MOBILE layout ──
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: "#0A0A0B",
        color: "#ECEBE8",
        fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
      }}
    >
      {/* Mobile header */}
      <header
        style={{
          height: 64,
          flexShrink: 0,
          background: "#141416",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-dm-serif), serif",
            fontSize: 18,
            letterSpacing: "0.2em",
            color: "#ECEBE8",
            textDecoration: "none",
          }}
        >
          WINGMAN
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <WmDots current={5} />
        </div>
      </header>

      {/* Summary section */}
      <div
        style={{
          background: "#141416",
          padding: "28px 20px 24px",
          boxSizing: "border-box",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            color: "#9C978E",
            background: "none",
            border: 0,
            padding: 0,
            fontSize: 13,
            cursor: "pointer",
            textAlign: "left",
            fontFamily: "inherit",
          }}
        >
          ← {backLabel}
        </button>

        <span style={{ display: "block", marginTop: 20, fontSize: 12, letterSpacing: "0.02em", color: "#9C978E" }}>
          Your total
        </span>
        <span
          style={{
            display: "block",
            marginTop: 8,
            fontFamily: "var(--font-dm-serif), serif",
            fontSize: 48,
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {lines.length > 0 ? sgd(total) : "S$0"}
        </span>
        <span style={{ display: "block", marginTop: 12, fontSize: 14 }}>
          {count} {count === 1 ? "piece" : "pieces"} · {stores.length}{" "}
          {stores.length === 1 ? "store" : "stores"}
        </span>

        {/* Payment info box */}
        <div
          style={{
            marginTop: 20,
            background: "#1C1C1F",
            padding: "16px 18px",
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ECEBE8"
            strokeWidth="1.25"
            aria-hidden
            style={{ flexShrink: 0, marginTop: 2 }}
          >
            <path d="M3 9h18l-1.5 11h-15z" />
            <path d="M8 9V6a4 4 0 0 1 8 0v3" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>You Pay at Each Store Directly</span>
            <span style={{ fontSize: 13, lineHeight: 1.55, color: "#9C978E" }}>
              Each checkout opens the store&apos;s own site in a new tab. Wingman never takes payment.
            </span>
          </div>
        </div>

        {soldOutCount > 0 && (
          <p
            style={{
              margin: "12px 0 0",
              fontSize: 13,
              color: "#E06C5F",
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E06C5F" strokeWidth="1.5" aria-hidden>
              <path d="M12 3l10 18H2z" />
              <path d="M12 10v5M12 18v.5" />
            </svg>
            {soldOutCount} sold-out {soldOutCount === 1 ? "piece" : "pieces"} left out of your total
          </p>
        )}

        {removed && (
          <div
            role="status"
            style={{
              marginTop: 12,
              background: "#1C1C1F",
              padding: "10px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
            }}
          >
            <span style={{ fontSize: 13, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              Removed {displayName(removed.line.name, removed.line.storeName)}
            </span>
            <button
              type="button"
              onClick={() => {
                onRestore(removed.line, removed.index);
                setRemoved(null);
              }}
              style={{
                background: "none",
                border: 0,
                color: "#C8A96A",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                flexShrink: 0,
                fontFamily: "inherit",
              }}
            >
              Undo
            </button>
          </div>
        )}
      </div>

      {/* Cart items */}
      <div style={{ padding: "0 20px 32px", display: "flex", flexDirection: "column", gap: 24, flex: 1 }}>
        <h1
          style={{
            margin: "24px 0 0",
            fontFamily: "var(--font-dm-serif), serif",
            fontWeight: 400,
            fontSize: 28,
            lineHeight: 1,
            textTransform: "uppercase" as const,
            letterSpacing: "0.02em",
          }}
        >
          Your Cart
        </h1>

        {lines.length === 0 && (
          <p style={{ fontSize: 15, color: "#9C978E" }}>
            Your cart is empty. Add a whole look or single pieces while you browse.
          </p>
        )}

        {stores.map((group) => {
          return (
            <section
              key={group.store}
              style={{
                borderLeft: "2px solid #C8A96A",
                paddingLeft: 20,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h2
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-dm-serif), serif",
                    fontWeight: 400,
                    fontSize: 22,
                  }}
                >
                  {group.store}
                </h2>
                <span style={{ fontSize: 12, color: "#9C978E" }}>
                  {group.lines.length} {group.lines.length === 1 ? "piece" : "pieces"}
                </span>
              </div>

              <ul
                style={{
                  listStyle: "none",
                  margin: "12px 0 0",
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {group.lines.map((line) => {
                  const soldOut = isSoldOut(line);
                  const oneSize = isOneSize(line.sizes);
                  return (
                    <li
                      key={line.id}
                      style={{
                        display: "flex",
                        gap: 14,
                        alignItems: "flex-start",
                        padding: "14px 0",
                        borderTop: "1px solid #2A2A2E",
                      }}
                    >
                      {/* Thumb */}
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          flexShrink: 0,
                          background: "#1C1C1F",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: soldOut ? 0.45 : 1,
                        }}
                      >
                        <ProductImage src={line.image} sizes="56px" className="h-full w-full object-contain" />
                      </div>

                      {/* Name + size + controls */}
                      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                        <span style={{ fontSize: 14, color: soldOut ? "#9C978E" : "#ECEBE8" }}>
                          {displayName(line.name, line.storeName)}
                        </span>
                        {soldOut ? (
                          <span style={{ fontSize: 12, color: "#E06C5F" }}>
                            Sold out in your size · Not in your total
                          </span>
                        ) : (
                          !oneSize && (
                            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                              {line.sizes.slice(0, 6).map((v) => {
                                const sel = v.variantId === line.variantId;
                                return (
                                  <button
                                    key={v.variantId}
                                    type="button"
                                    aria-pressed={sel}
                                    onClick={() => onSize(line.id, v.variantId)}
                                    style={{
                                      height: 28,
                                      minWidth: 32,
                                      padding: "0 6px",
                                      border: 0,
                                      fontSize: 11,
                                      cursor: "pointer",
                                      fontFamily: "inherit",
                                      background: sel ? "#ECEBE8" : "#1C1C1F",
                                      color: sel ? "#0A0A0B" : "#9C978E",
                                      fontWeight: sel ? 600 : 400,
                                    }}
                                  >
                                    {v.size}
                                  </button>
                                );
                              })}
                            </div>
                          )
                        )}

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          {!soldOut && (
                            <div style={{ display: "flex", alignItems: "center", background: "#141416" }}>
                              <button
                                type="button"
                                onClick={() => onQty(line.id, Math.max(1, line.qty - 1))}
                                aria-label="Decrease quantity"
                                style={{ width: 32, height: 32, border: 0, background: "none", color: "#ECEBE8", fontSize: 16, cursor: "pointer", fontFamily: "inherit" }}
                              >
                                −
                              </button>
                              <span style={{ width: 24, textAlign: "center", fontSize: 13, fontVariantNumeric: "tabular-nums" }}>
                                {line.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => onQty(line.id, Math.min(MAX_QTY, line.qty + 1))}
                                aria-label="Increase quantity"
                                style={{ width: 32, height: 32, border: 0, background: "none", color: "#ECEBE8", fontSize: 16, cursor: "pointer", fontFamily: "inherit" }}
                              >
                                +
                              </button>
                            </div>
                          )}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                            <span
                              style={{
                                fontSize: 14,
                                color: soldOut ? "#9C978E" : "#ECEBE8",
                                textDecoration: soldOut ? "line-through" : "none",
                                fontVariantNumeric: "tabular-nums",
                              }}
                            >
                              {sgd(line.price * (soldOut ? 1 : line.qty))}
                            </span>
                            <button
                              type="button"
                              onClick={() => remove(line.id)}
                              style={{
                                background: "none",
                                border: 0,
                                padding: 0,
                                fontSize: 12,
                                cursor: "pointer",
                                color: "#9C978E",
                                textDecoration: "underline",
                                textUnderlineOffset: 4,
                                fontFamily: "inherit",
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Subtotal + checkout */}
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 12, color: "#9C978E" }}>Subtotal</span>
                  <span style={{ fontFamily: "var(--font-dm-serif), serif", fontSize: 20, fontVariantNumeric: "tabular-nums" }}>
                    {sgd(group.subtotal)}
                  </span>
                </div>
                {group.checkoutUrl ? (
                  <a
                    href={group.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      height: 44,
                      padding: "0 20px",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      background: "#C8A96A",
                      color: "#0A0A0B",
                      textDecoration: "none",
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: "inherit",
                    }}
                  >
                    Check Out at {group.store} ↗
                  </a>
                ) : (
                  <span style={{ fontSize: 13, color: "#9C978E" }}>
                    Pick a size for each piece first
                  </span>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
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
