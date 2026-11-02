"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { RAW_IMG_PROPS } from "@/components/style/flow-shell";
import { ProductImage } from "@/components/style/product-image";
import { showsInRender, type Look, type LookItem } from "@/lib/agent/events";
import { displayName } from "@/lib/catalog/names";
import { sgd } from "@/lib/utils/format";

export type SwapOptionsState = { status: "loading" | "done" | "error"; options: LookItem[]; error?: string };

const SLOT_NAMES: Record<LookItem["slot"], string> = {
  top: "top",
  outerwear: "layer",
};

function priceDiff(next: number, current: number) {
  const d = Math.round(next - current);
  if (d === 0) return "Same price";
  return d > 0 ? `S$${d} more` : `S$${-d} less`;
}

export function SwapStep({
  look,
  slot,
  cheaper = false,
  state,
  onPick,
  onBack,
  onRetry,
}: {
  look: Look;
  slot: LookItem["slot"];
  cheaper?: boolean;
  state: SwapOptionsState;
  onPick: (option: LookItem) => void;
  onBack: () => void;
  onRetry: () => void;
}) {
  const current = look.items.find((i) => i.slot === slot)!;
  const name = SLOT_NAMES[slot];
  const [picked, setPicked] = useState<string | null>(null);
  const showsInTryOn = showsInRender(look, slot);
  const rendering = !!picked && showsInTryOn;

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
          <span style={{ fontSize: 12, letterSpacing: "0.02em", color: "#9C978E" }}>04 · Swap a piece</span>
        </div>
      </header>

      {/* ── Main ── */}
      <main style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* Left: look render */}
        <section
          style={{
            width: 628,
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
            background: "#141416",
          }}
        >
          {look.renders.outfit ? (
            <Image
              src={look.renders.outfit}
              alt={`You in ${look.name}`}
              fill
              sizes="628px"
              style={{ objectFit: "contain" }}
              {...RAW_IMG_PROPS}
            />
          ) : (
            <LookSvg />
          )}

          {/* Look label */}
          <div
            style={{ position: "absolute", top: 32, left: 36, display: "flex", flexDirection: "column", gap: 6 }}
          >
            <span style={{ fontSize: 12, color: "#9C978E" }}>Look 1</span>
            <span style={{ fontFamily: "var(--font-dm-serif), serif", fontSize: 22 }}>{look.name}</span>
          </div>

          {/* Rendering overlay */}
          {rendering && (
            <>
              <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,11,0.2)" }} />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: 120,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  animation: "wmScan 3.2s cubic-bezier(0.45, 0, 0.55, 1) infinite",
                }}
              >
                <div style={{ flex: 1, background: "rgba(200,169,106,0.07)" }} />
                <div style={{ height: 2, background: "#C8A96A" }} />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 140,
                  background: "linear-gradient(to top, rgba(10,10,11,0.9), rgba(10,10,11,0))",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 36,
                  right: 36,
                  bottom: 30,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#C8A96A",
                    animation: "wmPulse 1.6s ease-in-out infinite",
                  }}
                />
                <span style={{ fontSize: 13 }}>Trying on the {picked?.toLowerCase()}</span>
              </div>
            </>
          )}
        </section>

        {/* Right: swap options */}
        <section
          style={{
            flex: 1,
            minWidth: 0,
            padding: "32px 64px 32px 56px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
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
            ← {look.name}
          </button>
          <h1
            style={{
              margin: "14px 0 0",
              fontFamily: "var(--font-dm-serif), serif",
              fontWeight: 400,
              fontSize: 44,
              lineHeight: 1,
              textTransform: "uppercase" as const,
              letterSpacing: "0.02em",
            }}
          >
            {cheaper ? `Cheaper ${name}` : `Swapping the ${name.charAt(0).toUpperCase() + name.slice(1)}`}
          </h1>

          {/* Scrollable area: current piece + options */}
          <div
            className="no-scrollbar"
            style={{ flex: 1, overflowY: "auto", minHeight: 0, marginTop: 22 }}
          >
            {/* Current piece */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
              <p style={{ margin: 0, fontSize: 14, color: "#9C978E" }}>
                Currently:{" "}
                <span style={{ color: "#ECEBE8" }}>
                  {displayName(current.name, current.storeName)}
                </span>{" "}
                · {current.storeName} · {sgd(current.price)}
              </p>
            </div>

            {/* Options grid */}
            {state.status === "loading" && (
              <p style={{ marginTop: 28, color: "#9C978E", fontSize: 14 }}>
                Finding {cheaper ? "cheaper " : ""}options…
              </p>
            )}
            {state.status === "error" && (
              <div style={{ marginTop: 28 }}>
                <p style={{ color: "#E06C5F", fontSize: 14 }}>{state.error}</p>
                <button
                  type="button"
                  onClick={onRetry}
                  style={{
                    marginTop: 8,
                    background: "none",
                    border: 0,
                    color: "#ECEBE8",
                    fontSize: 14,
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Try Again
                </button>
              </div>
            )}
            {state.status === "done" && state.options.length === 0 && (
              <p style={{ marginTop: 28, color: "#9C978E", fontSize: 14 }}>
                {cheaper
                  ? `Nothing cheaper in stock goes with this look right now.`
                  : "Nothing else in stock fits this look and budget right now."}
              </p>
            )}
            {state.options.length > 0 && (
              <div
                style={{
                  marginTop: 22,
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: "24px 16px",
                  paddingBottom: 24,
                }}
              >
                {state.options.map((option) => {
                  const on = picked === option.id;
                  const diff = Math.round(option.price - current.price);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => {
                        setPicked(option.id);
                        onPick(option);
                      }}
                      style={{
                        background: "none",
                        border: 0,
                        padding: 0,
                        textAlign: "left",
                        color: "#ECEBE8",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        fontFamily: "inherit",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          height: 170,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: on ? "#26262A" : "#141416",
                          outline: on ? "1px solid #ECEBE8" : "none",
                          outlineOffset: -1,
                        }}
                      >
                        <ProductImage src={option.image} sizes="160px" className="h-full w-full object-contain" />
                        {on && (
                          <span
                            style={{
                              position: "absolute",
                              top: 10,
                              left: 10,
                              fontSize: 11,
                              fontWeight: 600,
                              background: "#ECEBE8",
                              color: "#0A0A0B",
                              padding: "4px 8px",
                            }}
                          >
                            Trying on
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <span style={{ fontSize: 14 }}>{displayName(option.name, option.storeName)}</span>
                        <span
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 13,
                            color: "#9C978E",
                          }}
                        >
                          <span>{option.storeName}</span>
                          <span style={{ color: "#ECEBE8" }}>{sgd(option.price)}</span>
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: diff < 0 ? "#5FB58A" : "#9C978E",
                          }}
                        >
                          {priceDiff(option.price, current.price)} vs current
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onBack}
            style={{
              marginTop: "auto",
              height: 52,
              background: "#C8A96A",
              color: "#0A0A0B",
              border: 0,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Keep This Swap
          </button>
        </section>
      </main>
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

function LookSvg() {
  return (
    <svg
      viewBox="0 0 600 900"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      aria-hidden
    >
      <rect width="600" height="900" fill="#26231F" />
      <path
        d="M40 900 L58 640 Q70 520 160 486 L246 452 L300 486 L354 452 L440 486 Q530 520 542 640 L560 900 Z"
        fill="#1A1E2B"
      />
      <path d="M246 452 L300 486 L354 452 L336 600 L300 660 L264 600 Z" fill="#E4E0D8" />
      <path d="M292 496 L308 496 L314 520 L318 690 L300 716 L282 690 L286 520 Z" fill="#4A3526" />
      <path d="M246 452 L216 470 L250 560 L230 580 L300 760 L272 600 Z" fill="#222738" />
      <path d="M354 452 L384 470 L350 560 L370 580 L300 760 L328 600 Z" fill="#222738" />
      <path d="M262 360 L338 360 L346 470 L300 490 L254 470 Z" fill="#3E342D" />
      <ellipse cx="222" cy="300" rx="12" ry="24" fill="#3E342D" />
      <ellipse cx="378" cy="300" rx="12" ry="24" fill="#3E342D" />
      <ellipse cx="300" cy="288" rx="80" ry="100" fill="#46392F" />
      <path
        d="M218 270 Q214 180 300 176 Q388 178 384 268 Q372 222 300 218 Q236 220 218 270 Z"
        fill="#16130F"
      />
    </svg>
  );
}
