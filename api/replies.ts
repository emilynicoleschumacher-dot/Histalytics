import { initDB, sql } from "./db";

export default async function handler(req: Request) {
  await initDB();

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "content-type": "application/json" },
    });
  }

  const { thread_id, author_name, body } = await req.json();

  if (!thread_id || !author_name || !body) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  // Verify thread exists
  const [thread] = await sql`
    SELECT id FROM threads WHERE id = ${Number(thread_id)}
  `;
  if (!thread) {
    return new Response(JSON.stringify({ error: "Thread not found" }), {
      status: 404,
      headers: { "content-type": "application/json" },
    });
  }

  const [reply] = await sql`
    INSERT INTO replies (thread_id, author_name, body)
    VALUES (${Number(thread_id)}, ${author_name}, ${body})
    RETURNING *
  `;

  // Update reply count on thread
  await sql`
    UPDATE threads 
    SET reply_count = (SELECT COUNT(*) FROM replies WHERE thread_id = ${Number(thread_id)}),
        last_activity_at = NOW()
    WHERE id = ${Number(thread_id)}
  `;

  return new Response(JSON.stringify(reply), {
    status: 201,
    headers: { "content-type": "application/json" },
  });
}

export const config = {
  runtime: "edge",
};