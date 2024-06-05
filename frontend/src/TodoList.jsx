import { useState, useEffect, useRef } from "react"
import axiosInstance from "./axiosInstance"
import TodoItem from "./TodoItem"

export default function TodoList() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const todoInputRef = useRef()

  useEffect(() => {
    async function fetchTodos() {
      setLoading(true)
      setError(null)

      const response = await axiosInstance
        .get("/todos/")
        .catch(() => {
          setError("Something went wrong fetching todos, try reloading")
        })
        .finally(() => setLoading(false))

      response && setTodos(response.data)
    }

    fetchTodos()
  }, [])

  async function onAdd(e) {
    setError(null)
    e.preventDefault()

    const todoTitle = todoInputRef.current.value
    if (!todoTitle.trim()) return

    setTodos([...todos, { title: todoTitle, id: 0, completed: false }])
    todoInputRef.current.value = ""

    const response = await axiosInstance
      .post("/todos/", { title: todoTitle })
      .catch((_) => {
        setTodos(todos)
        setError("Something went wrong adding todo!")
      })

    response && setTodos([...todos, response.data])
  }

  return (
    <>
      {loading && <h2>Loading...</h2>}
      {error && <h2>{error}</h2>}
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          {...todo}
          todos={todos}
          setTodos={setTodos}
          setError={setError}
        />
      ))}
      <form onSubmit={onAdd}>
        <input type="text" ref={todoInputRef} placeholder="Add a new todo" />
        <button type="submit">Add Todo</button>
      </form>
    </>
  )
}
