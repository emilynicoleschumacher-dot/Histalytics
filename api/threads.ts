import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
let sql: ReturnType<typeof neon> | null = null;

function getSql() {
  if (!sql) {
    if (!url) throw new Error("DATABASE_URL not set");
    sql = neon(url);
  }
  return sql;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const db = getSql();

    // Ensure tables exist
    await db`
      CREATE TABLE IF NOT EXISTS threads (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        author_name TEXT NOT NULL,
        body TEXT NOT NULL,
        view_count INTEGER DEFAULT 0,
        reply_count INTEGER DEFAULT 0,
        last_activity_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    await db`
      CREATE TABLE IF NOT EXISTS replies (
        id SERIAL PRIMARY KEY,
        thread_id INTEGER REFERENCES threads(id) ON DELETE CASCADE,
        author_name TEXT NOT NULL,
        body TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    if (req.method === "GET") {
      const threads = await db`
        SELECT * FROM threads ORDER BY last_activity_at DESC
      `;
      return res.status(200).json(threads);
    }

    if (req.method === "POST") {
      const { title, author_name, body } = req.body || {};
      if (!title || !author_name || !body) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const [thread] = await db`
        INSERT INTO threads (title, author_name, body)
        VALUES (${title}, ${author_name}, ${body})
        RETURNING *
      `;
      return res.status(201).json(thread);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err: any) {
    console.error("Threads API error:", err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
}