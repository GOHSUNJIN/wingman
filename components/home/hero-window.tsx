import Image from "next/image";
import Link from "next/link";

type Props = {
  after: string;
  alt: string;
};

export function HeroWindow({ after, alt }: Props) {
  return (
    <section
      aria-labelledby="hero-heading"
      style={{
        height: "100dvh",
        background: "#0A0A0B",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Nav */}
      <header
        style={{
          height: 72,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(24px, 5vw, 80px)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-dm-serif), Georgia, serif",
            fontSize: "20px",
            letterSpacing: "0.2em",
            color: "#ECEBE8",
          }}
        >
          WINGMAN
        </span>
        <nav aria-label="Main" style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          <a href="#looks" style={{ fontSize: "14px", color: "#9C978E", textDecoration: "none" }}>
            The looks
          </a>
          <a href="#how" style={{ fontSize: "14px", color: "#9C978E", textDecoration: "none" }}>
            How it works
          </a>
          <Link
            href="/style"
            style={{
              fontSize: "14px",
              color: "#ECEBE8",
              textDecoration: "none",
              borderBottom: "1px solid #C8A96A",
              paddingBottom: "2px",
            }}
          >
            Style me
          </Link>
        </nav>
      </header>

      {/* Main: text left, render right */}
      <div
        style={{
          flex: 1,
          display: "flex",
          minHeight: 0,
        }}
      >
        {/* Left: headline + CTA */}
        <div
          style={{
            flex: "0 0 clamp(340px, 48%, 600px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 clamp(24px, 5vw, 80px) 80px",
          }}
        >
          <h1
            id="hero-heading"
            style={{
              margin: 0,
              fontFamily: "var(--font-dm-serif), Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(52px, 6vw, 88px)",
              lineHeight: 1.0,
              color: "#ECEBE8",
            }}
          >
            Walk In
            <br />
            <span style={{ fontStyle: "italic", color: "#C8A96A" }}>Already Sure.</span>
          </h1>

          <p
            style={{
              margin: "28px 0 0",
              fontSize: "17px",
              lineHeight: 1.6,
              color: "#9C978E",
              maxWidth: "36ch",
            }}
          >
            One photo, one sentence about the occasion. Wingman builds you 2–3 full looks from
            real Singapore stores and tries them on your selfie before you spend a cent.
          </p>

          <div style={{ marginTop: "44px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <Link
              href="/style"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                height: "54px",
                padding: "0 28px",
                background: "#C8A96A",
                color: "#0A0A0B",
                textDecoration: "none",
                fontSize: "15px",
                fontWeight: 600,
                fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
                alignSelf: "flex-start",
              }}
            >
              Upload Your Photo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Right: render image */}
        <div
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Image
            src={after}
            alt={alt}
            fill
            priority
            sizes="52vw"
            style={{ objectFit: "cover", objectPosition: "50% 18%" }}
            unoptimized
          />
          {/* subtle left scrim so text doesn't compete */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to right, #0A0A0B 0%, transparent 25%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
