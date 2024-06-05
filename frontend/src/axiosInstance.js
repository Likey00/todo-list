import axios from "axios"

const axiosInstance = axios.create({
  baseURL: "https://likey-todo-app.azurewebsites.net",
  headers: {
    "Content-Type": "application/json",
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    localStorage.removeItem("token")
    return Promise.reject(error)
  }
)

export default axiosInstance
