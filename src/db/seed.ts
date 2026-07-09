/**
 * Seed script — loads Rowan's research data files into the database.
 * Works with both SQLite and Neon Postgres.
 * Called automatically when the products table is empty.
 */

import { getDb } from "./index";
import productsData from "~/data/products";
import { SEED_INGREDIENTS_SQL, KNOWN_INGREDIENTS } from "./ingredient-seed";

interface ProductEntry {
  id: string;
  category: string;
  name: string;
  type: string;
  forms?: string[];
  typical_dose?: string;
  mechanism?: string;
  helps_with: { symptoms: string[]; description: string };
  evidence_level: string;
  evidence_notes?: string;
  common_brands?: string[];
  potential_side_effects?: string[];
  notes?: string;
  price_range?: string;
}

/**
 * Seed the database with data from the shared knowledge base.
 * Safe to call multiple times — skips if already seeded.
 */
export async function seedDatabase(): Promise<{ seeded: string[] }> {
  const db = getDb();
  const seeded: string[] = [];

  // Check if products table has data
  const productCount = db.get("SELECT COUNT(*) as count FROM products") as { count: number } | null;

  if (!productCount || productCount.count === 0) {
    // Seed products from inlined data
    const products: ProductEntry[] = productsData.products || productsData;

    for (const p of products) {
      let mappedCategory = p.category;
      if (mappedCategory === "mast-cell-stabilizers") mappedCategory = "mast-cell-stabilizer";
      else if (mappedCategory === "antihistamines-h1") mappedCategory = "otc-relief";
      else if (mappedCategory === "antihistamines-h2") mappedCategory = "otc-relief";
      else if (mappedCategory === "dao-supplements") mappedCategory = "supplement";
      else if (mappedCategory === "low-histamine-foods") mappedCategory = "low-histamine-food";
      else if (mappedCategory === "prescription") mappedCategory = "otc-relief";

      const description = `${p.mechanism || ""} ${p.helps_with?.description || ""}`.trim();
      const usageNotes = `Typical dose: ${p.typical_dose || "Varies"}. ${p.notes || ""}`.trim();
      const brandInfo = p.common_brands?.length ? `Brands: ${p.common_brands.join(", ")}` : "";

      db.run(
        `INSERT OR IGNORE INTO products (id, name, category, description, usage_notes, price_range, evidence_level, applicable_symptoms)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          p.id,
          p.name,
          mappedCategory,
          description,
          `${usageNotes} ${brandInfo}`.trim(),
          p.price_range || "Varies",
          p.evidence_level || "anecdotal",
          JSON.stringify(p.helps_with?.symptoms || []),
        ]
      );
    }
    seeded.push(`products (${products.length} entries)`);
  }

  // Seed known ingredients
  const ingCount = db.get("SELECT COUNT(*) as count FROM known_ingredients") as { count: number } | null;
  if (!ingCount || ingCount.count === 0) {
    // For Postgres, use INSERT ... ON CONFLICT DO NOTHING
    // For SQLite, use INSERT OR IGNORE
    const isPostgres = !!process.env.DATABASE_URL;
    for (const ing of KNOWN_INGREDIENTS) {
      const sql = isPostgres
        ? `INSERT INTO known_ingredients (id, name, category, histamine_level, common_in, notes) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (name) DO NOTHING`
        : `INSERT OR IGNORE INTO known_ingredients (id, name, category, histamine_level, common_in, notes) VALUES ($1, $2, $3, $4, $5, $6)`;
      db.run(sql, [ing.id, ing.name, ing.category, ing.histamine_level, ing.common_in, ing.notes]);
    }
    seeded.push(`known_ingredients (${KNOWN_INGREDIENTS.length} entries)`);
  }

  return { seeded };
}

/**
 * Load products from the JSON file directly (for use in server functions).
 */
export async function loadProductsJson(): Promise<ProductEntry[]> {
  const raw = await readFile(PRODUCTS_PATH, "utf8");
  const data = JSON.parse(raw);
  return data.products || data;
}

/**
 * Check if the database has been seeded.
 */
export function isSeeded(): boolean {
  const db = getDb();
  const row = db.get("SELECT COUNT(*) as count FROM products") as { count: number } | null;
  return row ? row.count > 0 : false;
}