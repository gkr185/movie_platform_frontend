import { getAllNews, getNewsDetail, getNewsByCategory, searchNews, getActiveCategories } from '@/api/news'

const state = {
  newsList: [],
  currentNews: null,
  loading: false,
  error: null,
  categories: []
}

const mutations = {
  SET_NEWS_LIST(state, newsList) {
    state.newsList = newsList
  },
  SET_CURRENT_NEWS(state, news) {
    state.currentNews = news
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  }
}

const actions = {
  async fetchAllNews({ commit }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      const response = await getAllNews()
      commit('SET_NEWS_LIST', response.data)
    } catch (error) {
      console.error('获取新闻列表失败:', error)
      commit('SET_ERROR', error.message || '获取新闻列表失败')
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchNewsDetail({ commit }, id) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      const response = await getNewsDetail(id)
      commit('SET_CURRENT_NEWS', response.data)
    } catch (error) {
      console.error('获取新闻详情失败:', error)
      commit('SET_ERROR', error.message || '获取新闻详情失败')
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchNewsByCategory({ commit }, categoryId) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      const response = await getNewsByCategory(categoryId)
      commit('SET_NEWS_LIST', response.data)
    } catch (error) {
      console.error('获取分类新闻失败:', error)
      commit('SET_ERROR', error.message || '获取分类新闻失败')
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async searchNews({ commit }, keyword) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      const response = await searchNews(keyword)
      commit('SET_NEWS_LIST', response.data)
    } catch (error) {
      console.error('搜索新闻失败:', error)
      commit('SET_ERROR', error.message || '搜索新闻失败')
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchActiveCategories({ commit }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      const response = await getActiveCategories()
      commit('SET_CATEGORIES', response.data)
    } catch (error) {
      console.error('获取新闻分类失败:', error)
      commit('SET_ERROR', error.message || '获取新闻分类失败')
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const getters = {
  newsList: state => state.newsList,
  currentNews: state => state.currentNews,
  loading: state => state.loading,
  error: state => state.error,
  categories: state => state.categories
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
