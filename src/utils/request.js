import axios from 'axios'
import store from '@/store'
import { ElMessage } from 'element-plus'
import { API_BASE_URL } from '@/api/config'
import router from '@/router'

// 创建axios实例
const service = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 增加超时时间以匹配API文档
  retries: 3,     // 添加重试次数
  retryDelay: 1000, // 重试间隔时间(ms)
  withCredentials: true, // 重要：支持Cookie，用于Session机制
  credentials: 'include' // 确保跨域请求携带Cookie
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // Session机制不需要手动添加Token，Cookie会自动携带
    // 确保所有请求都携带Cookie
    config.withCredentials = true
    
    // 添加Content-Type头（如果没有设置）
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json'
    }
    
    console.log('发送请求:', config.method?.toUpperCase(), config.url)
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
      // Session失效或未登录
      if (res.code === 401) {
        store.dispatch('user/logout')
        router.push('/user/login')
        throw new Error('登录已过期，请重新登录')
      }
      
      // 处理用户模块特定错误码
      const errorMessages = {
        1001: '用户名已存在',
        1002: '邮箱已被注册',
        1003: '用户不存在',
        1004: '密码错误',
        1006: '用户名或密码错误',
        1007: '原密码错误'
      }
      
      const errorMessage = errorMessages[res.code] || res.message || '请求失败'
      throw new Error(errorMessage)
    }
    
    return res
  },
  async error => {
    // 处理401错误（Session过期）
    if (error.response?.status === 401) {
      store.dispatch('user/logout')
      router.push('/user/login')
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