import Image from "next/image";

export function BeforeAfter() {
  return (
    <section aria-labelledby="ba-heading" style={{ background: "#1C1A17" }}>
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "120px 24px",
          boxSizing: "border-box",
          display: "flex",
          flexWrap: "wrap",
          gap: "64px",
          alignItems: "center",
        }}
      >
        {/* Photos side-by-side */}
        <div
          style={{
            flex: "1 1 520px",
            minWidth: 0,
            display: "flex",
            gap: "16px",
            alignItems: "flex-end",
          }}
        >
          {/* Before */}
          <figure style={{ flex: 1, margin: "0 0 48px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ position: "relative", aspectRatio: "3 / 4", overflow: "hidden" }}>
              <Image
                src="/home/before.jpg"
                alt="Before: the plain selfie you upload"
                fill
                sizes="(min-width: 1024px) 25vw, 45vw"
                style={{ objectFit: "cover", objectPosition: "50% 20%" }}
                unoptimized
              />
            </div>
            <figcaption style={{ fontSize: "13px", color: "#9C978E" }}>Before · your selfie</figcaption>
          </figure>

          {/* After (larger) */}
          <figure style={{ flex: 1.25, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ position: "relative", aspectRatio: "3 / 4", overflow: "hidden" }}>
              <Image
                src="/home/wedding.jpg"
                alt="After: Ballroom Navy look tried on the selfie"
                fill
                sizes="(min-width: 1024px) 31vw, 55vw"
                style={{ objectFit: "cover", objectPosition: "50% 20%" }}
                unoptimized
              />
              {/* Scan line */}
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
                  animation: "wmScan 5s cubic-bezier(0.45, 0, 0.55, 1) infinite",
                }}
              >
                <div style={{ flex: 1, background: "rgba(200,169,106,0.07)" }} />
                <div style={{ height: 2, background: "#C8A96A" }} />
              </div>
            </div>
            <figcaption style={{ fontSize: "13px", color: "#9C978E" }}>After · Ballroom Navy, on you</figcaption>
          </figure>
        </div>

        {/* Copy */}
        <div style={{ flex: "1 1 380px", minWidth: 0, display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "13px", color: "#9C978E" }}>The try-on</span>
          <h2
            id="ba-heading"
            style={{
              margin: "16px 0 0",
              fontFamily: "var(--font-dm-serif), Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(40px, 5vw, 64px)",
              lineHeight: 1,
            }}
          >
            You&apos;re the Model in{" "}
            <span style={{ fontStyle: "italic", color: "#C8A96A" }}>Every Shot.</span>
          </h2>
          <p style={{ margin: "24px 0 0", fontSize: "17px", lineHeight: 1.65, color: "#9C978E" }}>
            No mannequins, no guessing from a flat lay. You judge the colours against your own skin and the cut
            against your own frame, before a single dollar moves.
          </p>
          <p style={{ margin: "20px 0 0", fontSize: "17px", lineHeight: 1.65, color: "#9C978E" }}>
            And the night before, Wingman sends a short prep plan, so the day itself is just getting dressed.
          </p>
        </div>
      </div>
    </section>
  );
}
