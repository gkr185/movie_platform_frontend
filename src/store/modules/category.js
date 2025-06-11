import { getCategories, getCategoryTree, getCategoryMovies, getAllMovies, getMovieCategories } from '@/api/category'
import { ElMessage } from 'element-plus'

const state = {
  categories: [],
  categoryTree: [],
  currentCategory: null,
  categoryMovies: [],
  pagination: {
    page: 1,
    size: 10,
    total: 0
  }
}

const mutations = {
  SET_CATEGORIES(state, { list = [] }) {
    state.categories = list.map(category => ({
      id: category.id,
      name: category.name || '',
      description: category.description || '',
      parentId: category.parent_id || 0
    }))
  },
  SET_CATEGORY_TREE(state, tree) {
    state.categoryTree = tree
  },
  SET_CURRENT_CATEGORY(state, category) {
    state.currentCategory = category
  },
  SET_CATEGORY_MOVIES(state, { list, total }) {
    state.categoryMovies = list.map(movie => ({
      ...movie,
      cover: movie.poster_url,
      score: movie.rating,
      isVip: movie.is_vip === 1
    }))
    state.pagination.total = total
  },
  SET_PAGINATION(state, { page, size }) {
    state.pagination.page = page
    state.pagination.size = size
  }
}

const actions = {
  // 获取分类列表
  async fetchCategories({ commit, state }, params = {}) {
    try {
      const { page = state.pagination.page, size = state.pagination.size } = params
      const response = await getCategories({ page, size, ...params })
      
      // 安全地处理响应数据
      const data = response.data || {}
      const list = Array.isArray(data) ? data : (data.list || [])
      const total = data.total || list.length || 0
      
      commit('SET_CATEGORIES', { list, total })
      commit('SET_PAGINATION', { page, size })
      return list
    } catch (error) {
      console.error('获取分类列表失败:', error)
      throw error
    }
  },

  // 获取分类树
  async fetchCategoryTree({ commit }) {
    try {
      const response = await getCategoryTree()
      commit('SET_CATEGORY_TREE', response.data)
      return response.data
    } catch (error) {
      console.error('获取分类树失败:', error)
      throw error
    }
  },

  // 获取分类下的电影
  async fetchCategoryMovies({ commit, state }, { categoryId, params = {} }) {
    try {
      const { page = state.pagination.page, size = state.pagination.size } = params
      const response = await getCategoryMovies(categoryId, { page, size, ...params })
      const { list, total } = response.data
      commit('SET_CATEGORY_MOVIES', { list, total })
      commit('SET_PAGINATION', { page, size })
      return list
    } catch (error) {
      console.error('获取分类电影失败:', error)
      throw error
    }
  },

  // 获取所有电影
  async fetchAllMovies({ commit, state }, { params = {} }) {
    try {
      const { page = state.pagination.page, size = state.pagination.size } = params
      const response = await getAllMovies({ page, size, ...params })
      
      // 处理后端返回的数据
      const list = response.content || []
      const total = response.totalElements || 0
      
      // 转换电影数据格式
      const formattedList = list.map(movie => ({
        id: movie.id,
        title: movie.title || '',
        description: movie.description || '',
        posterUrl: movie.poster_url || movie.posterUrl || '',
        rating: movie.rating || 0,
        duration: movie.duration || 0,
        releaseDate: movie.release_date || movie.releaseDate || '',
        isVip: movie.is_vip || movie.isVip || false
      }))
      
      commit('SET_CATEGORY_MOVIES', { list: formattedList, total })
      commit('SET_PAGINATION', { page, size })
      return formattedList
    } catch (error) {
      console.error('获取所有电影失败:', error)
      throw error
    }
  },

  // 设置当前分类
  setCurrentCategory({ commit }, category) {
    commit('SET_CURRENT_CATEGORY', category)
  },

  // 设置分页信息
  setPagination({ commit }, pagination) {
    commit('SET_PAGINATION', pagination)
  },

  // 获取电影的分类信息
  async fetchMovieCategories({ commit }, movieId) {
    try {
      if (!movieId) {
        ElMessage.warning('请选择有效的电影')
        return []
      }
      
      const response = await getMovieCategories(movieId)
      // 直接返回响应数据
      return response || []
      
    } catch (error) {
      console.error('获取电影分类失败:', error)
      ElMessage.error('获取电影分类失败，请稍后重试')
      return []
    }
  }
}

const getters = {
  categoryList: state => state.categories,
  categoryTree: state => state.categoryTree,
  currentCategory: state => state.currentCategory,
  categoryMovies: state => state.categoryMovies,
  pagination: state => state.pagination,
  getMovieCategories: state => movieId => {
    // 从 categories 中找到与电影相关的分类
    return state.categories.filter(category => 
      category.movies && category.movies.includes(movieId)
    )
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
