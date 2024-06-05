import { useState, useEffect } from "react"
import LoginForm from "./LoginForm"
import TodoList from "./TodoList"
import axiosInstance from "./axiosInstance"

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function fetchUser() {
      const response = await axiosInstance
        .get("/auth/verify-token")
        .catch(() => null)
      response && setUser(response.data)
    }

    fetchUser()
  }, [])

  if (!user) {
    return <LoginForm setUser={setUser} />
  }

  return (
    <>
      <h1>Welcome, {user.username}</h1>
      <TodoList />
    </>
  )
}
