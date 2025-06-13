import { ElMessage } from 'element-plus'
import { getMovieDetail, getMoviesByCategory, getMovieCategories, searchMovies } from '@/api/movie'

const state = {
  currentMovie: null,
  favorites: [],
  watchProgress: new Map(), // 观看进度
  recommendedMovies: [],
  searchResults: [], // 搜索结果
  searchLoading: false, // 搜索加载状态
  searchError: null, // 搜索错误信息
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
  searchResults: state => state.searchResults,
  searchLoading: state => state.searchLoading,
  searchError: state => state.searchError,
  playbackState: state => state.playbackState,
  
  // 转换API电影数据为前端所需格式
  movieDisplayData: () => (movie) => {
    if (!movie) return null
    
    // 处理 genres 字段，确保它是字符串并且可以被分割
    const genres = typeof movie.genres === 'string' ? movie.genres : (movie.category || '未分类')
    const mainCategory = genres.split(',')[0]
    
    // 处理发布日期
    let year
    try {
      year = movie.year || (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null)
    } catch (e) {
      year = null
    }

    return {
      id: movie.id,
      title: movie.title,
      cover: movie.posterUrl || movie.cover,
      score: movie.rating || 0,
      director: movie.director || '未知',
      actors: movie.actors || [],
      category: mainCategory,
      releaseDate: movie.releaseDate,
      description: movie.description || '',
      duration: movie.runtime ? `${movie.runtime}分钟` : '未知',
      year: year || '未知',
      tags: genres.split(','),
      quality: movie.quality || '1080p',
      resolution: movie.resolution || 'HD',
      videoUrl: movie.playUrl || '',
      needVip: movie.isVip === 1 || movie.needVip === true,
      rating: movie.rating || 0,
      supportedQualities: movie.supportedQualities || ['1080p'],
      defaultQuality: movie.defaultQuality || '1080p'
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
  },
  SET_SEARCH_RESULTS(state, results) {
    state.searchResults = results
  },
  SET_SEARCH_LOADING(state, loading) {
    state.searchLoading = loading
  },
  SET_SEARCH_ERROR(state, error) {
    state.searchError = error
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
        ElMessage.warning('请选择有效的电影分类')
        return []
      }
      
      console.log('开始获取分类电影，分类ID:', categoryId)
      const response = await getMoviesByCategory(categoryId)
      console.log('获取到的分类电影原始数据:', response)
      
      // 直接处理返回的数据
      const formattedMovies = response.map(movie => getters.movieDisplayData(movie))
      
      console.log('处理后的电影数据:', formattedMovies)
      return formattedMovies
    } catch (error) {
      console.error('获取分类电影失败:', error)
      ElMessage.error('获取分类电影失败，请稍后重试')
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

  // 获取电影的分类信息
  async fetchMovieCategories({ commit }, movieId) {
    try {
      if (!movieId) {
        ElMessage.warning('请选择有效的电影')
        return []
      }

      const response = await getMovieCategories(movieId)
      if (!response || !response.data) {
        return []
      }

      return response.data
    } catch (error) {
      console.error('获取电影分类失败:', error)
      ElMessage.error('获取电影分类失败，请稍后重试')
      return []
    }
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
  },

  // 搜索电影
  async searchMovies({ commit, getters }, keyword) {
    try {
      commit('SET_SEARCH_LOADING', true)
      commit('SET_SEARCH_ERROR', null)
      
      const results = await searchMovies(keyword)
      const formattedResults = results.map(movie => getters.movieDisplayData(movie))
      
      commit('SET_SEARCH_RESULTS', formattedResults)
      return formattedResults
    } catch (error) {
      console.error('搜索电影失败:', error)
      commit('SET_SEARCH_ERROR', error.message)
      ElMessage.error('搜索电影失败，请稍后重试')
      return []
    } finally {
      commit('SET_SEARCH_LOADING', false)
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