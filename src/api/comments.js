import request from '@/utils/request'
import { API_URLS } from './config'

/**
 * 创建评论
 * @param {Object} commentData - 评论数据
 * @param {number} commentData.userId - 用户ID
 * @param {number} commentData.movieId - 电影ID
 * @param {string} commentData.content - 评论内容
 * @param {number} commentData.rating - 评分
 * @param {number} commentData.parentId - 父评论ID（0表示顶级评论）
 * @returns {Promise}
 */
export function createComment(commentData) {
  console.log('[API] 发起创建评论请求:', {
    url: API_URLS.COMMENT.CREATE,
    data: commentData
  })
  return request({
    url: API_URLS.COMMENT.CREATE,
    method: 'post',
    data: commentData
  }).then(response => {
    console.log('[API] 创建评论成功:', response)
    return response
  }).catch(error => {
    console.error('[API] 创建评论失败:', error)
    throw error
  })
}

/**
 * 获取电影评论列表
 * @param {number} movieId - 电影ID
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页数量
 * @returns {Promise}
 */
export function getMovieComments(movieId, params) {
  const url = API_URLS.COMMENT.LIST.replace('{movieId}', movieId)
  console.log('[API] 发起获取评论列表请求:', {
    url,
    movieId,
    params
  })
  return request({
    url,
    method: 'get',
    params
  }).then(response => {
    console.log('[API] 获取评论列表成功:', {
      total: response?.data?.totalElements || 0,
      currentPage: response?.data?.number || 0,
      pageSize: response?.data?.size || 10,
      commentCount: response?.data?.content?.length || 0
    })
    return response
  }).catch(error => {
    console.error('[API] 获取评论列表失败:', {
      error,
      movieId,
      params
    })
    throw error
  })
}

/**
 * 更新评论
 * @param {number} commentId - 评论ID
 * @param {Object} commentData - 更新的评论数据
 * @returns {Promise}
 */
export function updateComment(commentId, commentData) {
  const url = API_URLS.COMMENT.UPDATE.replace('{commentId}', commentId)
  console.log('[API] 发起更新评论请求:', {
    url,
    commentId,
    data: commentData
  })
  return request({
    url,
    method: 'put',
    data: commentData
  }).then(response => {
    console.log('[API] 更新评论成功:', response)
    return response
  }).catch(error => {
    console.error('[API] 更新评论失败:', error)
    throw error
  })
}

/**
 * 删除评论
 * @param {number} commentId - 评论ID
 * @returns {Promise}
 */
export function deleteComment(commentId) {
  const url = API_URLS.COMMENT.DELETE.replace('{commentId}', commentId)
  console.log('[API] 发起删除评论请求:', {
    url,
    commentId
  })
  return request({
    url,
    method: 'delete'
  }).then(response => {
    console.log('[API] 删除评论成功:', response)
    return response
  }).catch(error => {
    console.error('[API] 删除评论失败:', error)
    throw error
  })
}

/**
 * 点赞评论
 * @param {number} commentId - 评论ID
 * @returns {Promise}
 */
export function likeComment(commentId) {
  const url = API_URLS.COMMENT.LIKE.replace('{commentId}', commentId)
  console.log('[API] 发起点赞评论请求:', {
    url,
    commentId
  })
  return request({
    url,
    method: 'post'
  }).then(response => {
    console.log('[API] 点赞评论成功:', response)
    return response
  }).catch(error => {
    console.error('[API] 点赞评论失败:', error)
    throw error
  })
}

/**
 * 取消点赞评论
 * @param {number} commentId - 评论ID
 * @returns {Promise}
 */
export function unlikeComment(commentId) {
  const url = API_URLS.COMMENT.UNLIKE.replace('{commentId}', commentId)
  console.log('[API] 发起取消点赞请求:', {
    url,
    commentId
  })
  return request({
    url,
    method: 'post'
  }).then(response => {
    console.log('[API] 取消点赞成功:', response)
    return response
  }).catch(error => {
    console.error('[API] 取消点赞失败:', error)
    throw error
  })
}

/**
 * 点踩评论
 * @param {number} commentId - 评论ID
 * @returns {Promise}
 */
export function dislikeComment(commentId) {
  const url = API_URLS.COMMENT.DISLIKE.replace('{commentId}', commentId)
  console.log('[API] 发起点踩评论请求:', {
    url,
    commentId
  })
  return request({
    url,
    method: 'post'
  }).then(response => {
    console.log('[API] 点踩评论成功:', response)
    return response
  }).catch(error => {
    console.error('[API] 点踩评论失败:', error)
    throw error
  })
}

/**
 * 取消点踩评论
 * @param {number} commentId - 评论ID
 * @returns {Promise}
 */
export function undislikeComment(commentId) {
  const url = API_URLS.COMMENT.UNDISLIKE.replace('{commentId}', commentId)
  console.log('[API] 发起取消点踩请求:', {
    url,
    commentId
  })
  return request({
    url,
    method: 'post'
  }).then(response => {
    console.log('[API] 取消点踩成功:', response)
    return response
  }).catch(error => {
    console.error('[API] 取消点踩失败:', error)
    throw error
  })
}

// 获取评论列表
export function getComments(movieId, page = 1, pageSize = 10) {
  console.log('[API Comments] 请求评论列表:', {
    movieId,
    page,
    pageSize
  })
  return request({
    url: API_URLS.COMMENT.LIST.replace('{movieId}', movieId),
    method: 'get',
    params: {
      page,
      pageSize
    }
  })
}

// 发表评论
export function submitComment({ movieId, content, rating, parentId, replyTo }) {
  console.log('[API Comments] 提交评论:', {
    movieId,
    content: content?.substring(0, 20),
    rating,
    parentId,
    replyTo
  })
  return request({
    url: API_URLS.COMMENT.CREATE,
    method: 'post',
    data: {
      movieId,
      content,
      rating,
      parentId,
      replyTo
    }
  })
}

