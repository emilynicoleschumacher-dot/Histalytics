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

  if (req.method === "POST") {
    const { food_name, meal_type, portion_size, notes, logged_at } = await req.json();
    if (!food_name) {
      return new Response(JSON.stringify({ error: "food_name required" }), {
        status: 400, headers: { "content-type": "application/json" },
      });
    }
    const [meal] = await db`
      INSERT INTO meal_logs (user_id, food_name, meal_type, portion_size, notes, logged_at)
      VALUES (${userId}, ${food_name}, ${meal_type || null}, ${portion_size || null}, ${notes || null}, ${logged_at || new Date().toISOString()})
      RETURNING id, logged_at
    `;
    return new Response(JSON.stringify(meal), {
      status: 201, headers: { "content-type": "application/json" },
    });
  }

  if (req.method === "GET") {
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const meals = await db`
      SELECT id, food_name, meal_type, portion_size, notes, logged_at
      FROM meal_logs WHERE user_id = ${userId}
      ORDER BY logged_at DESC LIMIT ${limit}
    `;
    return new Response(JSON.stringify(meals), {
      status: 200, headers: { "content-type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405, headers: { "content-type": "application/json" },
  });
}

export const config = { runtime: "edge" };