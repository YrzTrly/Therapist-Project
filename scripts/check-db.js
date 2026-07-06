import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  "";
console.log("Using connection string:", connectionString ? "PROVIDED" : "NONE");

const pool = new Pool({
  connectionString: connectionString || undefined,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  try {
    const res = await pool.query("SELECT 1 AS result");
    console.log("DB test query result:", res.rows);
  } catch (err) {
    console.error(
      "DB connection error:",
      err && err.message ? err.message : err,
    );
  } finally {
    await pool.end();
  }
})();
