import Image from "next/image";

const LOOKS = [
  {
    num: "No. 1",
    name: "Velvet Midnight",
    score: "8.7",
    scoreGold: true,
    stores: "Kevin Seah",
    price: "S$4,600",
    image: "/home/lookbook-1.jpg",
    alt: "Deep red velvet jacket try-on render",
    url: "https://kevinseah.com/products/velvet-jacket-made-to-order",
  },
  {
    num: "No. 2",
    name: "Warm Pinstripe",
    score: "8.3",
    scoreGold: false,
    stores: "The Jacket Maker",
    price: "S$3,079",
    image: "/home/lookbook-2.jpg",
    alt: "Brown double-breasted pinstripe suit try-on render",
    url: "https://thejacketmaker.sg/products/bennett-brown-pinstripe-classic-double-breasted-suit",
  },
  {
    num: "No. 3",
    name: "Navy Classic",
    score: "7.8",
    scoreGold: false,
    stores: "Colony Clothing",
    price: "S$1,890",
    image: "/home/lookbook-3.jpg",
    alt: "Ring Jacket 1954 navy blazer try-on render",
    url: "https://colonyclothing.net/products/ring-jacket-rc055f03x",
  },
] as const;

export function Lookbook() {
  return (
    <section id="looks" style={{ background: "#0A0A0B" }}>
      <style>{`
        .look-card:hover .look-thumb { transform: scale(1.03); }
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
            <h2
              style={{
                margin: 0,
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
            <a
              key={look.num}
              href={look.url}
              target="_blank"
              rel="noopener noreferrer"
              className="look-card"
              style={{ margin: 0, display: "flex", flexDirection: "column", gap: "18px", textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  position: "relative",
                  aspectRatio: "3 / 4",
                  overflow: "hidden",
                  background: "#141416",
                }}
              >
                <Image
                  src={look.image}
                  alt={look.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="look-thumb"
                  style={{
                    objectFit: "cover",
                    objectPosition: "50% 8%",
                    transform: "scale(1.32)",
                    transformOrigin: "50% 15%",
                  }}
                  unoptimized
                />
                <span
                  style={{
                    position: "absolute",
                    top: "16px",
                    left: "16px",
                    fontFamily: "var(--font-dm-serif), Georgia, serif",
                    fontSize: "15px",
                    background: "#0A0A0B",
                    padding: "6px 10px",
                    zIndex: 1,
                  }}
                >
                  {look.num}
                </span>
                <span
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    right: "16px",
                    fontSize: "12px",
                    color: "#9C978E",
                    background: "rgba(10,10,11,0.7)",
                    padding: "4px 8px",
                    zIndex: 1,
                  }}
                >
                  View item ↗
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: "28px" }}>
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
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
