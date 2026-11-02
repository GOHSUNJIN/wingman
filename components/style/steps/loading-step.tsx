"use client";

import Image from "next/image";
import Link from "next/link";
import { RAW_IMG_PROPS } from "@/components/style/flow-shell";
import type { Photo, Progress } from "@/components/style/style-flow";
import { STYLE_STEPS, type Look, type RenderKind, type StyleStep } from "@/lib/agent/events";
import type { ParsedOccasion } from "@/lib/agent/schemas";
import { expectedKinds, imageStatus } from "@/lib/agent/images";
import { cn } from "@/lib/utils/cn";

const STEP_LABELS: Record<StyleStep, string> = {
  reading: "Reading the occasion",
  picking: "Sourcing outfits",
  rendering: "Trying them on you",
  scoring: "Scoring the fit",
};

export function LoadingStep({
  photo,
  progress,
  refining,
  looks,
  settled,
  retrying,
  onRetry,
  onContinue,
  occasion,
}: {
  photo: Photo | null;
  progress: Progress;
  refining?: string | null;
  looks: Look[];
  settled: boolean;
  retrying: boolean;
  onRetry: () => void;
  onContinue: () => void;
  occasion?: ParsedOccasion | null;
}) {
  const current = STYLE_STEPS.indexOf(progress.step);
  const status = imageStatus(looks);
  const stuck = settled && !retrying && status.failed.length > 0;

  const headline = stuck
    ? "Almost Ready"
    : retrying
      ? "Trying Again"
      : refining
        ? "New Looks Coming"
        : current <= 1
          ? "Picking Your Looks"
          : "Trying Them On You";

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
          <WmDots current={3} />
          <span style={{ fontSize: 12, letterSpacing: "0.02em", color: "#9C978E" }}>03 · Styling</span>
        </div>
      </header>

      {/* ── Main ── */}
      <main style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* Left: photo with scan */}
        <section
          style={{
            width: 628,
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
            background: "#141416",
          }}
        >
          {photo ? (
            <Image
              src={photo.url}
              alt="Your photo being analysed"
              fill
              sizes="628px"
              style={{ objectFit: "cover", objectPosition: "50% 20%" }}
              {...RAW_IMG_PROPS}
            />
          ) : (
            <PersonSvg />
          )}
          <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,11,0.25)" }} />

          {/* Scan line */}
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
              animation: "wmScan 4.5s cubic-bezier(0.45, 0, 0.55, 1) infinite",
            }}
          >
            <div style={{ flex: 1, background: "rgba(200,169,106,0.07)" }} />
            <div style={{ height: 2, background: "#C8A96A" }} />
          </div>

          {/* Status dot + text */}
          <div
            style={{
              position: "absolute",
              left: 40,
              bottom: 36,
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
                display: "block",
                animation: "wmPulse 1.6s ease-in-out infinite",
              }}
            />
            <span style={{ fontSize: 12, letterSpacing: "0.02em", color: "#ECEBE8" }}>
              {stuck
                ? "Some try-ons need attention"
                : retrying
                  ? "Redoing failed try-ons"
                  : "Reading shoulders, build and skin tone"}
            </span>
          </div>
        </section>

        {/* Right: progress */}
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
          {occasion && (
            <span style={{ fontSize: 12, letterSpacing: "0.02em", color: "#9C978E" }}>
              {[occasion.occasion, occasion.setting, occasion.timeOfDay].filter(Boolean).join(" · ")}
            </span>
          )}

          <h1
            style={{
              margin: "10px 0 0",
              fontFamily: "var(--font-dm-serif), serif",
              fontWeight: 400,
              fontSize: 52,
              lineHeight: 1,
              textTransform: "uppercase" as const,
              letterSpacing: "0.02em",
              animation: "wmIn 0.6s cubic-bezier(0.2,0.7,0.2,1) both",
            }}
          >
            {headline}
          </h1>

          <p style={{ margin: "10px 0 0", fontSize: 14, color: "#9C978E" }}>
            {stuck
              ? status.outOfUnits
                ? "Try-ons are paused for now. Pieces and prices are all there."
                : `${status.failed.length === 1 ? "One try-on" : `${status.failed.length} try-ons`} didn't work.`
              : refining
                ? `Re-picking every look for "${refining}".`
                : "Usually takes about a minute. Keep this tab open."}
          </p>

          {stuck && (
            <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 12 }}>
              {!status.outOfUnits && (
                <button
                  type="button"
                  onClick={onRetry}
                  style={{
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
                  Try Again
                </button>
              )}
              <button
                type="button"
                onClick={onContinue}
                style={{
                  background: "none",
                  border: 0,
                  color: "#ECEBE8",
                  fontSize: 14,
                  textDecoration: "underline",
                  textUnderlineOffset: 4,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  alignSelf: "flex-start",
                }}
              >
                See My Looks
              </button>
            </div>
          )}

          {/* 3 look tiles */}
          {looks.length > 0 && (
            <div
              style={{
                marginTop: 20,
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 12,
              }}
            >
              {looks.map((look, li) =>
                expectedKinds(look).map((kind) => {
                  const url = look.renders[kind];
                  const failed = !url && look.renders.failed?.[kind];
                  const ready = !!url;
                  const rendering = !url && !failed;
                  const delay = `${(li * 0.6 + 0.3).toFixed(1)}s`;
                  return (
                    <figure
                      key={`${li}-${kind}`}
                      style={{
                        margin: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        animation: `wmReveal 1.2s cubic-bezier(0.2,0.7,0.2,1) ${delay} both`,
                      }}
                    >
                      <div
                        style={{
                          height: 180,
                          position: "relative",
                          overflow: "hidden",
                          background: ready ? "#1C1C1F" : rendering ? "#1C1C1F" : "#141416",
                        }}
                      >
                        {url ? (
                          <Image
                            src={url}
                            alt={`${look.name} try-on`}
                            fill
                            sizes="200px"
                            style={{ objectFit: "cover" }}
                            {...RAW_IMG_PROPS}
                          />
                        ) : rendering ? (
                          <>
                            <PersonSkeletonSvg opacity={0.55} />
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
                                animation: "wmScan 2.8s cubic-bezier(0.45, 0, 0.55, 1) infinite",
                              }}
                            >
                              <div style={{ flex: 1, background: "rgba(200,169,106,0.06)" }} />
                              <div style={{ height: 1, background: "#C8A96A" }} />
                            </div>
                          </>
                        ) : (
                          <PersonSkeletonSvg opacity={0.35} />
                        )}
                      </div>
                      <figcaption
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 13,
                        }}
                      >
                        <span style={{ color: failed ? "#9C978E" : "#ECEBE8" }}>
                          Look {li + 1} · {look.name}
                        </span>
                        <span
                          style={{
                            color: ready ? "#5FB58A" : rendering ? "#9C978E" : failed ? "#E06C5F" : "#9C978E",
                          }}
                        >
                          {ready ? "Ready" : rendering ? "Rendering" : failed ? "Failed" : "Queued"}
                        </span>
                      </figcaption>
                    </figure>
                  );
                })
              )}
            </div>
          )}

          {/* Pipeline + "What Wingman heard" */}
          <div
            style={{
              marginTop: 28,
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 40,
            }}
          >
            {/* Timeline */}
            <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column" }}>
              {STYLE_STEPS.map((step, i) => {
                const state = i < current ? "done" : i === current ? "active" : "pending";
                return (
                  <li key={step} style={{ display: "flex", gap: 16, height: 44 }}>
                    <div
                      style={{
                        width: 10,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: state !== "pending" ? "#C8A96A" : "#3A3A3F",
                          marginTop: 5,
                          flexShrink: 0,
                          animation: state === "active" ? "wmPulse 1.6s ease-in-out infinite" : "none",
                        }}
                      />
                      {i < STYLE_STEPS.length - 1 && (
                        <span
                          style={{
                            flex: 1,
                            width: 1,
                            background: state === "done" ? "#C8A96A" : "#3A3A3F",
                            marginTop: 4,
                          }}
                        />
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: 15,
                        color: state === "pending" ? "#9C978E" : "#ECEBE8",
                        fontWeight: state === "active" ? 600 : 400,
                      }}
                    >
                      {STEP_LABELS[step]}
                      {state === "active" && progress.detail && (
                        <span style={{ display: "block", fontSize: 13, fontWeight: 400, color: "#9C978E" }}>
                          {progress.detail}
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ol>

            {/* What Wingman heard */}
            {occasion && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <span style={{ fontSize: 12, letterSpacing: "0.02em", color: "#9C978E" }}>
                  What Wingman heard
                </span>
                <dl
                  style={{
                    margin: 0,
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "20px 24px",
                  }}
                >
                  {[
                    ["Occasion", occasion.occasion],
                    ["Setting", occasion.setting],
                    ["Vibe", occasion.formality],
                    ["Time", occasion.timeOfDay],
                  ]
                    .filter(([, v]) => v)
                    .map(([label, value]) => (
                      <div key={label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <dt style={{ fontSize: 12, color: "#9C978E" }}>{label}</dt>
                        <dd style={{ margin: 0, fontSize: 15, textTransform: "capitalize" }}>{value}</dd>
                      </div>
                    ))}
                </dl>
              </div>
            )}
          </div>

          {/* Skip link */}
          <button
            type="button"
            onClick={onContinue}
            style={{
              marginTop: "auto",
              background: "none",
              border: 0,
              color: "#9C978E",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
              textAlign: "left",
              alignSelf: "flex-start",
            }}
          >
            Skip to Your Looks →
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
    </svg>
  );
}

function PersonSkeletonSvg({ opacity }: { opacity: number }) {
  return (
    <svg
      viewBox="0 0 600 900"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", opacity }}
      aria-hidden
    >
      <path
        d="M40 900 L58 640 Q70 520 160 486 L246 452 L300 486 L354 452 L440 486 Q530 520 542 640 L560 900 Z"
        fill="#26262A"
      />
      <ellipse cx="300" cy="288" rx="80" ry="100" fill="#26262A" />
      <path d="M262 360 L338 360 L346 470 L300 490 L254 470 Z" fill="#26262A" />
    </svg>
  );
}
