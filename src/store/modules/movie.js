import { ElMessage } from 'element-plus'

// 模拟数据，实际项目中应该从API获取
const mockMovieDetail = {
  id: 1,
  title: '流浪地球2',
  cover: '/uploads/posters/wdzsj.jpg',
  score: 8.6,
  director: '郭帆',
  actors: '吴京,刘德华,李雪健',
  category: '科幻',
  releaseDate: '2023-01-22',
  description: '太阳即将毁灭，人类在地球表面建造出巨大的推进器，寻找新的家园。然而宇宙之路危机四伏，为了拯救地球，流浪地球时代的年轻人再次挺身而出，展开争分夺秒的生死之战。',
  duration: '173分钟',
  year: 2023,
  tags: ['科幻', '冒险', '灾难'],
  quality: '4K',
  resolution: 'HDR',
  video: '/uploads/videos/wandering-earth-2.mp4',
  needVIP: true
}

export default {
  namespaced: true,

  state: {
    currentMovie: null,
    favorites: []
  },

  mutations: {
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
    }
  },

  actions: {
    // 获取电影详情
    async fetchMovieDetail({ commit }, id) {
      try {
        // 这里应该调用后端API
        // const response = await axios.get(`/api/movies/${id}`)
        // const movie = response.data
        
        // 暂时使用模拟数据
        await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟请求延迟
        const movie = { ...mockMovieDetail, id: Number(id) }
        
        commit('SET_CURRENT_MOVIE', movie)
        return movie
      } catch (error) {
        console.error('获取电影详情失败:', error)
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
    }
  },

  getters: {
    currentMovie: state => state.currentMovie,
    isFavorite: state => movieId => state.favorites.some(item => item.id === movieId)
  }
} 