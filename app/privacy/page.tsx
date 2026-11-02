import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#0A0A0B",
        color: "#ECEBE8",
        fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
      }}
    >
      <header
        style={{
          height: 64,
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
          maxWidth: 720,
          margin: "0 auto",
          padding: "72px 40px 96px",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-dm-serif), Georgia, serif",
            fontWeight: 400,
            fontSize: "clamp(36px, 4vw, 56px)",
            lineHeight: 1,
            letterSpacing: "-0.015em",
          }}
        >
          Privacy
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 14, color: "#9C978E" }}>Last updated November 2026</p>

        <div
          style={{
            marginTop: 48,
            display: "flex",
            flexDirection: "column",
            gap: 40,
            fontSize: 16,
            lineHeight: 1.7,
            color: "#C9C5BD",
          }}
        >
          <section>
            <h2
              style={{
                margin: "0 0 12px",
                fontFamily: "var(--font-dm-serif), Georgia, serif",
                fontWeight: 400,
                fontSize: 24,
                color: "#ECEBE8",
              }}
            >
              Your photo
            </h2>
            <p style={{ margin: 0 }}>
              Your selfie is used only to render virtual try-ons during your session. It is never
              stored on a permanent basis. Rendered images are cached for up to 24 hours to avoid
              re-running the same try-on, then automatically deleted. You can delete your photo at
              any time by pressing the Delete My Photo button on your looks page.
            </p>
          </section>

          <section>
            <h2
              style={{
                margin: "0 0 12px",
                fontFamily: "var(--font-dm-serif), Georgia, serif",
                fontWeight: 400,
                fontSize: 24,
                color: "#ECEBE8",
              }}
            >
              What we collect
            </h2>
            <p style={{ margin: 0 }}>
              Wingman does not require an account and collects no personally identifiable information.
              We do not store your name, email, or payment details. Occasion inputs and budget
              preferences are held only in your browser session and are not linked to you.
            </p>
          </section>

          <section>
            <h2
              style={{
                margin: "0 0 12px",
                fontFamily: "var(--font-dm-serif), Georgia, serif",
                fontWeight: 400,
                fontSize: 24,
                color: "#ECEBE8",
              }}
            >
              Third-party services
            </h2>
            <p style={{ margin: 0 }}>
              Virtual try-on rendering is powered by YouCam (Perfect Corp). Your photo is transmitted
              to their API solely for the purpose of rendering your look and is subject to their data
              handling policies. Product data is sourced from public Shopify feeds of Singapore
              menswear stores. Checkout happens directly on each store&apos;s own website; Wingman
              never sees or handles any payment information.
            </p>
          </section>

          <section>
            <h2
              style={{
                margin: "0 0 12px",
                fontFamily: "var(--font-dm-serif), Georgia, serif",
                fontWeight: 400,
                fontSize: 24,
                color: "#ECEBE8",
              }}
            >
              Grooming tips
            </h2>
            <p style={{ margin: 0 }}>
              Skin analysis is used only to suggest a night-before grooming routine. Results are
              general skincare tips and are not medical advice. Analysis data is not stored beyond
              your session.
            </p>
          </section>

          <section>
            <h2
              style={{
                margin: "0 0 12px",
                fontFamily: "var(--font-dm-serif), Georgia, serif",
                fontWeight: 400,
                fontSize: 24,
                color: "#ECEBE8",
              }}
            >
              Questions
            </h2>
            <p style={{ margin: 0 }}>
              If you have any questions about how your data is handled, visit the{" "}
              <Link href="/contact" style={{ color: "#C8A96A", textDecoration: "underline", textUnderlineOffset: 4 }}>
                contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
