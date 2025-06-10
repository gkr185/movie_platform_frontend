import axios from 'axios'
import { API_BASE_URL, API_URLS } from './config'

// 创建axios实例
const movieApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 获取电影详情
export const getMovieDetail = async (movieId) => {
  try {
    const url = API_URLS.MOVIE.DETAIL.replace('{movieId}', movieId)
    const response = await movieApi.get(url)
    return response.data
  } catch (error) {
    console.error('获取电影详情失败:', error.message)
    throw error
  }
}

export default {
  getMovieDetail
} 