"use client";

import { useEffect, useRef, useState } from "react";

const SUB_SCORES = [
  { label: "Occasion", value: 9.0 },
  { label: "Colour on you", value: 8.5 },
  { label: "Budget", value: 7.8 },
] as const;
// TODO: sub-scores come from the AI fit check response (lib/agent/steps.ts)

const NOTES = [
  {
    title: "Navy Hopsack Blazer",
    body: "Reads formal under warm ballroom light without matching the groom's black.",
  },
  {
    title: "Soft Shoulder",
    body: "Adds a little width up top and suits your frame better than a padded cut.",
  },
  {
    title: "Brown Tie and Loafers",
    body: "Keep it warm rather than corporate. Budget dips slightly for the loafers.",
  },
] as const;

const CIRC = 2 * Math.PI * 33; // ≈ 207.3 — circumference for r=33

function scoreColor(v: number) {
  if (v >= 8) return "#5FB58A";
  if (v >= 6) return "#ECEBE8";
  return "#E06C5F";
}

function RingGauge({ label, value, filled }: { label: string; value: number; filled: boolean }) {
  const dash = filled ? ((value / 10) * CIRC).toFixed(1) : "0";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      <div style={{ position: "relative", width: "76px", height: "76px" }}>
        <svg
          width="76"
          height="76"
          viewBox="0 0 76 76"
          aria-hidden="true"
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle cx="38" cy="38" r="33" fill="none" stroke="#2A2A2E" strokeWidth="4" />
          <circle
            cx="38"
            cy="38"
            r="33"
            fill="none"
            stroke={scoreColor(value)}
            strokeWidth="4"
            strokeDasharray={`${dash} ${CIRC.toFixed(1)}`}
            style={{ transition: filled ? "stroke-dasharray 1.6s cubic-bezier(0.22, 1, 0.36, 1)" : "none" }}
          />
        </svg>
        <span
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "17px",
            fontWeight: 600,
          }}
        >
          {value.toFixed(1)}
        </span>
      </div>
      <span style={{ fontSize: "12px", color: "#9C978E" }}>{label}</span>
    </div>
  );
}

export function FitCheck() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFilled(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="fit" aria-labelledby="fit-heading" style={{ background: "#141416" }}>
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "112px 24px",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "24px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "13px", color: "#9C978E" }}>Fit Check</span>
            <h2
              id="fit-heading"
              style={{
                margin: "16px 0 0",
                fontFamily: "var(--font-dm-serif), Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(40px, 5.4vw, 72px)",
                lineHeight: 1,
              }}
            >
              Every Look Comes{" "}
              <span style={{ fontStyle: "italic", color: "#C8A96A" }}>With a Verdict.</span>
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: "15px", lineHeight: 1.6, color: "#9C978E", maxWidth: "320px" }}>
            Scored for your occasion, then explained piece by piece, right on your photo.
          </p>
        </div>

        {/* Main panel */}
        <div
          style={{
            marginTop: "56px",
            display: "flex",
            flexWrap: "wrap",
            background: "#1C1C1F",
          }}
        >
          {/* Left: photo with pins */}
          <figure
            style={{
              flex: "1 1 380px",
              minWidth: 0,
              maxWidth: "520px",
              margin: 0,
              position: "relative",
            }}
          >
            <div style={{ position: "relative", aspectRatio: "3 / 4", overflow: "hidden" }}>
              {/* TODO: replace with real Ballroom Navy try-on render */}
              <svg
                viewBox="0 0 600 900"
                preserveAspectRatio="xMidYMid slice"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
                role="img"
                aria-label="Ballroom Navy try-on with 3 numbered notes (placeholder)"
              >
                <rect width="600" height="900" fill="#4A4238" />
                <path d="M40 900 L58 640 Q70 520 160 486 L246 452 L300 486 L354 452 L440 486 Q530 520 542 640 L560 900 Z" fill="#1A1E2B" />
                <path d="M150 600 L138 900" stroke="#0A0A0B" strokeOpacity="0.35" strokeWidth="5" />
                <path d="M450 600 L462 900" stroke="#0A0A0B" strokeOpacity="0.35" strokeWidth="5" />
                <path d="M246 452 L300 486 L354 452 L336 600 L300 660 L264 600 Z" fill="#E4E0D8" />
                <path d="M292 496 L308 496 L314 520 L318 690 L300 716 L282 690 L286 520 Z" fill="#6B4A32" />
                <path d="M246 452 L216 470 L250 560 L230 580 L300 760 L272 600 Z" fill="#222738" />
                <path d="M354 452 L384 470 L350 560 L370 580 L300 760 L328 600 Z" fill="#222738" />
                <path d="M392 604 L434 598 L432 612 L394 616 Z" fill="#E4E0D8" />
                <path d="M262 360 L338 360 L346 470 L300 490 L254 470 Z" fill="#3E342D" />
                <ellipse cx="222" cy="300" rx="12" ry="24" fill="#3E342D" />
                <ellipse cx="378" cy="300" rx="12" ry="24" fill="#3E342D" />
                <ellipse cx="300" cy="288" rx="80" ry="100" fill="#46392F" />
                <path d="M218 270 Q214 180 300 176 Q388 178 384 268 Q372 222 300 218 Q236 220 218 270 Z" fill="#16130F" />
                <path d="M160 486 Q90 512 66 620" stroke="#FFFFFF" strokeOpacity="0.14" strokeWidth="3" fill="none" />
              </svg>

              {/* Numbered pins */}
              {[
                { left: "25%", top: "68%" },
                { left: "76%", top: "56%" },
                { left: "50%", top: "70%" },
              ].map((pos, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: pos.left,
                    top: pos.top,
                    width: "30px",
                    height: "30px",
                    margin: "-15px 0 0 -15px",
                    borderRadius: "50%",
                    background: "#C8A96A",
                    color: "#0A0A0B",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  {i + 1}
                </span>
              ))}

              {/* Scrim */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: "120px",
                  background: "linear-gradient(to top, rgba(10,10,11,0.85), rgba(10,10,11,0))",
                }}
              />
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "24px",
                  bottom: "20px",
                  fontFamily: "var(--font-dm-serif), Georgia, serif",
                  fontSize: "22px",
                }}
              >
                Ballroom Navy
              </span>
            </div>
          </figure>

          {/* Right: score + gauges + quote + notes */}
          <div
            ref={panelRef}
            style={{
              flex: "1 1 420px",
              minWidth: 0,
              padding: "48px 48px 44px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Score row */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: "24px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "13px", color: "#9C978E" }}>Wedding guest · Overall</span>
                <span
                  style={{
                    fontFamily: "var(--font-dm-serif), Georgia, serif",
                    fontSize: "112px",
                    lineHeight: 0.85,
                    color: "#C8A96A",
                  }}
                >
                  8.4
                </span>
              </div>
              <div style={{ display: "flex", gap: "20px" }}>
                {SUB_SCORES.map((s) => (
                  <RingGauge key={s.label} label={s.label} value={s.value} filled={filled} />
                ))}
              </div>
            </div>

            {/* Quote */}
            <blockquote
              style={{
                margin: "36px 0 0",
                padding: 0,
                border: 0,
                fontFamily: "var(--font-dm-serif), Georgia, serif",
                fontStyle: "italic",
                fontSize: "clamp(22px, 2.4vw, 30px)",
                lineHeight: 1.3,
              }}
            >
              &ldquo;Sharp enough for the ballroom, quiet enough for the groom.&rdquo;
            </blockquote>

            {/* Notes */}
            <ol
              style={{
                listStyle: "none",
                margin: "32px 0 0",
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              {NOTES.map((note, i) => (
                <li
                  key={note.title}
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "flex-start",
                    background: "#141416",
                    padding: "16px 18px",
                  }}
                >
                  <span
                    style={{
                      width: "26px",
                      height: "26px",
                      flexShrink: 0,
                      borderRadius: "50%",
                      background: "#C8A96A",
                      color: "#0A0A0B",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    {i + 1}
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    <span style={{ fontSize: "15px", fontWeight: 600 }}>{note.title}</span>
                    <span style={{ fontSize: "14px", lineHeight: 1.55, color: "#9C978E" }}>{note.body}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
