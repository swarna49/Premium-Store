import axios from "axios"

const api = axios.create({
    baseURL: "/api"
})

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthRequest = error.config?.url?.includes("/users/login") || error.config?.url?.includes("/users/register");

        if (error.response?.status === 401 && !isAuthRequest) {
            // Token expired or invalid, but NOT a login/register attempt
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            window.location.href = "/login"
        }
        return Promise.reject(error)
    }
)

export default api
