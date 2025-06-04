import { createStore } from 'vuex'

// 模拟数据
const mockMovies = {
  hot: [
    
    { id: 1, title: '流浪地球2', score: 8.6, cover: require('@/assets/wdzsj.jpg') },
    { id: 2, title: '满江红', score: 8.2, cover: 'https://img.movie.com/full-river-red.jpg' },
    { id: 3, title: '无名', score: 7.8, cover: 'https://img.movie.com/anonymous.jpg' },
    { id: 4, title: '中国乒乓', score: 8.1, cover: 'https://img.movie.com/ping-pong.jpg' },
    { id: 5, title: '保你平安', score: 7.9, cover: 'https://img.movie.com/safe-with-me.jpg' },
    { id: 6, title: '交换人生', score: 8.0, cover: 'https://img.movie.com/life-swap.jpg' }
  ],
  new: [
    { id: 7, title: '铃芽之旅', score: 8.3, cover: 'https://img.movie.com/suzume.jpg' },
    { id: 8, title: '蚁人与黄蜂女', score: 7.5, cover: 'https://img.movie.com/ant-man.jpg' },
    { id: 9, title: '阿凡达2', score: 8.7, cover: 'https://img.movie.com/avatar-2.jpg' },
    { id: 10, title: '泰坦尼克号重映', score: 9.5, cover: 'https://img.movie.com/titanic.jpg' },
    { id: 11, title: '深海', score: 8.2, cover: 'https://img.movie.com/deep-sea.jpg' },
    { id: 12, title: '熊出没·伴我熊芯', score: 7.8, cover: 'https://img.movie.com/boonie-bears.jpg' }
  ],
  recommended: [
    { id: 13, title: '肖申克的救赎', score: 9.7, cover: 'https://img.movie.com/shawshank.jpg' },
    { id: 14, title: '霸王别姬', score: 9.6, cover: 'https://img.movie.com/farewell.jpg' },
    { id: 15, title: '阿甘正传', score: 9.5, cover: 'https://img.movie.com/forrest-gump.jpg' },
    { id: 16, title: '泰坦尼克号', score: 9.4, cover: 'https://img.movie.com/titanic-old.jpg' },
    { id: 17, title: '这个杀手不太冷', score: 9.4, cover: 'https://img.movie.com/leon.jpg' },
    { id: 18, title: '千与千寻', score: 9.4, cover: 'https://img.movie.com/spirited-away.jpg' }
  ]
}

export default createStore({
  state: {
    user: null,
    token: localStorage.getItem('token') || '',
    movies: {
      hot: [],
      new: [],
      recommended: []
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    currentUser: state => state.user,
    hotMovies: state => state.movies.hot,
    newMovies: state => state.movies.new,
    recommendedMovies: state => state.movies.recommended
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_USER(state, user) {
      state.user = user
    },
    SET_HOT_MOVIES(state, movies) {
      state.movies.hot = movies
    },
    SET_NEW_MOVIES(state, movies) {
      state.movies.new = movies
    },
    SET_RECOMMENDED_MOVIES(state, movies) {
      state.movies.recommended = movies
    },
    LOGOUT(state) {
      state.token = ''
      state.user = null
      localStorage.removeItem('token')
    }
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        // 模拟登录API调用
        const mockUser = {
          id: 1,
          name: '测试用户',
          avatar: 'https://img.movie.com/avatar.jpg',
          email: 'test@example.com'
        }
        const response = { 
          data: { 
            token: 'mock-jwt-token',
            user: mockUser
          } 
        }
        commit('SET_TOKEN', response.data.token)
        commit('SET_USER', response.data.user)
        return response
      } catch (error) {
        throw error
      }
    },
    async fetchHotMovies({ commit }) {
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        commit('SET_HOT_MOVIES', mockMovies.hot)
      } catch (error) {
        console.error('获取热门电影失败:', error)
      }
    },
    async fetchNewMovies({ commit }) {
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        commit('SET_NEW_MOVIES', mockMovies.new)
      } catch (error) {
        console.error('获取最新电影失败:', error)
      }
    },
    async fetchRecommendedMovies({ commit }) {
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        commit('SET_RECOMMENDED_MOVIES', mockMovies.recommended)
      } catch (error) {
        console.error('获取推荐电影失败:', error)
      }
    }
  },
  modules: {
  }
})
