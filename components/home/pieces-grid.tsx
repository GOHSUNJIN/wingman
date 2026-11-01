import { IN_STOCK_PIECES, STORES } from "./looks-data";

const PIECES = [
  { name: "Hopsack Blazer", store: "Benjamin Barker", bg: "#E2DCD0", category: "jacket" as const, fill: "#2A3148" },
  { name: "Poplin Shirt", store: "Massimo Dutti", bg: "#3A342D", category: "shirt" as const, fill: "#E4E0D8" },
  { name: "Knit Polo", store: "COS", bg: "#2E3A3E", category: "shirt" as const, fill: "#D9CDB5" },
  { name: "Navy Chinos", store: "Uniqlo", bg: "#D6CBB6", category: "trousers" as const, fill: "#2A3148" },
  { name: "Field Watch", store: "Kapok", bg: "#33363A", category: "watch" as const, fill: "#6B4A32" },
];

function PieceSvg({ category, fill }: { category: typeof PIECES[number]["category"]; fill: string }) {
  switch (category) {
    case "jacket":
      return (
        <>
          <path d="M30 20 L42 16 L50 30 L58 16 L70 20 L84 44 L76 48 L72 40 L72 86 L28 86 L28 40 L24 48 L16 44 Z" fill={fill} />
          <path d="M42 16 L50 54 L58 16" stroke="#0A0A0B" strokeOpacity="0.5" strokeWidth="1" fill="none" />
        </>
      );
    case "shirt":
      return <path d="M32 18 L44 14 L50 22 L56 14 L68 18 L84 40 L76 46 L70 38 L70 86 L30 86 L30 38 L24 46 L16 40 Z" fill={fill} />;
    case "trousers":
      return <path d="M34 12 L66 12 L70 88 L56 88 L50 36 L44 88 L30 88 Z" fill={fill} />;
    case "watch":
      return (
        <>
          <rect x="40" y="10" width="20" height="80" fill={fill} />
          <circle cx="50" cy="50" r="18" fill="#C9C4BB" />
          <circle cx="50" cy="50" r="14" fill="#0E0E10" />
          <path d="M50 50 L50 40 M50 50 L57 54" stroke="#ECEBE8" strokeWidth="1.5" />
        </>
      );
    default:
      return null;
  }
}

export function PiecesGrid() {
  return (
    <section id="pieces" aria-labelledby="pieces-heading">
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "120px 24px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "32px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", maxWidth: "680px" }}>
            <span style={{ fontSize: "13px", color: "#9C978E" }}>Real stores, real pieces</span>
            <h2
              id="pieces-heading"
              style={{
                margin: "16px 0 0",
                fontFamily: "var(--font-dm-serif), Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(40px, 5vw, 64px)",
                lineHeight: 1,
              }}
            >
              Everything Is{" "}
              <span style={{ fontStyle: "italic", color: "#C8A96A" }}>Actually</span>{" "}
              for Sale.
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: "16px", lineHeight: 1.6, color: "#9C978E", maxWidth: "380px" }}>
            Looks are built from {STORES.length} Singapore menswear stores with{" "}
            {IN_STOCK_PIECES.toLocaleString("en-SG")} pieces in stock. Your cart splits by store and you check
            out on each store&apos;s own site.
          </p>
        </div>

        <div
          style={{
            marginTop: "56px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
          }}
        >
          {PIECES.map((piece) => (
            <figure key={piece.name} style={{ margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              <div
                style={{
                  aspectRatio: "1 / 1",
                  background: piece.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="62%" viewBox="0 0 100 100" aria-hidden="true">
                  <PieceSvg category={piece.category} fill={piece.fill} />
                </svg>
              </div>
              <figcaption style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontSize: "14px" }}>{piece.name}</span>
                <span style={{ fontSize: "13px", color: "#9C978E" }}>{piece.store}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
