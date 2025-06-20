import { mockUsers, registeredUsers } from '../data'
import { 
  login, 
  getUserInfo, 
  register, 
  updateUserInfo, 
  updateUserSettings,
  changePassword 
} from '@/api/user'
import { addFavorite, removeFavorite, getFavorites } from '@/api/favorite'
import { getToken, setToken, removeToken } from '@/utils/auth'
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
    token: getToken(),
    userId: null,
    userInfo: null,
    isLoggedIn: !!getToken(),
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
    currentMovieHistory: null
  },

  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      state.isLoggedIn = !!token
      setToken(token)
    },

    SET_USER_ID(state, userId) {
      state.userId = userId
    },

    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
      state.user = userInfo
      state.isLoggedIn = true
      state.userSettings = userInfo.settings || null
      state.isVIP = userInfo.isVip === 1
      state.vipExpireTime = userInfo.vipExpireTime
    },

    SET_VIP_STATUS(state, { isVip, vip_expire_time }) {
      state.isVIP = isVip === 1
      state.vipExpireTime = vip_expire_time
      if (state.userInfo) {
        state.userInfo.is_vip = isVip
        state.userInfo.vip_expire_time = vip_expire_time
      }
    },

    CLEAR_USER_STATE(state) {
      state.token = null
      state.userId = null
      state.userInfo = null
      state.isLoggedIn = false
      state.isVIP = false
      state.vipExpireTime = null
      state.userSettings = null
      state.watchHistory = []
      state.favorites = []
      removeToken()
    },

    SET_USER(state, user) {
      state.user = user
      state.isLoggedIn = !!user
      state.isVIP = user?.is_vip === 1
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
      state.token = ''
      state.user = null
      state.isLoggedIn = false
      state.isVIP = false
      state.userSettings = null
      state.watchHistory = []
      state.favorites = []
      localStorage.removeItem('token')
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

      // 限制历史记录数量为50条
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
    async register({ commit, dispatch }, userInfo) {
      try {
        const response = await register(userInfo)
        const { token, id } = response.data
        
        commit('SET_TOKEN', token)
        commit('SET_USER_ID', id)
        
        await dispatch('getUserInfo')
        
        return response
      } catch (error) {
        throw error
      }
    },

    async login({ commit, dispatch }, userInfo) {
      try {
        const { username, password } = userInfo
        const response = await login({ username: username.trim(), password })
        const { token, id } = response.data
        
        commit('SET_TOKEN', token)
        commit('SET_USER_ID', id)
        
        await dispatch('getUserInfo')
        
        return response
      } catch (error) {
        commit('CLEAR_USER_STATE')
        throw error
      }
    },

    async getUserInfo({ commit, state }) {
      try {
        if (!state.userId) {
          throw new Error('用户ID不存在')
        }
        const response = await getUserInfo(state.userId)
        const userInfo = response.data
        console.log('API返回的用户信息:', response)
        console.log('解析后的用户信息:', userInfo)
        
        commit('SET_USER_INFO', userInfo)
        
        return response
      } catch (error) {
        commit('CLEAR_USER_STATE')
        throw error
      }
    },

    async updateUserSettings({ commit, state }, settings) {
      try {
        const response = await updateUserSettings(state.userId, settings)
        commit('SET_USER_INFO', response.data)
        return response
      } catch (error) {
        throw error
      }
    },

    async changePassword({ state }, passwordData) {
      try {
        await changePassword(state.userId, passwordData)
      } catch (error) {
        throw error
      }
    },

    async updateUserInfo({ commit, state }, userData) {
      try {
        const response = await updateUserInfo(state.userId, userData)
        commit('SET_USER_INFO', response.data)
        return response
      } catch (error) {
        throw error
      }
    },

    logout({ commit }) {
      commit('CLEAR_USER_STATE')
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
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500))
        const plans = [
          {
            id: 1,
            name: '月度会员',
            price: 19.9,
            originalPrice: 29.9,
            duration: 30,
            recommended: false,
            features: [
              '1080p高清视频',
              '无广告观影体验',
              '会员专属内容'
            ]
          },
          {
            id: 2,
            name: '季度会员',
            price: 49.9,
            originalPrice: 79.9,
            duration: 90,
            recommended: true,
            features: [
              '4K超清视频',
              '无广告观影体验',
              '会员专属内容',
              '离线缓存'
            ]
          },
          {
            id: 3,
            name: '年度会员',
            price: 169.9,
            originalPrice: 299.9,
            duration: 365,
            recommended: false,
            features: [
              '4K超清视频',
              '无广告观影体验',
              '会员专属内容',
              '离线缓存',
              '专属客服'
            ]
          }
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
        
        // 尝试从真实API获取用户观看统计
        try {
          const response = await axios.get(API_URLS.MOVIE_VIEW.USER_STATS.replace('{userId}', state.userInfo.id))
          const stats = response.data
          commit('SET_WATCH_STATS', stats)
          return stats
        } catch (apiError) {
          console.warn('API获取观看统计失败，使用模拟数据:', apiError)
          
          // 如果API调用失败，使用模拟数据
          const mockStats = {
            totalDuration: state.watchHistory.length * 30, // 假设每部电影平均30分钟
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
        // 模拟API调用
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
        // 模拟API调用
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

    initUserState({ dispatch, state }) {
      if (state.token && !state.userInfo) {
        return dispatch('getUserInfo').catch(() => {
          dispatch('logout')
        })
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
        // 从列表中移除
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

    // 生成支付二维码
    async generatePaymentQRCode({ commit, state }, { planId, paymentMethod, amount }) {
      try {
        // 参数验证
        if (!planId || !paymentMethod || !amount) {
          throw new Error('缺少必要的支付参数')
        }

        // 获取当前用户ID
        const userId = state.userInfo?.id
        if (!userId) {
          throw new Error('用户未登录')
        }

        // 确保参数类型正确
        const params = {
          userId: Number(userId),
          planId: Number(planId),
          paymentMethod: Number(paymentMethod),
          amount: Number(amount)
        }

        // 验证参数范围
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
          // 服务器返回错误
          throw new Error(error.response.data.message || '生成支付二维码失败')
        }
        throw error
      }
    },

    // 检查支付状态
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
        // 将数字状态转换为字符串状态
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

    // 处理支付回调
    async handlePaymentCallback({ commit, dispatch }, { orderId, status }) {
      try {
        const response = await axios.post(API_URLS.PAYMENT.CALLBACK, {
          orderId,
          status
        })
        if (status === 'SUCCESS') {
          await dispatch('fetchUserInfo')
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
    token: state => state.token,
    userInfo: state => state.userInfo,
    userId: state => state.userId,
    historyList: state => state.historyList,
    historyTotal: state => state.historyTotal,
    currentMovieHistory: state => state.currentMovieHistory
  }
} 