import Image from "next/image";

export function BeforeAfter() {
  return (
    <section
      aria-labelledby="tryon-heading"
      style={{
        background: "#0F0F11",
        overflow: "hidden",
        display: "flex",
        minHeight: "680px",
      }}
    >
      {/* Render — bleeds to the left viewport edge, no margin */}
      <div
        style={{
          flex: "0 0 clamp(320px, 44vw, 560px)",
          position: "relative",
          overflow: "hidden",
          borderRight: "2px solid #C8A96A",
        }}
      >
        <Image
          src="/home/wedding.jpg"
          alt="Ballroom Navy look rendered on a selfie"
          fill
          priority
          sizes="(min-width: 1024px) 44vw, 90vw"
          style={{ objectFit: "cover", objectPosition: "50% 15%" }}
          unoptimized
        />

        {/* Scan line */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 100,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            animation: "wmScan 4.5s cubic-bezier(0.45, 0, 0.55, 1) infinite",
          }}
        >
          <div style={{ flex: 1, background: "rgba(200,169,106,0.06)" }} />
          <div style={{ height: 2, background: "#C8A96A" }} />
        </div>

        {/* Bottom scrim */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 180,
            background: "linear-gradient(to top, rgba(15,15,17,0.88), transparent)",
          }}
        />

        {/* Look label */}
        <div
          style={{
            position: "absolute",
            left: 32,
            bottom: 32,
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}
        >
          <span style={{ fontSize: 12, color: "#9C978E", letterSpacing: "0.02em" }}>
            Rendered look
          </span>
          <span
            style={{
              fontFamily: "var(--font-dm-serif), Georgia, serif",
              fontSize: 20,
              color: "#ECEBE8",
            }}
          >
            Ballroom Navy
          </span>
        </div>
      </div>

      {/* Copy — right side */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px clamp(40px, 7vw, 120px) 80px clamp(40px, 5vw, 96px)",
          boxSizing: "border-box",
        }}
      >
        <h2
          id="tryon-heading"
          style={{
            margin: 0,
            fontFamily: "var(--font-dm-serif), Georgia, serif",
            fontWeight: 400,
            fontSize: "clamp(44px, 4.5vw, 68px)",
            lineHeight: 1.05,
            color: "#ECEBE8",
          }}
        >
          On you.
          <br />
          Not a mannequin.
        </h2>

        <div
          aria-hidden="true"
          style={{ width: 52, height: 2, background: "#C8A96A", margin: "32px 0" }}
        />

        <p
          style={{
            margin: 0,
            fontSize: 17,
            lineHeight: 1.65,
            color: "#9C978E",
            maxWidth: 420,
          }}
        >
          Every look is rendered onto your photo before you decide. Judge the colours against your
          own skin and the cut against your own frame, before a single dollar moves.
        </p>
        <p
          style={{
            margin: "20px 0 0",
            fontSize: 17,
            lineHeight: 1.65,
            color: "#9C978E",
            maxWidth: 420,
          }}
        >
          The night before, a short grooming prep plan. So the day itself is just getting dressed.
        </p>

        {/* Proof row */}
        <div
          style={{
            marginTop: 52,
            display: "flex",
            gap: 40,
            flexWrap: "wrap",
          }}
        >
          {[
            ["2–3", "looks per occasion"],
            ["15+", "Singapore stores"],
            ["0", "payment to Wingman"],
          ].map(([num, label]) => (
            <div key={num + label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span
                style={{
                  fontFamily: "var(--font-dm-serif), Georgia, serif",
                  fontSize: 36,
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
    </section>
  );
}
