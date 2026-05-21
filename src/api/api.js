import { promise } from "zod"
import axios from 'axios'
const baseURL =  import.meta.env.VITE_BASE_URL
export const publicInstance = axios.create({ baseURL })
export const privateInstance = axios.create({ baseURL })

privateInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}
, error => {  return Promise.reject(error)
})