import Link from "next/link";

export function FinalCta() {
  return (
    <section aria-labelledby="cta-heading" style={{ position: "relative", background: "#2B2722", overflow: "hidden" }}>
      {/* Background figure */}
      <svg
        viewBox="0 0 600 900"
        preserveAspectRatio="xMidYMin slice"
        style={{
          position: "absolute",
          right: "-4%",
          top: 0,
          height: "160%",
          width: "auto",
          display: "block",
          opacity: 0.55,
        }}
        aria-hidden="true"
      >
        <path d="M40 900 L58 640 Q70 520 160 486 L246 452 L300 486 L354 452 L440 486 Q530 520 542 640 L560 900 Z" fill="#1A1E2B" />
        <path d="M246 452 L300 486 L354 452 L336 600 L300 660 L264 600 Z" fill="#E4E0D8" />
        <path d="M292 496 L308 496 L314 520 L318 690 L300 716 L282 690 L286 520 Z" fill="#6B4A32" />
        <path d="M262 360 L338 360 L346 470 L300 490 L254 470 Z" fill="#3E342D" />
        <ellipse cx="300" cy="288" rx="80" ry="100" fill="#46392F" />
        <path d="M218 270 Q214 180 300 176 Q388 178 384 268 Q372 222 300 218 Q236 220 218 270 Z" fill="#16130F" />
      </svg>

      {/* Left-to-right scrim */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(43,39,34,1) 35%, rgba(43,39,34,0.2))",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "160px 24px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: "13px", color: "#C9C5BD" }}>Got somewhere to be?</span>
        <h2
          id="cta-heading"
          style={{
            margin: "18px 0 0",
            fontFamily: "var(--font-dm-serif), Georgia, serif",
            fontWeight: 400,
            fontSize: "clamp(48px, 7.6vw, 112px)",
            lineHeight: 0.95,
            maxWidth: "760px",
          }}
        >
          Walk In{" "}
          <span style={{ fontStyle: "italic", color: "#C8A96A" }}>Already Sure.</span>
        </h2>
        <Link
          href="/style"
          style={{
            marginTop: "44px",
            fontFamily: "var(--font-dm-serif), Georgia, serif",
            fontSize: "32px",
            color: "#ECEBE8",
            textDecoration: "underline",
            textUnderlineOffset: "5px",
            textDecorationThickness: "1px",
          }}
        >
          Upload Your Photo →
        </Link>
      </div>
    </section>
  );
}
