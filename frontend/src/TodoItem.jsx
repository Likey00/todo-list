import axiosInstance from "./axiosInstance"

export default function TodoItem({
  id,
  title,
  completed,
  todos,
  setTodos,
  setError,
}) {
  async function onToggle() {
    setError(null)
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )

    await axiosInstance.put(`/todos/${id}`, {}).catch(() => {
      setError("Checked too quick, try again!")
      setTodos(todos)
    })
  }

  async function onDelete() {
    setError(null)
    setTodos(todos.filter((todo) => todo.id !== id))

    await axiosInstance.delete(`/todos/${id}`).catch(() => {
      setError("Deleted too quick, try again!")
      setTodos(todos)
    })
  }

  return (
    <li>
      {title}
      <input type="checkbox" checked={completed} onChange={onToggle} />
      <button onClick={onDelete}>Delete</button>
    </li>
  )
}
