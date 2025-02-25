import axios from 'axios'
import { toast } from 'react-toastify'
import store from '../../store'
import { toggleLoader } from '../../store/ui'

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_AUTH_BE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  return config
})

export const apiRequest = async (request, showLoader = true) => {
  store.dispatch(toggleLoader(showLoader))
  const response = await request()
    .then((res) => ({
      ...res.data,
      success: true,
    }))
    .catch((error) => {
      const message = error.response.data.message
      if (error.response.status === 403) {
        if (localStorage.getItem('token')) {
          toast.error(message)
        }
      } else {
        toast.error(message)
      }
      return {
        success: false,
        message: message,
      }
    })
  store.dispatch(toggleLoader(false))
  return response
}
