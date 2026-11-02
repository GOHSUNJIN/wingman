import { supabaseAdmin } from "@/lib/supabase/server";
import { CatalogClient } from "@/components/catalog/catalog-client";

export type CatalogProduct = {
  id: string;
  name: string;
  store_name: string;
  price: number;
  category: string;
  tier: string;
  image: string;
  url: string;
};

async function fetchAll(): Promise<CatalogProduct[]> {
  try {
    const db = supabaseAdmin();
    const { data, error } = await db
      .from("products")
      .select("id, name, store_name, price, category, tier, image, url")
      .eq("in_stock", true)
      .not("image", "is", null)
      .order("store_name", { ascending: true });
    if (error || !data) return [];
    return data as CatalogProduct[];
  } catch {
    return [];
  }
}

export default async function CatalogPage() {
  const products = await fetchAll();
  return <CatalogClient products={products} />;
}
