const STEPS = [
  {
    num: "1",
    heading: "Upload One Selfie",
    body: "Waist up, even light, facing the camera. It's the only photo Wingman needs and you can delete it any time.",
  },
  {
    num: "2",
    heading: "Tell Us the Occasion",
    body: "Pick the occasion, tell it about the venue and dress code in your own words and set a budget.",
  },
  {
    num: "3",
    heading: "See Every Look on You",
    body: "Complete outfits, each tried on your photo. Swap any piece or find a cheaper one and see it re-render.",
  },
] as const;

function Step1Illustration() {
  return (
    <div
      style={{
        position: "relative",
        height: "260px",
        background: "#1C1C1F",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "14px",
          left: "18px",
          fontFamily: "var(--font-dm-serif), Georgia, serif",
          fontSize: "56px",
          lineHeight: 1,
          color: "#C8A96A",
        }}
      >
        1
      </span>
      <div
        style={{
          width: "132px",
          height: "176px",
          outline: "1px dashed #6A665F",
          outlineOffset: "10px",
          overflow: "hidden",
        }}
      >
        <svg
          viewBox="0 0 600 900"
          preserveAspectRatio="xMidYMid slice"
          style={{ width: "100%", height: "100%", display: "block" }}
          aria-hidden="true"
        >
          <rect width="600" height="900" fill="#3A3632" />
          <path d="M40 900 L58 640 Q70 520 160 486 L246 452 L300 486 L354 452 L440 486 Q530 520 542 640 L560 900 Z" fill="#55504A" />
          <path d="M246 452 L300 486 L354 452 L336 600 L300 660 L264 600 Z" fill="#CFCAC1" />
          <path d="M262 360 L338 360 L346 470 L300 490 L254 470 Z" fill="#3E342D" />
          <ellipse cx="300" cy="288" rx="80" ry="100" fill="#46392F" />
          <path d="M218 270 Q214 180 300 176 Q388 178 384 268 Q372 222 300 218 Q236 220 218 270 Z" fill="#16130F" />
        </svg>
      </div>
      <div
        style={{
          position: "absolute",
          right: "16px",
          bottom: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          alignItems: "flex-end",
        }}
      >
        {["Even light", "Waist up", "Facing camera"].map((label) => (
          <span
            key={label}
            style={{
              background: "#0A0A0B",
              padding: "5px 9px",
              fontSize: "12px",
              display: "flex",
              gap: "6px",
              alignItems: "center",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5FB58A" strokeWidth="3" aria-hidden="true">
              <path d="M4 12l5 5L20 6" />
            </svg>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function Step2Illustration() {
  return (
    <div
      style={{
        position: "relative",
        height: "260px",
        background: "#1C1C1F",
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: "0 20px 22px",
        boxSizing: "border-box",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "14px",
          left: "18px",
          fontFamily: "var(--font-dm-serif), Georgia, serif",
          fontSize: "56px",
          lineHeight: 1,
          color: "#C8A96A",
        }}
      >
        2
      </span>
      <div style={{ width: "100%", maxWidth: "300px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <span style={{ background: "#ECEBE8", color: "#0A0A0B", fontSize: "12px", fontWeight: 600, padding: "7px 11px" }}>
            Wedding Guest
          </span>
          <span style={{ background: "#26262A", fontSize: "12px", padding: "7px 11px" }}>Interview</span>
          <span style={{ background: "#26262A", fontSize: "12px", padding: "7px 11px" }}>CNY</span>
        </div>
        <div
          style={{
            background: "#0A0A0B",
            padding: "12px 14px",
            fontSize: "12px",
            lineHeight: 1.5,
            color: "#C9C5BD",
          }}
        >
          Hotel ballroom, Saturday 7pm. Smart formal, don&apos;t upstage the groom.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "6px" }}>
          {[
            { label: "Budget", range: "S$150+", selected: false },
            { label: "Mid-range", range: "S$350+", selected: true },
            { label: "Luxury", range: "S$800+", selected: false },
          ].map((t) => (
            <span
              key={t.label}
              style={{
                background: "#141416",
                outline: t.selected ? "1px solid #ECEBE8" : "none",
                outlineOffset: t.selected ? "-1px" : undefined,
                padding: "8px 10px",
                fontSize: "11px",
                color: "#9C978E",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              {t.label}
              <span style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: "15px", color: "#ECEBE8" }}>
                {t.range}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const THUMBS = [
  { bg: "#4A4238", jacket: "#1A1E2B", shirt: "#E4E0D8", score: "8.4", gold: true },
  { bg: "#5B5246", jacket: "#3C3C42", shirt: "#D9CDB5", score: "7.9", gold: false },
  { bg: "#2E3A3E", jacket: "#4E5140", shirt: "#E6DCC8", score: "7.2", gold: false },
] as const;

function Step3Illustration() {
  return (
    <div
      style={{
        position: "relative",
        height: "260px",
        background: "#1C1C1F",
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: "8px",
        padding: "0 16px 20px",
        boxSizing: "border-box",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "14px",
          left: "18px",
          fontFamily: "var(--font-dm-serif), Georgia, serif",
          fontSize: "56px",
          lineHeight: 1,
          color: "#C8A96A",
        }}
      >
        3
      </span>
      {THUMBS.map((t) => (
        <div key={t.score} style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" }}>
          <div style={{ width: "84px", height: "112px", overflow: "hidden" }} aria-hidden="true">
            <svg
              viewBox="0 0 600 900"
              preserveAspectRatio="xMidYMid slice"
              style={{ width: "100%", height: "100%", display: "block" }}
            >
              <rect width="600" height="900" fill={t.bg} />
              <path d="M40 900 L58 640 Q70 520 160 486 L246 452 L300 486 L354 452 L440 486 Q530 520 542 640 L560 900 Z" fill={t.jacket} />
              <path d="M246 452 L300 486 L354 452 L336 600 L300 660 L264 600 Z" fill={t.shirt} />
              <path d="M262 360 L338 360 L346 470 L300 490 L254 470 Z" fill="#3E342D" />
              <ellipse cx="300" cy="288" rx="80" ry="100" fill="#46392F" />
              <path d="M218 270 Q214 180 300 176 Q388 178 384 268 Q372 222 300 218 Q236 220 218 270 Z" fill="#16130F" />
            </svg>
          </div>
          <span
            style={{
              fontFamily: "var(--font-dm-serif), Georgia, serif",
              fontSize: "18px",
              color: t.gold ? "#C8A96A" : "#ECEBE8",
            }}
          >
            {t.score}
          </span>
        </div>
      ))}
    </div>
  );
}

const ILLUSTRATIONS = [Step1Illustration, Step2Illustration, Step3Illustration];

export function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-heading">
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "120px 24px",
          boxSizing: "border-box",
        }}
      >
        <span style={{ fontSize: "15px", color: "#9C978E", textTransform: "uppercase", letterSpacing: "0.08em" }}>How it works</span>
        <h2
          id="how-heading"
          style={{
            margin: "16px 0 0",
            fontFamily: "var(--font-dm-serif), Georgia, serif",
            fontWeight: 400,
            fontSize: "clamp(40px, 5.4vw, 72px)",
            lineHeight: 1,
          }}
        >
          Three Steps.{" "}
          <span style={{ fontStyle: "italic", color: "#C8A96A" }}>One Photo.</span>
        </h2>
        <ol
          style={{
            listStyle: "none",
            margin: "64px 0 0",
            padding: 0,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "48px",
          }}
        >
          {STEPS.map((step, i) => {
            const Illustration = ILLUSTRATIONS[i]!;
            return (
              <li key={step.num} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <Illustration />
                <h3
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-dm-serif), Georgia, serif",
                    fontWeight: 400,
                    fontSize: "28px",
                    lineHeight: 1,
                    letterSpacing: "normal",
                  }}
                >
                  {step.heading}
                </h3>
                <p style={{ margin: 0, fontSize: "15px", lineHeight: 1.6, color: "#9C978E" }}>
                  {step.body}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
