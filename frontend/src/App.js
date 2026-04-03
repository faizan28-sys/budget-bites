import { useEffect, useState } from "react"
import AuthPage from "./AuthPage"
import RecipesPage from "./RecipesPage"
import BusinessPage from "./BusinessPage"
export default function App() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])
  function handleLogout() {
    localStorage.removeItem("user")
    setUser(null)
  }
  if (!user) {
    return <AuthPage setUser={setUser} />
  }
  return (
    <div>
      <div style={{ padding: "20px" }}>
        <p>Welcome, {user.name || user.email}</p>
        <p>Role: {user.role}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
      {user.role === "user" && <RecipesPage />}
      {user.role === "business" && <BusinessPage />}
    </div>
  )
}