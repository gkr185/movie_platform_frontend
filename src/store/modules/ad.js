// 广告状态管理模块
const state = {
  // 广告列表
  adList: [
    {
      id: 1,
      name: '前置广告1',
      type: 'pre-roll', // 广告类型：pre-roll（前置）, mid-roll（中置）, post-roll（后置）
      url: '/uploads/ads/pre-roll.mp4',
      duration: 30,
      skipAfter: 15,
      priority: 1,
      link: 'https://df.qq.com/main.shtml', // 广告跳转链接
      clickText: '点击了解更多' // 点击提示文本
    }
  ],
  
  // 广告播放历史
  playHistory: new Map(), // movieId -> adId[]
  
  // 当前播放的广告
  currentAd: null
}

const getters = {
  // 获取指定类型的广告列表
  getAdsByType: (state) => (type) => {
    return state.adList.filter(ad => ad.type === type)
  },

  // 获取当前广告
  currentAd: (state, getters, rootState) => {
    if (state.currentAd) {
      return {
        ...state.currentAd,
        url: rootState.baseURL + state.currentAd.url // 拼接完整URL
      }
    }
    return null
  },

  // 获取电影已播放的广告历史
  getMovieAdHistory: (state) => (movieId) => {
    return state.playHistory.get(movieId) || []
  }
}

const mutations = {
  // 设置当前广告
  SET_CURRENT_AD(state, ad) {
    state.currentAd = ad
  },

  // 记录广告播放历史
  ADD_TO_HISTORY(state, { movieId, adId }) {
    if (!state.playHistory.has(movieId)) {
      state.playHistory.set(movieId, [])
    }
    state.playHistory.get(movieId).push(adId)
  },

  // 清除电影的广告历史
  CLEAR_MOVIE_HISTORY(state, movieId) {
    state.playHistory.delete(movieId)
  }
}

const actions = {
  // 为电影选择合适的广告
  async selectAdForMovie({ state, commit, getters }, { movieId, type = 'pre-roll' }) {
    // 获取该类型的广告列表
    const ads = getters.getAdsByType(type)
    if (!ads.length) return null

    // 获取该电影已播放过的广告
    const playedAds = getters.getMovieAdHistory(movieId)
    
    // 优先选择未播放过的广告，按优先级排序
    let selectedAd = ads
      .filter(ad => !playedAds.includes(ad.id))
      .sort((a, b) => a.priority - b.priority)[0]

    // 如果所有广告都播放过，则重新从头开始
    if (!selectedAd) {
      selectedAd = ads.sort((a, b) => a.priority - b.priority)[0]
      // 清除历史记录
      commit('CLEAR_MOVIE_HISTORY', movieId)
    }

    if (selectedAd) {
      commit('SET_CURRENT_AD', selectedAd)
      commit('ADD_TO_HISTORY', { movieId, adId: selectedAd.id })
    }

    return selectedAd
  },

  // 清除当前广告
  clearCurrentAd({ commit }) {
    commit('SET_CURRENT_AD', null)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
} 