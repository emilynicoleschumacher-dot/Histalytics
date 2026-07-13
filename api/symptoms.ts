import { initDB, getOrCreateUser, sql } from "./_db";

export default async function handler(req: Request) {
  await initDB();
  const db = sql();

  // Get Clerk user ID from query param (passed by frontend)
  const url = new URL(req.url);
  const clerkId = url.searchParams.get("clerk_id");
  if (!clerkId) {
    return new Response(JSON.stringify({ error: "clerk_id required" }), {
      status: 401, headers: { "content-type": "application/json" },
    });
  }
  const userId = await getOrCreateUser(clerkId);

  if (req.method === "POST") {
    const { symptom_id, symptom_name, body_system, severity, duration_minutes, notes, logged_at, relief_at, relief_note } = await req.json();
    if (!symptom_id || !symptom_name || !body_system || severity === undefined) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { "content-type": "application/json" },
      });
    }
    const [symptom] = await db`
      INSERT INTO symptom_logs (user_id, symptom_id, symptom_name, body_system, severity, duration_minutes, notes, logged_at, relief_at, relief_note)
      VALUES (${userId}, ${symptom_id}, ${symptom_name}, ${body_system}, ${severity}, ${duration_minutes || null}, ${notes || null}, ${logged_at || new Date().toISOString()}, ${relief_at || null}, ${relief_note || null})
      RETURNING id, logged_at
    `;
    return new Response(JSON.stringify(symptom), {
      status: 201, headers: { "content-type": "application/json" },
    });
  }

  if (req.method === "PUT") {
    const id = url.searchParams.get("id");
    if (!id) {
      return new Response(JSON.stringify({ error: "id required" }), {
        status: 400, headers: { "content-type": "application/json" },
      });
    }
    const { symptom_id, symptom_name, body_system, severity, duration_minutes, notes, logged_at, relief_at, relief_note } = await req.json();
    await db`
      UPDATE symptom_logs SET
        symptom_id = ${symptom_id || null},
        symptom_name = ${symptom_name || null},
        body_system = ${body_system || null},
        severity = ${severity},
        duration_minutes = ${duration_minutes || null},
        notes = ${notes || null},
        logged_at = ${logged_at || null},
        relief_at = ${relief_at || null},
        relief_note = ${relief_note || null}
      WHERE id = ${id} AND user_id = ${userId}
    `;
    return new Response(JSON.stringify({ updated: true }), {
      status: 200, headers: { "content-type": "application/json" },
    });
  }

  if (req.method === "GET") {
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const symptoms = await db`
      SELECT id, symptom_id, symptom_name, body_system, severity, duration_minutes, notes, logged_at, relief_at, relief_note
      FROM symptom_logs WHERE user_id = ${userId}
      ORDER BY logged_at DESC LIMIT ${limit}
    `;
    return new Response(JSON.stringify(symptoms), {
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
    await db`DELETE FROM symptom_logs WHERE id = ${id} AND user_id = ${userId}`;
    return new Response(JSON.stringify({ deleted: true }), {
      status: 200, headers: { "content-type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405, headers: { "content-type": "application/json" },
  });
}

export const config = { runtime: "edge" };