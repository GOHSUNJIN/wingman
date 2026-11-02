"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PrepPlan } from "@/lib/agent/schemas";

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

/** The three-step grooming routine for the night before, from skin analysis when it worked. */
export function PrepStep({
  plan,
  skinAnalysed,
  setting,
  onBack,
  backLabel = "Back to your looks",
}: {
  plan: PrepPlan | null;
  skinAnalysed: boolean;
  setting?: string;
  onBack: () => void;
  backLabel?: string;
}) {
  const wide = useWide();

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
            <WmDots current={4} />
            <span style={{ fontSize: 12, letterSpacing: "0.02em", color: "#9C978E" }}>04 · Your prep plan</span>
          </div>
        </header>

        {/* ── Main ── */}
        <main style={{ flex: 1, display: "flex", minHeight: 0 }}>
          {/* Left: photo panel with face bracket */}
          <section
            style={{
              width: 628,
              flexShrink: 0,
              position: "relative",
              overflow: "hidden",
              background: "#141416",
            }}
          >
            <PersonWithNavySvg />

            {/* Face bracket */}
            <div
              aria-hidden="true"
              style={{ position: "absolute", left: 204, top: 112, width: 220, height: 272 }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 22,
                  height: 22,
                  borderLeft: "1px solid #ECEBE8",
                  borderTop: "1px solid #ECEBE8",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  width: 22,
                  height: 22,
                  borderRight: "1px solid #ECEBE8",
                  borderTop: "1px solid #ECEBE8",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  width: 22,
                  height: 22,
                  borderLeft: "1px solid #ECEBE8",
                  borderBottom: "1px solid #ECEBE8",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  width: 22,
                  height: 22,
                  borderRight: "1px solid #ECEBE8",
                  borderBottom: "1px solid #ECEBE8",
                }}
              />
              <span style={{ position: "absolute", left: 0, top: 284, fontSize: 12, color: "#ECEBE8" }}>
                Grooming focus
              </span>
            </div>

            {/* Bottom gradient + label */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: 200,
                background: "linear-gradient(to top, rgba(10,10,11,0.85), rgba(10,10,11,0))",
              }}
            />
            <div
              style={{ position: "absolute", left: 40, bottom: 34, display: "flex", flexDirection: "column", gap: 6 }}
            >
              <span style={{ fontSize: 12, color: "#9C978E" }}>Prepping for</span>
              <span style={{ fontFamily: "var(--font-dm-serif), serif", fontSize: 24 }}>
                {setting ? `${setting} · ` : ""}Wedding Guest · Saturday, 7pm
              </span>
            </div>
          </section>

          {/* Right: prep plan */}
          <section
            style={{
              flex: 1,
              minWidth: 0,
              padding: "36px 72px 32px 64px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <span style={{ fontSize: 12, letterSpacing: "0.02em", color: "#9C978E" }}>Friday evening</span>
            <h1
              style={{
                margin: "12px 0 0",
                fontFamily: "var(--font-dm-serif), serif",
                fontWeight: 400,
                fontSize: 52,
                lineHeight: 1,
                textTransform: "uppercase" as const,
                letterSpacing: "0.02em",
              }}
            >
              The Night Before
            </h1>
            <p style={{ margin: "14px 0 0", fontSize: 14, lineHeight: 1.55, color: "#9C978E", maxWidth: 460 }}>
              {plan
                ? `Three things tonight so tomorrow you only have to get dressed.`
                : "Your plan is still being written. It arrives a few seconds after your looks."}
            </p>

            {plan && (
              <ol style={{ listStyle: "none", margin: "24px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {plan.steps.map((step, i) => (
                  <li
                    key={step.title}
                    style={{
                      background: "#141416",
                      padding: "16px 20px",
                      display: "flex",
                      gap: 18,
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        width: 30,
                        height: 30,
                        flexShrink: 0,
                        borderRadius: "50%",
                        background: "#C8A96A",
                        color: "#0A0A0B",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-dm-serif), serif",
                        fontSize: 16,
                      }}
                      aria-hidden
                    >
                      {i + 1}
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 600 }}>{step.title}</span>
                      <span style={{ fontSize: 13, lineHeight: 1.55, color: "#9C978E" }}>{step.detail}</span>
                    </div>
                  </li>
                ))}
              </ol>
            )}

            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 20 }}>
              {plan && (
                <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: "#9C978E" }}>
                  {skinAnalysed
                    ? "Tailored to a skin reading from your photo. "
                    : "We couldn't read your skin from this photo (an angle or glasses can do that), so these are general tips. "}
                  Grooming tips only, not medical advice.
                </p>
              )}
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
            </div>
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
          <WmDots current={4} />
        </div>
      </header>

      {/* Content */}
      <div style={{ padding: "0 20px 40px", display: "flex", flexDirection: "column", flex: 1 }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            marginTop: 24,
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

        <span style={{ marginTop: 20, fontSize: 12, letterSpacing: "0.02em", color: "#9C978E" }}>Friday evening</span>
        <h1
          style={{
            margin: "8px 0 0",
            fontFamily: "var(--font-dm-serif), serif",
            fontWeight: 400,
            fontSize: 40,
            lineHeight: 1,
            textTransform: "uppercase" as const,
            letterSpacing: "0.02em",
          }}
        >
          The Night Before
        </h1>
        <p style={{ margin: "12px 0 0", fontSize: 14, lineHeight: 1.55, color: "#9C978E" }}>
          {plan
            ? "Three things tonight so tomorrow you only have to get dressed."
            : "Your plan is still being written. It arrives a few seconds after your looks."}
        </p>

        {plan && (
          <ol style={{ listStyle: "none", margin: "20px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {plan.steps.map((step, i) => (
              <li
                key={step.title}
                style={{
                  background: "#141416",
                  padding: "16px 20px",
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    flexShrink: 0,
                    borderRadius: "50%",
                    background: "#C8A96A",
                    color: "#0A0A0B",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-dm-serif), serif",
                    fontSize: 15,
                  }}
                  aria-hidden
                >
                  {i + 1}
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{step.title}</span>
                  <span style={{ fontSize: 13, lineHeight: 1.55, color: "#9C978E" }}>{step.detail}</span>
                </div>
              </li>
            ))}
          </ol>
        )}

        <div style={{ marginTop: "auto", paddingTop: 28, display: "flex", flexDirection: "column", gap: 16 }}>
          {plan && (
            <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: "#9C978E" }}>
              {skinAnalysed
                ? "Tailored to a skin reading from your photo. "
                : "We couldn't read your skin from this photo (an angle or glasses can do that), so these are general tips. "}
              Grooming tips only, not medical advice.
            </p>
          )}
        </div>
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

function PersonWithNavySvg() {
  return (
    <svg
      viewBox="0 0 600 900"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      aria-hidden
    >
      <rect width="600" height="900" fill="#2A2622" />
      <path
        d="M40 900 L58 640 Q70 520 160 486 L246 452 L300 486 L354 452 L440 486 Q530 520 542 640 L560 900 Z"
        fill="#1A1E2B"
      />
      <path d="M246 452 L300 486 L354 452 L336 600 L300 660 L264 600 Z" fill="#E4E0D8" />
      <path d="M262 360 L338 360 L346 470 L300 490 L254 470 Z" fill="#3E342D" />
      <path d="M246 452 L216 470 L250 560 L300 760 L272 600 Z" fill="#222738" />
      <path d="M354 452 L384 470 L350 560 L300 760 L328 600 Z" fill="#222738" />
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
