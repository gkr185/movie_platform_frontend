import { ElMessage } from 'element-plus'

// 模拟数据，实际项目中应该从API获取
const mockMovieDetails = {
  1: {
    id: 1,
    title: '流浪地球2',
    cover: '/uploads/posters/OIP-C.jpg',
    score: 8.6,
    director: '郭帆',
    actors: '吴京,刘德华,李雪健',
    category: '科幻',
    releaseDate: '2023-01-22',
    description: '太阳即将毁灭，人类在地球表面建造出巨大的推进器，寻找新的家园。然而宇宙之路危机四伏，为了拯救地球，流浪地球时代的年轻人再次挺身而出，展开争分夺秒的生命之战。',
    duration: '173分钟',
    year: 2023,
    tags: ['科幻', '冒险', '灾难'],
    quality: '4K',
    resolution: 'HDR',
    videoUrl: '/uploads/videos/video03.mp4',
    needVIP: false,
    supportedQualities: ['1080p', '4K'],
    defaultQuality: '1080p',
    subtitles: [
      { language: 'zh', url: '/uploads/subtitles/movie-1-zh.vtt' },
      { language: 'en', url: '/uploads/subtitles/movie-1-en.vtt' }
    ]
  },
  2: {
    id: 2,
    title: '满江红',
    cover: '/uploads/posters/manjianghong.jpg',
    score: 8.2,
    director: '张艺谋',
    actors: '沈腾,易烊千玺,张译',
    category: '悬疑',
    releaseDate: '2023-01-22',
    description: '南宋绍兴年间，岳飞死后四年，秦桧率领的奸臣集团已权倾朝野。一个名叫张大（沈腾 饰）的市井混混与丁宣（易烊千玺 饰）和孙均（张译 饰）等人深入险境，试图查明真相，但是在这个过程中，他们发现了一个涉及更大阴谋的惊天秘密。',
    duration: '159分钟',
    year: 2023,
    tags: ['悬疑', '剧情', '古装'],
    quality: '4K',
    resolution: 'HDR',
    videoUrl: '/uploads/videos/movie-2.mp4',
    needVIP: true,
    supportedQualities: ['1080p', '4K'],
    defaultQuality: '1080p',
    subtitles: [
      { language: 'zh', url: '/uploads/subtitles/movie-2-zh.vtt' },
      { language: 'en', url: '/uploads/subtitles/movie-2-en.vtt' }
    ]
  },
  3: {
    id: 3,
    title: '无名',
    cover: '/uploads/posters/wuming.jpg',
    score: 7.8,
    director: '程耳',
    actors: '梁朝伟,王一博,周迅',
    category: '谍战',
    releaseDate: '2023-01-22',
    description: '1937年淞沪会战末期，代号"兰花"的中共特工严正（梁朝伟 饰）发现了日军精心策划的smuggler计划，得知日军要在上海大肆搜捕地下抗日分子的消息。在上海地下党的指示下，严正联系上了代号"棘刺"的神秘人物（王一博 饰），两人携手开始了一场惊心动魄的反间谍行动。',
    duration: '128分钟',
    year: 2023,
    tags: ['谍战', '悬疑', '动作'],
    quality: '4K',
    resolution: 'HDR',
    videoUrl: '/uploads/videos/movie-3.mp4',
    needVIP: false,
    supportedQualities: ['1080p', '4K'],
    defaultQuality: '1080p',
    subtitles: [
      { language: 'zh', url: '/uploads/subtitles/movie-3-zh.vtt' },
      { language: 'en', url: '/uploads/subtitles/movie-3-en.vtt' }
    ]
  }
}

// 分类数据
const categories = {
  hot: [1, 2], // 热门电影ID列表
  new: [2, 3], // 最新电影ID列表
  recommended: [1, 3] // 推荐电影ID列表
}

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
  // 获取分类电影列表
  getMoviesByCategory: () => (category) => {
    const movieIds = categories[category] || []
    return movieIds.map(id => mockMovieDetails[id]).filter(Boolean)
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
  async fetchMovieDetail({ commit }, movieId) {
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 从 mockMovieDetails 中获取详细信息
      const movie = mockMovieDetails[movieId]
      
      if (movie) {
        commit('SET_CURRENT_MOVIE', movie)
        return movie
      }
      return null
    } catch (error) {
      console.error('获取电影详情失败:', error)
      throw error
    }
  },

  // 更新观看进度
  async updateWatchProgress({ commit }, { movieId, progress }) {
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 100))
      commit('UPDATE_WATCH_PROGRESS', { movieId, progress })
    } catch (error) {
      console.error('更新观看进度失败:', error)
      throw error
    }
  },

  // 获取推荐电影
  async fetchRecommendedMovies({ commit }, movieId) {
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 从所有电影中随机选择4个不同于当前电影的电影作为推荐
      const allMovieIds = Object.keys(mockMovieDetails)
      const otherMovieIds = allMovieIds.filter(id => parseInt(id) !== parseInt(movieId))
      const recommendedIds = otherMovieIds
        .sort(() => Math.random() - 0.5)
        .slice(0, 4)
      
      const recommendedMovies = recommendedIds
        .map(id => mockMovieDetails[id])
        .filter(Boolean)
      
      commit('SET_RECOMMENDED_MOVIES', recommendedMovies)
    } catch (error) {
      console.error('获取推荐电影失败:', error)
      throw error
    }
  },

  // 添加到收藏
  async addToFavorites({ commit }, movie) {
    try {
      // 这里应该调用后端API
      // await axios.post('/api/user/favorites', { movieId: movie.id })
      
      // 暂时直接修改状态
      await new Promise(resolve => setTimeout(resolve, 300)) // 模拟请求延迟
      commit('TOGGLE_FAVORITE', movie)
    } catch (error) {
      console.error('添加收藏失败:', error)
      throw error
    }
  },

  // 取消收藏
  async removeFromFavorites({ commit }, movieId) {
    try {
      // 这里应该调用后端API
      // await axios.delete(`/api/user/favorites/${movieId}`)
      
      // 暂时直接修改状态
      await new Promise(resolve => setTimeout(resolve, 300)) // 模拟请求延迟
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