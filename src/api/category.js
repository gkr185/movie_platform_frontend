import { API_URLS } from './config'
import { movieApi } from './movie'

// 获取所有电影（支持分页）
export function getAllMovies(params) {
  const { page = 1, size = 10, ...rest } = params
  return movieApi.get(API_URLS.MOVIE.LIST, {
    params: {
      page: Number(page),
      size: Number(size),
      ...rest,
      status: 1 // 只获取有效的电影
    }
  }).then(response => response.data)
    .catch(error => {
      console.error('获取所有电影失败:', error)
      throw error
    })
}

// 获取分类列表（支持分页和条件查询）
export function getCategories(params = {}) {
  return movieApi.get(API_URLS.CATEGORY.LIST, {
    params: {
      ...params,
      status: 1,
      include_movies: true
    }
  }).then(response => response.data)
    .catch(error => {
      console.error('获取分类列表失败:', error)
      throw error
    })
}

// 获取分类树结构
export function getCategoryTree() {
  return movieApi.get(API_URLS.CATEGORY.TREE)
    .then(response => {
      if (!response.data) {
        throw new Error('获取分类树结构失败: 响应数据为空')
      }
      return response.data
    })
    .catch(error => {
      console.error('获取分类树结构失败:', error)
      throw error
    })
}

// 获取分类详情
export function getCategoryDetail(categoryId) {
  if (!categoryId || isNaN(Number(categoryId))) {
    return Promise.reject(new Error('无效的分类ID'))
  }
  
  return movieApi.get(API_URLS.CATEGORY.DETAIL.replace('{categoryId}', Number(categoryId)))
    .then(response => {
      if (!response.data) {
        throw new Error(`未找到ID为${categoryId}的分类`)
      }
      return response.data
    })
    .catch(error => {
      console.error(`获取分类${categoryId}详情失败:`, error)
      throw error
    })
}

// 获取分类下的电影列表
export function getCategoryMovies(categoryId, params = {}) {
  if (!categoryId || isNaN(Number(categoryId))) {
    return Promise.reject(new Error('无效的分类ID'))
  }

  console.log('发起获取分类电影请求:', {
    categoryId,
    params,
    url: API_URLS.MOVIE.BY_CATEGORY.replace('{categoryId}', Number(categoryId))
  })

  return movieApi.get(API_URLS.MOVIE.BY_CATEGORY.replace('{categoryId}', Number(categoryId)), {
    params: {
      ...params,
      status: 1
    }
  }).then(response => {
    console.log('获取分类电影API原始响应:', response)
    return response.data
  })
  .catch(error => {
    console.error(`获取分类${categoryId}的电影列表失败:`, error)
    console.error('请求配置:', error.config)
    if (error.response) {
      console.error('响应数据:', error.response.data)
      console.error('响应状态:', error.response.status)
      console.error('响应头:', error.response.headers)
    }
    throw error
  })
}

// 获取电影的分类信息
export function getMovieCategories(movieId) {
  if (!movieId || isNaN(Number(movieId))) {
    return Promise.reject(new Error('无效的电影ID'))
  }
  
  return movieApi.get(API_URLS.MOVIE.CATEGORIES.replace('{movieId}', Number(movieId)))
    .then(response => {
      if (!response.data) {
        throw new Error(`未找到ID为${movieId}的电影分类信息`)
      }
      return response.data
    })
    .catch(error => {
      console.error(`获取电影${movieId}的分类信息失败:`, error)
      throw error
    })
}




