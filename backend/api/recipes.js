import dotenv from "dotenv"
dotenv.config()
const SPOONACULAR_KEY = process.env.SPOONACULAR_KEY
export async function getRecipes(req, res) {
  const query = req.query.q
  if (!query) return res.json([])
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&number=5&apiKey=${SPOONACULAR_KEY}`
    )
    const data = await response.json()
    if (!data.results) {
      return res.json([])
    }
    const results = data.results.map(r => ({
      id: r.id,
      title: r.title,
      image: r.image
    }))
    return res.json(results)
  } catch (err) {
    console.log("Error fetching recipes:", err)
    return res.json([])
  }
}
export async function getRecipeDetails(req, res) {
  const id = req.params.id
  if (!id) return res.json({})
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${SPOONACULAR_KEY}`
    )
    const data = await response.json()
    const details = {
      id: data.id,
      title: data.title,
      image: data.image,
      readyInMinutes: data.readyInMinutes,
      servings: data.servings,
      summary: data.summary,
      ingredients: data.extendedIngredients?.map(i => i.original) || []
    }
    return res.json(details)
  } catch (err) {
    console.log("Error fetching details:", err)
    return res.json({})
  }
}