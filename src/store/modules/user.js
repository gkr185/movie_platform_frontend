import { mockUsers, registeredUsers } from '../data'

export default {
  namespaced: true,
  
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || '',
    isLoggedIn: false,
    isVIP: false,
    userSettings: null,
    watchHistory: [],
    favorites: [],
    searchHistory: JSON.parse(localStorage.getItem('searchHistory')) || [],
    vipPlans: [],
    watchStats: null,
    watchPreferences: null
  },

  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },

    SET_USER(state, user) {
      state.user = user
      state.isLoggedIn = !!user
      state.isVIP = user?.vip || false
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
    }
  },

  actions: {
    async login({ commit }, credentials) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const user = registeredUsers.get(credentials.username)
        
        if (!user) {
          throw new Error('用户不存在')
        }
        
        if (user.password !== credentials.password) {
          throw new Error('密码错误')
        }

        const token = btoa(user.username + ':' + new Date().getTime())
        
        const userInfo = { ...user }
        delete userInfo.password
        
        commit('SET_TOKEN', token)
        commit('SET_USER', userInfo)
        
        return { token, user: userInfo }
      } catch (error) {
        throw error
      }
    },

    async register({ commit }, userData) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        
        if (registeredUsers.has(userData.username)) {
          throw new Error('用户名已存在')
        }
        
        const emailExists = Array.from(registeredUsers.values()).some(
          user => user.email === userData.email
        )
        if (emailExists) {
          throw new Error('邮箱已被使用')
        }
        
        const newUser = {
          id: registeredUsers.size + 1,
          username: userData.username,
          password: userData.password,
          name: userData.username,
          email: userData.email,
          avatar: '',
          vip: false,
          watchHistory: [],
          favorites: [],
          settings: {
            theme: 'light',
            playbackQuality: '1080p',
            autoPlay: true,
            notifications: true
          }
        }
        
        registeredUsers.set(userData.username, newUser)
        
        return { success: true }
      } catch (error) {
        throw error
      }
    },

    async logout({ commit }) {
      try {
        await new Promise(resolve => setTimeout(resolve, 300))
        commit('LOGOUT')
        document.documentElement.setAttribute('data-theme', 'light')
        return { success: true }
      } catch (error) {
        throw error
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

    async fetchWatchStats({ commit }, timeRange = 'month') {
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500))
        const stats = {
          totalDuration: 120,
          totalCount: 48,
          favoriteCount: 32,
          ratingCount: 25,
          durationGrowth: 20,
          countGrowth: 15,
          favoriteGrowth: 10,
          ratingGrowth: 5,
          dates: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          durations: [3, 2.5, 4, 1, 5, 6, 4.5]
        }
        commit('SET_WATCH_STATS', stats)
        return stats
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
    username: state => state.user?.name || '',
    userAvatar: state => state.user?.avatar || '',
    vipPlans: state => state.vipPlans,
    watchStats: state => state.watchStats,
    watchPreferences: state => state.watchPreferences
  }
} 