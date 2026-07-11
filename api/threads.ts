import { initDB, sql } from "./db";

export default async function handler(req: Request) {
  await initDB();

  if (req.method === "GET") {
    const threads = await sql`
      SELECT * FROM threads
      ORDER BY last_activity_at DESC
    `;
    return new Response(JSON.stringify(threads), {
      headers: { "content-type": "application/json" },
    });
  }

  if (req.method === "POST") {
    const { title, author_name, body } = await req.json();
    if (!title || !author_name || !body) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const [thread] = await sql`
      INSERT INTO threads (title, author_name, body)
      VALUES (${title}, ${author_name}, ${body})
      RETURNING *
    `;

    return new Response(JSON.stringify(thread), {
      status: 201,
      headers: { "content-type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "content-type": "application/json" },
  });
}