import axios from 'axios'
import { getToken } from '@/utils/auth'
import { API_BASE_URL, API_URLS } from './config'

// 创建独立的axios实例避免循环依赖
const historyApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
})

// 请求拦截器
historyApi.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
historyApi.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error.response?.status === 401) {
      // 处理401错误但不引用store避免循环依赖
      console.error('认证失败，请重新登录')
    }
    throw error
  }
)

/**
 * 添加/更新观看历史
 * @param {number} userId - 用户ID
 * @param {number} movieId - 电影ID
 * @param {number} progress - 观看进度（秒）
 * @param {number} playTime - 播放时长（秒）
 */
export function addHistory(userId, movieId, progress, playTime) {
  const url = API_URLS.HISTORY.ADD
    .replace('{userId}', userId)
    .replace('{movieId}', movieId)
  return historyApi.post(url, null, {
    params: { progress, playTime }
  })
}

/**
 * 获取观看历史列表
 * @param {number} userId - 用户ID
 * @param {Object} params - 分页参数
 */
export function getHistoryList(userId, params) {
  const url = API_URLS.HISTORY.LIST
    .replace('{userId}', userId)
  return historyApi.get(url, { params }).then(response => {
    // 处理返回的数据结构
    const records = response.content.map(item => ({
      ...item.movie,
      progress: item.history.progress,
      playTime: item.history.playTime,
      createTime: item.history.createTime,
      updateTime: item.history.updateTime
    }))
    return {
      records,
      total: response.totalElements,
      page: response.number + 1,
      size: response.size,
      totalPages: response.totalPages
    }
  })
}

/**
 * 删除单条观看历史
 * @param {number} userId - 用户ID
 * @param {number} movieId - 电影ID
 */
export function deleteHistory(userId, movieId) {
  const url = API_URLS.HISTORY.DELETE
    .replace('{userId}', userId)
    .replace('{movieId}', movieId)
  return historyApi.delete(url)
}

/**
 * 清空观看历史
 * @param {number} userId - 用户ID
 */
export function clearHistory(userId) {
  const url = API_URLS.HISTORY.CLEAR
    .replace('{userId}', userId)
  return historyApi.delete(url)
}

/**
 * 获取特定电影的观看记录
 * @param {number} userId - 用户ID
 * @param {number} movieId - 电影ID
 */
export function getMovieHistory(userId, movieId) {
  const url = API_URLS.HISTORY.DETAIL
    .replace('{userId}', userId)
    .replace('{movieId}', movieId)
  return historyApi.get(url)
} 