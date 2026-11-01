export function PrivacyBand() {
  return (
    <section id="privacy" aria-labelledby="privacy-heading" style={{ background: "#141416" }}>
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "72px 24px",
          boxSizing: "border-box",
          display: "flex",
          flexWrap: "wrap",
          gap: "32px",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <div aria-hidden="true" style={{ position: "relative", width: "84px", height: "112px", flexShrink: 0 }}>
            <div style={{ width: "84px", height: "112px", overflow: "hidden", opacity: 0.55 }}>
              <svg
                viewBox="0 0 600 900"
                preserveAspectRatio="xMidYMid slice"
                style={{ width: "100%", height: "100%", display: "block" }}
                aria-hidden="true"
              >
                <rect width="600" height="900" fill="#3A3632" />
                <path d="M40 900 L58 640 Q70 520 160 486 L246 452 L300 486 L354 452 L440 486 Q530 520 542 640 L560 900 Z" fill="#55504A" />
                <path d="M262 360 L338 360 L346 470 L300 490 L254 470 Z" fill="#3E342D" />
                <ellipse cx="300" cy="288" rx="80" ry="100" fill="#46392F" />
                <path d="M218 270 Q214 180 300 176 Q388 178 384 268 Q372 222 300 218 Q236 220 218 270 Z" fill="#16130F" />
              </svg>
            </div>
            <span
              style={{
                position: "absolute",
                right: "-12px",
                bottom: "-12px",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#E06C5F",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A0A0B" strokeWidth="2" aria-label="Delete">
                <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
              </svg>
            </span>
          </div>
          <h2
            id="privacy-heading"
            style={{
              margin: 0,
              fontFamily: "var(--font-dm-serif), Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(30px, 3.6vw, 44px)",
              lineHeight: 1.05,
            }}
          >
            One Photo.{" "}
            <span style={{ fontStyle: "italic", color: "#C8A96A" }}>Yours to Delete.</span>
          </h2>
        </div>
        <p style={{ margin: 0, fontSize: "16px", lineHeight: 1.6, color: "#9C978E", maxWidth: "440px" }}>
          Your selfie is only used to render your try-ons. Delete it from any screen and it&apos;s gone.
        </p>
      </div>
    </section>
  );
}
