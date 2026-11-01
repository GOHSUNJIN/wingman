"use client";

import Image from "next/image";
import Link from "next/link";
import { useId } from "react";
import { RAW_IMG_PROPS } from "@/components/style/flow-shell";
import type { Photo } from "@/components/style/style-flow";
import type { Occasion, Tier } from "@/lib/catalog/types";
import { OCCASION_CHOICES, TIER_LABELS } from "@/lib/occasions";

const TIER_RANGES: Record<Tier, string> = { budget: "S$150–350", mid: "S$350–800", luxury: "S$800+" };
const TIER_NOTES: Record<Tier, string> = {
  budget: "High-street staples",
  mid: "Considered labels",
  luxury: "Investment pieces",
};

export function OccasionStep(props: {
  photo: Photo | null;
  occasionId: Occasion;
  sentence: string;
  tier: Tier;
  onOccasion: (id: Occasion) => void;
  onSentence: (s: string) => void;
  onTier: (t: Tier) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const textId = useId();
  const ready = props.sentence.trim().length >= 3;

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
          <WmDots current={2} />
          <span style={{ fontSize: 12, letterSpacing: "0.02em", color: "#9C978E" }}>02 · The occasion</span>
        </div>
      </header>

      {/* ── Main ── */}
      <main style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* Left: photo panel */}
        <section
          style={{
            width: 628,
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
            background: "#141416",
          }}
        >
          {props.photo ? (
            <Image
              src={props.photo.url}
              alt="Your photo"
              fill
              sizes="628px"
              style={{ objectFit: "cover", objectPosition: "50% 20%" }}
              {...RAW_IMG_PROPS}
            />
          ) : (
            <PersonSvg />
          )}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 260,
              background: "linear-gradient(to top, rgba(10,10,11,0.9), rgba(10,10,11,0))",
            }}
          />
          <div
            style={{ position: "absolute", left: 40, bottom: 36, display: "flex", flexDirection: "column", gap: 6 }}
          >
            <span style={{ fontSize: 12, letterSpacing: "0.02em", color: "#9C978E" }}>Styling for</span>
            <span style={{ fontFamily: "var(--font-dm-serif), serif", fontSize: 28 }}>You, on the Day</span>
          </div>
        </section>

        {/* Right: form */}
        <section
          style={{
            flex: 1,
            minWidth: 0,
            padding: "44px 96px 40px 88px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          <button
            type="button"
            onClick={props.onBack}
            style={{
              color: "#9C978E",
              background: "none",
              border: 0,
              padding: 0,
              fontSize: 13,
              cursor: "pointer",
              textAlign: "left",
              alignSelf: "flex-start",
              fontFamily: "inherit",
            }}
          >
            ← Your Photo
          </button>
          <h1
            style={{
              margin: "20px 0 0",
              fontFamily: "var(--font-dm-serif), serif",
              fontWeight: 400,
              fontSize: 60,
              lineHeight: 1,
            }}
          >
            The Occasion
          </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (ready) props.onSubmit();
            }}
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            {/* Occasion chips */}
            <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 14 }}>
              <span style={{ fontSize: 12, letterSpacing: "0.02em", color: "#9C978E" }}>What&apos;s on</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {OCCASION_CHOICES.map((o) => {
                  const on = props.occasionId === o.id;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => props.onOccasion(o.id)}
                      style={{
                        height: 44,
                        padding: "0 20px",
                        border: 0,
                        fontSize: 14,
                        cursor: "pointer",
                        background: on ? "#ECEBE8" : "#1C1C1F",
                        color: on ? "#0A0A0B" : "#ECEBE8",
                        fontWeight: on ? 600 : 400,
                        fontFamily: "inherit",
                      }}
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Free-text */}
            <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 14 }}>
              <label
                htmlFor={textId}
                style={{ fontSize: 12, letterSpacing: "0.02em", color: "#9C978E" }}
              >
                Describe the event
              </label>
              <textarea
                id={textId}
                value={props.sentence}
                onChange={(e) => props.onSentence(e.target.value)}
                rows={4}
                maxLength={300}
                placeholder="Where, when, and anything you want or want to avoid"
                style={{
                  height: 132,
                  resize: "none",
                  background: "#141416",
                  color: "#ECEBE8",
                  border: 0,
                  padding: "18px 20px",
                  fontSize: 16,
                  lineHeight: 1.6,
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* Budget tiers */}
            <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 14 }}>
              <span style={{ fontSize: 12, letterSpacing: "0.02em", color: "#9C978E" }}>
                Budget for the whole look
              </span>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 12,
                }}
              >
                {(["budget", "mid", "luxury"] as const).map((t) => {
                  const on = props.tier === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={on}
                      onClick={() => props.onTier(t)}
                      style={{
                        textAlign: "left",
                        padding: 20,
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        cursor: "pointer",
                        color: "#ECEBE8",
                        boxSizing: "border-box",
                        background: on ? "#1C1C1F" : "#141416",
                        border: `1px solid ${on ? "#ECEBE8" : "transparent"}`,
                        fontFamily: "inherit",
                      }}
                    >
                      <span style={{ fontSize: 15, fontWeight: 600 }}>{TIER_LABELS[t]}</span>
                      <span style={{ fontFamily: "var(--font-dm-serif), serif", fontSize: 26 }}>
                        {TIER_RANGES[t]}
                      </span>
                      <span style={{ fontSize: 13, color: "#9C978E" }}>{TIER_NOTES[t]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={!ready}
              style={{
                marginTop: "auto",
                height: 56,
                background: "#C8A96A",
                color: "#0A0A0B",
                border: 0,
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "0.04em",
                cursor: ready ? "pointer" : "not-allowed",
                opacity: ready ? 1 : 0.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "inherit",
              }}
            >
              Style Me →
            </button>
          </form>
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

function PersonSvg() {
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
        fill="#33302C"
      />
      <path d="M246 452 L300 486 L354 452 L336 600 L300 660 L264 600 Z" fill="#CFCAC1" />
      <path d="M262 360 L338 360 L346 470 L300 490 L254 470 Z" fill="#3E342D" />
      <ellipse cx="222" cy="300" rx="12" ry="24" fill="#3E342D" />
      <ellipse cx="378" cy="300" rx="12" ry="24" fill="#3E342D" />
      <ellipse cx="300" cy="288" rx="80" ry="100" fill="#46392F" />
      <path
        d="M218 270 Q214 180 300 176 Q388 178 384 268 Q372 222 300 218 Q236 220 218 270 Z"
        fill="#16130F"
      />
      <path d="M160 486 Q90 512 66 620" stroke="#4A4540" strokeWidth="3" fill="none" />
    </svg>
  );
}
