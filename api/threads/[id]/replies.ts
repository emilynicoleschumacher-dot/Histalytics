import { initDB, sql } from "../../db";

export default async function handler(req: Request) {
  await initDB();

  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const id = segments[segments.length - 2]; // thread_id is before "replies"

  if (!id || isNaN(Number(id))) {
    return new Response(JSON.stringify({ error: "Invalid thread ID" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  if (req.method === "POST") {
    const { author_name, body } = await req.json();
    if (!author_name || !body) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const [reply] = await sql`
      INSERT INTO replies (thread_id, author_name, body)
      VALUES (${Number(id)}, ${author_name}, ${body})
      RETURNING *
    `;

    return new Response(JSON.stringify(reply), {
      status: 201,
      headers: { "content-type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "content-type": "application/json" },
  });
}