import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  withCredentials: true,
})

axiosInstance.interceptors.request.use((config) => {
  return config
}, (error) => {
  return Promise.reject(error)
})

axiosInstance.interceptors.response.use((config) => {
  return config
}, (error) => {
  return Promise.reject(error)
})

export default {
  install: (app: any, options: any) => {
    app.config.globalProperties.$axios = axiosInstance
    app.provide('$axios', axiosInstance)
  }
}