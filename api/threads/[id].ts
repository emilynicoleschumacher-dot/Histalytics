import { initDB, sql } from "../../db";

export default async function handler(req: Request) {
  await initDB();

  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id || isNaN(Number(id))) {
    return new Response(JSON.stringify({ error: "Invalid thread ID" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  if (req.method === "GET") {
    const [thread] = await sql`
      SELECT * FROM threads WHERE id = ${Number(id)}
    `;
    if (!thread) {
      return new Response(JSON.stringify({ error: "Thread not found" }), {
        status: 404,
        headers: { "content-type": "application/json" },
      });
    }

    const replies = await sql`
      SELECT * FROM replies WHERE thread_id = ${Number(id)}
      ORDER BY created_at ASC
    `;

    return new Response(JSON.stringify({ ...thread, replies }), {
      headers: { "content-type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "content-type": "application/json" },
  });
}