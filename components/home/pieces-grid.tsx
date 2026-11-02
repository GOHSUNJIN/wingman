import Image from "next/image";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";
import { sgd } from "@/lib/utils/format";
import { IN_STOCK_PIECES, STORES } from "./looks-data";

type FeaturedRow = {
  id: string;
  name: string;
  store_name: string;
  price: number;
  category: string;
  image: string;
  url: string;
};

const CATEGORY_LABEL: Record<string, string> = { top: "Top", outerwear: "Layer" };

async function fetchFeatured(): Promise<FeaturedRow[]> {
  try {
    const db = supabaseAdmin();
    // Pull a handful from each category then interleave for variety
    const [tops, outerwear] = await Promise.all([
      db
        .from("products")
        .select("id, name, store_name, price, category, image, url")
        .eq("in_stock", true)
        .eq("category", "top")
        .not("image", "is", null)
        .limit(6),
      db
        .from("products")
        .select("id, name, store_name, price, category, image, url")
        .eq("in_stock", true)
        .eq("category", "outerwear")
        .not("image", "is", null)
        .limit(6),
    ]);
    const t = (tops.data ?? []) as FeaturedRow[];
    const o = (outerwear.data ?? []) as FeaturedRow[];
    // Interleave and cap at 8
    const merged: FeaturedRow[] = [];
    const len = Math.max(t.length, o.length);
    for (let i = 0; i < len && merged.length < 8; i++) {
      if (t[i]) merged.push(t[i]);
      if (o[i] && merged.length < 8) merged.push(o[i]);
    }
    return merged;
  } catch {
    return [];
  }
}

export async function PiecesGrid() {
  const featured = await fetchFeatured();

  return (
    <section id="pieces" aria-labelledby="pieces-heading" style={{ background: "#0A0A0B" }}>
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "120px 24px",
          boxSizing: "border-box",
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "32px",
            marginBottom: "64px",
          }}
        >
          <h2
            id="pieces-heading"
            style={{
              margin: 0,
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
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "flex-start" }}>
            <p style={{ margin: 0, fontSize: "16px", lineHeight: 1.6, color: "#9C978E", maxWidth: "360px" }}>
              Looks are built from {STORES.length} Singapore menswear stores with{" "}
              {IN_STOCK_PIECES.toLocaleString("en-SG")} pieces in stock. Your cart splits by store
              and you check out on each store&apos;s own site.
            </p>
            <Link
              href="/catalog"
              style={{
                background: "#1C1C1F",
                color: "#ECEBE8",
                padding: "14px 28px",
                fontSize: "15px",
                fontWeight: 500,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              View Catalog
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Product grid */}
        {featured.length > 0 && (
          <ul
            aria-label="Featured pieces"
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "2px",
            }}
          >
            {featured.map((piece) => (
              <li key={piece.id}>
                <a
                  href={piece.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textDecoration: "none",
                    color: "inherit",
                    background: "#141416",
                  }}
                  className="pieces-card"
                >
                  <div
                    style={{
                      aspectRatio: "1 / 1",
                      background: "#1C1C1F",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={piece.image}
                      alt={piece.name}
                      fill
                      sizes="(min-width: 1280px) 310px, (min-width: 768px) 25vw, 50vw"
                      className="object-contain pieces-img"
                      unoptimized
                    />
                  </div>
                  <div style={{ padding: "16px 18px 20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ fontSize: "11px", color: "#C8A96A", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      {CATEGORY_LABEL[piece.category] ?? piece.category}
                    </span>
                    <span style={{ fontSize: "14px", color: "#ECEBE8", lineHeight: 1.35 }}>
                      {piece.name}
                    </span>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px", marginTop: "2px" }}>
                      <span style={{ fontSize: "13px", color: "#9C978E" }}>{piece.store_name}</span>
                      <span style={{ fontSize: "14px", color: "#ECEBE8", fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
                        {sgd(piece.price)}
                      </span>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <style>{`
        .pieces-card { transition: background .2s }
        .pieces-card:hover { background: #1C1C1F }
        .pieces-img { transition: transform .5s cubic-bezier(.2,.7,.2,1) }
        .pieces-card:hover .pieces-img { transform: scale(1.04) }
        @media (max-width: 640px) {
          #pieces [aria-label="Featured pieces"] { grid-template-columns: repeat(2, minmax(0, 1fr)) }
        }
      `}</style>
    </section>
  );
}
