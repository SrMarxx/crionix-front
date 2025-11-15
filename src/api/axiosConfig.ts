import axios, { type InternalAxiosRequestConfig, type AxiosInstance } from 'axios'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  withCredentials: true,
})

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const jwtToken = localStorage.getItem('accessToken')

    const publicRoutes = ['/login', '/csrf']

    if (jwtToken && !publicRoutes.includes(config.url || '')) {
      config.headers.Authorization = `Bearer ${jwtToken}`
    }

    const { useAuthStore } = await import('@/stores/auth')
    const authStore = useAuthStore()
    const csrfToken = authStore.csrfToken

    const csrfMethods = ['post', 'put', 'delete', 'patch']
    if (csrfToken && config.method && csrfMethods.includes(config.method)) {
      config.headers['X-XSRF-TOKEN'] = csrfToken
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default axiosInstance
