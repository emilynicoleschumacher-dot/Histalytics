/**
 * Known MCAS-relevant ingredients seed data.
 * These are common triggers that MCAS patients should track.
 * Loaded into the known_ingredients table on database initialization.
 */

export interface KnownIngredient {
  id: string;
  name: string;
  category: "food-additive" | "preservative" | "color" | "fragrance" | "chemical" | "botanical" | "other";
  histamine_level: "high" | "moderate" | "low" | "unknown";
  common_in: string; // JSON
  notes: string;
}

export const KNOWN_INGREDIENTS: KnownIngredient[] = [
  // ── Food Additives ──
  { id: "ing-001", name: "Monosodium Glutamate (MSG)", category: "food-additive", histamine_level: "high", common_in: JSON.stringify(["processed foods", "seasoning blends", "restaurant food", "broths"]), notes: "Potent histamine liberator. Also known as E621, yeast extract, hydrolyzed vegetable protein." },
  { id: "ing-002", name: "Sulfites", category: "preservative", histamine_level: "high", common_in: JSON.stringify(["dried fruit", "wine", "vinegar", "processed potatoes", "shelf-stable juices"]), notes: "Common in wine (especially white), dried fruit, and some vinegars. Can trigger asthma-like reactions." },
  { id: "ing-003", name: "Benzoates / Sodium Benzoate", category: "preservative", histamine_level: "high", common_in: JSON.stringify(["soda", "fruit juice", "pickles", "sauces", "cosmetics"]), notes: "E211. Common in soft drinks and acidic foods. Can trigger urticaria and asthma." },
  { id: "ing-004", name: "Nitrates / Nitrites", category: "preservative", histamine_level: "high", common_in: JSON.stringify(["cured meats", "bacon", "ham", "hot dogs", "salami"]), notes: "Found in processed meats. Can trigger migraines and mast cell activation." },
  { id: "ing-005", name: "Tartrazine (Yellow #5)", category: "color", histamine_level: "moderate", common_in: JSON.stringify(["sodas", "candy", "baked goods", "medications", "mustard"]), notes: "E102. Artificial yellow dye known to trigger urticaria and asthma in sensitive individuals." },
  { id: "ing-006", name: "Sunset Yellow (Yellow #6)", category: "color", histamine_level: "moderate", common_in: JSON.stringify(["candy", "cereal", "baked goods", "snack foods"]), notes: "E110. Common yellow-orange dye." },
  { id: "ing-007", name: "Red #40 (Allura Red)", category: "color", histamine_level: "moderate", common_in: JSON.stringify(["candy", "soft drinks", "cereal", "maraschino cherries"]), notes: "E129. Most widely used red dye in the US." },
  { id: "ing-008", name: "Aspartame", category: "food-additive", histamine_level: "moderate", common_in: JSON.stringify(["diet soda", "sugar-free products", "gum", "protein powders"]), notes: "Artificial sweetener. Can trigger headaches and neurological symptoms." },
  { id: "ing-009", name: "Saccharin", category: "food-additive", histamine_level: "moderate", common_in: JSON.stringify(["diet drinks", "sugar-free candy", "tabletop sweeteners"]), notes: "Artificial sweetener. Can trigger histamine release in some individuals." },

  // ── Fragrance / Personal Care ──
  { id: "ing-010", name: "Fragrance / Parfum", category: "fragrance", histamine_level: "high", common_in: JSON.stringify(["perfume", "lotions", "shampoo", "cleaning products", "laundry detergent", "air fresheners"]), notes: "Catch-all term for undisclosed chemical mixtures. One of the most common triggers." },
  { id: "ing-011", name: "Essential Oils", category: "fragrance", histamine_level: "moderate", common_in: JSON.stringify(["aromatherapy", "lotions", "shampoo", "cleaning products", "candles"]), notes: "Can trigger mast cells via olfactory TRP channels. Lavender and tea tree are common triggers." },
  { id: "ing-012", name: "Sodium Lauryl Sulfate (SLS)", category: "chemical", histamine_level: "moderate", common_in: JSON.stringify(["shampoo", "body wash", "toothpaste", "soap", "cleaning products"]), notes: "Surfactant/detergent. Can irritate skin and trigger mast cells topically." },
  { id: "ing-013", name: "Phthalates", category: "chemical", histamine_level: "moderate", common_in: JSON.stringify(["fragrance", "nail polish", "hair spray", "plastics", "vinyl"]), notes: "Endocrine disruptors that can activate mast cells. Often hidden in 'fragrance'." },
  { id: "ing-014", name: "Parabens", category: "preservative", histamine_level: "moderate", common_in: JSON.stringify(["shampoo", "conditioner", "lotions", "makeup", "deodorant"]), notes: "Preservatives in personal care products. Can trigger contact dermatitis and mast cell activation." },
  { id: "ing-015", name: "Formaldehyde releasers", category: "preservative", histamine_level: "high", common_in: JSON.stringify(["nail polish", "hair products", "some shampoos", "body lotions"]), notes: "Quaternium-15, DMDM hydantoin, imidazolidinyl urea. Release formaldehyde over time." },
  { id: "ing-016", name: "Propylene Glycol", category: "chemical", histamine_level: "moderate", common_in: JSON.stringify(["lotions", "deodorant", "shampoo", "medications", "food", "vape liquid"]), notes: "Penetration enhancer. Can trigger contact dermatitis and mast cell activation." },

  // ── Botanical / Plant-derived ──
  { id: "ing-017", name: "Capsaicin", category: "botanical", histamine_level: "moderate", common_in: JSON.stringify(["spicy foods", "hot sauce", "pepper spray", "topical pain creams"]), notes: "TRPV1 agonist. Directly activates mast cells and TRP channels." },
  { id: "ing-018", name: "Cinnamon / Cinnamaldehyde", category: "botanical", histamine_level: "moderate", common_in: JSON.stringify(["baked goods", "cereal", "candles", "toothpaste", "gum"]), notes: "TRPA1 agonist. Common flavor that can trigger mast cells." },
  { id: "ing-019", name: "Menthol", category: "botanical", histamine_level: "moderate", common_in: JSON.stringify(["mint gum", "toothpaste", "cough drops", "topical creams", "lip balm"]), notes: "TRPM8 agonist. Can trigger mast cells, especially in topical products." },
  { id: "ing-020", name: "Salicylates", category: "botanical", histamine_level: "high", common_in: JSON.stringify(["aspirin", "ibuprofen", "many fruits", "vegetables", "herbs", "spices", "mint flavoring"]), notes: "Natural chemicals in plants. High salicylate foods can trigger MCAS flares. Cross-reactivity with NSAIDs." },
  { id: "ing-021", name: "Histamine (as ingredient)", category: "food-additive", histamine_level: "high", common_in: JSON.stringify(["fermented foods", "aged cheeses", "cured meats", "wine", "beer"]), notes: "Direct histamine content in food. The most direct trigger for histamine intolerance." },
  { id: "ing-022", name: "Tyramine", category: "food-additive", histamine_level: "high", common_in: JSON.stringify(["aged cheese", "cured meats", "soy products", "fermented foods", "bananas"]), notes: "Biogenic amine that competes with histamine for DAO enzyme, reducing histamine breakdown." },
  { id: "ing-023", name: "Alcohol (Ethanol)", category: "chemical", histamine_level: "high", common_in: JSON.stringify(["beer", "wine", "liquor", "mouthwash", "some extracts"]), notes: "Histamine liberator AND DAO inhibitor. Double trigger for histamine intolerance." },

  // ── Other common triggers ──
  { id: "ing-024", name: "Caffeine", category: "chemical", histamine_level: "moderate", common_in: JSON.stringify(["coffee", "tea", "soda", "energy drinks", "chocolate"]), notes: "Methylxanthine that can trigger histamine release and affect DAO activity." },
  { id: "ing-025", name: "Nickel", category: "chemical", histamine_level: "moderate", common_in: JSON.stringify(["jewelry", "coins", "batteries", "dental work", "food (chocolate, nuts, legumes)"]), notes: "Common contact allergen. Oral nickel sensitivity can trigger systemic symptoms." },
  { id: "ing-026", name: "Latex", category: "chemical", histamine_level: "moderate", common_in: JSON.stringify(["gloves", "balloons", "elastic bands", "some medical devices", "some clothing"]), notes: "Can trigger IgE-mediated mast cell activation. Cross-reactive with some fruits (banana, avocado, kiwi)." },
  { id: "ing-027", name: "Casein", category: "food-additive", histamine_level: "moderate", common_in: JSON.stringify(["dairy products", "protein powders", "processed foods", "some non-dairy creamers"]), notes: "Milk protein. Can trigger mast cell activation separate from lactose intolerance." },
  { id: "ing-028", name: "Gluten", category: "food-additive", histamine_level: "moderate", common_in: JSON.stringify(["wheat", "barley", "rye", "bread", "pasta", "cereal", "soy sauce", "beer"]), notes: "Can trigger mast cell activation in sensitive individuals, separate from celiac disease." },
  { id: "ing-029", name: "Soy Lecithin", category: "food-additive", histamine_level: "moderate", common_in: JSON.stringify(["chocolate", "baked goods", "margarine", "dressings", "supplements"]), notes: "Common emulsifier. Soy is a known histamine liberator for many MCAS patients." },
];

export const SEED_INGREDIENTS_SQL = KNOWN_INGREDIENTS.map((ing) => {
  const escapedName = ing.name.replace(/'/g, "''");
  const escapedCommonIn = ing.common_in.replace(/'/g, "''");
  const escapedNotes = ing.notes.replace(/'/g, "''");
  return `INSERT OR IGNORE INTO known_ingredients (id, name, category, histamine_level, common_in, notes)
    VALUES ('${ing.id}', '${escapedName}', '${ing.category}', '${ing.histamine_level}', '${escapedCommonIn}', '${escapedNotes}');`;
}).join("\n");