import { mockUsers, registeredUsers } from '../data'
import { 
  login, 
  logout,
  getCurrentUser,
  checkLoginStatus,
  getUserInfo, 
  register, 
  updateProfile, 
  changePassword 
} from '@/api/user'
import { addFavorite, removeFavorite, getFavorites } from '@/api/favorite'
import { 
  addHistory, 
  getHistoryList, 
  deleteHistory, 
  clearHistory,
  getMovieHistory 
} from '@/api/history'
import axios from 'axios'
import { API_URLS } from '@/api/config'

export default {
  namespaced: true,
  
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    userId: null,
    userInfo: null,
    isLoggedIn: false,
    isVIP: false,
    userSettings: null,
    watchHistory: [],
    favorites: [],
    searchHistory: JSON.parse(localStorage.getItem('searchHistory')) || [],
    vipPlans: [],
    watchStats: null,
    watchPreferences: null,
    vipExpireTime: null,
    historyList: [],
    historyTotal: 0,
    currentMovieHistory: null,
    sessionId: null
  },

  mutations: {
    SET_SESSION_ID(state, sessionId) {
      state.sessionId = sessionId
    },

    SET_USER_ID(state, userId) {
      state.userId = userId
    },

    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
      state.user = userInfo
      state.isLoggedIn = true
      state.userId = userInfo.id
      state.userSettings = userInfo.settings || null
      state.isVIP = userInfo.isVip === 1
      state.vipExpireTime = userInfo.vipExpireTime
      
      localStorage.setItem('user', JSON.stringify(userInfo))
    },

    SET_LOGIN_STATUS(state, isLoggedIn) {
      state.isLoggedIn = isLoggedIn
      if (!isLoggedIn) {
        state.user = null
        state.userId = null
        state.userInfo = null
        state.isVIP = false
        state.vipExpireTime = null
        state.userSettings = null
        state.sessionId = null
        localStorage.removeItem('user')
      }
    },

    SET_VIP_STATUS(state, { isVip, vip_expire_time }) {
      state.isVIP = isVip === 1
      state.vipExpireTime = vip_expire_time
      if (state.userInfo) {
        state.userInfo.isVip = isVip
        state.userInfo.vipExpireTime = vip_expire_time
      }
    },

    CLEAR_USER_STATE(state) {
      state.userId = null
      state.userInfo = null
      state.isLoggedIn = false
      state.isVIP = false
      state.vipExpireTime = null
      state.userSettings = null
      state.watchHistory = []
      state.favorites = []
      state.sessionId = null
      localStorage.removeItem('user')
    },

    SET_USER(state, user) {
      state.user = user
      state.isLoggedIn = !!user
      state.isVIP = user?.isVip === 1
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

    LOGOUT(state) {
      state.user = null
      state.userId = null
      state.userInfo = null
      state.isLoggedIn = false
      state.isVIP = false
      state.userSettings = null
      state.watchHistory = []
      state.favorites = []
      state.sessionId = null
      localStorage.removeItem('user')
    },

    UPDATE_USER_SETTINGS(state, settings) {
      state.userSettings = { ...state.userSettings, ...settings }
      if (state.user) {
        state.user.settings = state.userSettings
        localStorage.setItem('user', JSON.stringify(state.user))
      }
    },

    ADD_TO_HISTORY(state, { movie, progress }) {
      const now = new Date().toISOString()
      const historyItem = {
        id: movie.id,
        title: movie.title,
        cover: movie.cover,
        watchTime: now,
        progress: progress,
        duration: movie.duration,
        quality: movie.quality,
        lastPosition: progress * (movie.duration || 0)
      }

      const index = state.watchHistory.findIndex(item => item.id === movie.id)
      if (index > -1) {
        state.watchHistory.splice(index, 1)
      }
      state.watchHistory.unshift(historyItem)

      if (state.watchHistory.length > 50) {
        state.watchHistory.pop()
      }

      if (state.user) {
        state.user.watchHistory = state.watchHistory
        localStorage.setItem('user', JSON.stringify(state.user))
      }
    },

    REMOVE_FROM_HISTORY(state, movieId) {
      state.watchHistory = state.watchHistory.filter(item => item.id !== movieId)
      if (state.user) {
        state.user.watchHistory = state.watchHistory
        localStorage.setItem('user', JSON.stringify(state.user))
      }
    },

    CLEAR_HISTORY(state) {
      state.watchHistory = []
      if (state.user) {
        state.user.watchHistory = []
        localStorage.setItem('user', JSON.stringify(state.user))
      }
    },

    SET_FAVORITES(state, favorites) {
      state.favorites = favorites
      if (state.user) {
        state.user.favorites = favorites
        localStorage.setItem('user', JSON.stringify(state.user))
      }
    },

    ADD_TO_FAVORITES(state, movie) {
      if (!state.favorites.find(item => item.id === movie.id)) {
        const newFavorite = {
          ...movie,
          addTime: new Date().toISOString()
        }
        state.favorites.unshift(newFavorite)
        if (state.user) {
          state.user.favorites = state.favorites
          localStorage.setItem('user', JSON.stringify(state.user))
        }
      }
    },

    REMOVE_FROM_FAVORITES(state, movieId) {
      state.favorites = state.favorites.filter(item => item.id !== movieId)
      if (state.user) {
        state.user.favorites = state.favorites
        localStorage.setItem('user', JSON.stringify(state.user))
      }
    },

    ADD_SEARCH_HISTORY(state, keyword) {
      state.searchHistory = state.searchHistory.filter(item => item !== keyword)
      state.searchHistory.unshift(keyword)
      if (state.searchHistory.length > 10) {
        state.searchHistory.pop()
      }
      localStorage.setItem('searchHistory', JSON.stringify(state.searchHistory))
    },

    CLEAR_SEARCH_HISTORY(state) {
      state.searchHistory = []
      localStorage.removeItem('searchHistory')
    },

    SET_VIP_PLANS(state, plans) {
      state.vipPlans = plans
    },

    SET_WATCH_STATS(state, stats) {
      state.watchStats = stats
    },

    SET_WATCH_PREFERENCES(state, preferences) {
      state.watchPreferences = preferences
    },

    SET_HISTORY_LIST(state, { list, total }) {
      state.historyList = list
      state.historyTotal = total
    },

    SET_CURRENT_MOVIE_HISTORY(state, history) {
      state.currentMovieHistory = history
    },

    CLEAR_HISTORY_LIST(state) {
      state.historyList = []
      state.historyTotal = 0
    }
  },

  actions: {
    async checkLoginStatus({ commit }) {
      try {
        const response = await checkLoginStatus()
        const isLoggedIn = response.data
        commit('SET_LOGIN_STATUS', isLoggedIn)
        
        if (isLoggedIn) {
          await this.dispatch('user/getCurrentUser')
        }
        
        return isLoggedIn
      } catch (error) {
        console.error('检查登录状态失败:', error)
        commit('SET_LOGIN_STATUS', false)
        return false
      }
    },

    async getCurrentUser({ commit }) {
      try {
        const response = await getCurrentUser()
        const userInfo = response.data
        console.log('获取当前用户信息:', userInfo)
        
        commit('SET_USER_INFO', userInfo)
        return response
      } catch (error) {
        console.error('获取当前用户信息失败:', error)
        commit('CLEAR_USER_STATE')
        throw error
      }
    },

    async register({ commit, dispatch }, userInfo) {
      try {
        const response = await register(userInfo)
        console.log('注册响应:', response)
        
        if (response.data) {
          // 注册成功后不需要获取当前用户信息，因为用户还未登录
          // 注册成功后应该跳转到登录页面
          const { id } = response.data
          if (id) {
            commit('SET_USER_ID', id)
          }
          
          // 注册成功后清除可能存在的旧用户状态
          commit('CLEAR_USER_STATE')
        }
        
        return response
      } catch (error) {
        throw error
      }
    },

    async login({ commit, dispatch }, userInfo) {
      try {
        const { username, password } = userInfo
        const response = await login({ username: username.trim(), password })
        console.log('登录响应:', response)
        
        if (response.data) {
          const loginData = response.data
          
          if (loginData.sessionId) {
            commit('SET_SESSION_ID', loginData.sessionId)
          }
          
          if (loginData.user) {
            commit('SET_USER_INFO', loginData.user)
          } else {
            await dispatch('getCurrentUser')
          }
        }
        
        return response
      } catch (error) {
        commit('CLEAR_USER_STATE')
        throw error
      }
    },

    async logout({ commit }) {
      try {
        await logout()
        commit('LOGOUT')
      } catch (error) {
        console.error('登出失败:', error)
        commit('LOGOUT')
        throw error
      }
    },

    async updateUserSettings({ commit, dispatch }, settings) {
      try {
        const response = await updateProfile(settings)
        commit('SET_USER_INFO', response.data)
        return response
      } catch (error) {
        throw error
      }
    },

    async changePassword({ state }, passwordData) {
      try {
        await changePassword(passwordData)
      } catch (error) {
        throw error
      }
    },

    async updateUserInfo({ commit, dispatch }, userData) {
      try {
        const response = await updateProfile(userData)
        commit('SET_USER_INFO', response.data)
        return response
      } catch (error) {
        throw error
      }
    },

    async initUserState({ dispatch }) {
      try {
        const isLoggedIn = await dispatch('checkLoginStatus')
        return isLoggedIn
      } catch (error) {
        console.error('初始化用户状态失败:', error)
        return false
      }
    },

    async addToHistory({ commit }, { movie, progress }) {
      try {
        await new Promise(resolve => setTimeout(resolve, 300))
        commit('ADD_TO_HISTORY', { movie, progress })
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

    async fetchFavorites({ commit, state }) {
      try {
        if (!state.userId) {
          throw new Error('用户未登录')
        }
        console.log('获取收藏列表，用户ID:', state.userId)
        const favorites = await getFavorites(state.userId)
        console.log('获取到的收藏列表:', favorites)
        commit('SET_FAVORITES', favorites)
        return favorites
      } catch (error) {
        console.error('获取收藏列表失败:', error)
        throw error
      }
    },

    async addToFavorites({ commit, state }, movie) {
      try {
        if (!state.userId) {
          throw new Error('用户未登录')
        }
        console.log('添加收藏，用户ID:', state.userId, '电影ID:', movie.id)
        await addFavorite(state.userId, movie.id)
        commit('ADD_TO_FAVORITES', movie)
        return true
      } catch (error) {
        console.error('添加收藏失败:', error)
        throw error
      }
    },

    async removeFromFavorites({ commit, state }, movieId) {
      try {
        if (!state.userId) {
          throw new Error('用户未登录')
        }
        console.log('取消收藏，用户ID:', state.userId, '电影ID:', movieId)
        await removeFavorite(state.userId, movieId)
        commit('REMOVE_FROM_FAVORITES', movieId)
        return true
      } catch (error) {
        console.error('取消收藏失败:', error)
        throw error
      }
    },

    async addSearchHistory({ commit }, keyword) {
      commit('ADD_SEARCH_HISTORY', keyword)
    },

    async clearSearchHistory({ commit }) {
      commit('CLEAR_SEARCH_HISTORY')
    },

    async fetchVIPPlans({ commit }) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        const plans = [
          
        ]
        commit('SET_VIP_PLANS', plans)
        return plans
      } catch (error) {
        console.error('获取VIP套餐失败:', error)
        throw error
      }
    },

    async fetchWatchStats({ commit, state }, timeRange = 'month') {
      try {
        if (!state.userInfo?.id) {
          throw new Error('用户未登录')
        }
        
        try {
          const response = await axios.get(API_URLS.MOVIE_VIEW.USER_STATS.replace('{userId}', state.userInfo.id))
          const stats = response.data
          commit('SET_WATCH_STATS', stats)
          return stats
        } catch (apiError) {
          console.warn('API获取观看统计失败，使用模拟数据:', apiError)
          
          const mockStats = {
            totalDuration: state.watchHistory.length * 30,
            totalCount: state.watchHistory.length,
            favoriteCount: state.favorites.length,
            ratingCount: Math.floor(state.watchHistory.length * 0.6),
            durationGrowth: 20,
            countGrowth: 15,
            favoriteGrowth: 10,
            ratingGrowth: 5,
            dates: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            durations: [3, 2.5, 4, 1, 5, 6, 4.5]
          }
          commit('SET_WATCH_STATS', mockStats)
          return mockStats
        }
      } catch (error) {
        console.error('获取观影统计失败:', error)
        throw error
      }
    },

    async fetchWatchPreferences({ commit }) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        const preferences = [
          { value: 35, name: '科幻' },
          { value: 25, name: '动作' },
          { value: 20, name: '喜剧' },
          { value: 15, name: '剧情' },
          { value: 5, name: '其他' }
        ]
        commit('SET_WATCH_PREFERENCES', preferences)
        return preferences
      } catch (error) {
        console.error('获取观影偏好失败:', error)
        throw error
      }
    },

    async purchaseVIP({ commit, state }, { planId, paymentMethod }) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const plan = state.vipPlans.find(p => p.id === planId)
        if (!plan) {
          throw new Error('无效的会员套餐')
        }

        const now = new Date()
        const expireDate = new Date(now.setDate(now.getDate() + plan.duration))
        
        const updatedUser = {
          ...state.user,
          vip: true,
          vipExpireDate: expireDate.toISOString()
        }
        
        commit('SET_USER', updatedUser)
        return { success: true }
      } catch (error) {
        console.error('购买VIP失败:', error)
        throw error
      }
    },

    async updateHistory({ commit, state }, { movieId, progress, playTime }) {
      try {
        if (!state.userInfo?.id) {
          throw new Error('用户未登录')
        }
        console.log('更新观看历史:', { userId: state.userInfo.id, movieId, progress, playTime })
        await addHistory(state.userInfo.id, movieId, progress, playTime)
      } catch (error) {
        console.error('更新观看历史失败:', error)
        throw error
      }
    },

    async fetchHistoryList({ commit, state }, params) {
      try {
        if (!state.userInfo?.id) {
          throw new Error('用户未登录')
        }
        console.log('获取观看历史列表:', { userId: state.userInfo.id, params })
        const { records, total } = await getHistoryList(state.userInfo.id, params)
        commit('SET_HISTORY_LIST', { list: records, total })
        return { records, total }
      } catch (error) {
        console.error('获取观看历史列表失败:', error)
        throw error
      }
    },

    async deleteHistory({ commit, state }, movieId) {
      try {
        if (!state.userInfo?.id) {
          throw new Error('用户未登录')
        }
        console.log('删除观看历史:', { userId: state.userInfo.id, movieId })
        await deleteHistory(state.userInfo.id, movieId)
        const newList = state.historyList.filter(item => item.id !== movieId)
        commit('SET_HISTORY_LIST', { list: newList, total: state.historyTotal - 1 })
      } catch (error) {
        console.error('删除观看历史失败:', error)
        throw error
      }
    },

    async clearAllHistory({ commit, state }) {
      try {
        if (!state.userInfo?.id) {
          throw new Error('用户未登录')
        }
        console.log('清空观看历史:', { userId: state.userInfo.id })
        await clearHistory(state.userInfo.id)
        commit('CLEAR_HISTORY_LIST')
      } catch (error) {
        console.error('清空观看历史失败:', error)
        throw error
      }
    },

    async fetchMovieHistory({ commit, state }, movieId) {
      try {
        if (!state.userInfo?.id) {
          throw new Error('用户未登录')
        }
        console.log('获取电影观看记录:', { userId: state.userInfo.id, movieId })
        const history = await getMovieHistory(state.userInfo.id, movieId)
        commit('SET_CURRENT_MOVIE_HISTORY', history)
        return history
      } catch (error) {
        console.error('获取电影观看记录失败:', error)
        throw error
      }
    },

    async generatePaymentQRCode({ commit, state }, { planId, paymentMethod, amount }) {
      try {
        if (!planId || !paymentMethod || !amount) {
          throw new Error('缺少必要的支付参数')
        }

        const userId = state.userInfo?.id
        if (!userId) {
          throw new Error('用户未登录')
        }

        const params = {
          userId: Number(userId),
          planId: Number(planId),
          paymentMethod: Number(paymentMethod),
          amount: Number(amount)
        }

        if (isNaN(params.userId) || params.userId <= 0) {
          throw new Error('无效的用户ID')
        }
        if (isNaN(params.planId) || params.planId <= 0) {
          throw new Error('无效的套餐ID')
        }
        if (isNaN(params.paymentMethod) || ![1, 2].includes(params.paymentMethod)) {
          throw new Error('无效的支付方式')
        }
        if (isNaN(params.amount) || params.amount <= 0) {
          throw new Error('无效的支付金额')
        }

        const response = await axios.post(API_URLS.PAYMENT.GENERATE_QRCODE, params)
        
        if (!response.data || !response.data.orderId || !response.data.qrCodeUrl) {
          throw new Error('支付二维码生成失败')
        }

        return response.data
      } catch (error) {
        console.error('生成支付二维码失败:', error)
        if (error.response) {
          throw new Error(error.response.data.message || '生成支付二维码失败')
        }
        throw error
      }
    },

    async checkPaymentStatus({ commit }, { orderId }) {
      try {
        if (!orderId) {
          throw new Error('订单号不能为空')
        }

        const response = await axios.get(API_URLS.PAYMENT.CHECK_STATUS.replace('{orderId}', orderId))
        
        if (!response.data || typeof response.data.status === 'undefined') {
          throw new Error('获取支付状态失败')
        }

        const status = response.data.status
        const statusMap = {
          0: 'PENDING',
          1: 'SUCCESS',
          2: 'FAILED'
        }
        return statusMap[status] || 'PENDING'
      } catch (error) {
        console.error('检查支付状态失败:', error)
        if (error.response) {
          throw new Error(error.response.data.message || '检查支付状态失败')
        }
        throw error
      }
    },

    async handlePaymentCallback({ commit, dispatch }, { orderId, status }) {
      try {
        const response = await axios.post(API_URLS.PAYMENT.CALLBACK, {
          orderId,
          status
        })
        if (status === 'SUCCESS') {
          await dispatch('getCurrentUser')
        }
        return response.data
      } catch (error) {
        throw new Error('处理支付回调失败')
      }
    }
  },

  getters: {
    isLoggedIn: state => state.isLoggedIn,
    isVIP: state => state.isVIP,
    currentUser: state => state.user,
    userSettings: state => state.userSettings,
    watchHistory: state => state.watchHistory,
    favorites: state => state.favorites,
    vipExpireDate: state => state.user?.vipExpireDate,
    searchHistory: state => state.searchHistory,
    username: state => (state.userInfo?.username || state.user?.username || state.user?.name || ''),
    userAvatar: state => (state.userInfo?.avatar || state.user?.avatar || ''),
    vipPlans: state => state.vipPlans,
    watchStats: state => state.watchStats,
    watchPreferences: state => state.watchPreferences,
    token: state => state.sessionId,
    userInfo: state => state.userInfo,
    userId: state => state.userId,
    historyList: state => state.historyList,
    historyTotal: state => state.historyTotal,
    currentMovieHistory: state => state.currentMovieHistory
  }
} 