import { useRef, useState } from "react"
import axiosInstance from "./axiosInstance"

export default function LoginForm({ setUser }) {
  const usernameRef = useRef()
  const passwordRef = useRef()
  const [loggingIn, setLoggingIn] = useState(false)
  const [error, setError] = useState(null)
  const [registering, setRegistering] = useState(false)
  const [regMessage, setRegMessage] = useState(null)

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }

  async function handleLogin(e) {
    e.preventDefault()
    setLoggingIn(true)
    setError(null)

    const response = await axiosInstance
      .post("/auth/token", getFormData(), config)
      .catch((_) => setError("Incorrect username or password"))
      .finally(() => setLoggingIn(false))

    if (response) {
      const token = response.data
      localStorage.setItem("token", token.access_token)
      setUser(token.user)
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    setRegistering(true)
    setRegMessage(null)
    setError(null)

    const formData = new URLSearchParams()
    formData.append("username", usernameRef.current.value)
    formData.append("password", passwordRef.current.value)

    const response = await axiosInstance
      .post("/users/register", getFormData(), config)
      .catch((_) => setError("Username already exists!"))
      .finally(() => setRegistering(false))

    if (response) {
      setRegMessage("Successfully registered! You may now log in")
    }
  }

  function getFormData() {
    const formData = new URLSearchParams()
    formData.append("username", usernameRef.current.value)
    formData.append("password", passwordRef.current.value)
    return formData
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username</label>
          <input type="text" ref={usernameRef} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" ref={passwordRef} required />
        </div>
        <button type="submit" disabled={loggingIn}>
          {loggingIn ? "Logging in..." : "Login"}
        </button>
        <button onClick={handleRegister} type="button" disabled={registering}>
          {registering ? "Registering..." : "Register"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {regMessage && <p>{regMessage}</p>}
    </div>
  )
}
