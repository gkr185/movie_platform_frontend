import { ElMessage } from 'element-plus'
import { getMovieDetail, getMoviesByCategory } from '@/api/movie'

const state = {
  currentMovie: null,
  favorites: [],
  watchProgress: new Map(), // 观看进度
  recommendedMovies: [],
  playbackState: {
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    volume: 1,
    quality: '1080p'
  }
}

const getters = {
  currentMovie: state => state.currentMovie,
  isFavorite: state => movieId => state.favorites.some(item => item.id === movieId),
  watchProgress: state => state.watchProgress,
  recommendedMovies: state => state.recommendedMovies,
  playbackState: state => state.playbackState,
  
  // 转换API电影数据为前端所需格式
  movieDisplayData: () => (movie) => {
    if (!movie) return null
    return {
      id: movie.id,
      title: movie.title,
      cover: movie.posterUrl,
      score: movie.rating,
      director: movie.director,
      actors: movie.actors,
      category: movie.genres.split(',')[0], // 取第一个分类作为主分类
      releaseDate: movie.releaseDate,
      description: movie.description,
      duration: `${movie.runtime}分钟`,
      year: new Date(movie.releaseDate).getFullYear(),
      tags: movie.genres.split(','),
      quality: '4K',
      resolution: 'HDR',
      videoUrl: movie.playUrl,
      needVIP: movie.isVip === 1,
      supportedQualities: ['1080p', '4K'],
      defaultQuality: '1080p',
      subtitles: [
        { language: 'zh', url: '/uploads/subtitles/movie-zh.vtt' },
        { language: 'en', url: '/uploads/subtitles/movie-en.vtt' }
      ]
    }
  }
}

const mutations = {
  SET_CURRENT_MOVIE(state, movie) {
    state.currentMovie = movie
  },
  TOGGLE_FAVORITE(state, movie) {
    const index = state.favorites.findIndex(item => item.id === movie.id)
    if (index === -1) {
      state.favorites.push(movie)
    } else {
      state.favorites.splice(index, 1)
    }
  },
  UPDATE_WATCH_PROGRESS(state, { movieId, progress }) {
    state.watchProgress.set(movieId, progress)
  },
  SET_RECOMMENDED_MOVIES(state, movies) {
    state.recommendedMovies = movies
  },
  UPDATE_PLAYBACK_STATE(state, payload) {
    state.playbackState = {
      ...state.playbackState,
      ...payload
    }
  },
  RESET_PLAYBACK_STATE(state) {
    state.playbackState = {
      currentTime: 0,
      duration: 0,
      isPlaying: false,
      volume: state.playbackState.volume, // 保持音量设置
      quality: '1080p'
    }
  }
}

const actions = {
  // 获取电影详情
  async fetchMovieDetail({ commit, getters }, movieId) {
    try {
      const movieData = await getMovieDetail(movieId)
      if (movieData) {
        // 转换API数据为前端所需格式
        const formattedMovie = getters.movieDisplayData(movieData)
        commit('SET_CURRENT_MOVIE', formattedMovie)
        return formattedMovie
      }
      return null
    } catch (error) {
      console.error('获取电影详情失败:', error)
      ElMessage.error('获取电影详情失败')
      throw error
    }
  },

  // 根据分类获取相关电影
  async fetchMoviesByCategory({ commit, getters }, categoryId) {
    try {
      if (!categoryId) {
        console.warn('未提供分类ID')
        return []
      }
      
      const movies = await getMoviesByCategory(categoryId)
      if (!movies) return []
      
      // 转换API数据为前端所需格式
      const formattedMovies = movies.map(movie => getters.movieDisplayData(movie))
      return formattedMovies
    } catch (error) {
      console.error('获取相关电影失败:', error)
      return []
    }
  },

  // 更新观看进度
  async updateWatchProgress({ commit }, { movieId, progress }) {
    try {
      // TODO: 调用实际的API
      commit('UPDATE_WATCH_PROGRESS', { movieId, progress })
    } catch (error) {
      console.error('更新观看进度失败:', error)
      throw error
    }
  },

  // 获取推荐电影
  async fetchRecommendedMovies({ commit }, movieId) {
    try {
      // TODO: 调用实际的推荐API
      // 临时返回空数组，等待API实现
      commit('SET_RECOMMENDED_MOVIES', [])
    } catch (error) {
      console.error('获取推荐电影失败:', error)
      throw error
    }
  },

  // 添加到收藏
  async addToFavorites({ commit }, movie) {
    try {
      // TODO: 调用实际的收藏API
      commit('TOGGLE_FAVORITE', movie)
    } catch (error) {
      console.error('添加收藏失败:', error)
      throw error
    }
  },

  // 取消收藏
  async removeFromFavorites({ commit }, movieId) {
    try {
      // TODO: 调用实际的取消收藏API
      commit('TOGGLE_FAVORITE', { id: movieId })
    } catch (error) {
      console.error('取消收藏失败:', error)
      throw error
    }
  },

  // 更新播放状态
  updatePlaybackState({ commit }, payload) {
    commit('UPDATE_PLAYBACK_STATE', payload)
  },

  // 重置播放状态
  resetPlaybackState({ commit }) {
    commit('RESET_PLAYBACK_STATE')
  },

  // 开始播放电影
  async startPlayback({ commit, dispatch, state }, movieId) {
    try {
      // 如果已经加载了电影信息，直接使用
      if (state.currentMovie?.id === parseInt(movieId)) {
        return state.currentMovie
      }

      // 否则重新获取电影信息
      const movie = await dispatch('fetchMovieDetail', movieId)
      
      if (!movie) {
        throw new Error('视频不存在')
      }

      // 重置播放状态
      commit('RESET_PLAYBACK_STATE')
      
      // 设置默认播放状态
      commit('UPDATE_PLAYBACK_STATE', {
        currentTime: 0,
        duration: 0,
        isPlaying: false,
        volume: 1,
        quality: movie.defaultQuality || '1080p'
      })
      
      return movie
    } catch (error) {
      console.error('开始播放失败:', error)
      throw error
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