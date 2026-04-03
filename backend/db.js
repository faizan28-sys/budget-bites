import sqlite3 from "sqlite3"
import { open } from "sqlite"
import path from "path"
import { fileURLToPath } from "url"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbPath = path.join(__dirname, "data.db")
let db
export async function initDb() {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  })
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT NOT NULL,
      name TEXT,
      surname TEXT,
      dateOfBirth TEXT,
      address TEXT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `)
  const admin = await db.get(
    "SELECT * FROM users WHERE email = ? AND role = ?",
    ["admin", "admin"]
  )
  if (!admin) {
    await db.run(
      `INSERT INTO users
      (role, name, surname, dateOfBirth, address, email, password)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ["admin", "Admin", "", "", "", "admin", "161211"]
    )
  }
}
export function getDb() {
  return db
}