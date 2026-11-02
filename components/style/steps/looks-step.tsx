"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { RAW_IMG_PROPS } from "@/components/style/flow-shell";
import { ProductImage } from "@/components/style/product-image";
import { RefineBar } from "@/components/style/refine-bar";
import type { Photo } from "@/components/style/style-flow";
import { showsInRender, type Look, type LookItem } from "@/lib/agent/events";
import type { ParsedOccasion } from "@/lib/agent/schemas";
import { isSoldOut, pieceCount, type CartLine } from "@/lib/cart";
import { displayName } from "@/lib/catalog/names";
import type { Tier } from "@/lib/catalog/types";
import { TIER_LABELS } from "@/lib/occasions";
import { cn } from "@/lib/utils/cn";
import { sgd } from "@/lib/utils/format";

const SLOT_LABELS: Record<LookItem["slot"], string> = {
  top: "Top",
  outerwear: "Layer",
};

export function LooksStep({
  looks,
  photo,
  occasion,
  tier,
  scoring,
  notice,
  onRestart,
  onCompare,
  onSwap,
  onRefine,
  cart,
  onAddToCart,
  onAddPiece,
  onViewCart,
  focusLook = 0,
  hasPrep,
  onPrep,
  onBrowse,
  onDeletePhoto,
}: {
  looks: Look[];
  photo: Photo | null;
  occasion: ParsedOccasion | null;
  tier: Tier;
  scoring: boolean;
  notice: string | null;
  onRestart: () => void;
  onCompare?: (index: number) => void;
  onSwap?: (index: number, slot: LookItem["slot"], cheaper?: boolean) => void;
  onRefine?: (message: string) => void;
  cart: CartLine[];
  onAddToCart: (look: Look) => void;
  onAddPiece: (item: LookItem) => void;
  onViewCart: () => void;
  focusLook?: number;
  hasPrep: boolean;
  onPrep: () => void;
  onBrowse: () => void;
  onDeletePhoto: () => void;
}) {
  const inCartIds = new Set(cart.map((l) => l.id));
  const cartTotal = cart.filter((l) => !isSoldOut(l)).reduce((sum, l) => sum + l.price * l.qty, 0);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(focusLook);
  const [fullscreen, setFullscreen] = useState(false);
  const wide = useWide();

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setFullscreen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen]);

  const goTo = (i: number, behavior: ScrollBehavior = "smooth") => {
    setActive(i);
    const card = track.current?.children[i] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior, block: "nearest", inline: "center" });
  };

  useEffect(() => {
    if (focusLook > 0 && !wide) goTo(focusLook, "instant");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shown = looks[Math.min(active, looks.length - 1)];

  // Wide-mode derived values
  const shownScoring = scoring && !!shown && !shown.fitCheck;
  const shownFitScore = shown?.fitCheck?.score;
  const scoreColor = shownFitScore != null
    ? shownFitScore >= 8 ? "#5FB58A" : shownFitScore >= 6 ? "#C8A96A" : "#E06C5F"
    : "#9C978E";
  const onThem = shown ? shown.items.filter((i) => showsInRender(shown, i.slot)) : [];
  const hasOuterwear = shown ? shown.items.some((i) => i.slot === "outerwear") : false;
  const swappable = hasOuterwear
    ? shown!.items.filter((i) => i.slot === "outerwear" || i.slot === "top")
    : onThem;
  const alongside = shown ? shown.items.filter((i) => !swappable.some((s) => s.id === i.id)) : [];
  const shownInCart = shown
    ? shown.items.filter((i) => showsInRender(shown, i.slot)).every((i) => inCartIds.has(i.id))
    : false;
  const rendering = shown ? !shown.renders.outfit && shown.renders.errors.length === 0 : false;

  // ── WIDE layout ──
  if (wide && shown) {
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
            <CartIcon count={cart.length} onClick={onViewCart} />
            <WmDots current={4} />
            <span style={{ fontSize: 12, letterSpacing: "0.02em", color: "#9C978E" }}>04 · Your looks</span>
          </div>
        </header>

        {/* ── Main ── */}
        <main style={{ flex: 1, display: "flex", minHeight: 0 }}>
          {/* Left: 628px look render */}
          <section
            style={{
              width: 628,
              flexShrink: 0,
              position: "relative",
              overflow: "hidden",
              background: "#141416",
            }}
          >
            {shown.renders.outfit ? (
              <button
                type="button"
                onClick={() => setFullscreen(true)}
                aria-label="View render fullscreen"
                style={{ position: "absolute", inset: 0, background: "none", border: 0, padding: 0, cursor: "zoom-in", width: "100%", height: "100%" }}
              >
                <Image
                  src={shown.renders.outfit}
                  alt={`You in ${shown.name}`}
                  fill
                  sizes="628px"
                  style={{ objectFit: "contain" }}
                  {...RAW_IMG_PROPS}
                />
              </button>
            ) : photo ? (
              <Image
                src={photo.url}
                alt="Your photo"
                fill
                sizes="628px"
                style={{ objectFit: "contain", opacity: 0.4 }}
                {...RAW_IMG_PROPS}
              />
            ) : (
              <LookSvg />
            )}

            {/* Top scrim for label legibility */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 160,
                background: "linear-gradient(to bottom, rgba(10,10,11,0.72) 0%, rgba(10,10,11,0) 100%)",
                pointerEvents: "none",
              }}
            />

            {/* Look label */}
            <div
              style={{ position: "absolute", top: 32, left: 36, display: "flex", flexDirection: "column", gap: 6 }}
            >
              <span style={{ fontSize: 12, letterSpacing: "0.02em", color: "#9C978E" }}>
                {looks.length > 1 ? `Look ${active + 1} of ${looks.length}` : "Look 1"}
              </span>
              <span style={{ fontFamily: "var(--font-dm-serif), serif", fontSize: 22 }}>{shown.name}</span>
            </div>

            {/* Score box */}
            {shown.fitCheck ? (
              <div
                style={{
                  position: "absolute",
                  top: 32,
                  right: 32,
                  width: 88,
                  height: 88,
                  background: "#0A0A0B",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <span
                  style={{ fontFamily: "var(--font-dm-serif), serif", fontSize: 36, lineHeight: 1, color: scoreColor }}
                >
                  {shown.fitCheck.score.toFixed(1)}
                </span>
                <span style={{ fontSize: 11, color: "#9C978E" }}>Fit score</span>
              </div>
            ) : shownScoring ? (
              <div
                style={{
                  position: "absolute",
                  top: 32,
                  right: 32,
                  width: 88,
                  height: 88,
                  background: "#0A0A0B",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 11, color: "#9C978E" }}>Scoring…</span>
              </div>
            ) : null}

            {/* Re-rendering overlay */}
            {rendering && (
              <>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 160,
                    background: "linear-gradient(to top, rgba(10,10,11,0.9), rgba(10,10,11,0))",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: 36,
                    right: 36,
                    bottom: 28,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "#C8A96A",
                          animation: "wmPulse 1.6s ease-in-out infinite",
                        }}
                      />
                      <span style={{ fontSize: 13 }}>Trying this look on you…</span>
                    </div>
                    <span style={{ fontSize: 12, color: "#9C978E" }}>About 15s</span>
                  </div>
                  <div style={{ height: 2, background: "#3A3A3F" }}>
                    <div style={{ height: 2, background: "#C8A96A", animation: "wmBar 14s linear infinite" }} />
                  </div>
                </div>
              </>
            )}

            {/* Error note */}
            {!shown.renders.outfit && !rendering && (
              <p
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  margin: 0,
                  background: "rgba(10,10,11,0.8)",
                  padding: "16px 36px",
                  fontSize: 13,
                }}
              >
                {shown.renders.errors.includes("QUOTA")
                  ? "Try-ons are paused for now, so here are the pieces on their own."
                  : "The try-on didn't work for this one; the pieces are below."}
              </p>
            )}
          </section>

          {/* Right: details panel */}
          <section
            style={{
              flex: 1,
              minWidth: 0,
              background: "#141416",
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            {/* Look tabs */}
            {looks.length > 1 && (
              <div
                role="tablist"
                aria-label="Choose a look"
                style={{
                  height: 64,
                  flexShrink: 0,
                  display: "grid",
                  gridTemplateColumns: `repeat(${looks.length}, minmax(0, 1fr))`,
                  padding: "0 40px",
                  gap: 24,
                }}
              >
                {looks.map((l, i) => {
                  const on = active === i;
                  const ls = l.fitCheck?.score;
                  const lColor = ls != null
                    ? ls >= 8 ? "#5FB58A" : ls >= 6 ? "#C8A96A" : "#E06C5F"
                    : "#9C978E";
                  return (
                    <button
                      key={i}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      onClick={() => setActive(i)}
                      style={{
                        background: "none",
                        border: 0,
                        padding: 0,
                        height: 64,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                        fontSize: 14,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        color: on ? "#ECEBE8" : "#9C978E",
                        fontWeight: on ? 600 : 400,
                        boxShadow: on ? "inset 0 -2px 0 #ECEBE8" : "inset 0 -2px 0 transparent",
                      }}
                    >
                      <span>Look {i + 1}</span>
                      <span style={{ fontVariantNumeric: "tabular-nums", color: on ? lColor : "#9C978E" }}>
                        {l.fitCheck ? l.fitCheck.score.toFixed(1) : "…"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Scrollable content */}
            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflow: "hidden",
                padding: "20px 40px 16px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {notice && (
                <p
                  role="status"
                  style={{ margin: "0 0 16px", background: "#1C1C1F", padding: "12px 16px", fontSize: 13 }}
                >
                  {notice}
                </p>
              )}

              <span style={{ fontSize: 12, letterSpacing: "0.02em", color: "#9C978E" }}>
                {TIER_LABELS[shown.tier]} · {shown.items[0] ? SLOT_LABELS[shown.items[0].slot].toLowerCase() : "piece"}
              </span>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 16,
                }}
              >
                <h1
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-dm-serif), serif",
                    fontWeight: 400,
                    fontSize: 34,
                    lineHeight: 1.05,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.02em",
                  }}
                >
                  {shown.name}
                </h1>
                <span style={{ fontFamily: "var(--font-dm-serif), serif", fontSize: 22, flexShrink: 0 }}>
                  {sgd(shown.total)}
                </span>
              </div>

              {/* Fit Check box */}
              <div
                style={{
                  marginTop: 14,
                  background: "#1C1C1F",
                  padding: "12px 16px",
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                }}
                aria-live="polite"
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 2, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: "#9C978E" }}>Fit Check</span>
                  {shown.fitCheck ? (
                    <span
                      style={{
                        fontFamily: "var(--font-dm-serif), serif",
                        fontSize: 28,
                        lineHeight: 1.1,
                        color: scoreColor,
                      }}
                    >
                      {shown.fitCheck.score.toFixed(1)}
                    </span>
                  ) : (
                    <span style={{ fontSize: 14, color: "#9C978E" }}>{shownScoring ? "…" : ""}</span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: "#C9C5BD" }}>
                    {shown.fitCheck
                      ? shown.fitCheck.reasoning
                      : shownScoring
                        ? "Scoring this look…"
                        : shown.why}
                  </p>
                </div>
              </div>

              {/* Piece list */}
              <ul
                style={{ listStyle: "none", margin: "16px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 4 }}
              >
                {swappable.map((item) => (
                  <PieceRow
                    key={item.slot}
                    item={item}
                    onSwap={onSwap ? (slot) => onSwap(active, slot) : undefined}
                  />
                ))}
              </ul>
              {alongside.length > 0 && (
                <>
                  <span style={{ display: "block", marginTop: 20, fontSize: 12, letterSpacing: "0.02em", color: "#9C978E" }}>
                    Also in this look
                  </span>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "#9C978E" }}>
                    Picked for the outfit, not shown on you.
                  </p>
                  <ul style={{ listStyle: "none", margin: "10px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                    {alongside.map((item) => (
                      <PieceRow
                        key={item.slot}
                        item={item}
                        inCart={inCartIds.has(item.id)}
                        onAdd={() => onAddPiece(item)}
                      />
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Bottom action bar */}
            <div
              style={{
                flexShrink: 0,
                padding: "18px 40px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {shownInCart ? (
                <button
                  type="button"
                  onClick={onViewCart}
                  style={{
                    background: "none",
                    border: 0,
                    padding: 0,
                    color: "#ECEBE8",
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: "underline",
                    textUnderlineOffset: 4,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    textAlign: "left",
                  }}
                >
                  In your cart. View cart
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onAddToCart(shown)}
                  style={{
                    height: 52,
                    background: "#C8A96A",
                    color: "#0A0A0B",
                    border: 0,
                    fontSize: 15,
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Add Look to Cart · {sgd(shown.total)}
                </button>
              )}
              <div style={{ height: 1, background: "#2A2A2E" }} />
              {onCompare && (
                <button
                  type="button"
                  onClick={() => onCompare(active)}
                  style={{ background: "none", border: 0, padding: 0, color: "#9C978E", cursor: "pointer", fontFamily: "inherit", fontSize: 13, textDecoration: "underline", textUnderlineOffset: 4, textAlign: "left" }}
                >
                  Compare prices
                </button>
              )}
              {hasPrep && (
                <button
                  type="button"
                  onClick={onPrep}
                  style={{ background: "none", border: 0, padding: 0, color: "#9C978E", cursor: "pointer", fontFamily: "inherit", fontSize: 13, textDecoration: "underline", textUnderlineOffset: 4, textAlign: "left" }}
                >
                  Your night-before prep plan
                </button>
              )}
              <nav
                aria-label="More actions"
                style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}
              >
                <Link
                  href="/catalog"
                  style={{ color: "#9C978E", fontSize: 13, textDecoration: "underline", textUnderlineOffset: 4 }}
                >
                  Browse Every Piece
                </Link>
                <button
                  type="button"
                  onClick={onRestart}
                  style={{ background: "none", border: 0, padding: 0, color: "#9C978E", cursor: "pointer", fontFamily: "inherit", fontSize: 13, textDecoration: "underline", textUnderlineOffset: 4 }}
                >
                  Change Occasion
                </button>
                <button
                  type="button"
                  onClick={onDeletePhoto}
                  style={{ background: "none", border: 0, padding: 0, color: "#E06C5F", cursor: "pointer", fontFamily: "inherit", fontSize: 13, textDecoration: "underline", textUnderlineOffset: 4 }}
                >
                  Delete My Photo
                </button>
              </nav>
            </div>

            {onRefine && <RefineBar onRefine={onRefine} inside />}
          </section>
        </main>

        {fullscreen && shown.renders.outfit && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Render fullscreen"
            onClick={() => setFullscreen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out" }}
          >
            <Image
              src={shown.renders.outfit}
              alt={`You in ${shown.name}`}
              fill
              sizes="100vw"
              style={{ objectFit: "contain" }}
              {...RAW_IMG_PROPS}
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setFullscreen(false); }}
              aria-label="Close fullscreen"
              style={{ position: "absolute", top: 24, right: 24, background: "none", border: 0, color: "#ECEBE8", fontSize: 24, cursor: "pointer", fontFamily: "inherit", lineHeight: 1, padding: 8, zIndex: 1 }}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── MOBILE layout ──
  const sharedCardProps = (look: Look, i: number) => ({
    look,
    index: i,
    count: looks.length,
    photo,
    scoring: scoring && !look.fitCheck,
    onCompare: onCompare && (() => onCompare(i)),
    onSwap: onSwap && ((slot: LookItem["slot"]) => onSwap(i, slot)),
    inCart: look.items.filter((item) => showsInRender(look, item.slot)).every((item) => inCartIds.has(item.id)),
    cartIds: inCartIds,
    onAddToCart: () => onAddToCart(look),
    onAddPiece,
    onViewCart,
  });

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#0A0A0B",
        color: "#ECEBE8",
        fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
        padding: "0 20px 40px",
        boxSizing: "border-box",
      }}
    >
      {/* Mobile header */}
      <header
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "0 -20px",
          padding: "0 20px",
          background: "#141416",
          marginBottom: 24,
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
          <CartIcon count={cart.length} onClick={onViewCart} />
          <WmDots current={4} />
        </div>
      </header>

      <div style={{ maxWidth: 480 }}>
        <h1 style={{ margin: 0, fontFamily: "var(--font-dm-serif), serif", fontWeight: 400, fontSize: 40, textTransform: "uppercase" as const, letterSpacing: "0.02em" }}>
          {looks.length === 1 ? "Your look" : "Your looks"}
        </h1>
        <p style={{ marginTop: 12, fontSize: 15, color: "#9C978E" }}>
          {looks.length === 1 ? "One look" : `${looks.length} looks`} from real Singapore stores, tried on your photo.
        </p>
        {cart.length > 0 && (
          <button
            type="button"
            onClick={onViewCart}
            style={{
              marginTop: 16,
              display: "flex",
              minHeight: 48,
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#1C1C1F",
              border: 0,
              padding: "0 16px",
              color: "#ECEBE8",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 14,
              textAlign: "left",
            }}
          >
            <span>
              Cart: {pieceCount(cart)} {pieceCount(cart) === 1 ? "piece" : "pieces"},{" "}
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{sgd(cartTotal)}</span>
            </span>
            <span style={{ fontWeight: 600 }}>View cart</span>
          </button>
        )}
        {notice && (
          <p role="status" style={{ marginTop: 16, background: "#1C1C1F", padding: 16, fontSize: 13 }}>
            {notice}
          </p>
        )}
      </div>

      {looks.length > 1 && (
        <LookSwitcher looks={looks} photo={photo} active={active} onChoose={goTo} />
      )}

      <div
        ref={track}
        onScroll={(e) => {
          const el = e.currentTarget;
          const width = (el.children[0] as HTMLElement | undefined)?.offsetWidth ?? el.clientWidth;
          setActive(Math.round(el.scrollLeft / (width + 16)));
        }}
        style={{
          display: "flex",
          gap: 16,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          marginTop: 24,
          marginLeft: -20,
          marginRight: -20,
          paddingLeft: 20,
          paddingRight: 20,
        }}
        aria-label="Looks"
      >
        {looks.map((look, i) => (
          <LookCard key={i} {...sharedCardProps(look, i)} />
        ))}
      </div>

      {looks.length > 1 && (
        <div
          style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 8 }}
          aria-label={`Look ${active + 1} of ${looks.length}`}
          role="status"
        >
          {looks.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to look ${i + 1}`}
              style={{
                width: active === i ? 8 : 6,
                height: active === i ? 8 : 6,
                borderRadius: "50%",
                background: active === i ? "#C8A96A" : "#3A3A3F",
                border: 0,
                padding: 0,
                cursor: "pointer",
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      )}

      <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start" }}>
        {hasPrep && (
          <button
            type="button"
            onClick={onPrep}
            style={{ background: "none", border: 0, padding: "8px 0", color: "#ECEBE8", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline", textUnderlineOffset: 4 }}
          >
            Your night-before prep plan
          </button>
        )}
        <button
          type="button"
          onClick={onBrowse}
          style={{ background: "none", border: 0, padding: "8px 0", color: "#9C978E", fontSize: 14, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline", textUnderlineOffset: 4 }}
        >
          Browse every piece
        </button>
        <button
          type="button"
          onClick={onRestart}
          style={{ background: "none", border: 0, padding: "8px 0", color: "#9C978E", fontSize: 14, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline", textUnderlineOffset: 4 }}
        >
          Change the occasion or budget
        </button>
        <button
          type="button"
          onClick={onDeletePhoto}
          style={{ background: "none", border: 0, padding: "8px 0", color: "#9C978E", fontSize: 14, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline", textUnderlineOffset: 4 }}
        >
          Delete my photo
        </button>
      </div>

      {onRefine && <RefineBar onRefine={onRefine} />}
    </div>
  );
}

function LookCard({
  look,
  index,
  count,
  photo,
  scoring,
  onCompare,
  onSwap,
  inCart,
  cartIds,
  onAddToCart,
  onAddPiece,
  onViewCart,
}: {
  look: Look;
  index: number;
  count: number;
  photo: Photo | null;
  scoring: boolean;
  onCompare?: () => void;
  onSwap?: (slot: LookItem["slot"]) => void;
  inCart: boolean;
  cartIds: Set<string>;
  onAddToCart: () => void;
  onAddPiece: (item: LookItem) => void;
  onViewCart: () => void;
}) {
  const rendering = !look.renders.outfit && look.renders.errors.length === 0;
  const onThem = look.items.filter((i) => showsInRender(look, i.slot));
  const hasOuterwear = look.items.some((i) => i.slot === "outerwear");
  const swappable = hasOuterwear
    ? look.items.filter((i) => i.slot === "outerwear" || i.slot === "top")
    : onThem;
  const alongside = look.items.filter((i) => !swappable.some((s) => s.id === i.id));

  const scoreColor = look.fitCheck
    ? look.fitCheck.score >= 8
      ? "var(--success)"
      : look.fitCheck.score >= 6
        ? "var(--brass)"
        : "var(--danger)"
    : "var(--text-muted)";

  return (
    <article
      aria-label={`Look ${index + 1} of ${count}: ${look.name}`}
      style={{
        width: "86%",
        maxWidth: 384,
        flexShrink: 0,
        scrollSnapAlign: "center",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#141416",
      }}
    >
      <div style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", background: "#1C1C1F" }}>
        {look.renders.outfit ? (
          <Image
            src={look.renders.outfit}
            alt={`You in ${look.name}`}
            fill
            sizes="(min-width: 640px) 24rem, 86vw"
            style={{ objectFit: "cover" }}
            {...RAW_IMG_PROPS}
          />
        ) : (
          photo && (
            <Image
              src={photo.url}
              alt="Your photo"
              fill
              sizes="24rem"
              style={{ objectFit: "cover", opacity: 0.4 }}
              {...RAW_IMG_PROPS}
            />
          )
        )}
        {rendering && (
          <p
            style={{
              position: "absolute",
              inset: "auto 0 0",
              margin: 0,
              background: "rgba(10,10,11,0.8)",
              padding: "12px 16px",
              fontSize: 13,
            }}
          >
            Trying this look on you…
          </p>
        )}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 20 }}>
        <h2 style={{ margin: 0, fontFamily: "var(--font-dm-serif), serif", fontWeight: 400, fontSize: 24 }}>
          {look.name}
        </h2>
        <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <p style={{ margin: 0, fontSize: 14, fontVariantNumeric: "tabular-nums" }}>
            {sgd(look.total)}
            <span style={{ color: "#9C978E" }}> · {TIER_LABELS[look.tier]}</span>
          </p>
          {onCompare && (
            <button type="button" onClick={onCompare} style={{ background: "none", border: 0, padding: 0, color: "#ECEBE8", fontSize: 13, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline", textUnderlineOffset: 3 }}>
              Compare prices
            </button>
          )}
        </div>

        <div style={{ marginTop: 20, background: "#1C1C1F", padding: 16 }} aria-live="polite">
          {look.fitCheck ? (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <FitRing score={look.fitCheck.score} />
              <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
                <p style={{ margin: 0, fontWeight: 500 }}>Fit Check</p>
                <p style={{ margin: "8px 0 0", fontSize: 13, color: "#9C978E" }}>{look.fitCheck.reasoning}</p>
              </div>
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: 13, color: "#9C978E" }}>{scoring ? "Scoring this look…" : "No score."}</p>
          )}
        </div>
        <p style={{ marginTop: 20, fontSize: 14, color: "#9C978E" }}>{look.why}</p>
        <ul style={{ listStyle: "none", margin: "16px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          {swappable.map((item) => <PieceRow key={item.slot} item={item} onSwap={onSwap} />)}
        </ul>
        {alongside.length > 0 && (
          <>
            <p style={{ margin: "20px 0 8px", fontSize: 12, color: "#9C978E" }}>Also in this look</p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {alongside.map((item) => (
                <PieceRow key={item.slot} item={item} inCart={cartIds.has(item.id)} onAdd={() => onAddPiece(item)} />
              ))}
            </ul>
          </>
        )}

        <div style={{ marginTop: "auto", paddingTop: 20 }}>
          {inCart ? (
            <button type="button" onClick={onViewCart} style={{ background: "none", border: 0, padding: 0, color: "#ECEBE8", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline", textUnderlineOffset: 4 }}>
              In your cart. View cart
            </button>
          ) : (
            <button
              type="button"
              onClick={onAddToCart}
              style={{ width: "100%", height: 48, background: "#C8A96A", color: "#0A0A0B", border: 0, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function PieceRow({
  item,
  onSwap,
  inCart,
  onAdd,
}: {
  item: LookItem;
  onSwap?: (slot: LookItem["slot"]) => void;
  inCart?: boolean;
  onAdd?: () => void;
}) {
  return (
    <li style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 0" }}>
      <a
        href={item.url}
        target="_blank"
        rel="noopener"
        style={{ display: "flex", flex: 1, minWidth: 0, alignItems: "center", gap: 12, textDecoration: "none", color: "inherit" }}
      >
        <div style={{ width: 72, height: 72, flexShrink: 0, background: "#F5F4F2", overflow: "hidden", position: "relative" }}>
          <Image src={item.image} alt={item.name} fill sizes="72px" style={{ objectFit: "cover", objectPosition: "50% 20%" }} unoptimized />
        </div>
        <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 12, color: "#9C978E" }}>
            {SLOT_LABELS[item.slot]} · {item.storeName}
          </span>
          <span style={{ fontSize: 14 }}>{displayName(item.name, item.storeName)}</span>
          <span style={{ fontSize: 14, fontVariantNumeric: "tabular-nums" }}>{sgd(item.price)}</span>
        </span>
      </a>
      {onSwap ? (
        <span style={{ display: "flex", flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => onSwap(item.slot)}
            style={{ background: "none", border: 0, padding: 0, color: "#ECEBE8", fontSize: 13, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline", textUnderlineOffset: 3 }}
          >
            Swap
          </button>
        </span>
      ) : onAdd ? (
        <span style={{ display: "flex", flexShrink: 0, flexDirection: "column", gap: 6 }}>
          <a
            href={item.url}
            target="_blank"
            rel="noopener"
            style={{ color: "#9C978E", fontSize: 13, textDecoration: "underline", textUnderlineOffset: 3 }}
          >
            View
          </a>
          {inCart ? (
            <span style={{ fontSize: 13, color: "#9C978E" }}>In cart</span>
          ) : (
            <button
              type="button"
              onClick={onAdd}
              style={{ background: "none", border: 0, padding: 0, color: "#ECEBE8", fontSize: 13, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline", textUnderlineOffset: 3 }}
            >
              Add
            </button>
          )}
        </span>
      ) : null}
    </li>
  );
}

function FitRing({ score }: { score: number }) {
  const r = 32;
  const circ = 2 * Math.PI * r;
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setFilled(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const offset = filled ? circ - (score / 10) * circ : circ;
  const color = score >= 8 ? "var(--success)" : score >= 6 ? "var(--brass)" : "var(--danger)";

  return (
    <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }} aria-hidden>
      <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--surface)" strokeWidth="5" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={offset}
          style={{ transition: filled ? "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)" : "none" }}
        />
      </svg>
      <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1 }}>
        <span style={{ fontFamily: "var(--font-dm-serif), serif", fontSize: 21, color }}>{score.toFixed(1)}</span>
        <span style={{ marginTop: 2, fontSize: 11, color: "#9C978E" }}>/10</span>
      </div>
    </div>
  );
}

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

function LookSwitcher({
  looks,
  photo,
  active,
  onChoose,
}: {
  looks: Look[];
  photo: Photo | null;
  active: number;
  onChoose: (index: number) => void;
}) {
  return (
    <div role="tablist" aria-label="Choose a look" style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
      {looks.map((look, i) => {
        const on = active === i;
        const picture = look.renders.outfit ?? photo?.url;
        return (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={on}
            aria-label={`Look ${i + 1}: ${look.name}${look.fitCheck ? `, scored ${look.fitCheck.score.toFixed(1)}` : ""}`}
            onClick={() => onChoose(i)}
            style={{
              display: "flex",
              minHeight: 44,
              alignItems: "center",
              gap: 8,
              padding: 4,
              background: on ? "#ECEBE8" : "#141416",
              color: on ? "#0A0A0B" : "#ECEBE8",
              border: 0,
              cursor: "pointer",
              fontFamily: "inherit",
              textAlign: "left",
            }}
          >
            <span style={{ position: "relative", width: 40, height: 50, flexShrink: 0, overflow: "hidden", background: "#1C1C1F", display: "none" }}>
              {picture && <Image src={picture} alt="" fill sizes="48px" style={{ objectFit: "cover" }} {...RAW_IMG_PROPS} />}
            </span>
            <span style={{ flex: 1, minWidth: 0, padding: "4px 4px 4px 8px" }}>
              <span style={{ display: "block", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {look.name}
              </span>
              <span style={{ display: "block", fontSize: 12, fontVariantNumeric: "tabular-nums", color: on ? "#666" : "#9C978E" }}>
                {look.fitCheck ? `${look.fitCheck.score.toFixed(1)} of 10` : "Scoring…"}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function CartIcon({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={count > 0 ? `Cart: ${count} ${count === 1 ? "item" : "items"}` : "Cart"}
      style={{
        background: "none",
        border: 0,
        padding: 4,
        cursor: "pointer",
        position: "relative",
        color: count > 0 ? "#C8A96A" : "#9C978E",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "color 180ms ease",
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {count > 0 && (
        <span
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            minWidth: 15,
            height: 15,
            background: "#C8A96A",
            color: "#0A0A0B",
            borderRadius: "50%",
            fontSize: 9,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
            padding: "0 2px",
          }}
        >
          {count > 99 ? "99" : count}
        </span>
      )}
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
