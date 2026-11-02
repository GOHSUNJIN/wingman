import Image from "next/image";
import Link from "next/link";

export function FinalCta() {
  return (
    <section aria-labelledby="cta-heading" style={{ background: "#0A0A0B", overflow: "hidden" }}>
      <style>{`
        .cta-btn { background: #C8A96A; color: #0A0A0B; text-decoration: none; display: inline-flex; align-items: center; gap: 12px; transition: background .2s }
        .cta-btn:hover { background: #D9BD85 }
        .cta-card-l { transform: rotate(-3deg); transform-origin: bottom center; transition: transform .5s cubic-bezier(.2,.7,.2,1) }
        .cta-card-l:hover { transform: rotate(0deg) translateY(-8px) }
        .cta-card-r { transform: rotate(3deg); transform-origin: bottom center; transition: transform .5s cubic-bezier(.2,.7,.2,1) }
        .cta-card-r:hover { transform: rotate(0deg) translateY(-8px) }
      `}</style>

      <div
        style={{
          maxWidth: "1360px",
          margin: "0 auto",
          padding: "120px 24px 100px",
          boxSizing: "border-box",
          display: "flex",
          flexWrap: "wrap",
          gap: 64,
          alignItems: "center",
        }}
      >
        {/* Left: text */}
        <div style={{ flex: "1 1 420px", minWidth: 0 }}>
          <div style={{ width: 44, height: 2, background: "#C8A96A", marginBottom: 40 }} aria-hidden="true" />

          <h2
            id="cta-heading"
            style={{
              margin: 0,
              fontFamily: "var(--font-dm-serif), Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(48px, 6vw, 88px)",
              lineHeight: 0.95,
              letterSpacing: "-0.015em",
              color: "#ECEBE8",
            }}
          >
            Got somewhere
            <br />
            to be?{" "}
            <span style={{ fontStyle: "italic", color: "#C8A96A" }}>Walk in</span>
            <br />
            <span style={{ fontStyle: "italic", color: "#C8A96A" }}>already sure.</span>
          </h2>

          <p
            style={{
              margin: "28px 0 0",
              fontSize: 16,
              lineHeight: 1.65,
              color: "#9C978E",
              maxWidth: 380,
            }}
          >
            One selfie. Tell Wingman the occasion. Three full looks
            from real Singapore stores, tried on your photo in about a minute.
          </p>

          <Link
            href="/style"
            className="cta-btn"
            style={{
              marginTop: 48,
              height: 60,
              padding: "0 36px",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            Upload Your Photo
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
              <path d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </Link>

          <div
            style={{
              marginTop: 48,
              display: "flex",
              gap: 40,
              flexWrap: "wrap",
            }}
          >
            {[
              ["2-3", "looks per occasion"],
              ["15+", "Singapore stores"],
              ["0", "payment to Wingman"],
            ].map(([num, label]) => (
              <div key={num} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span
                  style={{
                    fontFamily: "var(--font-dm-serif), Georgia, serif",
                    fontSize: 34,
                    lineHeight: 1,
                    color: "#ECEBE8",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {num}
                </span>
                <span style={{ fontSize: 13, color: "#9C978E" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: staggered render cards */}
        <div
          style={{
            flex: "1 1 480px",
            minWidth: 300,
            maxWidth: 640,
            position: "relative",
            aspectRatio: "4 / 3",
          }}
        >
          {/* Left card */}
          <figure
            className="cta-card-l"
            style={{
              position: "absolute",
              left: 0,
              top: "18%",
              width: "32%",
              margin: 0,
            }}
          >
            <div style={{ position: "relative", aspectRatio: "3 / 4", overflow: "hidden" }}>
              <Image
                src="/home/lookbook-1.jpg"
                alt="Velvet look render"
                fill
                sizes="20vw"
                style={{ objectFit: "cover", objectPosition: "50% 10%" }}
                unoptimized
              />
            </div>
            <figcaption
              style={{
                marginTop: 8,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                fontSize: 13,
                color: "#9C978E",
              }}
            >
              <span>Velvet Midnight</span>
              <span style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 15, color: "#ECEBE8" }}>8.7</span>
            </figcaption>
          </figure>

          {/* Center card - featured */}
          <figure
            style={{
              position: "absolute",
              left: "28%",
              top: 0,
              width: "44%",
              margin: 0,
              background: "#0A0A0B",
              padding: "0 6px 6px",
              zIndex: 1,
              outline: "2px solid #C8A96A",
              outlineOffset: "4px",
            }}
          >
            <div style={{ position: "relative", aspectRatio: "3 / 4", overflow: "hidden" }}>
              <Image
                src="/home/lookbook-2.jpg"
                alt="Warm Pinstripe look render"
                fill
                sizes="28vw"
                style={{ objectFit: "cover", objectPosition: "50% 10%" }}
                unoptimized
              />
              <span
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  background: "#C8A96A",
                  color: "#0A0A0B",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "4px 8px",
                }}
              >
                Top pick
              </span>
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  width: 56,
                  height: 56,
                  background: "#0A0A0B",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <span style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 22, lineHeight: 1, color: "#C8A96A" }}>8.3</span>
                <span style={{ fontSize: 9, color: "#9C978E" }}>Fit score</span>
              </div>
            </div>
            <figcaption style={{ paddingTop: 8, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 17, color: "#ECEBE8" }}>Warm Pinstripe</span>
              <span style={{ fontSize: 13, color: "#9C978E" }}>S$3,079</span>
            </figcaption>
          </figure>

          {/* Right card */}
          <figure
            className="cta-card-r"
            style={{
              position: "absolute",
              right: 0,
              top: "12%",
              width: "28%",
              margin: 0,
            }}
          >
            <div style={{ position: "relative", aspectRatio: "3 / 4", overflow: "hidden" }}>
              <Image
                src="/home/lookbook-3.jpg"
                alt="Navy Classic look render"
                fill
                sizes="18vw"
                style={{ objectFit: "cover", objectPosition: "50% 10%" }}
                unoptimized
              />
            </div>
            <figcaption
              style={{
                marginTop: 8,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                fontSize: 13,
                color: "#9C978E",
              }}
            >
              <span>Navy Classic</span>
              <span style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 15, color: "#ECEBE8" }}>7.8</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
