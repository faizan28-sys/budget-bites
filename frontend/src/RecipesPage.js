import { useState } from "react"
export default function RecipesPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  async function searchRecipe() {
    if (!query.trim()) return
    try {
      const res = await fetch(`/api/recipes?q=${query}`)
      const data = await res.json()
      setResults(data)
      setSelectedRecipe(null)
    } catch (err) {
      console.log("Error fetching recipes:", err)
      setResults([])
    }
  }
  async function viewDetails(id) {
    try {
      const res = await fetch(`/api/recipes/${id}`)
      const data = await res.json()
      setSelectedRecipe(data)
    } catch (err) {
      console.log("Error fetching details:", err)
      setSelectedRecipe(null)
    }
  }
  return (
    <div style={{ padding: "20px" }}>
      <h1>Recipe Search</h1>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search recipes"
      />
      <button onClick={searchRecipe}>Search</button>
      {results.length > 0 && !selectedRecipe && (
        <div style={{ marginTop: "20px" }}>
          {results.map(recipe => (
            <div
              key={recipe.id}
              style={{ marginBottom: "15px", cursor: "pointer" }}
              onClick={() => viewDetails(recipe.id)}
            >
              <p>{recipe.title}</p>
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  width={100}
                />
              )}
            </div>
          ))}
        </div>
      )}
      {selectedRecipe && (
        <div style={{ marginTop: "20px" }}>
          <h2>{selectedRecipe.title}</h2>
          {selectedRecipe.image && (
            <img
              src={selectedRecipe.image}
              alt={selectedRecipe.title}
              width={200}
            />
          )}
          <p>Ready in: {selectedRecipe.readyInMinutes} minutes</p>
          <p>Servings: {selectedRecipe.servings}</p>
          <h3>Ingredients</h3>
          <ul>
            {selectedRecipe.ingredients?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <div
            dangerouslySetInnerHTML={{
              __html: selectedRecipe.summary || ""
            }}
          />
          <button onClick={() => setSelectedRecipe(null)}>
            Back
          </button>
        </div>
      )}
    </div>
  )
}