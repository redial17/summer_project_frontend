import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'

const baseURL = '/api'

const instance = axios.create({
  baseURL,
  timeout: 1000
})

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // send token
    const useStore = useUserStore()
    if (useStore.token) {
      config.headers.Authorization = useStore.token
    }
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    // TODO: login successful logic
    if (response.data) {
      return response
    }
    // failure
    ElMessage.error(response)
    return Promise.reject(response.data)
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    // 401 permission denied or token expired
    if (error.response?.status === 401) {
      router.push('/login')
    }

    // default
    ElMessage.error(error.response)
    return Promise.reject(error)
  }
)

export default instance
export { baseURL }
