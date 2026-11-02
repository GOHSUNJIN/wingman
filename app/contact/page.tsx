import Link from "next/link";

export default function ContactPage() {
  return (
    <div
      style={{
        height: "100dvh",
        background: "#0A0A0B",
        color: "#ECEBE8",
        fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
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
            fontFamily: "var(--font-dm-serif), Georgia, serif",
            fontSize: 20,
            letterSpacing: "0.2em",
            color: "#ECEBE8",
            textDecoration: "none",
          }}
        >
          WINGMAN
        </Link>
        <Link href="/" style={{ fontSize: 13, color: "#9C978E", textDecoration: "none" }}>
          Back to home
        </Link>
      </header>

      <main
        style={{
          flex: 1,
          maxWidth: 720,
          width: "100%",
          margin: "0 auto",
          padding: "44px 40px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-dm-serif), Georgia, serif",
            fontWeight: 400,
            fontSize: "clamp(32px, 3.5vw, 48px)",
            lineHeight: 1,
            letterSpacing: "-0.015em",
          }}
        >
          Contact
        </h1>

        {/* Project card */}
        <div
          style={{
            background: "#141416",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <span style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9C978E" }}>
            Project
          </span>
          <span style={{ fontSize: 15, color: "#ECEBE8", lineHeight: 1.5 }}>
            Wingman is a hackathon project built for the{" "}
            <span style={{ color: "#C8A96A" }}>YouCam API Skin AI and eCommerce VTO Hackathon</span>{" "}
            by Perfect Corp on Devpost.
          </span>
        </div>

        {/* Developed by */}
        <section>
          <h2
            style={{
              margin: "0 0 12px",
              fontFamily: "var(--font-dm-serif), Georgia, serif",
              fontWeight: 400,
              fontSize: 22,
              color: "#ECEBE8",
            }}
          >
            Developed by
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                background: "#141416",
                padding: "14px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 500 }}>Sun Jin</span>
              <a
                href="https://gohsunjin.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 13,
                  color: "#C8A96A",
                  textDecoration: "underline",
                  textUnderlineOffset: 4,
                  textDecorationThickness: 1,
                }}
              >
                gohsunjin.vercel.app
              </a>
            </div>
            <div
              style={{
                background: "#141416",
                padding: "14px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 500 }}>Ritish</span>
              {/* Add Ritish link here once URL is provided */}
            </div>
          </div>
        </section>

        {/* About */}
        <section>
          <h2
            style={{
              margin: "0 0 10px",
              fontFamily: "var(--font-dm-serif), Georgia, serif",
              fontWeight: 400,
              fontSize: 22,
              color: "#ECEBE8",
            }}
          >
            About the project
          </h2>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: "#C9C5BD" }}>
            Wingman lets you upload a selfie, describe an occasion, and receive two to three full looks from real
            Singapore menswear stores, tried on your photo using the YouCam Virtual Try-On API. Every item links
            directly to the store for checkout. Built with Next.js, Supabase, Anthropic Claude, and Perfect Corp YouCam APIs.
          </p>
        </section>
      </main>
    </div>
  );
}
