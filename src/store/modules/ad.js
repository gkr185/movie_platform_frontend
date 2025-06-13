// 广告状态管理模块
import { getImageAds, getVideoAds } from '@/api/ad'
import { ElMessage } from 'element-plus'

const state = {
  // 图片广告列表
  imageAds: [],
  // 当前视频广告
  currentVideoAd: null,
  // 广告加载状态
  loading: false,
  // 错误信息
  error: null,
  // 广告播放历史
  playHistory: new Map(), // movieId -> adId[]
}

const getters = {
  // 获取所有图片广告
  imageAds: state => state.imageAds,
  
  // 获取当前视频广告
  currentVideoAd: state => {
    console.log('获取当前视频广告状态:', state.currentVideoAd)
    return state.currentVideoAd
  },
  
  // 获取加载状态
  loading: state => state.loading,
  
  // 获取错误信息
  error: state => state.error,
  
  // 获取电影已播放的广告历史
  getMovieAdHistory: state => movieId => {
    return state.playHistory.get(movieId) || []
  },

  // 获取指定位置的图片广告
  getImageAdsByPosition: state => position => {
    return state.imageAds.filter(ad => ad.position === position)
  }
}

const mutations = {
  // 设置图片广告列表
  SET_IMAGE_ADS(state, ads) {
    console.log('设置图片广告数据:', ads)
    state.imageAds = ads
  },

  // 设置当前视频广告
  SET_CURRENT_VIDEO_AD(state, ad) {
    console.log('设置当前视频广告:', ad)
    state.currentVideoAd = ad
  },

  // 清除当前视频广告
  CLEAR_CURRENT_VIDEO_AD(state) {
    console.log('清除当前视频广告')
    state.currentVideoAd = null
  },

  // 设置加载状态
  SET_LOADING(state, status) {
    console.log('设置加载状态:', status)
    state.loading = status
  },

  // 设置错误信息
  SET_ERROR(state, error) {
    console.log('设置错误状态:', error)
    state.error = error
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
  // 获取图片广告列表
  async fetchImageAds({ commit }) {
    console.log('开始获取图片广告')
    commit('SET_LOADING', true)
    try {
      const response = await getImageAds()
      console.log('获取图片广告响应:', response)
      if (response.data) {
        commit('SET_IMAGE_ADS', response.data)
      }
    } catch (error) {
      console.error('获取图片广告失败:', error)
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 获取视频广告
  async fetchVideoAds({ commit }) {
    console.log('开始获取视频广告')
    commit('SET_LOADING', true)
    try {
      const response = await getVideoAds()
      console.log('获取视频广告响应:', response)
      if (response) {
        console.log('设置视频广告数据:', response)
        commit('SET_CURRENT_VIDEO_AD', response)
      } else {
        console.warn('视频广告响应数据为空')
        commit('SET_CURRENT_VIDEO_AD', null)
      }
    } catch (error) {
      console.error('获取视频广告失败:', error)
      commit('SET_ERROR', error.message)
      commit('SET_CURRENT_VIDEO_AD', null)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 清除当前视频广告
  clearCurrentVideoAd({ commit }) {
    commit('CLEAR_CURRENT_VIDEO_AD')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
} 