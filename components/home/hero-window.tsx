import Image from "next/image";
import Link from "next/link";

const OCCASIONS = ["First Date", "Interview", "Wedding Guest", "CNY", "Company D&D", "Night Out"] as const;

export function HeroWindow() {
  return (
    <section
      aria-labelledby="hero-heading"
      style={{
        background: "#0A0A0B",
        color: "#ECEBE8",
        fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        @keyframes wmIn  { from { opacity:0; transform:translateY(10px)  } to { opacity:1; transform:none } }
        @keyframes wmRise{ from { opacity:0; transform:translateY(24px)  } to { opacity:1; transform:none } }
        @keyframes wmDash{ to   { stroke-dashoffset:-24 } }
        .wm-in { animation: wmIn   .8s cubic-bezier(.2,.7,.2,1)        both }
        .wm-r0 { animation: wmRise  1s cubic-bezier(.2,.7,.2,1)  .10s  both }
        .wm-r1 { animation: wmRise  1s cubic-bezier(.2,.7,.2,1)  .45s  both }
        .wm-r2 { animation: wmRise  1s cubic-bezier(.2,.7,.2,1)  .70s  both }
        .wm-r3 { animation: wmRise  1s cubic-bezier(.2,.7,.2,1)  .95s  both }
        .wm-dash { animation: wmDash 1.2s linear infinite }
        @media (prefers-reduced-motion: reduce) {
          .wm-in,.wm-r0,.wm-r1,.wm-r2,.wm-r3 { animation: none }
        }
        .hero-nav-link { color: #C9C5BD; text-decoration: none }
        .hero-nav-link:hover { color: #ECEBE8 }
        .hero-cta { background:#C8A96A; color:#0A0A0B; text-decoration:none }
        .hero-cta:hover { background:#D6BA80 }
        .hero-see { color:#ECEBE8; text-decoration:underline; text-underline-offset:5px; text-decoration-thickness:1px }
        .hero-see:hover { color:#C8A96A }
        .look-side { transition: transform .5s cubic-bezier(.2,.7,.2,1) }
        .look-side:hover { transform: translateY(-6px) }
        .look-center:hover .look-center-img { transform: scale(1.03) }
        .look-center-img { transition: transform .6s cubic-bezier(.2,.7,.2,1) }
      `}</style>

      {/* ── Nav ── */}
      <header
        className="wm-in"
        style={{
          width: "100%",
          maxWidth: 1360,
          margin: "0 auto",
          padding: "0 24px",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-dm-serif), Georgia, serif",
            fontSize: 20,
            letterSpacing: "0.2em",
          }}
        >
          WINGMAN
        </span>
        <nav aria-label="Main" style={{ display: "flex", alignItems: "center", gap: 32, fontSize: 14, flexWrap: "wrap" }}>
          <a href="#looks" className="hero-nav-link">The Looks</a>
          <a href="#how" className="hero-nav-link">How It Works</a>
          <Link href="/style" className="hero-see">Style Me</Link>
        </nav>
      </header>

      {/* ── Body ── */}
      <div
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 1360,
          margin: "0 auto",
          padding: "16px 24px 48px",
          boxSizing: "border-box",
          display: "flex",
          flexWrap: "wrap",
          gap: 48,
          alignItems: "center",
        }}
      >
        {/* Left: text */}
        <div style={{ flex: "1 1 400px", minWidth: 0, display: "flex", flexDirection: "column" }}>
          <div className="wm-in" style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 13, color: "#9C978E" }}>
            <span>The Occasion Issue</span>
            <span style={{ width: 40, height: 1, background: "#C8A96A" }} />
            <span>Singapore</span>
          </div>

          <h1
            id="hero-heading"
            className="wm-r0"
            style={{
              margin: "28px 0 0",
              fontFamily: "var(--font-dm-serif), Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(48px, 6.4vw, 96px)",
              lineHeight: 0.94,
              letterSpacing: "-0.015em",
            }}
          >
            One Selfie.{" "}
            <span style={{ fontStyle: "italic", color: "#C8A96A" }}>Three Ways</span>
            <br />to Walk In.
          </h1>

          <p
            className="wm-r1"
            style={{ margin: "28px 0 0", fontSize: 17, lineHeight: 1.6, color: "#C9C5BD", maxWidth: 440 }}
          >
            Tell Wingman where you&apos;re going. It builds full looks from real Singapore stores
            and tries each one on your photo, scored for the occasion.
          </p>

          <div className="wm-r2" style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 8 }} aria-label="Occasions">
            {OCCASIONS.map((o) => (
              <span
                key={o}
                style={{
                  background: o === "Wedding Guest" ? "#ECEBE8" : "#1C1C1F",
                  color: o === "Wedding Guest" ? "#0A0A0B" : "#ECEBE8",
                  fontWeight: o === "Wedding Guest" ? 600 : 400,
                  padding: "8px 12px",
                  fontSize: 13,
                }}
              >
                {o}
              </span>
            ))}
          </div>

          <div className="wm-r3" style={{ marginTop: 40, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 32 }}>
            <Link
              href="/style"
              className="hero-cta"
              style={{
                height: 56,
                padding: "0 32px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              Upload Your Photo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </Link>
            <a href="#how" className="hero-see" style={{ fontSize: 15 }}>See How It Works</a>
          </div>
        </div>

        {/* Right: look card composition */}
        <div
          style={{
            flex: "1 1 560px",
            minWidth: 300,
            maxWidth: 760,
            position: "relative",
            aspectRatio: "6 / 5",
          }}
        >
          {/* Dashed gold arc */}
          <svg
            className="wm-r0"
            aria-hidden
            viewBox="0 0 600 500"
            preserveAspectRatio="none"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}
          >
            <path
              className="wm-dash"
              d="M78 380 C 110 320, 150 300, 190 290"
              stroke="#C8A96A"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Left card — Navy Classic */}
          <figure
            className="wm-r2 look-side"
            style={{ position: "absolute", left: 0, top: "10%", width: "33%", margin: 0 }}
          >
            <div style={{ position: "relative", aspectRatio: "3 / 4", overflow: "hidden" }}>
              <Image
                src="/home/lookbook-3.jpg"
                alt="Navy Classic look — Colony Clothing Ring Jacket navy blazer"
                fill
                sizes="25vw"
                style={{ objectFit: "cover", objectPosition: "50% 8%", transform: "scale(1.15)", transformOrigin: "50% 15%" }}
                unoptimized
              />
            </div>
            <figcaption style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 13 }}>
              <span>Navy Classic</span>
              <span style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 17 }}>7.8</span>
            </figcaption>
          </figure>

          {/* Right card — Velvet Midnight */}
          <figure
            className="wm-r3 look-side"
            style={{ position: "absolute", right: 0, top: "2%", width: "33%", margin: 0 }}
          >
            <div style={{ position: "relative", aspectRatio: "3 / 4", overflow: "hidden" }}>
              <Image
                src="/home/lookbook-1.jpg"
                alt="Velvet Midnight look — Kevin Seah deep red velvet jacket"
                fill
                sizes="25vw"
                style={{ objectFit: "cover", objectPosition: "50% 8%", transform: "scale(1.15)", transformOrigin: "50% 15%" }}
                unoptimized
              />
            </div>
            <figcaption style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 13 }}>
              <span>Velvet Midnight</span>
              <span style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 17 }}>8.7</span>
            </figcaption>
          </figure>

          {/* Center card — Warm Pinstripe (featured) */}
          <figure
            className="wm-r1 look-center"
            style={{
              position: "absolute",
              left: "26%",
              top: "6%",
              width: "48%",
              margin: 0,
              background: "#0A0A0B",
              padding: "0 10px 10px",
              zIndex: 1,
            }}
          >
            <div style={{ position: "relative", aspectRatio: "3 / 4", overflow: "hidden" }}>
              <Image
                src="/home/lookbook-2.jpg"
                alt="Warm Pinstripe look — The Jacket Maker brown double-breasted suit"
                fill
                sizes="35vw"
                className="look-center-img"
                style={{ objectFit: "cover", objectPosition: "50% 8%", transform: "scale(1.15)", transformOrigin: "50% 15%" }}
                unoptimized
              />
              {/* Fit score badge */}
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  width: 72,
                  height: 72,
                  background: "#0A0A0B",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <span style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 30, lineHeight: 1, color: "#C8A96A" }}>8.3</span>
                <span style={{ fontSize: 10, color: "#9C978E" }}>Fit score</span>
              </div>
              <span
                style={{
                  position: "absolute",
                  top: 14,
                  left: 14,
                  background: "#C8A96A",
                  color: "#0A0A0B",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "5px 8px",
                }}
              >
                Top pick
              </span>
            </div>
            <figcaption style={{ paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 22 }}>Warm Pinstripe</span>
                <span style={{ fontSize: 12, color: "#9C978E" }}>The Jacket Maker</span>
              </div>
              <span style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 20 }}>S$3,079</span>
            </figcaption>
          </figure>

          {/* Selfie card */}
          <figure
            className="wm-r0"
            style={{ position: "absolute", left: "2%", bottom: 0, width: "17%", margin: 0, display: "flex", flexDirection: "column", gap: 8 }}
          >
            <div
              style={{
                position: "relative",
                aspectRatio: "3 / 4",
                overflow: "hidden",
                outline: "1px dashed #C8A96A",
                outlineOffset: 4,
              }}
            >
              <Image
                src="/home/selfie-placeholder.jpg"
                alt="Your selfie — the starting photo"
                fill
                sizes="12vw"
                style={{ objectFit: "cover", objectPosition: "50% 8%", transform: "scale(1.15)", transformOrigin: "50% 15%" }}
                unoptimized
              />
            </div>
            <figcaption style={{ fontSize: 12, color: "#C8A96A" }}>Your one selfie</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
