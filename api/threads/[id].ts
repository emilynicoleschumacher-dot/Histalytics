import { initDB, sql } from "../db";

export default async function handler(req: Request) {
  await initDB();
  const db = sql();

  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "content-type": "application/json" },
    });
  }

  // Extract thread ID from URL path: /api/threads/123
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  if (!id || isNaN(Number(id))) {
    return new Response(JSON.stringify({ error: "Invalid thread ID" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const threadId = Number(id);

  // Get thread
  const [thread] = await db`
    SELECT * FROM threads WHERE id = ${threadId}
  `;

  if (!thread) {
    return new Response(JSON.stringify({ error: "Thread not found" }), {
      status: 404,
      headers: { "content-type": "application/json" },
    });
  }

  // Get replies
  const replies = await db`
    SELECT id, author_name, body, created_at
    FROM replies
    WHERE thread_id = ${threadId}
    ORDER BY created_at ASC
  `;

  // Increment view count
  await db`
    UPDATE threads SET view_count = view_count + 1 WHERE id = ${threadId}
  `;

  return new Response(JSON.stringify({ ...thread, replies }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

export const config = {
  runtime: "edge",
};