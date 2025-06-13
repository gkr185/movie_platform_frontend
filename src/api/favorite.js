import axios from 'axios'
import { API_BASE_URL, API_URLS } from './config'
import { getToken } from '@/utils/auth'

// 创建axios实例
export const favoriteApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
favoriteApi.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('收藏API请求配置错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
favoriteApi.interceptors.response.use(
  response => {
    return response
  },
  error => {
    console.error('收藏API请求错误:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    })
    return Promise.reject(error)
  }
)

// 添加收藏
export const addFavorite = async (userId, movieId) => {
  try {
    const url = API_URLS.FAVORITE.ADD
      .replace('{userId}', userId)
      .replace('{movieId}', movieId)
    const response = await favoriteApi.post(url)
    return response.data
  } catch (error) {
    console.error('添加收藏失败:', error.message)
    throw error
  }
}

// 取消收藏
export const removeFavorite = async (userId, movieId) => {
  try {
    const url = API_URLS.FAVORITE.REMOVE
      .replace('{userId}', userId)
      .replace('{movieId}', movieId)
    const response = await favoriteApi.delete(url)
    return response.data
  } catch (error) {
    console.error('取消收藏失败:', error.message)
    throw error
  }
}

// 获取收藏列表
export const getFavorites = async (userId) => {
  try {
    const url = API_URLS.FAVORITE.LIST.replace('{userId}', userId)
    console.log('请求收藏列表URL:', url) // 添加日志
    const response = await favoriteApi.get(url)
    console.log('收藏列表响应:', response.data) // 添加日志
    return response.data
  } catch (error) {
    console.error('获取收藏列表失败:', error.message)
    throw error
  }
}

export default {
  addFavorite,
  removeFavorite,
  getFavorites
} 