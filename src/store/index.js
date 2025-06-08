import { createStore } from 'vuex'
import { mockMovies, mockAds, mockRankings, mockVIPPlans, mockBanners } from './data'
import movie from './modules/movie'
import user from './modules/user'
import comment from './modules/comment'
import ad from './modules/ad'

export default createStore({
  state: {
    movies: {
      hot: [],
      new: [],
      recommended: []
    },
    banners: [],
    theme: localStorage.getItem('theme') || 'light',
    navMenu: {
      isOpen: false
    },
    advertisements: [],
    rankings: {
      hot: [],
      score: []
    },
    vipPlans: [],
    baseURL: process.env.VUE_APP_API_BASE_URL || ''
  },

  getters: {
    hotMovies: state => state.movies.hot,
    newMovies: state => state.movies.new,
    recommendedMovies: state => state.movies.recommended,
    banners: state => state.banners,
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
    SET_BANNERS(state, banners) {
      state.banners = banners
    },
    SET_THEME(state, theme) {
      state.theme = theme
      localStorage.setItem('theme', theme)
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
    async fetchBanners({ commit }) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        commit('SET_BANNERS', mockBanners)
      } catch (error) {
        console.error('获取轮播图数据失败:', error)
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
    },
    toggleTheme({ commit, state }) {
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      commit('SET_THEME', newTheme)
    }
  },

  modules: {
    movie,
    user,
    comment,
    ad
  }
})
