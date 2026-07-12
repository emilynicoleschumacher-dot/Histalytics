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

  const today = new Date().toISOString().slice(0, 10);
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [totalSymptoms] = await db`SELECT COUNT(*)::int as count FROM symptom_logs WHERE user_id = ${userId}`;
  const [todaySymptoms] = await db`SELECT COUNT(*)::int as count FROM symptom_logs WHERE user_id = ${userId} AND logged_at::date = ${today}::date`;
  const [avgSeverity] = await db`SELECT COALESCE(AVG(severity), 0)::float as avg FROM symptom_logs WHERE user_id = ${userId} AND logged_at >= ${weekAgo}`;
  const [totalMeals] = await db`SELECT COUNT(*)::int as count FROM meal_logs WHERE user_id = ${userId}`;
  const [totalSupplements] = await db`SELECT COUNT(*)::int as count FROM supplement_logs WHERE user_id = ${userId}`;

  return new Response(JSON.stringify({
    totalSymptoms: totalSymptoms.count,
    todaySymptoms: todaySymptoms.count,
    avgSeverity: Math.round(avgSeverity.avg * 10) / 10,
    totalMeals: totalMeals.count,
    totalSupplements: totalSupplements.count,
  }), {
    status: 200, headers: { "content-type": "application/json" },
  });
}

export const config = { runtime: "edge" };