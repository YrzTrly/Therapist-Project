import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export async function initDb() {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        );
    `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            "userId" INTEGER NOT NULL REFERENCES users(id),
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
    `);
}

export function query(text, params) {
  return pool.query(text, params);
}
