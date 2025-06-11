import request from '@/utils/request'
import { API_URLS } from './config'
import { movieApi } from './movie'

// 获取所有电影（支持分页）
export function getAllMovies(params) {
  const { page = 1, size = 10, ...rest } = params
  return request({
    url: '/api/movies',
    method: 'get',
    params: {
      page,
      size,
      ...rest,
      status: 1 // 只获取有效的电影
    }
  })
}

// 获取分类列表（支持分页和条件查询）
export function getCategories(params) {
  return request({
    url: '/api/categories',
    method: 'get',
    params: {
      ...params,
      status: 1, // 只获取有效的分类
      include_movies: true // 包含电影关联
    }
  })
}

// 获取分类树结构
export function getCategoryTree() {
  return request({
    url: '/api/categories/tree',
    method: 'get'
  })
}

// 获取分类详情
export function getCategoryDetail(categoryId) {
  return request({
    url: `/api/categories/${categoryId}`,
    method: 'get'
  })
}

// 创建分类（需要管理员权限）
export function createCategory(data) {
  return request({
    url: '/api/categories',
    method: 'post',
    data: {
      ...data,
      status: 1,
      sort_order: data.sortOrder || 0
    }
  })
}

// 更新分类（需要管理员权限）
export function updateCategory(categoryId, data) {
  return request({
    url: `/api/categories/${categoryId}`,
    method: 'put',
    data: {
      ...data,
      sort_order: data.sortOrder
    }
  })
}

// 删除分类（需要管理员权限）
export function deleteCategory(categoryId) {
  return request({
    url: `/api/categories/${categoryId}`,
    method: 'delete'
  })
}

// 获取分类下的电影列表
export function getCategoryMovies(categoryId, params) {
  return request({
    url: `/api/movies/categories/${categoryId}`,
    method: 'get',
    params: {
      ...params,
      status: 1 // 只获取有效的电影
    }
  })
}

// 获取电影的分类信息
export function getMovieCategories(movieId) {
  if (!movieId) {
    return Promise.reject(new Error('电影ID不能为空'))
  }
  
  const url = API_URLS.MOVIE.CATEGORIES.replace('{movieId}', movieId)
  return movieApi.get(url)
    .then(response => {
      // 如果响应中没有data字段，尝试返回整个响应
      const data = response.data || response
      if (!data) {
        throw new Error('获取分类数据失败')
      }
      return data
    })
    .catch(error => {
      console.error('获取电影分类失败:', error)
      throw error
    })
}

// 获取热门分类
export function getHotCategories() {
  return request({
    url: '/api/categories/hot',
    method: 'get'
  })
}

// 获取推荐分类
export function getRecommendCategories() {
  return request({
    url: '/api/categories/recommend',
    method: 'get'
  })
}