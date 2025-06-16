import axios from 'axios'
import { getToken } from './auth'
import store from '@/store'
import { ElMessage } from 'element-plus'
import { API_BASE_URL } from '@/api/config'
import router from '@/router'

// 创建axios实例
const service = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 设置超时时间为10秒
  retries: 3,     // 添加重试次数
  retryDelay: 1000 // 重试间隔时间(ms)
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在请求发送前添加token
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    } else {
      // 如果请求需要认证但没有token，直接拒绝
      const requiresAuth = !config.url.includes('/login') && 
                         !config.url.includes('/register') &&
                         !config.url.includes('/public')&&
                         !config.url.includes('/check-username')
      if (requiresAuth) {
        return Promise.reject(new Error('请先登录'))
      }
    }
    return config
  },
  error => {
    console.error('请求配置错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // 如果响应中包含错误码，进行相应处理
    if (res.code && res.code !== 200) {
      // token失效
      if (res.code === 401) {
        store.dispatch('user/logout')
        router.push('/login')
        throw new Error('登录已过期，请重新登录')
      }
      
      // 其他业务错误
      throw new Error(res.message || '请求失败')
    }
    
    return res
  },
  async error => {
    // 处理401错误
    if (error.response?.status === 401) {
      store.dispatch('user/logout')
      router.push('/login')
      throw new Error('登录已过期，请重新登录')
    }

    // 处理404错误
    if (error.response?.status === 404) {
      throw new Error('请求的资源不存在')
    }

    // 处理网络错误
    if (!error.response) {
      throw new Error('网络连接失败，请检查网络设置')
    }

    // 如果配置了重试且不是401错误，进行重试
    if (error.config && error.config.retries > 0 && error.response?.status !== 401) {
      error.config.retries--
      await new Promise(resolve => setTimeout(resolve, error.config.retryDelay))
      return service(error.config)
    }

    console.error('API请求失败：', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    })

    throw error
  }
)


export default service 