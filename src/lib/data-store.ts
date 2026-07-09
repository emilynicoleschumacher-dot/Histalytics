/**
 * Client-side data store using localStorage.
 * Replaces the server-side SQLite database for the static SPA build.
 */

import symptomsData from "~/data/symptoms";
import productsData from "~/data/products";

/* ─── Types ─── */

export interface SymptomLog {
  id: string;
  symptomId: string;
  symptomName: string;
  bodySystem: string;
  severity: number;
  durationMinutes: number | null;
  notes: string | null;
  loggedAt: string;
}

export interface MealLog {
  id: string;
  foodName: string;
  mealType: string | null;
  portionSize: string | null;
  notes: string | null;
  loggedAt: string;
}

export interface IngredientLog {
  id: string;
  name: string;
  category: string;
  sourceType: string;
  histamineLevel: string;
  notes: string | null;
  loggedAt: string;
}

export interface ProductLog {
  id: string;
  productName: string;
  brand: string | null;
  productType: string;
  ingredients: string | null;
  notes: string | null;
  loggedAt: string;
}

/* ─── Helpers ─── */

function getStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStore<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function generateId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/* ─── Symptom Knowledge Base ─── */

export function getSymptomSystems() {
  const options: { system: string; symptoms: { id: string; name: string }[] }[] = [];
  for (const [, sys] of Object.entries(symptomsData.symptoms)) {
    options.push({
      system: sys.system,
      symptoms: sys.symptoms.map((s) => ({ id: s.id, name: s.name })),
    });
  }
  return options;
}

export function getSymptomKnowledgeBase() {
  return symptomsData;
}

/* ─── Symptom Logging ─── */

export function logSymptom(data: {
  symptomId: string;
  symptomName: string;
  bodySystem: string;
  severity: number;
  durationMinutes?: number | null;
  notes?: string | null;
}): SymptomLog {
  const logs = getStore<SymptomLog[]>("symptom_logs", []);
  const entry: SymptomLog = {
    id: generateId(),
    symptomId: data.symptomId,
    symptomName: data.symptomName,
    bodySystem: data.bodySystem,
    severity: data.severity,
    durationMinutes: data.durationMinutes ?? null,
    notes: data.notes ?? null,
    loggedAt: new Date().toISOString(),
  };
  logs.unshift(entry);
  setStore("symptom_logs", logs);
  return entry;
}

export function getRecentSymptoms(limit = 50): SymptomLog[] {
  return getStore<SymptomLog[]>("symptom_logs", []).slice(0, limit);
}

/* ─── Meal Logging ─── */

export function logMeal(data: {
  foodName: string;
  mealType?: string | null;
  portionSize?: string | null;
  notes?: string | null;
}): MealLog {
  const logs = getStore<MealLog[]>("meal_logs", []);
  const entry: MealLog = {
    id: generateId(),
    foodName: data.foodName,
    mealType: data.mealType ?? null,
    portionSize: data.portionSize ?? null,
    notes: data.notes ?? null,
    loggedAt: new Date().toISOString(),
  };
  logs.unshift(entry);
  setStore("meal_logs", logs);
  return entry;
}

export function getRecentMeals(limit = 50): MealLog[] {
  return getStore<MealLog[]>("meal_logs", []).slice(0, limit);
}

/* ─── Dashboard Stats ─── */

export function getDashboardStats() {
  const symptoms = getStore<SymptomLog[]>("symptom_logs", []);
  const today = new Date().toISOString().slice(0, 10);
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const totalSymptoms = symptoms.length;
  const todaySymptoms = symptoms.filter((s) => s.loggedAt.slice(0, 10) === today).length;

  const recentSymptoms = symptoms.filter((s) => s.loggedAt >= weekAgo);
  const avgSeverity = recentSymptoms.length
    ? Math.round((recentSymptoms.reduce((sum, s) => sum + s.severity, 0) / recentSymptoms.length) * 10) / 10
    : 0;

  // Top symptoms by frequency
  const symptomCounts: Record<string, { count: number; totalSeverity: number }> = {};
  for (const s of recentSymptoms) {
    if (!symptomCounts[s.symptomName]) symptomCounts[s.symptomName] = { count: 0, totalSeverity: 0 };
    symptomCounts[s.symptomName].count++;
    symptomCounts[s.symptomName].totalSeverity += s.severity;
  }
  const topSymptoms = Object.entries(symptomCounts)
    .map(([name, data]) => ({
      symptom_name: name,
      count: data.count,
      avg_severity: Math.round((data.totalSeverity / data.count) * 10) / 10,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalSymptoms,
    todaySymptoms,
    avgSeverity,
    topSymptoms,
  };
}

/* ─── History ─── */

export function getFullHistory() {
  return {
    symptoms: getStore<SymptomLog[]>("symptom_logs", []),
    meals: getStore<MealLog[]>("meal_logs", []),
  };
}

/* ─── Recommendations ─── */

export function getRecommendations() {
  const symptoms = getStore<SymptomLog[]>("symptom_logs", []);

  // Get user's most frequent symptoms with IDs
  const symptomCounts: Record<string, { count: number; name: string }> = {};
  for (const s of symptoms) {
    if (s.symptomId) {
      if (!symptomCounts[s.symptomId]) symptomCounts[s.symptomId] = { count: 0, name: s.symptomName };
      symptomCounts[s.symptomId].count++;
    }
  }
  const frequentSymptoms = Object.entries(symptomCounts)
    .map(([id, data]) => ({ symptom_id: id, symptom_name: data.name, count: data.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const userSymptomIds = new Set(frequentSymptoms.map((s) => s.symptom_id));
  const allProducts = productsData.products || [];

  // Build symptom name map
  const symptomNameMap: Record<string, string> = {};
  for (const [, sys] of Object.entries(symptomsData.symptoms)) {
    for (const s of sys.symptoms) {
      symptomNameMap[s.id] = s.name;
    }
  }

  const matchedProducts = allProducts
    .map((p) => {
      const helpsWithIds = p.helps_with?.symptoms || [];
      const matchingSymptoms = helpsWithIds.filter((id) => userSymptomIds.has(id));
      const matchCount = matchingSymptoms.length;

      let evidenceScore = 0;
      if (p.evidence_level === "strong") evidenceScore = 3;
      else if (p.evidence_level === "moderate") evidenceScore = 2;
      else if (p.evidence_level === "preliminary") evidenceScore = 1;

      const score = matchCount * 2 + evidenceScore;

      return {
        id: p.id,
        name: p.name,
        category: p.category,
        type: p.type,
        typical_dose: p.typical_dose,
        mechanism: p.mechanism,
        evidence_level: p.evidence_level,
        evidence_notes: p.evidence_notes,
        common_brands: p.common_brands,
        notes: p.notes,
        matching_symptoms: matchingSymptoms.map((id) => ({
          id,
          name: symptomNameMap[id] || id,
        })),
        match_count: matchCount,
        score,
      };
    })
    .filter((p) => p.match_count > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 30);

  const discoveryProducts = allProducts
    .filter((p) => !p.helps_with?.symptoms?.some((id) => userSymptomIds.has(id)))
    .map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      type: p.type,
      mechanism: p.mechanism,
      evidence_level: p.evidence_level,
      common_brands: p.common_brands,
      notes: p.notes,
      matching_symptoms: [] as { id: string; name: string }[],
      match_count: 0,
      score: 0,
    }))
    .sort((a, b) => {
      const order = ["strong", "moderate", "preliminary", "anecdotal"];
      return order.indexOf(a.evidence_level) - order.indexOf(b.evidence_level);
    })
    .slice(0, 10);

  return {
    frequentSymptoms,
    matchedProducts,
    discoveryProducts,
    totalProducts: allProducts.length,
  };
}

/* ─── Ingredient Tracking ─── */

export const knownIngredients = getStore<{ id: string; name: string; category: string; histamine_level: string; common_in: string; notes: string }[]>("known_ingredients", [
  { id: "ing-001", name: "MSG (Monosodium Glutamate)", category: "food-additive", histamine_level: "moderate", common_in: "Processed foods, Asian cuisine, chips", notes: "Histamine liberator – triggers mast cell release" },
  { id: "ing-002", name: "Sulfites", category: "food-additive", histamine_level: "high", common_in: "Dried fruits, wine, vinegar, processed meats", notes: "Common trigger for asthma-like reactions" },
  { id: "ing-003", name: "Benzoates", category: "food-additive", histamine_level: "moderate", common_in: "Soda, fruit juices, pickles, sauces", notes: "Can trigger pseudoallergic reactions" },
  { id: "ing-004", name: "Nitrates / Nitrites", category: "food-additive", histamine_level: "moderate", common_in: "Processed meats (bacon, ham, hot dogs)", notes: "Can cause headache and flushing" },
  { id: "ing-005", name: "Tartrazine (Yellow #5)", category: "food-additive", histamine_level: "moderate", common_in: "Candy, soda, cereals, medications", notes: "Common food dye trigger" },
  { id: "ing-006", name: "Aspartame", category: "food-additive", histamine_level: "low", common_in: "Diet sodas, sugar-free products", notes: "Some patients react to artificial sweeteners" },
  { id: "ing-007", name: "Fragrance / Parfum", category: "personal-care", histamine_level: "high", common_in: "Perfumes, lotions, laundry detergent, candles", notes: "Common airborne trigger for MCAS" },
  { id: "ing-008", name: "Essential Oils", category: "personal-care", histamine_level: "moderate", common_in: "Aromatherapy, skincare, natural products", notes: "Highly concentrated plant compounds can trigger reactions" },
  { id: "ing-009", name: "SLS (Sodium Lauryl Sulfate)", category: "personal-care", histamine_level: "low", common_in: "Shampoo, toothpaste, body wash", notes: "Can irritate sensitive skin and mucous membranes" },
  { id: "ing-010", name: "Phthalates", category: "personal-care", histamine_level: "moderate", common_in: "Fragranced products, plastics, nail polish", notes: "Endocrine disruptor, can trigger mast cells" },
  { id: "ing-011", name: "Parabens", category: "personal-care", histamine_level: "low", common_in: "Preservatives in cosmetics and skincare", notes: "Some patients react to preservatives" },
  { id: "ing-012", name: "Formaldehyde Releasers", category: "personal-care", histamine_level: "moderate", common_in: "Nail polish, hair products, some skincare", notes: "Common preservatives that release formaldehyde" },
  { id: "ing-013", name: "Propylene Glycol", category: "personal-care", histamine_level: "low", common_in: "Skincare, medications, food", notes: "Can cause contact dermatitis in sensitive individuals" },
  { id: "ing-014", name: "Capsaicin", category: "food", histamine_level: "moderate", common_in: "Hot peppers, spicy foods, topical creams", notes: "Can trigger histamine release in sensitive individuals" },
  { id: "ing-015", name: "Cinnamon / Cassia", category: "food", histamine_level: "moderate", common_in: "Baked goods, teas, supplements", notes: "Common spice trigger" },
  { id: "ing-016", name: "Menthol", category: "food", histamine_level: "low", common_in: "Mint, cough drops, toothpaste", notes: "Can cause localized reactions in sensitive individuals" },
  { id: "ing-017", name: "Salicylates", category: "food", histamine_level: "moderate", common_in: "Berries, apples, tomatoes, spices, aspirin", notes: "Often cross-reactive with histamine intolerance" },
  { id: "ing-018", name: "Histamine (High-Level)", category: "food", histamine_level: "high", common_in: "Aged cheese, fermented foods, cured meats, fish", notes: "Direct histamine content – causes immediate symptoms" },
  { id: "ing-019", name: "Tyramine", category: "food", histamine_level: "moderate", common_in: "Aged cheeses, cured meats, soy sauce, sauerkraut", notes: "Often found alongside histamine in aged foods" },
  { id: "ing-020", name: "Alcohol / Ethanol", category: "food", histamine_level: "high", common_in: "Alcoholic beverages (especially red wine, beer)", notes: "Histamine liberator + DAO inhibitor" },
  { id: "ing-021", name: "Caffeine", category: "food", histamine_level: "low", common_in: "Coffee, tea, chocolate, energy drinks", notes: "Can trigger mast cell activation in some patients" },
  { id: "ing-022", name: "Nickel", category: "environmental", histamine_level: "moderate", common_in: "Jewelry, coins, stainless steel, some foods", notes: "Common contact allergen; can also be in food" },
  { id: "ing-023", name: "Latex", category: "environmental", histamine_level: "high", common_in: "Gloves, balloons, elastic, medical devices", notes: "Common allergen often cross-reactive with foods" },
  { id: "ing-024", name: "Casein (Dairy Protein)", category: "food", histamine_level: "moderate", common_in: "Milk, cheese, yogurt, processed foods", notes: "Can trigger mast cell activation" },
  { id: "ing-025", name: "Gluten", category: "food", histamine_level: "moderate", common_in: "Wheat, barley, rye, processed foods", notes: "Can trigger mast cell activation in sensitive individuals" },
  { id: "ing-026", name: "Soy Lecithin", category: "food-additive", histamine_level: "low", common_in: "Processed foods, chocolate, supplements", notes: "Common additive that some patients react to" },
  { id: "ing-027", name: "Pollen / Ragweed", category: "environmental", histamine_level: "moderate", common_in: "Seasonal allergens, some foods (oral allergy syndrome)", notes: "Can trigger mast cell activation" },
  { id: "ing-028", name: "Dust Mites", category: "environmental", histamine_level: "moderate", common_in: "Bedding, carpets, upholstery", notes: "Common indoor allergen" },
  { id: "ing-029", name: "Mold / Mycotoxins", category: "environmental", histamine_level: "high", common_in: "Damp buildings, certain foods (cheese, peanuts)", notes: "Can be a major trigger for MCAS patients" },
]);

export function getKnownIngredients() {
  return knownIngredients;
}

export function logIngredient(data: {
  name: string;
  category: string;
  sourceType?: string;
  histamineLevel?: string;
  notes?: string | null;
}): IngredientLog {
  const logs = getStore<IngredientLog[]>("ingredient_logs", []);
  const entry: IngredientLog = {
    id: generateId(),
    name: data.name,
    category: data.category,
    sourceType: data.sourceType ?? "manual",
    histamineLevel: data.histamineLevel ?? "unknown",
    notes: data.notes ?? null,
    loggedAt: new Date().toISOString(),
  };
  logs.unshift(entry);
  setStore("ingredient_logs", logs);
  return entry;
}

export function logPersonalCareProduct(data: {
  productName: string;
  brand?: string | null;
  productType?: string;
  ingredients?: string | null;
  notes?: string | null;
}): ProductLog {
  const logs = getStore<ProductLog[]>("product_logs", []);
  const entry: ProductLog = {
    id: generateId(),
    productName: data.productName,
    brand: data.brand ?? null,
    productType: data.productType ?? "other",
    ingredients: data.ingredients ?? null,
    notes: data.notes ?? null,
    loggedAt: new Date().toISOString(),
  };
  logs.unshift(entry);
  setStore("product_logs", logs);

  // Also log individual ingredients
  if (data.ingredients) {
    const ingList = data.ingredients.split(",").map((i) => i.trim()).filter(Boolean);
    for (const ing of ingList) {
      logIngredient({
        name: ing,
        category: "personal-care",
        sourceType: "product",
        notes: `From: ${data.productName}`,
      });
    }
  }

  return entry;
}

export function getIngredientHistory() {
  return {
    ingredients: getStore<IngredientLog[]>("ingredient_logs", []),
    products: getStore<ProductLog[]>("product_logs", []),
  };
}

export function getIngredientTrends() {
  const ingredients = getStore<IngredientLog[]>("ingredient_logs", []);

  const topIngredients: Record<string, { count: number; category: string }> = {};
  for (const ing of ingredients) {
    if (!topIngredients[ing.name]) topIngredients[ing.name] = { count: 0, category: ing.category };
    topIngredients[ing.name].count++;
  }

  return {
    topIngredients: Object.entries(topIngredients)
      .map(([name, data]) => ({ name, count: data.count, category: data.category }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20),
    frequentFlareIngredients: [],
  };
}