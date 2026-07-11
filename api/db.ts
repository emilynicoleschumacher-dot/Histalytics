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

export async function initDB() {
  const db = getSql();
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
}

export { getSql as sql };