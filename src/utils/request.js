import axios from 'axios'
import { getToken } from './auth'
import store from '@/store'
import { ElMessage } from 'element-plus'
import { API_BASE_URL } from '@/api/config'

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
    // 在请求发送前添加token，但不强制要求
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.warn('请求配置错误，但继续执行：', error)
    return Promise.resolve(error)
  }
)

// 添加重试机制
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // 放宽状态码检查，只要返回数据就认为是成功
    if (res) {
      return res
    } else {
      console.warn('响应数据为空，但继续执行')
      return {}
    }
  },
  async error => {
    if (error.config && error.config.retries > 0) {
      error.config.retries--;
      
      // 等待重试延迟时间
      await new Promise(resolve => setTimeout(resolve, error.config.retryDelay))
      
      // 重试请求
      return service(error.config)
    }

    console.warn('API请求失败：', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message
    })

    // 显示友好的错误提示，但不中断执行
    ElMessage({
      message: '请求暂时无法完成，但您可以继续使用其他功能',
      type: 'warning',
      duration: 3000
    })

    // 返回空数据而不是拒绝Promise
    return Promise.resolve({
      code: error.response?.status || 500,
      data: [],
      message: error.message
    })
  }
)

export default service 