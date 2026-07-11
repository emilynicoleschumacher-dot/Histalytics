import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);

export async function initDB() {
  await sql`
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

  await sql`
    CREATE TABLE IF NOT EXISTS replies (
      id SERIAL PRIMARY KEY,
      thread_id INTEGER REFERENCES threads(id) ON DELETE CASCADE,
      author_name TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  // Add columns if they don't exist (idempotent migration)
  const migrations = [
    `ALTER TABLE threads ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0`,
    `ALTER TABLE threads ADD COLUMN IF NOT EXISTS reply_count INTEGER DEFAULT 0`,
    `ALTER TABLE threads ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMP DEFAULT NOW()`,
    `ALTER TABLE threads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()`,
  ];
  for (const m of migrations) {
    try { await sql.unsafe(m); } catch { /* column may already exist */ }
  }
}

export { sql };