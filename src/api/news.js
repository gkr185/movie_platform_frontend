import axios from 'axios'
import { API_URLS, TIMEOUT } from './config'
import { getToken } from '@/utils/auth'

// 创建 axios 实例
const newsApi = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || '',
  timeout: TIMEOUT
})

// 请求拦截器
newsApi.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('新闻API请求失败:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
newsApi.interceptors.response.use(
  response => response,
  error => {
    console.error('新闻API请求失败:', error)
    return Promise.reject(error)
  }
)

// 获取所有新闻
export const getAllNews = () => {
  return newsApi.get('/api/news/all')
}

// 获取新闻详情
export const getNewsDetail = (id) => {
  return newsApi.get(`/api/news/${id}`)
}

// 按分类获取新闻
export const getNewsByCategory = (categoryId) => {
  return newsApi.get(`/api/news/category/${categoryId}`)
}

// 搜索新闻
export const searchNews = (keyword) => {
  return newsApi.get(`/api/news/keyword/${keyword}`)
}

// 获取启用的新闻分类
export const getActiveCategories = () => {
  return newsApi.get('/api/news/categories/active')
}