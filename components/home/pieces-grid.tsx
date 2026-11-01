import Image from "next/image";
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
};

async function fetchFeatured(): Promise<FeaturedRow[]> {
  try {
    const db = supabaseAdmin();
    const categories = ["top", "outerwear", "bottom", "shoes", "watch"] as const;
    const results = await Promise.all(
      categories.map((cat) =>
        db
          .from("products")
          .select("id, name, store_name, price, category, image")
          .eq("in_stock", true)
          .eq("category", cat)
          .not("image", "is", null)
          .limit(1)
      )
    );
    return results
      .filter((r) => !r.error && r.data && r.data.length > 0)
      .map((r) => r.data![0] as FeaturedRow);
  } catch {
    return [];
  }
}

export async function PiecesGrid() {
  const featured = await fetchFeatured();

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
          </div>
          <p style={{ margin: 0, fontSize: "16px", lineHeight: 1.6, color: "#9C978E", maxWidth: "380px" }}>
            Looks are built from {STORES.length} Singapore menswear stores with{" "}
            {IN_STOCK_PIECES.toLocaleString("en-SG")} pieces in stock. Your cart splits by store
            and you check out on each store&apos;s own site.
          </p>
        </div>

        {featured.length > 0 && (
          <div
            style={{
              marginTop: "56px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "16px",
            }}
          >
            {featured.map((piece) => (
              <figure
                key={piece.id}
                style={{ margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}
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
                    sizes="(min-width: 1280px) 220px, (min-width: 768px) 20vw, 45vw"
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <figcaption style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "14px", color: "#ECEBE8" }}>{piece.name}</span>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: "13px", color: "#9C978E" }}>{piece.store_name}</span>
                    <span style={{ fontSize: "13px", color: "#9C978E", fontVariantNumeric: "tabular-nums" }}>
                      {sgd(piece.price)}
                    </span>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
