import request from '@/utils/request'

/**
 * 电影观看统计API
 */
export const movieViewApi = {
  /**
   * 增加VIP用户观看电影次数
   * @param {number} movieId - 电影ID
   * @param {number} userId - 用户ID
   */
  addVipView: (movieId, userId) => {
    return request({
      url: `/api/moviesView/${movieId}/users/${userId}`,
      method: 'post'
    })
  },

  /**
   * 获取按总观看次数降序排列的电影列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码，默认1
   * @param {number} params.size - 每页数量，默认20
   * @param {number} params.limit - 限制数量（用于首页推荐）
   */
  getMoviesByViewCount: (params = {}) => {
    return request({
      url: '/api/moviesView/movies',
      method: 'get',
      params: {
        page: params.page || 1,
        size: params.size || 20,
        limit: params.limit
      }
    })
  },

  /**
   * 获取特定电影的总观看次数
   * @param {number} movieId - 电影ID
   */
  getMovieViewCount: (movieId) => {
    return request({
      url: `/api/moviesView/${movieId}/count`,
      method: 'get'
    })
  },

  /**
   * 获取电影的观看统计信息
   * @param {number} movieId - 电影ID
   */
  getMovieViewStats: (movieId) => {
    return request({
      url: `/api/moviesView/movies/${movieId}/stats`,
      method: 'get'
    })
  },

  /**
   * 获取用户的观看统计信息
   * @param {number} userId - 用户ID
   */
  getUserViewStats: (userId) => {
    return request({
      url: `/api/moviesView/users/${userId}/stats`,
      method: 'get'
    })
  }
}

export default movieViewApi 