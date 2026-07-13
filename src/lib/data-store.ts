/**
 * Client-side data store using localStorage (fallback) + Neon Postgres API (production).
 * When the API is available (Vercel), data persists server-side.
 * Falls back to localStorage when offline (dev mode).
 */

import symptomsData from "~/data/symptoms";
import productsData from "~/data/products";

/* ─── API Helper ─── */

let _clerkId: string | null = null;

export function setClerkId(id: string | null) {
  _clerkId = id;
}

export function getClerkId(): string | null {
  return _clerkId;
}

async function apiFetch(path: string, options?: RequestInit): Promise<Response | null> {
  const clerkId = getClerkId();
  if (!clerkId) return null;
  const sep = path.includes("?") ? "&" : "?";
  try {
    const res = await fetch(`/api/${path}${sep}clerk_id=${encodeURIComponent(clerkId)}`, {
      ...options,
      headers: { "content-type": "application/json", ...options?.headers },
    });
    if (!res.ok) return null;
    return res;
  } catch {
    return null;
  }
}

/* ─── Types ─── */

/** Load all data from the API and merge into localStorage. Call on sign-in. */
export async function syncFromAPI(): Promise<void> {
  const clerkId = getClerkId();
  if (!clerkId) return;

  const fetches: { key: string; endpoint: string; mapper: (r: any) => any }[] = [
    {
      key: "symptom_logs",
      endpoint: "symptoms",
      mapper: (r: any) => ({
        id: r.id,
        symptomId: r.symptom_id,
        symptomName: r.symptom_name,
        bodySystem: r.body_system,
        severity: r.severity,
        durationMinutes: r.duration_minutes ?? null,
        activityLevel: null,
        notes: r.notes ?? null,
        loggedAt: r.logged_at,
      }),
    },
    {
      key: "meal_logs",
      endpoint: "meals",
      mapper: (r: any) => ({
        id: r.id,
        foodName: r.food_name,
        mealType: r.meal_type ?? null,
        portionSize: r.portion_size ?? null,
        ingredients: r.ingredients ? JSON.parse(r.ingredients) : null,
        notes: r.notes ?? null,
        loggedAt: r.logged_at,
      }),
    },
    {
      key: "supplement_logs",
      endpoint: "supplements",
      mapper: (r: any) => ({
        id: r.id,
        supplementName: r.supplement_name,
        brand: r.brand ?? null,
        dosage: r.dosage ?? null,
        notes: r.notes ?? null,
        loggedAt: r.logged_at,
      }),
    },
  ];

  for (const f of fetches) {
    try {
      const res = await apiFetch(f.endpoint);
      if (!res) continue;
      const rows = await res.json();
      if (!Array.isArray(rows)) continue;
      const items = rows.map(f.mapper).filter(Boolean);
      if (items.length > 0) {
        // Merge: API data is authoritative, keep existing local entries too (deduplicate by id)
        const existing = getStore<any[]>(f.key, []);
        const existingIds = new Set(existing.map((e: any) => e.id));
        const deletedIds = getDeletedIds(f.key);
        const newItems = items.filter((i: any) => !existingIds.has(i.id) && !deletedIds.has(i.id));
        setStore(f.key, [...newItems, ...existing]);
      }
    } catch {
      // Silently skip — localStorage data is still available
    }
  }
}

/** Track a deleted item ID so syncFromAPI doesn't restore it from the server. */
function trackDeletedId(storeKey: string, id: string): void {
  const deleted = getStore<Record<string, string[]>>("deleted_log_ids", {});
  if (!deleted[storeKey]) deleted[storeKey] = [];
  if (!deleted[storeKey].includes(id)) deleted[storeKey].push(id);
  setStore("deleted_log_ids", deleted);
}

/** Get set of deleted IDs for a given store key. */
function getDeletedIds(storeKey: string): Set<string> {
  const deleted = getStore<Record<string, string[]>>("deleted_log_ids", {});
  return new Set(deleted[storeKey] || []);
}

export type ActivityLevel = "low" | "medium" | "high" | null;

export interface SymptomLog {
  id: string;
  symptomId: string;
  symptomName: string;
  bodySystem: string;
  severity: number;
  durationMinutes: number | null;
  activityLevel: ActivityLevel;
  notes: string | null;
  loggedAt: string;
}

export interface MealLog {
  id: string;
  foodName: string;
  mealType: string | null;
  portionSize: string | null;
  ingredients: string[] | null;
  activityLevel: ActivityLevel;
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

export interface SupplementLog {
  id: string;
  supplementName: string;
  brand: string | null;
  dosage: string | null;
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

/* ─── Date helpers for insights ─── */

/** Return the date as YYYY-MM-DD string (local timezone). */
function toDateStr(iso: string): string {
  // Use the date portion of the ISO string (already in ISO format, UTC)
  return iso.slice(0, 10);
}

/** Get a date string for N days ago. */
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

/** Check if a date string is within N days before today. */
function isWithinDays(dateStr: string, n: number): boolean {
  const d = new Date(dateStr + "T00:00:00");
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  return diffMs >= 0 && diffMs <= n * 24 * 60 * 60 * 1000;
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

export async function logSymptom(data: {
  symptomId: string;
  symptomName: string;
  bodySystem: string;
  severity: number;
  durationMinutes?: number | null;
  activityLevel?: ActivityLevel;
  notes?: string | null;
  loggedAt?: string | null;
}): Promise<SymptomLog> {
  const logs = getStore<SymptomLog[]>("symptom_logs", []);
  const entry: SymptomLog = {
    id: generateId(),
    symptomId: data.symptomId,
    symptomName: data.symptomName,
    bodySystem: data.bodySystem,
    severity: data.severity,
    durationMinutes: data.durationMinutes ?? null,
    activityLevel: data.activityLevel ?? null,
    notes: data.notes ?? null,
    loggedAt: data.loggedAt || new Date().toISOString(),
  };
  logs.unshift(entry);
  setStore("symptom_logs", logs);
  // Background sync to API (non-blocking)
  apiFetch("symptoms", {
    method: "POST",
    body: JSON.stringify({
      symptom_id: data.symptomId,
      symptom_name: data.symptomName,
      body_system: data.bodySystem,
      severity: data.severity,
      duration_minutes: data.durationMinutes,
      notes: data.notes,
    }),
  }).catch(() => {});
  return entry;
}

export function getRecentSymptoms(limit = 50): SymptomLog[] {
  return getStore<SymptomLog[]>("symptom_logs", []).slice(0, limit);
}

export function getAllSymptoms(): SymptomLog[] {
  return getStore<SymptomLog[]>("symptom_logs", []);
}

export function getSymptomById(id: string): SymptomLog | undefined {
  return getStore<SymptomLog[]>("symptom_logs", []).find((s) => s.id === id);
}

export function updateSymptom(id: string, data: Partial<Omit<SymptomLog, "id">>): boolean {
  const logs = getStore<SymptomLog[]>("symptom_logs", []);
  const idx = logs.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  logs[idx] = { ...logs[idx], ...data };
  setStore("symptom_logs", logs);
  return true;
}

export function deleteSymptom(id: string): boolean {
  const logs = getStore<SymptomLog[]>("symptom_logs", []);
  const filtered = logs.filter((s) => s.id !== id);
  if (filtered.length === logs.length) return false;
  setStore("symptom_logs", filtered);
  // Track deletion so syncFromAPI doesn't restore it
  trackDeletedId("symptom_logs", id);
  return true;
}

/* ─── Meal Logging ─── */

export async function logMeal(data: {
  foodName: string;
  mealType?: string | null;
  portionSize?: string | null;
  ingredients?: string[] | null;
  activityLevel?: ActivityLevel;
  notes?: string | null;
  loggedAt?: string | null;
}): Promise<MealLog> {
  const logs = getStore<MealLog[]>("meal_logs", []);
  const entry: MealLog = {
    id: generateId(),
    foodName: data.foodName,
    mealType: data.mealType ?? null,
    portionSize: data.portionSize ?? null,
    ingredients: data.ingredients ?? null,
    activityLevel: data.activityLevel ?? null,
    notes: data.notes ?? null,
    loggedAt: data.loggedAt || new Date().toISOString(),
  };
  logs.unshift(entry);
  setStore("meal_logs", logs);

  // Log each ingredient via the ingredient store
  if (data.ingredients && data.ingredients.length > 0) {
    for (const ing of data.ingredients) {
      if (ing.trim()) {
        logIngredient({
          name: ing.trim(),
          category: "food",
          sourceType: "meal",
          notes: `From: ${data.foodName}`,
        });
      }
    }
  }

  // Background sync to API
  apiFetch("meals", {
    method: "POST",
    body: JSON.stringify({
      food_name: data.foodName,
      meal_type: data.mealType,
      portion_size: data.portionSize,
      notes: data.notes,
    }),
  }).catch(() => {});

  return entry;
}

export function getRecentMeals(limit = 50): MealLog[] {
  return getStore<MealLog[]>("meal_logs", []).slice(0, limit);
}

export function getAllMeals(): MealLog[] {
  return getStore<MealLog[]>("meal_logs", []);
}

export function getMealById(id: string): MealLog | undefined {
  return getStore<MealLog[]>("meal_logs", []).find((m) => m.id === id);
}

export function updateMeal(id: string, data: Partial<Omit<MealLog, "id">>): boolean {
  const logs = getStore<MealLog[]>("meal_logs", []);
  const idx = logs.findIndex((m) => m.id === id);
  if (idx === -1) return false;
  logs[idx] = { ...logs[idx], ...data };
  setStore("meal_logs", logs);
  return true;
}

export function deleteMeal(id: string): boolean {
  const logs = getStore<MealLog[]>("meal_logs", []);
  const filtered = logs.filter((m) => m.id !== id);
  if (filtered.length === logs.length) return false;
  setStore("meal_logs", filtered);
  trackDeletedId("meal_logs", id);
  return true;
}

/* ─── Supplement Logging ─── */

export async function logSupplement(data: {
  supplementName: string;
  brand?: string | null;
  dosage?: string | null;
  ingredients?: string | null;
  notes?: string | null;
  loggedAt?: string | null;
}): Promise<SupplementLog> {
  const logs = getStore<SupplementLog[]>("supplement_logs", []);
  const entry: SupplementLog = {
    id: generateId(),
    supplementName: data.supplementName,
    brand: data.brand ?? null,
    dosage: data.dosage ?? null,
    ingredients: data.ingredients ?? null,
    notes: data.notes ?? null,
    loggedAt: data.loggedAt || new Date().toISOString(),
  };
  logs.unshift(entry);
  setStore("supplement_logs", logs);

  // Also log individual ingredients from supplements
  if (data.ingredients) {
    const ingList = data.ingredients.split(",").map((i) => i.trim()).filter(Boolean);
    for (const ing of ingList) {
      logIngredient({
        name: ing,
        category: "supplement-additive",
        sourceType: "supplement",
        notes: `From supplement: ${data.supplementName}`,
      });
    }
  }

  // Background sync to API
  apiFetch("supplements", {
    method: "POST",
    body: JSON.stringify({
      supplement_name: data.supplementName,
      brand: data.brand,
      dosage: data.dosage,
      notes: data.notes,
    }),
  }).catch(() => {});

  return entry;
}

export function getRecentSupplements(limit = 50): SupplementLog[] {
  return getStore<SupplementLog[]>("supplement_logs", []).slice(0, limit);
}

export function getAllSupplements(): SupplementLog[] {
  return getStore<SupplementLog[]>("supplement_logs", []);
}

export function getSupplementById(id: string): SupplementLog | undefined {
  return getStore<SupplementLog[]>("supplement_logs", []).find((s) => s.id === id);
}

export function updateSupplement(id: string, data: Partial<Omit<SupplementLog, "id">>): boolean {
  const logs = getStore<SupplementLog[]>("supplement_logs", []);
  const idx = logs.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  logs[idx] = { ...logs[idx], ...data };
  setStore("supplement_logs", logs);
  return true;
}

export function deleteSupplement(id: string): boolean {
  const logs = getStore<SupplementLog[]>("supplement_logs", []);
  const filtered = logs.filter((s) => s.id !== id);
  if (filtered.length === logs.length) return false;
  setStore("supplement_logs", filtered);
  trackDeletedId("supplement_logs", id);
  return true;
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
    supplements: getStore<SupplementLog[]>("supplement_logs", []),
    products: getStore<ProductLog[]>("product_logs", []),
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
  { id: "ing-012", name: "Formaldehyde Releasers", category: "personal-care", histamine_level: "moderate", common_in: "Nail products, some cosmetics", notes: "Can trigger contact dermatitis and mast cell activation" },
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
  loggedAt?: string | null;
}): ProductLog {
  const logs = getStore<ProductLog[]>("product_logs", []);
  const entry: ProductLog = {
    id: generateId(),
    productName: data.productName,
    brand: data.brand ?? null,
    productType: data.productType ?? "other",
    ingredients: data.ingredients ?? null,
    notes: data.notes ?? null,
    loggedAt: data.loggedAt || new Date().toISOString(),
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

export function getProductById(id: string): ProductLog | undefined {
  return getStore<ProductLog[]>("product_logs", []).find((p) => p.id === id);
}

export function updateProduct(id: string, data: Partial<Omit<ProductLog, "id">>): boolean {
  const logs = getStore<ProductLog[]>("product_logs", []);
  const idx = logs.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  logs[idx] = { ...logs[idx], ...data };
  setStore("product_logs", logs);
  return true;
}

export function deleteProduct(id: string): boolean {
  const logs = getStore<ProductLog[]>("product_logs", []);
  const filtered = logs.filter((p) => p.id !== id);
  if (filtered.length === logs.length) return false;
  setStore("product_logs", filtered);
  trackDeletedId("product_logs", id);
  return true;
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

/* ══════════════════════════════════════════
   Insights — Real Data Computations
   ══════════════════════════════════════════ */

type TimeRange = "7d" | "14d" | "30d";

/** Number of days for a given time range label. */
function timeRangeDays(range: TimeRange): number {
  if (range === "7d") return 7;
  if (range === "14d") return 14;
  return 30;
}

/** Get data only within the time range. */
function filterByRange<T extends { loggedAt: string }>(items: T[], range: TimeRange): T[] {
  const days = timeRangeDays(range);
  const cutoff = daysAgo(days);
  return items.filter((i) => i.loggedAt.slice(0, 10) >= cutoff);
}

/* ── Section 1: Overview Stats ── */

export interface InsightStats {
  daysTracked: number;
  symptomsLogged: number;
  currentStreak: number;
  avgSeverity7d: number;
}

export function getInsightStats(range: TimeRange): InsightStats {
  const symptoms = filterByRange(getAllSymptoms(), range);
  const meals = filterByRange(getAllMeals(), range);
  const products = filterByRange(getStore<ProductLog[]>("product_logs", []), range);
  const supplements = filterByRange(getAllSupplements(), range);

  const days = timeRangeDays(range);

  // Days tracked — unique days with at least one log of any type
  const allDates = new Set<string>();
  for (const s of symptoms) allDates.add(toDateStr(s.loggedAt));
  for (const m of meals) allDates.add(toDateStr(m.loggedAt));
  for (const p of products) allDates.add(toDateStr(p.loggedAt));
  for (const s of supplements) allDates.add(toDateStr(s.loggedAt));

  const daysTracked = allDates.size;

  // Current streak — consecutive days ending today with at least one log
  const todayStr = new Date().toISOString().slice(0, 10);
  let streak = 0;
  const checkDate = new Date();
  while (true) {
    const ds = checkDate.toISOString().slice(0, 10);
    if (allDates.has(ds)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // Allow today to be partial — if today has no logs, streak is 0
      if (ds === todayStr) {
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      }
      break;
    }
  }

  // Average severity over 7 days
  const symptoms7d = filterByRange(getAllSymptoms(), "7d");
  const avgSeverity7d = symptoms7d.length
    ? Math.round((symptoms7d.reduce((sum, s) => sum + s.severity, 0) / symptoms7d.length) * 10) / 10
    : 0;

  return {
    daysTracked,
    symptomsLogged: symptoms.length,
    currentStreak: streak,
    avgSeverity7d,
  };
}

/* ── Section 2: Symptom Trends ── */

export interface TrendDayPoint {
  date: string;
  label: string;
  values: { symptomName: string; severity: number }[];
}

export function getSymptomTrends(range: TimeRange): TrendDayPoint[] {
  const symptoms = filterByRange(getAllSymptoms(), range);
  if (symptoms.length === 0) return [];

  // Find the actual date range from the symptom data
  let minDate = symptoms[0].loggedAt.slice(0, 10);
  let maxDate = symptoms[0].loggedAt.slice(0, 10);
  for (const s of symptoms) {
    const ds = toDateStr(s.loggedAt);
    if (ds < minDate) minDate = ds;
    if (ds > maxDate) maxDate = ds;
  }

  // Create entries for each day from minDate to maxDate
  const byDay: Record<string, TrendDayPoint> = {};
  const start = new Date(minDate + "T12:00:00");
  const end = new Date(maxDate + "T12:00:00");
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    byDay[dateStr] = { date: dateStr, label, values: [] };
  }

  // Fill in actual symptom values
  for (const s of symptoms) {
    const dateStr = toDateStr(s.loggedAt);
    if (byDay[dateStr]) {
      byDay[dateStr].values.push({
        symptomName: s.symptomName,
        severity: s.severity,
      });
    }
  }

  return Object.values(byDay);
}

/* ── Section 3: Flare Day Analysis ── */

export interface FlareDayItem {
  day: string;
  value: number;
  isFlare: boolean;
}

export interface DayOfWeekItem {
  day: string;
  avgSeverity: number;
  logCount: number;
}

export function getFlareDayAnalysis(range: TimeRange): {
  flareData: FlareDayItem[];
  flareCount: number;
  totalDays: number;
  dayOfWeekData: DayOfWeekItem[];
} {
  const symptoms = filterByRange(getAllSymptoms(), range);

  // Group symptoms by day
  const byDay: Record<string, SymptomLog[]> = {};
  for (const s of symptoms) {
    const ds = toDateStr(s.loggedAt);
    if (!byDay[ds]) byDay[ds] = [];
    byDay[ds].push(s);
  }

  // Find the actual date range from the data
  const dates = Object.keys(byDay).sort();
  if (dates.length === 0) {
    return { flareData: [], flareCount: 0, totalDays: 0, dayOfWeekData: [] };
  }

  // Create entries for each day from first to last data date
  const flareData: FlareDayItem[] = [];
  const start = new Date(dates[0] + "T12:00:00");
  const end = new Date(dates[dates.length - 1] + "T12:00:00");
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().slice(0, 10);
    const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
    const daySymptoms = byDay[dateStr] || [];
    const avgSeverity = daySymptoms.length
      ? Math.round((daySymptoms.reduce((sum, s) => sum + s.severity, 0) / daySymptoms.length) * 10) / 10
      : 0;

    flareData.push({
      day: dayLabel,
      value: avgSeverity,
      isFlare: avgSeverity >= 6,
    });
  }

  const flareCount = flareData.filter((d) => d.isFlare).length;

  // Day of week breakdown
  const byDayOfWeek: Record<string, { severities: number[]; count: number }> = {
    Monday: { severities: [], count: 0 },
    Tuesday: { severities: [], count: 0 },
    Wednesday: { severities: [], count: 0 },
    Thursday: { severities: [], count: 0 },
    Friday: { severities: [], count: 0 },
    Saturday: { severities: [], count: 0 },
    Sunday: { severities: [], count: 0 },
  };

  for (const s of symptoms) {
    const d = new Date(s.loggedAt);
    const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
    if (byDayOfWeek[dayName]) {
      byDayOfWeek[dayName].severities.push(s.severity);
    }
  }

  const dayOfWeekData: DayOfWeekItem[] = Object.entries(byDayOfWeek).map(([day, data]) => ({
    day,
    avgSeverity: data.severities.length
      ? Math.round((data.severities.reduce((a, b) => a + b, 0) / data.severities.length) * 10) / 10
      : 0,
    logCount: data.severities.length,
  }));

  return { flareData, flareCount, totalDays: flareData.length, dayOfWeekData };
}

/* ── Section 4: Ingredient Correlations ── */

export interface IngredientCorrelation {
  ingredientName: string;
  timesLogged: number;
  timesOnFlareDays: number;
  correlationPercent: number;
  category: string;
  logDates: string[];
}

export function getIngredientCorrelations(range: TimeRange): IngredientCorrelation[] {
  const symptoms = filterByRange(getAllSymptoms(), range);
  const ingredients = filterByRange(
    getStore<IngredientLog[]>("ingredient_logs", []),
    range,
  );

  // Get flare days (days where avg symptom severity >= 6)
  const byDay: Record<string, SymptomLog[]> = {};
  for (const s of symptoms) {
    const ds = toDateStr(s.loggedAt);
    if (!byDay[ds]) byDay[ds] = [];
    byDay[ds].push(s);
  }
  const flareDays = new Set<string>();
  for (const [ds, daySymptoms] of Object.entries(byDay)) {
    const avg = daySymptoms.reduce((sum, s) => sum + s.severity, 0) / daySymptoms.length;
    if (avg >= 6) {
      flareDays.add(ds);
    }
  }

  // Group ingredient logs by ingredient name
  const ingByName: Record<string, { dates: string[]; category: string }> = {};
  for (const ing of ingredients) {
    if (!ingByName[ing.name]) {
      ingByName[ing.name] = { dates: [], category: ing.category };
    }
    ingByName[ing.name].dates.push(toDateStr(ing.loggedAt));
  }

  // Also get ingredient info from meal logs (which log via logIngredient)
  // And from product/supplement logs

  const correlations: IngredientCorrelation[] = Object.entries(ingByName)
    .map(([name, data]) => {
      const timesLogged = data.dates.length;
      const timesOnFlareDays = data.dates.filter((d) => flareDays.has(d)).length;
      const correlationPercent = timesLogged > 0
        ? Math.round((timesOnFlareDays / timesLogged) * 100)
        : 0;

      // Get sample log dates for detail expansion
      const uniqueFlareDates = [...new Set(data.dates.filter((d) => flareDays.has(d)))];
      const logDates = uniqueFlareDates.slice(0, 5).map((d) => {
        // Find avg severity for that flare day
        const daySymptoms = byDay[d] || [];
        const avgSev = daySymptoms.length
          ? Math.round((daySymptoms.reduce((s, ss) => s + ss.severity, 0) / daySymptoms.length) * 10) / 10
          : 0;
        const dateLabel = new Date(d + "T12:00:00").toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        return `${dateLabel} ��� Flare day (avg ${avgSev}/10)`;
      });

      return {
        ingredientName: name,
        timesLogged,
        timesOnFlareDays,
        correlationPercent,
        category: data.category,
        logDates,
      };
    })
    .filter((c) => c.timesLogged > 0)
    .sort((a, b) => b.correlationPercent - a.correlationPercent);

  return correlations;
}

/* ── Section 5: Combined Timeline ── */

export type TimelineEntryType = "symptom" | "meal" | "product" | "supplement";

export interface TimelineEntry {
  id: string;
  type: TimelineEntryType;
  title: string;
  subtitle: string;
  severity?: number;
  time: string;
  ingredients?: string[];
  notes?: string;
}

export function getCombinedTimeline(limit = 50): TimelineEntry[] {
  const symptoms = getAllSymptoms();
  const meals = getAllMeals();
  const products = getStore<ProductLog[]>("product_logs", []);
  const supplements = getAllSupplements();

  const entries: TimelineEntry[] = [];

  for (const s of symptoms) {
    const d = new Date(s.loggedAt);
    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    // Is this today?
    const todayStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    entries.push({
      id: `symptom-${s.id}`,
      type: "symptom",
      title: `${s.symptomName}${s.severity >= 6 ? " (flare)" : ""}`,
      subtitle: dateStr === todayStr ? "Today" : dateStr,
      severity: s.severity,
      time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      notes: s.notes ?? undefined,
    });
  }

  for (const m of meals) {
    const d = new Date(m.loggedAt);
    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const todayStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    entries.push({
      id: `meal-${m.id}`,
      type: "meal",
      title: `${m.mealType ? m.mealType.charAt(0).toUpperCase() + m.mealType.slice(1) + " — " : ""}${m.foodName}`,
      subtitle: dateStr === todayStr ? "Today" : dateStr,
      time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      ingredients: m.ingredients ?? undefined,
    });
  }

  for (const p of products) {
    const d = new Date(p.loggedAt);
    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const todayStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    entries.push({
      id: `product-${p.id}`,
      type: "product",
      title: p.productName + (p.brand ? ` (${p.brand})` : ""),
      subtitle: dateStr === todayStr ? "Today" : dateStr,
      time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      ingredients: p.ingredients ? p.ingredients.split(",").map((i) => i.trim()).filter(Boolean) : undefined,
      notes: p.notes ?? undefined,
    });
  }

  for (const s of supplements) {
    const d = new Date(s.loggedAt);
    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const todayStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    entries.push({
      id: `supplement-${s.id}`,
      type: "supplement",
      title: s.supplementName + (s.dosage ? ` — ${s.dosage}` : ""),
      subtitle: dateStr === todayStr ? "Today" : dateStr,
      time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      ingredients: s.ingredients ? s.ingredients.split(",").map((i) => i.trim()).filter(Boolean) : undefined,
      notes: s.notes ?? undefined,
    });
  }

  // Sort by loggedAt descending, then take limit
  entries.sort((a, b) => {
    // Compare by subtitle (date) first, then by time
    const dateA = a.subtitle === "Today" ? new Date().getTime() : new Date(a.subtitle + " 2026").getTime();
    const dateB = b.subtitle === "Today" ? new Date().getTime() : new Date(b.subtitle + " 2026").getTime();
    return dateB - dateA || b.time.localeCompare(a.time);
  });

  return entries.slice(0, limit);
}

/* ══════════════════════════════════════════
   Activity Level Correlation
   ══════════════════════════������═══════════════ */

export interface ActivityLevelCorrelation {
  level: string;
  label: string;
  avgSeverity: number;
  symptomCount: number;
  color: string;
}

export function getActivityLevelCorrelation(range: TimeRange = "30d"): ActivityLevelCorrelation[] {
  const symptoms = filterByRange(getAllSymptoms(), range);

  const byLevel: Record<string, { totalSeverity: number; count: number }> = {
    low: { totalSeverity: 0, count: 0 },
    medium: { totalSeverity: 0, count: 0 },
    high: { totalSeverity: 0, count: 0 },
  };

  for (const s of symptoms) {
    const level = s.activityLevel ?? "low"; // default to "low" if not set
    if (byLevel[level]) {
      byLevel[level].totalSeverity += s.severity;
      byLevel[level].count++;
    }
  }

  const levelConfig: Record<string, { label: string; color: string }> = {
    low: { label: "Low Activity", color: "bg-green-400" },
    medium: { label: "Medium Activity", color: "bg-amber-400" },
    high: { label: "High Activity", color: "bg-coral-400" },
  };

  return Object.entries(byLevel)
    .filter(([, data]) => data.count > 0)
    .map(([level, data]) => ({
      level,
      label: levelConfig[level]?.label ?? level,
      avgSeverity: Math.round((data.totalSeverity / data.count) * 10) / 10,
      symptomCount: data.count,
      color: levelConfig[level]?.color ?? "bg-brand-400",
    }))
    .sort((a, b) => {
      const order = { low: 0, medium: 1, high: 2 };
      return (order[a.level as keyof typeof order] ?? 0) - (order[b.level as keyof typeof order] ?? 0);
    });
}

/* ─── Demo / Seed Data ─── */

export function seedDemoData(): void {
  const now = Date.now();
  const day = 86_400_000; // ms in one day

  const symptomTemplates = [
    { id: "neuro-002", name: "Headache / Migraine", system: "Nervous System", baseSeverity: 6 },
    { id: "msk-003", name: "Fatigue / Chronic fatigue", system: "Musculoskeletal", baseSeverity: 7 },
    { id: "neuro-001", name: "Brain fog", system: "Nervous System", baseSeverity: 5 },
    { id: "gi-004", name: "Nausea / Vomiting", system: "Digestive", baseSeverity: 4 },
    { id: "derm-001", name: "Flushing", system: "Skin", baseSeverity: 5 },
    { id: "msk-001", name: "Joint pain / Arthritis", system: "Musculoskeletal", baseSeverity: 4 },
    { id: "gi-002", name: "Bloating / Gas", system: "Digestive", baseSeverity: 3 },
    { id: "neuro-004", name: "Anxiety / Panic attacks", system: "Nervous System", baseSeverity: 5 },
  ];

  const mealTemplates = [
    { name: "Oatmeal with blueberries", type: "breakfast", ingredients: ["Oats", "Blueberries", "Honey", "Almond milk"] },
    { name: "Scrambled eggs on toast", type: "breakfast", ingredients: ["Eggs", "Bread", "Butter", "Salt"] },
    { name: "Grilled chicken salad", type: "lunch", ingredients: ["Chicken breast", "Lettuce", "Olive oil", "Lemon juice", "Cucumber"] },
    { name: "Turkey sandwich", type: "lunch", ingredients: ["Turkey", "Bread", "Lettuce", "Mustard"] },
    { name: "Salmon with rice", type: "dinner", ingredients: ["Salmon", "White rice", "Broccoli", "Butter", "Lemon"] },
    { name: "Beef stir-fry", type: "dinner", ingredients: ["Beef", "Bell peppers", "Rice", "Soy sauce", "Garlic"] },
    { name: "Apple with almond butter", type: "snack", ingredients: ["Apple", "Almond butter"] },
    { name: "Aged cheese plate", type: "snack", ingredients: ["Aged cheddar", "Brie", "Crackers", "Grapes"] },
  ];

  // Build symptoms: some days are flare days (lots of symptoms, high severity),
  // some are good days (few/no symptoms)
  const symptomLogs: SymptomLog[] = [];
  const mealLogs: MealLog[] = [];
  const ingredientLogs: IngredientLog[] = [];

  for (let d = 13; d >= 0; d--) {
    const date = new Date(now - d * day);
    const isFlareDay = d === 12 || d === 8 || d === 3; // 3 flare days
    const isGoodDay = d === 10 || d === 5 || d === 0; // 3 good days

    // Log symptoms
    if (isFlareDay) {
      // Bad flare — lots of symptoms, high severity
      for (const tpl of symptomTemplates) {
        const severity = Math.min(10, tpl.baseSeverity + Math.floor(Math.random() * 4));
        symptomLogs.push({
          id: `demo-sym-${d}-${tpl.id}`,
          symptomId: tpl.id,
          symptomName: tpl.name,
          bodySystem: tpl.system,
          severity,
          durationMinutes: 60 + Math.floor(Math.random() * 240),
          activityLevel: "low",
          notes: null,
          loggedAt: new Date(date.getTime() + 8 * 3600_000 + Math.random() * 12 * 3600_000).toISOString(),
        });
        // Also log ingredient link for specific triggers
        if (tpl.id === "neuro-002" || tpl.id === "msk-003") {
          ingredientLogs.push({
            id: `demo-ing-${d}-${tpl.id}`,
            name: "Aged cheddar",
            category: "food",
            sourceType: "meal",
            histamineLevel: "high",
            notes: `From: Aged cheese plate (day ${d})`,
            loggedAt: new Date(date.getTime() + 8 * 3600_000).toISOString(),
          });
        }
      }
    } else if (isGoodDay) {
      // Good day — just 1-2 mild symptoms
      const mild = ["Flushing", "Bloating / Gas"];
      for (const name of mild) {
        const tpl = symptomTemplates.find((t) => t.name === name)!;
        symptomLogs.push({
          id: `demo-sym-${d}-${tpl.id}`,
          symptomId: tpl.id,
          symptomName: tpl.name,
          bodySystem: tpl.system,
          severity: 2 + Math.floor(Math.random() * 2),
          durationMinutes: 30 + Math.floor(Math.random() * 60),
          activityLevel: Math.random() > 0.5 ? "medium" : "high",
          notes: null,
          loggedAt: new Date(date.getTime() + 14 * 3600_000).toISOString(),
        });
      }
    } else {
      // Normal day — 3-5 symptoms
      const count = 3 + Math.floor(Math.random() * 3);
      const shuffled = [...symptomTemplates].sort(() => Math.random() - 0.5);
      for (let i = 0; i < count; i++) {
        const tpl = shuffled[i];
        const severity = Math.max(1, tpl.baseSeverity - 2 + Math.floor(Math.random() * 4));
        symptomLogs.push({
          id: `demo-sym-${d}-${tpl.id}`,
          symptomId: tpl.id,
          symptomName: tpl.name,
          bodySystem: tpl.system,
          severity,
          durationMinutes: 30 + Math.floor(Math.random() * 180),
          activityLevel: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as ActivityLevel,
          notes: null,
          loggedAt: new Date(date.getTime() + 8 * 3600_000 + Math.random() * 14 * 3600_000).toISOString(),
        });
      }
    }

    // Log 2-3 meals per day
    const mealCount = 2 + Math.floor(Math.random() * 2);
    const shuffledMeals = [...mealTemplates].sort(() => Math.random() - 0.5);
    for (let i = 0; i < mealCount; i++) {
      const mt = shuffledMeals[i % shuffledMeals.length];
      mealLogs.push({
        id: `demo-meal-${d}-${i}`,
        foodName: mt.name,
        mealType: mt.type,
        portionSize: ["1 cup", "1 serving", "medium bowl", "6 oz"][Math.floor(Math.random() * 4)],
        ingredients: mt.ingredients,
        activityLevel: null,
        notes: null,
        loggedAt: new Date(date.getTime() + 8 * 3600_000 + i * 5 * 3600_000).toISOString(),
      });
      // Log each ingredient
      for (const ing of mt.ingredients) {
        ingredientLogs.push({
          id: `demo-ing-${d}-${i}-${ing.slice(0, 4)}`,
          name: ing,
          category: "food",
          sourceType: "meal",
          histamineLevel: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
          notes: `From: ${mt.name}`,
          loggedAt: new Date(date.getTime() + 8 * 3600_000 + i * 5 * 3600_000).toISOString(),
        });
      }
    }
  }

  setStore("symptom_logs", symptomLogs);
  setStore("meal_logs", mealLogs);
  setStore("ingredient_logs", ingredientLogs);
}

/* ─── Favorites (Quick-Log) ─── */

export interface FavoriteEntry {
  id: string;
  label: string;
  type: "symptom" | "meal" | "supplement" | "product";
  /** For symptoms: symptom ID + system */
  symptomId?: string;
  symptomName?: string;
  bodySystem?: string;
  /** For meals: food name */
  foodName?: string;
  mealType?: string;
  /** For supplements */
  supplementName?: string;
  brand?: string;
  dosage?: string;
  /** For products */
  productName?: string;
  productType?: string;
  ingredients?: string;
  notes?: string;
  createdAt: string;
}

export function getFavorites(): FavoriteEntry[] {
  return getStore<FavoriteEntry[]>("favorites", []);
}

export function saveFavorite(entry: Omit<FavoriteEntry, "id" | "createdAt">): FavoriteEntry {
  const favorites = getFavorites();
  // Avoid duplicates by type+label
  const existing = favorites.findIndex((f) => f.type === entry.type && f.label === entry.label);
  const newEntry: FavoriteEntry = {
    ...entry,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  if (existing >= 0) {
    favorites[existing] = newEntry;
  } else {
    favorites.unshift(newEntry);
  }
  setStore("favorites", favorites);
  return newEntry;
}

export function removeFavorite(id: string): void {
  const favorites = getFavorites().filter((f) => f.id !== id);
  setStore("favorites", favorites);
}

export function isFavorite(type: string, label: string): boolean {
  return getFavorites().some((f) => f.type === type && f.label === label);
}