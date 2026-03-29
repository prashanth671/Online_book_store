import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
})

// Attach JWT to every request
API.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem('bs_user') || 'null')
    if (user?.token) config.headers.Authorization = `Bearer ${user.token}`
  } catch { /* ignore */ }
  return config
})

// Global response error normaliser
API.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.message ||
      'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export default API
