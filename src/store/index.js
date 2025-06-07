import { createStore } from 'vuex'
import { mockMovies, mockAds, mockRankings, mockUsers, mockVIPPlans } from './data'

export default createStore({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || '',
    movies: {
      hot: [],
      new: [],
      recommended: []
    },
    theme: localStorage.getItem('theme') || 'light',
    navMenu: {
      isOpen: false
    },
    advertisements: [],
    rankings: {
      hot: [],
      score: []
    },
    userSettings: null,
    watchHistory: [],
    favorites: [],
    vipPlans: []
  },
  getters: {
    isLoggedIn: state => !!state.token,
    currentUser: state => state.user,
    hotMovies: state => state.movies.hot,
    newMovies: state => state.movies.new,
    recommendedMovies: state => state.movies.recommended,
    currentTheme: state => state.theme,
    isMenuOpen: state => state.navMenu.isOpen,
    advertisements: state => state.advertisements,
    hotRankings: state => state.rankings.hot,
    scoreRankings: state => state.rankings.score,
    userSettings: state => state.userSettings,
    watchHistory: state => state.watchHistory,
    favorites: state => state.favorites,
    vipPlans: state => state.vipPlans,
    isVIP: state => state.user?.vip || false,
    vipExpireDate: state => state.user?.vipExpireDate
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_USER(state, user) {
      state.user = user
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
        state.userSettings = user.settings
        state.watchHistory = user.watchHistory
        state.favorites = user.favorites
      } else {
        localStorage.removeItem('user')
        state.userSettings = null
        state.watchHistory = []
        state.favorites = []
      }
    },
    SET_HOT_MOVIES(state, movies) {
      state.movies.hot = movies
    },
    SET_NEW_MOVIES(state, movies) {
      state.movies.new = movies
    },
    SET_RECOMMENDED_MOVIES(state, movies) {
      state.movies.recommended = movies
    },
    LOGOUT(state) {
      state.token = ''
      state.user = null
      state.userSettings = null
      state.watchHistory = []
      state.favorites = []
      localStorage.removeItem('token')
    },
    TOGGLE_THEME(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      if (state.userSettings) {
        state.userSettings.theme = state.theme
      }
      localStorage.setItem('theme', state.theme)
      document.documentElement.setAttribute('data-theme', state.theme)
    },
    TOGGLE_MENU(state) {
      state.navMenu.isOpen = !state.navMenu.isOpen
    },
    SET_MENU_STATE(state, isOpen) {
      state.navMenu.isOpen = isOpen
    },
    SET_ADVERTISEMENTS(state, ads) {
      state.advertisements = ads
    },
    SET_HOT_RANKINGS(state, rankings) {
      state.rankings.hot = rankings
    },
    SET_SCORE_RANKINGS(state, rankings) {
      state.rankings.score = rankings
    },
    UPDATE_USER_SETTINGS(state, settings) {
      state.userSettings = { ...state.userSettings, ...settings }
      if (state.user) {
        state.user.settings = state.userSettings
      }
    },
    ADD_TO_HISTORY(state, movie) {
      const index = state.watchHistory.findIndex(item => item.id === movie.id)
      if (index > -1) {
        state.watchHistory.splice(index, 1)
      }
      state.watchHistory.unshift(movie)
    },
    REMOVE_FROM_HISTORY(state, movieId) {
      state.watchHistory = state.watchHistory.filter(item => item.id !== movieId)
    },
    CLEAR_HISTORY(state) {
      state.watchHistory = []
    },
    ADD_TO_FAVORITES(state, movie) {
      if (!state.favorites.find(item => item.id === movie.id)) {
        state.favorites.unshift({
          ...movie,
          addTime: new Date().toISOString()
        })
      }
    },
    REMOVE_FROM_FAVORITES(state, movieId) {
      state.favorites = state.favorites.filter(item => item.id !== movieId)
    },
    SET_VIP_PLANS(state, plans) {
      state.vipPlans = plans
    }
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const mockUser = mockUsers.test
        const response = { 
          data: { 
            token: 'mock-jwt-token',
            user: mockUser
          } 
        }
        commit('SET_TOKEN', response.data.token)
        commit('SET_USER', response.data.user)
        return response
      } catch (error) {
        throw error
      }
    },
    async fetchHotMovies({ commit }) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        commit('SET_HOT_MOVIES', mockMovies.hot)
      } catch (error) {
        console.error('获取热门电影失败:', error)
      }
    },
    async fetchNewMovies({ commit }) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        commit('SET_NEW_MOVIES', mockMovies.new)
      } catch (error) {
        console.error('获取最新电影失败:', error)
      }
    },
    async fetchRecommendedMovies({ commit }) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        commit('SET_RECOMMENDED_MOVIES', mockMovies.recommended)
      } catch (error) {
        console.error('获取推荐电影失败:', error)
      }
    },
    async fetchAdvertisements({ commit }) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        commit('SET_ADVERTISEMENTS', mockAds)
      } catch (error) {
        console.error('获取广告数据失败:', error)
      }
    },
    async fetchRankings({ commit }) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        commit('SET_HOT_RANKINGS', mockRankings.hot)
        commit('SET_SCORE_RANKINGS', mockRankings.score)
      } catch (error) {
        console.error('获取排行榜数据失败:', error)
      }
    },
    async updateUserSettings({ commit }, settings) {
      try {
        await new Promise(resolve => setTimeout(resolve, 300))
        commit('UPDATE_USER_SETTINGS', settings)
      } catch (error) {
        console.error('更新用户设置失败:', error)
        throw error
      }
    },
    async addToHistory({ commit }, movie) {
      try {
        await new Promise(resolve => setTimeout(resolve, 300))
        commit('ADD_TO_HISTORY', movie)
      } catch (error) {
        console.error('添加观看历史失败:', error)
        throw error
      }
    },
    async removeFromHistory({ commit }, movieId) {
      try {
        await new Promise(resolve => setTimeout(resolve, 300))
        commit('REMOVE_FROM_HISTORY', movieId)
      } catch (error) {
        console.error('删除观看历史失败:', error)
        throw error
      }
    },
    async clearHistory({ commit }) {
      try {
        await new Promise(resolve => setTimeout(resolve, 300))
        commit('CLEAR_HISTORY')
      } catch (error) {
        console.error('清空观看历史失败:', error)
        throw error
      }
    },
    async addToFavorites({ commit }, movie) {
      try {
        await new Promise(resolve => setTimeout(resolve, 300))
        commit('ADD_TO_FAVORITES', movie)
      } catch (error) {
        console.error('添加收藏失败:', error)
        throw error
      }
    },
    async removeFromFavorites({ commit }, movieId) {
      try {
        await new Promise(resolve => setTimeout(resolve, 300))
        commit('REMOVE_FROM_FAVORITES', movieId)
      } catch (error) {
        console.error('取消收藏失败:', error)
        throw error
      }
    },
    async fetchVIPPlans({ commit }) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        commit('SET_VIP_PLANS', mockVIPPlans)
      } catch (error) {
        console.error('获取VIP套餐失败:', error)
        throw error
      }
    }
  },
  modules: {
  }
})
