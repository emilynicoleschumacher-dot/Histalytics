import { initDB, getOrCreateUser, sql } from "./_db";

export default async function handler(req: Request) {
  await initDB();
  const db = sql();
  const url = new URL(req.url);
  const clerkId = url.searchParams.get("clerk_id");
  if (!clerkId) {
    return new Response(JSON.stringify({ error: "clerk_id required" }), {
      status: 401, headers: { "content-type": "application/json" },
    });
  }
  const userId = await getOrCreateUser(clerkId);

  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { "content-type": "application/json" },
    });
  }

  const symptoms = await db`
    SELECT id, symptom_id, symptom_name, body_system, severity, duration_minutes, notes, logged_at
    FROM symptom_logs WHERE user_id = ${userId}
    ORDER BY logged_at DESC LIMIT 200
  `;

  const meals = await db`
    SELECT id, food_name, meal_type, portion_size, notes, logged_at
    FROM meal_logs WHERE user_id = ${userId}
    ORDER BY logged_at DESC LIMIT 200
  `;

  const supplements = await db`
    SELECT id, supplement_name, brand, dosage, frequency, notes, logged_at
    FROM supplement_logs WHERE user_id = ${userId}
    ORDER BY logged_at DESC LIMIT 200
  `;

  return new Response(JSON.stringify({ symptoms, meals, supplements }), {
    status: 200, headers: { "content-type": "application/json" },
  });
}

export const config = { runtime: "edge" };