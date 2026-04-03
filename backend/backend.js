import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { initDb } from "./db.js"
import { registerUser, loginUser } from "./api/auth.js"
import { getRecipes, getRecipeDetails } from "./api/recipes.js"
dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
const PORT = 5050
app.post("/api/auth/register", registerUser)
app.post("/api/auth/login", loginUser)
app.get("/api/recipes", getRecipes)
app.get("/api/recipes/:id", getRecipeDetails)
await initDb()
app.listen(PORT, () => {
  console.log(`Backend running on ${PORT}`)
})