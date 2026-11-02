"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import { RAW_IMG_PROPS } from "@/components/style/flow-shell";
import type { Photo } from "@/components/style/style-flow";
import { downscalePhoto } from "@/lib/photo/downscale";
import type { PhotoCheck } from "@/lib/photo/problems";

// Design tokens (inline, shared with AppHeader)
const S = "#141416";     // surface
const B = "#0A0A0B";     // bg
const T = "#ECEBE8";     // text
const M = "#9C978E";     // muted
const G = "#C8A96A";     // gold

const TIPS = [
  {
    title: "Even Lighting",
    subtitle: "Face a window, not a lamp",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth="1.25" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    ),
  },
  {
    title: "Waist Up",
    subtitle: "Shoulders and torso in frame",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth="1.25" aria-hidden="true">
        <circle cx="12" cy="6" r="3" />
        <path d="M5 22v-7a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v7" />
        <path d="M3 22h18" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    title: "Face the Camera",
    subtitle: "Straight on, arms relaxed",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth="1.25" aria-hidden="true">
        <path d="M3 8V4h4M17 4h4v4M21 16v4h-4M7 20H3v-4" />
        <circle cx="12" cy="11" r="3.5" />
        <path d="M7.5 18a4.5 4.5 0 0 1 9 0" />
      </svg>
    ),
  },
  {
    title: "Glasses Are Fine",
    subtitle: "Wear what you'll wear on the day",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth="1.25" aria-hidden="true">
        <circle cx="6.5" cy="14" r="3.5" />
        <circle cx="17.5" cy="14" r="3.5" />
        <path d="M10 14h4M3 13l2-6M21 13l-2-6" />
      </svg>
    ),
  },
] as const;

export function PhotoStep({
  photo,
  onPhoto,
  onNext,
  notice,
}: {
  photo: Photo | null;
  onPhoto: (photo: Photo) => void;
  onNext: () => void;
  notice?: string | null;
}) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const latest = useRef<string | null>(null);

  async function choose(file: File | undefined) {
    if (!file) return;
    setProblem(null);
    if (!file.type.startsWith("image/")) return setProblem("That file isn't a photo. Choose a JPEG or PNG.");
    setBusy(true);
    let blob: Blob;
    try {
      blob = await downscalePhoto(file);
    } catch {
      setBusy(false);
      return setProblem("We couldn't read that photo. Try another one.");
    }
    const url = URL.createObjectURL(blob);
    latest.current = url;
    onPhoto({ blob, url });
    setBusy(false);
    setChecking(true);
    const result = await check(blob);
    if (latest.current !== url) return;
    if (result?.zoom) return zoom(file, result.zoom, url);
    onPhoto({ blob, url, check: result });
    setChecking(false);
  }

  async function zoom(file: File, crop: NonNullable<PhotoCheck["zoom"]>, from: string) {
    let blob: Blob;
    try {
      blob = await downscalePhoto(file, undefined, undefined, crop);
    } catch {
      if (latest.current === from) setChecking(false);
      return;
    }
    if (latest.current !== from) return;
    const url = URL.createObjectURL(blob);
    latest.current = url;
    onPhoto({ blob, url, zoomed: true });
    const result = await check(blob);
    if (latest.current !== url) return;
    onPhoto({ blob, url, zoomed: true, check: result });
    setChecking(false);
  }

  const hard = photo?.check?.problems.find((p) => !p.soft);
  const soft = photo?.check?.problems.filter((p) => p.soft) ?? [];
  const shown = hard ? [hard] : soft;
  const canProceed = photo && !checking && !hard;

  return (
    <div
      style={{
        height: "100dvh",
        background: B,
        color: T,
        fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header
        style={{
          height: "64px",
          flexShrink: 0,
          background: S,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-dm-serif), Georgia, serif",
            fontSize: "20px",
            letterSpacing: "0.2em",
            color: T,
            textDecoration: "none",
          }}
        >
          WINGMAN
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
            aria-label="Step 1 of 5"
            role="status"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                aria-hidden="true"
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: i === 0 ? G : "#3A3A3F",
                  animation: i === 0 ? "wmPulse 1.6s ease-in-out infinite" : "none",
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: "12px", letterSpacing: "0.02em", color: M }}>
            01 · Your photo
          </span>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <main style={{ flex: 1, display: "flex", minHeight: 0 }}>

        {/* ── LEFT: Photo panel ─────────────────────────────────────────── */}
        <section
          aria-label="Photo upload"
          style={{
            width: "628px",
            flexShrink: 0,
            position: "relative",
            background: S,
            display: "flex",
          }}
        >
          {photo ? (
            /* ── Uploaded state ── */
            <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
              <style>{`
                @keyframes photoLock {
                  0%   { opacity: 0; transform: scale(1.06); }
                  18%  { opacity: 1; transform: scale(1); }
                  65%  { opacity: 1; }
                  100% { opacity: 0; }
                }
              `}</style>

              {/* Image — contain (full body visible) until faceY known, then cover panned to face */}
              <Image
                src={photo.url}
                alt="Your uploaded selfie"
                fill
                sizes="628px"
                style={{
                  objectFit: photo.check?.faceY != null ? "cover" : "contain",
                  objectPosition: photo.check?.faceY != null
                    ? `50% ${Math.round(photo.check.faceY * 100)}%`
                    : "center",
                  transitionProperty: "object-position",
                  transitionDuration: "1.4s",
                  transitionTimingFunction: "cubic-bezier(0.2, 0.7, 0.2, 1)",
                  willChange: "object-position",
                }}
                {...RAW_IMG_PROPS}
              />

              {/* Gold scan line while checking */}
              {checking && (
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    height: 120,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    animation: "wmScan 2.4s cubic-bezier(0.45, 0, 0.55, 1) infinite",
                    pointerEvents: "none",
                  }}
                >
                  <div style={{ flex: 1, background: "rgba(200,169,106,0.08)" }} />
                  <div style={{ height: 2, background: G }} />
                </div>
              )}

              {/* Gold border flash when face is locked in */}
              {photo.check?.faceY != null && !checking && (
                <div
                  key={photo.url}
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    border: `2px solid ${G}`,
                    animation: "photoLock 2.2s cubic-bezier(0.2, 0.7, 0.2, 1) forwards",
                    pointerEvents: "none",
                  }}
                />
              )}

              {/* Checking label */}
              {checking && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(10,10,11,0.28)",
                    display: "flex",
                    alignItems: "flex-end",
                    padding: "0 40px 36px",
                    pointerEvents: "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span
                      aria-hidden="true"
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: G,
                        animation: "wmPulse 1.6s ease-in-out infinite",
                      }}
                    />
                    <span style={{ fontSize: "13px" }}>Finding your face…</span>
                  </div>
                </div>
              )}

              {/* Bottom scrim */}
              {!checking && (
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: "180px",
                    background: "linear-gradient(to top, rgba(10,10,11,0.85), rgba(10,10,11,0))",
                  }}
                />
              )}

              {/* Bottom info bar */}
              {!checking && (
                <div
                  style={{
                    position: "absolute",
                    left: "40px",
                    right: "40px",
                    bottom: "32px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ fontSize: "12px", letterSpacing: "0.02em", color: M }}>
                      Uploaded
                    </span>
                    <span style={{ fontSize: "14px" }}>Your photo</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    style={{
                      background: "none",
                      border: 0,
                      padding: 0,
                      fontSize: "14px",
                      color: T,
                      textDecoration: "underline",
                      textUnderlineOffset: "4px",
                      textDecorationThickness: "1px",
                      cursor: "pointer",
                    }}
                  >
                    Replace Photo
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── Empty state ── */
            <div style={{ flex: 1, padding: "48px", display: "flex" }}>
              <label
                htmlFor={inputId}
                style={{
                  flex: 1,
                  background: B,
                  border: "1px dashed #5A5650",
                  color: T,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "20px",
                  cursor: "pointer",
                  transition: "background 180ms ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = S)}
                onMouseLeave={(e) => (e.currentTarget.style.background = B)}
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={T}
                  strokeWidth="1.25"
                  aria-hidden="true"
                >
                  <path d="M12 16V4" />
                  <path d="M7 9l5-5 5 5" />
                  <path d="M4 16v4h16v-4" />
                </svg>
                <span
                  style={{
                    fontFamily: "var(--font-dm-serif), Georgia, serif",
                    fontSize: "32px",
                  }}
                >
                  {busy ? "Reading…" : "Upload Your Photo"}
                </span>
                <span style={{ fontSize: "14px", color: M }}>
                  Drag a selfie here, or click to choose. JPG or PNG, up to 15 MB.
                </span>
              </label>
            </div>
          )}
        </section>

        {/* ── RIGHT: Content panel ──────────────────────────────────────── */}
        <section
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Content */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
              padding: "32px 64px 0",
              boxSizing: "border-box",
            }}
          >
            <span style={{ fontSize: "12px", letterSpacing: "0.02em", color: M }}>
              Step one
            </span>
            <h1
              style={{
                margin: "12px 0 0",
                fontFamily: "var(--font-dm-serif), Georgia, serif",
                fontWeight: 400,
                fontSize: "52px",
                lineHeight: 1,
                textTransform: "uppercase" as const,
                letterSpacing: "0.02em",
              }}
            >
              Your Photo
            </h1>

            {/* Notice (after deleting photo) */}
            {notice && (
              <p
                role="status"
                style={{
                  margin: "12px 0 0",
                  padding: "10px 14px",
                  background: S,
                  fontSize: "13px",
                  color: M,
                }}
              >
                {notice}
              </p>
            )}

            <p
              style={{
                margin: "12px 0 0",
                fontSize: "15px",
                lineHeight: 1.55,
                color: M,
                maxWidth: "440px",
              }}
            >
              Every look is tried on this picture. A clear, honest selfie gets you a try-on you can
              trust.
            </p>

            {/* Tips + example figure — hidden once a photo is uploaded */}
            <div
              style={{
                marginTop: "20px",
                display: photo ? "none" : "flex",
                gap: "28px",
                alignItems: "flex-start",
              }}
            >
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  flex: 1,
                }}
              >
                {TIPS.map((tip) => (
                  <li
                    key={tip.title}
                    style={{ display: "flex", alignItems: "center", gap: "14px" }}
                  >
                    {tip.icon}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 500 }}>{tip.title}</span>
                      <span style={{ fontSize: "12px", color: M }}>{tip.subtitle}</span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Example figure */}
              <figure
                style={{
                  margin: 0,
                  width: "96px",
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "96px",
                    height: "128px",
                    position: "relative",
                    overflow: "hidden",
                    background: "#1C1C1F",
                  }}
                >
                  <Image
                    src="/home/before.jpg"
                    alt="Example: waist-up, front-facing, evenly lit selfie"
                    fill
                    sizes="96px"
                    className="object-cover object-[50%_20%]"
                  />
                </div>
                <figcaption
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.02em",
                    color: M,
                  }}
                >
                  Like this
                </figcaption>
              </figure>
            </div>

            {/* Problems / alerts */}
            {problem && (
              <p role="alert" style={{ margin: "24px 0 0", fontSize: "14px", color: "#E06C5F" }}>
                {problem}
              </p>
            )}
            {photo?.zoomed && !checking && !hard && (
              <p role="status" style={{ margin: "16px 0 0", fontSize: "14px", color: M }}>
                We zoomed in to frame you better.
              </p>
            )}
            {photo && !checking && shown.length > 0 && (
              <div
                role="alert"
                style={{
                  margin: "24px 0 0",
                  padding: "16px 20px",
                  background: S,
                }}
              >
                {shown.map((p) => (
                  <div key={p.code} style={{ marginTop: p === shown[0] ? 0 : "16px" }}>
                    <p style={{ margin: 0, fontSize: "15px", fontWeight: 500 }}>{p.message}</p>
                    <p style={{ margin: "4px 0 0", fontSize: "14px", color: M }}>{p.tip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Pinned footer: actions + privacy ── */}
          <div
            style={{
              flexShrink: 0,
              padding: "20px 64px 28px",
              boxSizing: "border-box",
            }}
          >
            {photo && !checking && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {shown.length > 0 ? (
                  <>
                    <label
                      htmlFor={inputId}
                      style={{
                        height: "56px",
                        background: G,
                        color: B,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "15px",
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        cursor: "pointer",
                      }}
                    >
                      Swap Photo
                    </label>
                    {!hard && (
                      <button
                        type="button"
                        onClick={onNext}
                        style={{
                          height: "56px",
                          background: "#1C1C1F",
                          color: T,
                          border: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "15px",
                          fontWeight: 500,
                          letterSpacing: "0.04em",
                          cursor: "pointer",
                        }}
                      >
                        Use This One
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={onNext}
                      style={{
                        height: "56px",
                        background: G,
                        color: B,
                        border: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "15px",
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        cursor: "pointer",
                      }}
                    >
                      Use This Photo
                    </button>
                    <label
                      htmlFor={inputId}
                      style={{
                        alignSelf: "flex-start",
                        fontSize: "14px",
                        color: M,
                        textDecoration: "underline",
                        textUnderlineOffset: "4px",
                        textDecorationThickness: "1px",
                        cursor: "pointer",
                      }}
                    >
                      Choose a different photo
                    </label>
                  </>
                )}
              </div>
            )}

            <p style={{ margin: photo && !checking ? "16px 0 0" : "0", fontSize: "12px", lineHeight: 1.5, color: M }}>
              Your photo is only used to render your try-ons. Delete it any time from your looks.
            </p>
          </div>
        </section>
      </main>

      {/* ── Hidden file input ─────────────────────────────────────────────── */}
      <input
        ref={fileRef}
        id={inputId}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          void choose(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}

async function check(blob: Blob): Promise<PhotoCheck | undefined> {
  const form = new FormData();
  form.set("photo", blob, "photo.jpg");
  try {
    const res = await fetch("/api/photo/check", { method: "POST", body: form });
    return res.ok ? ((await res.json()) as PhotoCheck) : undefined;
  } catch {
    return undefined;
  }
}
