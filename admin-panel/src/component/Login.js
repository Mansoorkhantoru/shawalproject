import React, { useState } from "react"
import axios from "axios"
import "./protected.css"
export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const login = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post("http://localhost:3000/admin/login", {
        username,
        password
      })

      alert(res.data.message)

      // store login state
      localStorage.setItem("admin", "true")

      // redirect
      window.location.href = "/allorders"
    } catch (error) {
      alert("Login failed")
    }
  }

  return (
    <form onSubmit={login} className="login">
      <h1>Admin Login</h1>

      <div className="in">
        <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>
      </div>
    </form>
  )
}