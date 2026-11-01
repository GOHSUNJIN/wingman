const LOOKS = [
  {
    num: "No. 1",
    name: "Ballroom Navy",
    score: "8.4",
    scoreGold: true,
    stores: "Benjamin Barker, Massimo Dutti",
    price: "S$756",
    bg: "#3A342D",
    jacket: "#1A1E2B",
    shirt: "#E4E0D8",
    tie: "#6B4A32",
    lapel: "#222738",
  },
  {
    num: "No. 2",
    name: "Warm Charcoal",
    score: "7.9",
    scoreGold: false,
    stores: "Massimo Dutti, COS",
    price: "S$788",
    bg: "#33363A",
    jacket: "#3C3C42",
    shirt: "#D9CDB5",
    tie: null,
    lapel: null,
  },
  {
    num: "No. 3",
    name: "Soft Tailoring",
    score: "7.2",
    scoreGold: false,
    stores: "COS, Uniqlo, Massimo Dutti",
    price: "S$549",
    bg: "#2E3A3E",
    jacket: "#4E5140",
    shirt: "#E6DCC8",
    tie: null,
    lapel: null,
  },
] as const;

export function Lookbook() {
  return (
    <section id="looks" style={{ background: "#0A0A0B" }}>
      <style>{`
        .look-card:hover .look-thumb { transform: scale(1.02); }
        .look-thumb { transition: transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1); }
      `}</style>
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "96px 24px 120px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "24px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "13px", color: "#9C978E" }}>One brief, three answers</span>
            <h2
              style={{
                margin: "16px 0 0",
                fontFamily: "var(--font-dm-serif), Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(40px, 5.4vw, 72px)",
                lineHeight: 1,
              }}
            >
              A Cousin&apos;s Wedding,{" "}
              <span style={{ fontStyle: "italic", color: "#C8A96A" }}>Three Ways.</span>
            </h2>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "15px",
              lineHeight: 1.6,
              color: "#9C978E",
              maxWidth: "340px",
            }}
          >
            &ldquo;Hotel ballroom, Saturday 7pm, smart formal. Don&apos;t upstage the groom.&rdquo;
            {" "}Here&apos;s what Wingman came back with.
          </p>
        </div>

        <div
          style={{
            marginTop: "56px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {LOOKS.map((look) => (
            <figure key={look.num} className="look-card" style={{ margin: 0, display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* TODO: replace SVG with real try-on render for this look */}
              <div
                style={{
                  position: "relative",
                  aspectRatio: "3 / 4",
                  overflow: "hidden",
                  background: look.bg,
                }}
              >
                <svg
                  className="look-thumb"
                  viewBox="0 0 600 900"
                  preserveAspectRatio="xMidYMid slice"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
                  role="img"
                  aria-label={`${look.num}: ${look.name} (placeholder)`}
                >
                  <rect width="600" height="900" fill={look.bg} />
                  <path d="M40 900 L58 640 Q70 520 160 486 L246 452 L300 486 L354 452 L440 486 Q530 520 542 640 L560 900 Z" fill={look.jacket} />
                  {look.lapel && (
                    <>
                      <path d="M150 600 L138 900" stroke="#0A0A0B" strokeOpacity="0.35" strokeWidth="5" />
                      <path d="M450 600 L462 900" stroke="#0A0A0B" strokeOpacity="0.35" strokeWidth="5" />
                    </>
                  )}
                  <path d="M246 452 L300 486 L354 452 L336 600 L300 660 L264 600 Z" fill={look.shirt} />
                  {look.tie && (
                    <path d="M292 496 L308 496 L314 520 L318 690 L300 716 L282 690 L286 520 Z" fill={look.tie} />
                  )}
                  {look.lapel && (
                    <>
                      <path d="M246 452 L216 470 L250 560 L230 580 L300 760 L272 600 Z" fill={look.lapel} />
                      <path d="M354 452 L384 470 L350 560 L370 580 L300 760 L328 600 Z" fill={look.lapel} />
                    </>
                  )}
                  <path d="M262 360 L338 360 L346 470 L300 490 L254 470 Z" fill="#3E342D" />
                  <ellipse cx="300" cy="288" rx="80" ry="100" fill="#46392F" />
                  <path d="M218 270 Q214 180 300 176 Q388 178 384 268 Q372 222 300 218 Q236 220 218 270 Z" fill="#16130F" />
                </svg>
                <span
                  style={{
                    position: "absolute",
                    top: "16px",
                    left: "16px",
                    fontFamily: "var(--font-dm-serif), Georgia, serif",
                    fontSize: "15px",
                    background: "#0A0A0B",
                    padding: "6px 10px",
                  }}
                >
                  {look.num}
                </span>
              </div>
              <figcaption style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-dm-serif), Georgia, serif",
                      fontSize: "28px",
                    }}
                  >
                    {look.name}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-dm-serif), Georgia, serif",
                      fontSize: "24px",
                      color: look.scoreGold ? "#C8A96A" : "#ECEBE8",
                    }}
                  >
                    {look.score}
                  </span>
                </div>
                <span style={{ fontSize: "14px", color: "#9C978E" }}>
                  {look.stores} · {look.price}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
