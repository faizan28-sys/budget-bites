import { useState } from "react"
export default function AuthPage({ setUser }) {
  const [tab, setTab] = useState("login")
  const [loginRole, setLoginRole] = useState("user")
  const [registerRole, setRegisterRole] = useState("user")
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [message, setMessage] = useState("")
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [address, setAddress] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  async function handleLogin(e) {
    e.preventDefault()
    setMessage("")
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
          role: loginRole
        })
      })
      const text = await res.text()
      console.log("LOGIN RAW RESPONSE:", text)
      const data = text ? JSON.parse(text) : {}
      setMessage(data.message || "")
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user))
        setUser(data.user)
      }
    } catch (err) {
      console.log("Login error:", err)
      setMessage(err.message || "Something went wrong")
    }
  }
  async function handleRegister(e) {
    e.preventDefault()
    setMessage("")
    const body = {
      role: registerRole,
      email: registerEmail,
      password: registerPassword
    }
    if (registerRole === "user") {
      body.name = name
      body.surname = surname
      body.dateOfBirth = dateOfBirth
    }
    if (registerRole === "business") {
      body.name = name
      body.address = address
    }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      })
      const text = await res.text()
      console.log("REGISTER RAW RESPONSE:", text)
      const data = text ? JSON.parse(text) : {}
      setMessage(data.message || "")
      if (res.ok) {
        setName("")
        setSurname("")
        setDateOfBirth("")
        setAddress("")
        setRegisterEmail("")
        setRegisterPassword("")
      }
    } catch (err) {
      console.log("Register error:", err)
      setMessage(err.message || "Something went wrong")
    }
  }
  return (
    <div style={{ maxWidth: "420px", margin: "40px auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setTab("login")}>Login</button>
        <button onClick={() => setTab("register")}>Register</button>
      </div>
      {tab === "login" && (
        <div>
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "10px" }}>
              <select
                value={loginRole}
                onChange={e => setLoginRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="business">Business</option>
              </select>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <input
                type="text"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <input
                type="password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="Password"
              />
            </div>

            <button type="submit">Login</button>
          </form>
        </div>
      )}
      {tab === "register" && (
        <div>
          <h1>Register</h1>
          <div style={{ marginBottom: "10px" }}>
            <select
              value={registerRole}
              onChange={e => setRegisterRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="business">Business</option>
            </select>
          </div>
          <form onSubmit={handleRegister}>
            {registerRole === "user" && (
              <>
                <div style={{ marginBottom: "10px" }}>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Name"
                  />
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <input
                    type="text"
                    value={surname}
                    onChange={e => setSurname(e.target.value)}
                    placeholder="Surname"
                  />
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={e => setDateOfBirth(e.target.value)}
                  />
                </div>
              </>
            )}
            {registerRole === "business" && (
              <>
                <div style={{ marginBottom: "10px" }}>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Business Name"
                  />
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Address"
                  />
                </div>
              </>
            )}
            <div style={{ marginBottom: "10px" }}>
              <input
                type="text"
                value={registerEmail}
                onChange={e => setRegisterEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <input
                type="password"
                value={registerPassword}
                onChange={e => setRegisterPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
            <button type="submit">Register</button>
          </form>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  )
}