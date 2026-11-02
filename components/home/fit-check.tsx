"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SUB_SCORES = [
  { label: "Occasion", value: 9.0 },
  { label: "Colour on you", value: 8.5 },
  { label: "Budget", value: 7.8 },
] as const;

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
    title: "Open Collar Shirt",
    body: "White underneath reads crisp without the tie's formality, and keeps the look from going too dark.",
  },
] as const;

const CIRC = 2 * Math.PI * 33; // approx 207.3, circumference for r=33

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
      <span style={{ fontSize: "13px", color: "#9C978E" }}>{label}</span>
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
            <h2
              id="fit-heading"
              style={{
                margin: 0,
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
              <Image
                src="/home/fit-check-render.jpg"
                alt="Navy blazer try-on render with fit annotations"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                style={{ objectFit: "cover", objectPosition: "50% 8%", transform: "scale(1.2)", transformOrigin: "50% 15%" }}
                unoptimized
              />

              {/* Numbered pins */}
              {[
                { left: "25%", top: "60%" },
                { left: "76%", top: "50%" },
                { left: "50%", top: "40%" },
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
                <span style={{ fontSize: "14px", color: "#9C978E" }}>Wedding guest · Overall</span>
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
