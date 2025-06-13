import axios from 'axios'
import { API_BASE_URL, API_URLS } from './config'

// 创建axios实例
export const movieApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 响应拦截器
movieApi.interceptors.response.use(
  response => {
    return response
  },
  error => {
    console.error('API请求错误:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    })
    return Promise.reject(error)
  }
)

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

// 按分类搜索电影
export const getMoviesByCategory = async (categoryId) => {
  try {
    const url = API_URLS.MOVIE.BY_CATEGORY.replace('{categoryId}', categoryId)
    const response = await movieApi.get(url)
    return response.data
  } catch (error) {
    console.error('按分类搜索电影失败:', error.message)
    throw error
  }
}

// 获取电影的所有分类
export const getMovieCategories = async (movieId) => {
  try {
    const url = API_URLS.MOVIE.CATEGORIES.replace('{movieId}', movieId)
    const response = await movieApi.get(url)
    return response.data
  } catch (error) {
    console.error('获取电影分类失败:', error.message)
    throw error
  }
}

// 获取热门电影排行
export const getHotMovies = async () => {
  try {
    console.log('请求热门电影排行:', API_URLS.MOVIE.RANKINGS.HOT)
    const response = await movieApi.get(API_URLS.MOVIE.RANKINGS.HOT)
    console.log('热门电影排行响应:', response.data)
    return response.data
  } catch (error) {
    console.error('获取热门电影排行失败:', error.message)
    throw error
  }
}

// 获取推荐电影排行
export const getRecommendedMovies = async () => {
  try {
    console.log('请求推荐电影排行:', API_URLS.MOVIE.RANKINGS.RECOMMENDED)
    const response = await movieApi.get(API_URLS.MOVIE.RANKINGS.RECOMMENDED)
    console.log('推荐电影排行响应:', response.data)
    return response.data
  } catch (error) {
    console.error('获取推荐电影排行失败:', error.message)
    throw error
  }
}

// 获取最新电影排行
export const getNewMovies = async () => {
  try {
    console.log('请求最新电影排行:', API_URLS.MOVIE.RANKINGS.NEW)
    const response = await movieApi.get(API_URLS.MOVIE.RANKINGS.NEW)
    console.log('最新电影排行响应:', response.data)
    return response.data
  } catch (error) {
    console.error('获取最新电影排行失败:', error.message)
    throw error
  }
}

// 按关键词搜索电影
export const searchMovies = async (keyword) => {
  try {
    console.log('搜索电影，关键词:', keyword)
    const response = await movieApi.get(API_URLS.MOVIE.SEARCH, {
      params: { keyword }
    })
    console.log('搜索结果:', response.data)
    return response.data
  } catch (error) {
    console.error('搜索电影失败:', error.message)
    throw error
  }
}

export default {
  getMovieDetail,
  getMoviesByCategory,
  getMovieCategories,
  getHotMovies,
  getRecommendedMovies,
  getNewMovies,
  searchMovies
} 