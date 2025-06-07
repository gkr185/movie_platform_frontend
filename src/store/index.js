import { createStore } from 'vuex'
import { mockMovies, mockAds, mockRankings, mockVIPPlans } from './data'
import movie from './modules/movie'
import user from './modules/user'
import comment from './modules/comment'

export default createStore({
  state: {
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
    vipPlans: []
  },

  getters: {
    hotMovies: state => state.movies.hot,
    newMovies: state => state.movies.new,
    recommendedMovies: state => state.movies.recommended,
    currentTheme: state => state.theme,
    isMenuOpen: state => state.navMenu.isOpen,
    advertisements: state => state.advertisements,
    hotRankings: state => state.rankings.hot,
    scoreRankings: state => state.rankings.score,
    vipPlans: state => state.vipPlans
  },

  mutations: {
    SET_HOT_MOVIES(state, movies) {
      state.movies.hot = movies
    },
    SET_NEW_MOVIES(state, movies) {
      state.movies.new = movies
    },
    SET_RECOMMENDED_MOVIES(state, movies) {
      state.movies.recommended = movies
    },
    TOGGLE_THEME(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
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
    SET_VIP_PLANS(state, plans) {
      state.vipPlans = plans
    }
  },

  actions: {
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
    async fetchVIPPlans({ commit }) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        commit('SET_VIP_PLANS', mockVIPPlans)
      } catch (error) {
        console.error('获取VIP套餐失败:', error)
      }
    }
  },

  modules: {
    movie,
    user,
    comment
  }
})
