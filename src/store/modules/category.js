import { getMovieCategories } from '@/api/category'
import { ElMessage } from 'element-plus'

const state = {
  // 改用普通对象存储，避免Map序列化问题
  movieCategories: {}
}

const getters = {
  // 获取指定电影的分类
  getMovieCategories: (state) => (movieId) => {
    console.log('调用getMovieCategories getter:', movieId)
    console.log('当前state中的分类数据:', state.movieCategories)
    return state.movieCategories[movieId] || []
  }
}

const mutations = {
  SET_MOVIE_CATEGORIES(state, { movieId, categories }) {
    console.log('设置分类:', movieId, categories)
    // 使用Vue的响应式更新方式
    state.movieCategories = {
      ...state.movieCategories,
      [movieId]: categories
    }
  }
}

const actions = {
  // 获取电影分类
  async fetchMovieCategories({ commit }, movieId) {
    try {
      console.log('获取分类:', movieId)
      const categories = await getMovieCategories(movieId)
      console.log('API返回的分类数据:', categories)
      commit('SET_MOVIE_CATEGORIES', { movieId, categories })
      return categories
    } catch (error) {
      console.error('获取电影分类失败:', error)
      ElMessage.error('获取电影分类失败')
      return []
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
