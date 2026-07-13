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
    const { supplement_name, brand, dosage, frequency, notes, logged_at } = await req.json();
    if (!supplement_name) {
      return new Response(JSON.stringify({ error: "supplement_name required" }), {
        status: 400, headers: { "content-type": "application/json" },
      });
    }
    const [supplement] = await db`
      INSERT INTO supplement_logs (user_id, supplement_name, brand, dosage, frequency, notes, logged_at)
      VALUES (${userId}, ${supplement_name}, ${brand || null}, ${dosage || null}, ${frequency || null}, ${notes || null}, ${logged_at || new Date().toISOString()})
      RETURNING id, logged_at
    `;
    return new Response(JSON.stringify(supplement), {
      status: 201, headers: { "content-type": "application/json" },
    });
  }

  if (req.method === "GET") {
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const supplements = await db`
      SELECT id, supplement_name, brand, dosage, frequency, notes, logged_at
      FROM supplement_logs WHERE user_id = ${userId}
      ORDER BY logged_at DESC LIMIT ${limit}
    `;
    return new Response(JSON.stringify(supplements), {
      status: 200, headers: { "content-type": "application/json" },
    });
  }

  if (req.method === "DELETE") {
    const id = url.searchParams.get("id");
    if (!id) {
      return new Response(JSON.stringify({ error: "id required" }), {
        status: 400, headers: { "content-type": "application/json" },
      });
    }
    await db`DELETE FROM supplement_logs WHERE id = ${id} AND user_id = ${userId}`;
    return new Response(JSON.stringify({ deleted: true }), {
      status: 200, headers: { "content-type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405, headers: { "content-type": "application/json" },
  });
}

export const config = { runtime: "edge" };