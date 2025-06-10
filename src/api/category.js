import axios from 'axios'
import { API_BASE_URL, API_URLS } from './config'

// 创建axios实例
const categoryApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 获取单独电影的分类
export const getMovieCategories = async (movieId) => {
  try {
    const response = await categoryApi.get(`/api/movies/getCategories/${movieId}`)
    return response.data
  } catch (error) {
    console.error('获取电影分类失败:', error.message)
    throw error
  }
}

export default {
  getMovieCategories
} 