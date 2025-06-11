import axios from 'axios'
import { getToken } from './auth'
import store from '@/store'
import { ElMessage } from 'element-plus'
import { API_BASE_URL, TIMEOUT } from '@/api/config'

// 创建axios实例
const service = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在请求发送前添加token
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // 如果返回的状态码不是200，说明接口出错
    if (res.code !== 200) {
      ElMessage({
        message: res.message || '错误',
        type: 'error',
        duration: 5 * 1000
      })

      // 401: Token失效
      if (res.code === 401) {
        store.dispatch('user/logout').then(() => {
          location.reload()
        })
      }
      return Promise.reject(new Error(res.message || '错误'))
    } else {
      return res
    }
  },
  error => {
    console.error('响应错误：', error)
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service 