/**
 * Server functions for the Histalytics app.
 * These run on the server and handle database operations.
 */

import { createServerFn } from "@tanstack/react-start";
import { getDb, getOrCreateDefaultUser } from "~/db/local";
import symptomsData from "~/data/symptoms";
import productsData from "~/data/products";

/* ─── Helpers ─── */

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

// Build a map of symptom_id -> symptom_name from the knowledge base
function buildSymptomMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const sys of Object.values(symptomsData.symptoms)) {
    for (const s of sys.symptoms) {
      map[s.id] = s.name;
    }
  }
  return map;
}

/* ─── Knowledge Base ─── */

// Load the MCAS symptom knowledge base
export const getSymptomKnowledgeBase = createServerFn({ method: "GET" }).handler(async () => {
  return symptomsData;
});

/* ─── Symptom Logging ─── */

export const logSymptom = createServerFn({ method: "POST" }).handler(async (data: unknown) => {
  const { symptomId, symptomName, bodySystem, severity, durationMinutes, notes } = data as {
    symptomId: string;
    symptomName: string;
    bodySystem: string;
    severity: number;
    durationMinutes?: number;
    notes?: string;
  };

  const db = getDb();
  const userId = getOrCreateDefaultUser();

  const result = db.query(`
    INSERT INTO symptom_logs (user_id, symptom_id, symptom_name, body_system, severity, duration_minutes, notes)
    VALUES ($userId, $symptomId, $symptomName, $bodySystem, $severity, $durationMinutes, $notes)
    RETURNING id, logged_at
  `).get({
    $userId: userId,
    $symptomId: symptomId,
    $symptomName: symptomName,
    $bodySystem: bodySystem,
    $severity: severity,
    $durationMinutes: durationMinutes ?? null,
    $notes: notes ?? null,
  });

  return result;
});

export const getRecentSymptoms = createServerFn({ method: "GET" }).handler(async () => {
  const db = getDb();
  const userId = getOrCreateDefaultUser();

  const rows = db.query(`
    SELECT id, symptom_id, symptom_name, body_system, severity, duration_minutes, notes, logged_at
    FROM symptom_logs
    WHERE user_id = $userId
    ORDER BY logged_at DESC
    LIMIT 50
  `).all({ $userId: userId });

  return rows;
});

/* ─── Meal Logging ─── */

export const logMeal = createServerFn({ method: "POST" }).handler(async (data: unknown) => {
  const { foodName, mealType, portionSize, notes } = data as {
    foodName: string;
    mealType?: string;
    portionSize?: string;
    notes?: string;
  };

  const db = getDb();
  const userId = getOrCreateDefaultUser();

  const result = db.query(`
    INSERT INTO meal_logs (user_id, food_name, meal_type, portion_size, notes)
    VALUES ($userId, $foodName, $mealType, $portionSize, $notes)
    RETURNING id, logged_at
  `).get({
    $userId: userId,
    $foodName: foodName,
    $mealType: mealType ?? null,
    $portionSize: portionSize ?? null,
    $notes: notes ?? null,
  });

  return result;
});

export const getRecentMeals = createServerFn({ method: "GET" }).handler(async () => {
  const db = getDb();
  const userId = getOrCreateDefaultUser();

  const rows = db.query(`
    SELECT id, food_name, meal_type, portion_size, notes, logged_at
    FROM meal_logs
    WHERE user_id = $userId
    ORDER BY logged_at DESC
    LIMIT 50
  `).all({ $userId: userId });

  return rows;
});

/* ─── Dashboard Stats ─── */

export const getDashboardStats = createServerFn({ method: "GET" }).handler(async () => {
  const db = getDb();
  const userId = getOrCreateDefaultUser();

  const today = new Date().toISOString().slice(0, 10);
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const totalSymptoms = db.query(
    "SELECT COUNT(*) as count FROM symptom_logs WHERE user_id = $userId"
  ).get({ $userId: userId }) as { count: number };

  const todaySymptoms = db.query(
    "SELECT COUNT(*) as count FROM symptom_logs WHERE user_id = $userId AND date(logged_at) = $today"
  ).get({ $userId: userId, $today: today }) as { count: number };

  const avgSeverity = db.query(
    "SELECT COALESCE(AVG(severity), 0) as avg FROM symptom_logs WHERE user_id = $userId AND logged_at >= $weekAgo"
  ).get({ $userId: userId, $weekAgo: weekAgo }) as { avg: number };

  const topSymptoms = db.query(`
    SELECT symptom_name, COUNT(*) as count, AVG(severity) as avg_severity
    FROM symptom_logs
    WHERE user_id = $userId AND logged_at >= $weekAgo
    GROUP BY symptom_name
    ORDER BY count DESC
    LIMIT 5
  `).all({ $userId: userId, $weekAgo: weekAgo });

  return {
    totalSymptoms: totalSymptoms.count,
    todaySymptoms: todaySymptoms.count,
    avgSeverity: Math.round(avgSeverity.avg * 10) / 10,
    topSymptoms,
  };
});

/* ─── History ─── */

export const getFullHistory = createServerFn({ method: "GET" }).handler(async () => {
  const db = getDb();
  const userId = getOrCreateDefaultUser();

  const symptoms = db.query(`
    SELECT id, symptom_id, symptom_name, body_system, severity, duration_minutes, notes, logged_at
    FROM symptom_logs
    WHERE user_id = $userId
    ORDER BY logged_at DESC
    LIMIT 200
  `).all({ $userId: userId });

  const meals = db.query(`
    SELECT id, food_name, meal_type, portion_size, notes, logged_at
    FROM meal_logs
    WHERE user_id = $userId
    ORDER BY logged_at DESC
    LIMIT 200
  `).all({ $userId: userId });

  return { symptoms, meals };
});

/* ─── Recommendations ─── */

// Load product data from the inlined data module (bundled in JS)
function loadProducts(): ProductEntry[] {
  return productsData.products || [];
}

export const getRecommendations = createServerFn({ method: "GET" }).handler(async () => {
  const db = getDb();
  const userId = getOrCreateDefaultUser();

  // Get user's most frequent symptoms with IDs
  const frequentSymptoms = db.query(`
    SELECT symptom_id, symptom_name, COUNT(*) as count
    FROM symptom_logs
    WHERE user_id = $userId AND symptom_id IS NOT NULL AND symptom_id != ''
    GROUP BY symptom_id, symptom_name
    ORDER BY count DESC
    LIMIT 10
  `).all({ $userId: userId }) as { symptom_id: string; symptom_name: string; count: number }[];

  // Get symptom name map for resolving IDs to names
  const symptomNameMap = buildSymptomMap();

  // Load products from the inlined data module
  const allProducts = loadProducts();

  // Match products against user's symptoms
  const userSymptomIds = new Set(frequentSymptoms.map((s) => s.symptom_id));

  const matchedProducts = allProducts
    .map((p) => {
      const helpsWithIds = p.helps_with?.symptoms || [];
      const matchingSymptoms = helpsWithIds.filter((id) => userSymptomIds.has(id));
      const matchCount = matchingSymptoms.length;

      // Score: more matches = higher, evidence level boosts
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
    .filter((p) => p.match_count > 0) // Only products that match at least one symptom
    .sort((a, b) => b.score - a.score) // Highest score first
    .slice(0, 30);

  // Also get some general non-matched products for discovery (evidence-ordered)
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
      matching_symptoms: [],
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
});

/* ─── Ingredient Tracking ─── */

export const getKnownIngredients = createServerFn({ method: "GET" }).handler(async () => {
  const db = getDb();
  const rows = db.query("SELECT id, name, category, histamine_level, common_in, notes FROM known_ingredients ORDER BY name").all();
  return rows;
});

export const logIngredient = createServerFn({ method: "POST" }).handler(async (data: unknown) => {
  const { name, category, sourceType, histamineLevel, notes } = data as {
    name: string;
    category: string;
    sourceType?: string;
    histamineLevel?: string;
    notes?: string;
  };
  const db = getDb();
  const userId = getOrCreateDefaultUser();
  const result = db.query(`
    INSERT INTO ingredient_logs (user_id, name, category, source_type, histamine_level, notes)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, logged_at
  `).get(userId, name, category, sourceType ?? "manual", histamineLevel ?? "unknown", notes ?? null);
  return result;
});

export const logPersonalCareProduct = createServerFn({ method: "POST" }).handler(async (data: unknown) => {
  const { productName, brand, productType, ingredients, notes } = data as {
    productName: string;
    brand?: string;
    productType?: string;
    ingredients?: string;
    notes?: string;
  };
  const db = getDb();
  const userId = getOrCreateDefaultUser();
  const result = db.query(`
    INSERT INTO personal_care_logs (user_id, product_name, brand, product_type, ingredients, notes)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, logged_at
  `).get(userId, productName, brand ?? null, productType ?? "other", ingredients ?? null, notes ?? null);

  if (ingredients) {
    const ingList = ingredients.split(",").map((i: string) => i.trim()).filter(Boolean);
    for (const ing of ingList) {
      db.query(`
        INSERT INTO ingredient_logs (user_id, name, category, source_type, source_id, histamine_level, notes)
        VALUES ($1, $2, 'personal-care', 'product', $3, 'unknown', $4)
      `).run(userId, ing, (result as any)?.id, `From: ${productName}`);
    }
  }
  return result;
});

export const getIngredientHistory = createServerFn({ method: "GET" }).handler(async () => {
  const db = getDb();
  const userId = getOrCreateDefaultUser();
  const ingredients = db.query(`
    SELECT id, name, category, source_type, histamine_level, notes, logged_at
    FROM ingredient_logs WHERE user_id = $1 ORDER BY logged_at DESC LIMIT 100
  `).all(userId);
  const products = db.query(`
    SELECT id, product_name, brand, product_type, ingredients, notes, logged_at
    FROM personal_care_logs WHERE user_id = $1 ORDER BY logged_at DESC LIMIT 100
  `).all(userId);
  return { ingredients, products };
});

export const getIngredientTrends = createServerFn({ method: "GET" }).handler(async () => {
  const db = getDb();
  const userId = getOrCreateDefaultUser();

  const topIngredients = db.query(`
    SELECT name, COUNT(*) as count, category
    FROM ingredient_logs WHERE user_id = $1
    GROUP BY name ORDER BY count DESC LIMIT 20
  `).all(userId);

  const frequentFlareIngredients = db.query(`
    SELECT il.name, COUNT(*) as flare_count, AVG(sl.severity) as avg_severity
    FROM ingredient_logs il
    JOIN ingredient_flare_links ifl ON il.id = ifl.ingredient_log_id
    JOIN symptom_logs sl ON ifl.symptom_log_id = sl.id
    WHERE il.user_id = $1
    GROUP BY il.name
    ORDER BY flare_count DESC, avg_severity DESC
    LIMIT 15
  `).all(userId);

  return { topIngredients, frequentFlareIngredients };
});

export const linkIngredientToFlare = createServerFn({ method: "POST" }).handler(async (data: unknown) => {
  const { ingredientLogId, symptomLogId, timeDelta, confidence, notes } = data as {
    ingredientLogId: string;
    symptomLogId: string;
    timeDelta?: number;
    confidence?: number;
    notes?: string;
  };
  const db = getDb();
  const userId = getOrCreateDefaultUser();
  const result = db.query(`
    INSERT INTO ingredient_flare_links (user_id, ingredient_log_id, symptom_log_id, time_delta_minutes, confidence, notes)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id
  `).get(userId, ingredientLogId, symptomLogId, timeDelta ?? null, confidence ?? 0.5, notes ?? null);
  return result;
});