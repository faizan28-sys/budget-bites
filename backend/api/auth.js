import { getDb } from "../db.js"
export async function registerUser(req, res) {
  console.log("REGISTER BODY:", req.body)
  const {
    role,
    name,
    surname,
    dateOfBirth,
    address,
    email,
    password
  } = req.body
  if (!role || !email || !password) {
    return res.status(400).json({
      message: "Please fill in all required fields"
    })
  }
  if (role !== "user" && role !== "business") {
    return res.status(403).json({
      message: "Only user and business accounts can register"
    })
  }
  if (role === "user" && (!name || !surname || !dateOfBirth)) {
    return res.status(400).json({
      message: "Please fill in all user fields"
    })
  }

  if (role === "business" && (!name || !address)) {
    return res.status(400).json({
      message: "Please fill in all business fields"
    })
  }
  try {
    const db = getDb()
    if (!db) {
      return res.status(500).json({
        message: "Database not initialized"
      })
    }
    const existingUser = await db.get(
      "SELECT * FROM users WHERE email = ?",
      [email]
    )

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered"
      })
    }
    const result = await db.run(
      `INSERT INTO users
      (role, name, surname, dateOfBirth, address, email, password)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        role,
        name || "",
        surname || "",
        dateOfBirth || "",
        address || "",
        email,
        password
      ]
    )
    return res.json({
      message: "Registration successful",
      user: {
        id: result.lastID,
        role,
        name: name || "",
        surname: surname || "",
        dateOfBirth: dateOfBirth || "",
        address: address || "",
        email
      }
    })
  } catch (err) {
    console.log("Register error:", err)
    return res.status(500).json({
      message: err.message || "Registration failed"
    })
  }
}
export async function loginUser(req, res) {
  console.log("LOGIN BODY:", req.body)
  const { email, password, role } = req.body
  if (!email || !password || !role) {
    return res.status(400).json({
      message: "Please fill in all login fields"
    })
  }
  if (role !== "user" && role !== "business") {
    return res.status(403).json({
      message: "Invalid role"
    })
  }
  try {
    const db = getDb()
    if (!db) {
      return res.status(500).json({
        message: "Database not initialized"
      })
    }
    const user = await db.get(
      "SELECT * FROM users WHERE email = ? AND password = ? AND role = ?",
      [email, password, role]
    )

    if (!user) {
      return res.status(401).json({
        message: "Invalid login"
      })
    }

    return res.json({
      message: "Login successful",
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        surname: user.surname,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        email: user.email
      }
    })
  } catch (err) {
    console.log("Login error:", err)
    return res.status(500).json({
      message: err.message || "Login failed"
    })
  }
}