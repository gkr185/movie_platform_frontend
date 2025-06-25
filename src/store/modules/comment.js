import { 
  getComments, 
  createComment,
  deleteComment,
  likeComment as likeCommentApi,
  dislikeComment as dislikeCommentApi,
  unlikeComment,
  undislikeComment
} from '@/api/comments'
import { getUserInfo } from '@/api/user'

export default {
  namespaced: true,

  state: {
    comments: [], // 所有评论数据
    
    total: 0,
    currentPage: 1,
    pageSize: 10,
    loading: false
  },

  mutations: {
    SET_LOADING(state, loading) {
      console.log('[Vuex Comment] 设置加载状态:', loading)
      state.loading = loading
    },

    SET_PAGE(state, { currentPage, pageSize }) {
      console.log('[Vuex Comment] 设置分页信息:', { currentPage, pageSize })
      state.currentPage = currentPage
      state.pageSize = pageSize
    },

    // 设置评论数据，将评论按照父子关系组织
    SET_COMMENTS(state, { comments, total }) {
      console.log('[Vuex Comment] 开始处理评论数据:', {
        receivedComments: comments?.length || 0,
        total
      })

      // 将评论分为父评论和回复
      const parentComments = []
      const repliesMap = {}

      // 第一次遍历，收集所有回复
      comments?.forEach(comment => {
        if (comment.parentId) {
          if (!repliesMap[comment.parentId]) {
            repliesMap[comment.parentId] = []
          }
          repliesMap[comment.parentId].push({
            ...comment,
            likeCount: comment.likeCount || 0,
            dislikeCount: comment.dislikeCount || 0,
            rating: comment.rating || 0,
            createTime: comment.createTime || new Date().toISOString()
          })
          console.log('[Vuex Comment] 添加回复到映射:', {
            parentId: comment.parentId,
            replyId: comment.id
          })
        }
      })

      // 第二次遍历，构建父评论并添加回复
      comments?.forEach(comment => {
        if (!comment.parentId) {
          const replies = repliesMap[comment.id] || []
          parentComments.push({
            ...comment,
            likeCount: comment.likeCount || 0,
            dislikeCount: comment.dislikeCount || 0,
            rating: comment.rating || 0,
            createTime: comment.createTime || new Date().toISOString(),
            replies: replies.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
          })
          console.log('[Vuex Comment] 添加父评论:', {
            commentId: comment.id,
            repliesCount: replies.length
          })
        }
      })

      console.log('[Vuex Comment] 评论数据处理完成:', {
        parentCommentsCount: parentComments.length,
        repliesMapSize: Object.keys(repliesMap).length
      })

      // 按时间倒序排序父评论
      state.comments = parentComments.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
      state.total = total
    },

    // 添加新评论
    ADD_COMMENT(state, comment) {
      console.log('[Vuex Comment] 添加新评论:', {
        commentId: comment.id,
        parentId: comment.parentId,
        content: comment.content?.substring(0, 20)
      })

      const processedComment = {
        ...comment,
        likeCount: comment.likeCount || 0,
        dislikeCount: comment.dislikeCount || 0,
        rating: comment.rating || 0,
        createTime: comment.createTime || new Date().toISOString(),
        replies: []
      }

      if (!comment.parentId) {
        // 添加父评论
        state.comments.unshift(processedComment)
        state.total += 1
        console.log('[Vuex Comment] 添加父评论成功')
      } else {
        // 添加回复
        const parentComment = state.comments.find(c => c.id === comment.parentId)
        if (parentComment) {
          if (!parentComment.replies) {
            parentComment.replies = []
          }
          parentComment.replies.unshift(processedComment)
          console.log('[Vuex Comment] 添加回复成功:', {
            parentId: comment.parentId,
            repliesCount: parentComment.replies.length
          })
        } else {
          console.warn('[Vuex Comment] 未找到父评论:', comment.parentId)
        }
      }
    },

    // 删除评论
    REMOVE_COMMENT(state, { commentId, parentId }) {
      console.log('[Vuex Comment] 删除评论:', { commentId, parentId })

      if (!parentId) {
        // 删除父评论
        const index = state.comments.findIndex(c => c.id === commentId)
        if (index > -1) {
          state.comments.splice(index, 1)
          state.total -= 1
          console.log('[Vuex Comment] 删除父评论成功')
        } else {
          console.warn('[Vuex Comment] 未找到要删除的父评论:', commentId)
        }
      } else {
        // 删除回复
        const parentComment = state.comments.find(c => c.id === parentId)
        if (parentComment && parentComment.replies) {
          const replyIndex = parentComment.replies.findIndex(r => r.id === commentId)
          if (replyIndex > -1) {
            parentComment.replies.splice(replyIndex, 1)
            console.log('[Vuex Comment] 删除回复成功')
          } else {
            console.warn('[Vuex Comment] 未找到要删除的回复:', commentId)
          }
        } else {
          console.warn('[Vuex Comment] 未找到父评论或回复列表:', parentId)
        }
      }
    },

    // 更新评论
    UPDATE_COMMENT(state, { commentId, parentId, data }) {
      console.log('[Vuex Comment] 更新评论:', {
        commentId,
        parentId,
        updateData: data
      })

      if (!parentId) {
        // 更新父评论
        const comment = state.comments.find(c => c.id === commentId)
        if (comment) {
          Object.assign(comment, data)
          console.log('[Vuex Comment] 更新父评论成功')
        } else {
          console.warn('[Vuex Comment] 未找到要更新的父评论:', commentId)
        }
      } else {
        // 更新回复
        const parentComment = state.comments.find(c => c.id === parentId)
        if (parentComment && parentComment.replies) {
          const reply = parentComment.replies.find(r => r.id === commentId)
          if (reply) {
            Object.assign(reply, data)
            console.log('[Vuex Comment] 更新回复成功')
          } else {
            console.warn('[Vuex Comment] 未找到要更新的回复:', commentId)
          }
        } else {
          console.warn('[Vuex Comment] 未找到父评论或回复列表:', parentId)
        }
      }
    }
  },

  actions: {
    // 获取评论列表
    async fetchComments({ commit }, { movieId, page = 1, pageSize = 10 }) {
      console.log('[Vuex Comment] 开始获取评论列表:', {
        movieId,
        page,
        pageSize
      })

      commit('SET_LOADING', true)
      try {
        const response = await getComments(movieId, page, pageSize)
        console.log('[Vuex Comment] 获取评论列表响应:', response)

        // 处理响应数据
        const { content: comments = [], totalElements: total = 0 } = response || {}
        
        // 获取所有评论和回复中的用户ID
        const userIds = new Set()
        comments.forEach(comment => {
          if (comment.userId) userIds.add(comment.userId)
          if (comment.replies) {
            comment.replies.forEach(reply => {
              if (reply.userId) userIds.add(reply.userId)
            })
          }
        })

        // 获取所有用户信息
        const userInfoMap = new Map()
        await Promise.all(Array.from(userIds).map(async userId => {
          try {
            const response = await getUserInfo(userId)
            const userInfo = response.data || response // 处理不同的响应格式
            userInfoMap.set(userId, userInfo)
            console.log(`[Vuex Comment] 获取用户 ${userId} 信息成功:`, userInfo)
          } catch (error) {
            console.error(`获取用户 ${userId} 信息失败:`, error)
            // 设置默认用户信息
            userInfoMap.set(userId, {
              id: userId,
              username: '未知用户',
              avatar: '',
              isVIP: false
            })
          }
        }))

        // 数据预处理，添加用户信息
        const processedComments = comments.map(comment => {
          const userInfo = userInfoMap.get(comment.userId)
          const processedComment = {
            ...comment,
            likeCount: comment.likeCount || 0,
            dislikeCount: comment.dislikeCount || 0,
            rating: comment.rating || 0,
            createTime: comment.createTime || new Date().toISOString(),
            user: userInfo || {
              id: comment.userId,
              username: '未知用户',
              avatar: '',
              isVIP: false
            },
            replies: comment.replies || []
          }

          // 处理回复的用户信息
          if (processedComment.replies.length > 0) {
            processedComment.replies = processedComment.replies.map(reply => {
              const replyUserInfo = userInfoMap.get(reply.userId)
              return {
                ...reply,
                likeCount: reply.likeCount || 0,
                dislikeCount: reply.dislikeCount || 0,
                createTime: reply.createTime || new Date().toISOString(),
                user: replyUserInfo || {
                  id: reply.userId,
                  username: '未知用户',
                  avatar: '',
                  isVIP: false
                }
              }
            }).sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
          }

          return processedComment
        })

        commit('SET_COMMENTS', { 
          comments: processedComments, 
          total
        })
        commit('SET_PAGE', { currentPage: page, pageSize })

        console.log('[Vuex Comment] 评论列表获取成功:', {
          commentsCount: processedComments.length,
          total
        })

        return { data: processedComments, total }
      } catch (error) {
        console.error('[Vuex Comment] 获取评论列表失败:', error)
        // 设置空数据，避免UI错误
        commit('SET_COMMENTS', { comments: [], total: 0 })
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // 提交评论或回复
    async submitComment({ commit, rootState }, { movieId, content, rating, parentId, replyTo }) {
      console.log('[Vuex Comment] 开始提交评论:', {
        movieId,
        content: content?.substring(0, 20),
        rating,
        parentId,
        replyTo
      })

      // 获取当前用户ID - 优先从userInfo获取，然后从user获取
      const userId = rootState.user?.userInfo?.id || rootState.user?.user?.id
      if (!userId) {
        throw new Error('请先登录')
      }

      try {
        const comment = await createComment({
          movieId: Number(movieId),
          userId: Number(userId),
          content: content.trim(),
          rating: Number(rating),
          parentId: parentId ? Number(parentId) : 0
        })

        console.log('[Vuex Comment] 提交评论成功:', comment)

        // 获取用户信息
        let userInfo
        try {
          const response = await getUserInfo(userId)
          userInfo = response.data || response // 处理不同的响应格式
          console.log('[Vuex Comment] 获取用户信息成功:', userInfo)
        } catch (error) {
          console.error('获取用户信息失败:', error)
          userInfo = {
            id: userId,
            username: '未知用户',
            avatar: '',
            isVIP: false
          }
        }

        // 如果后端返回的数据不完整，使用本地数据补充
        const processedComment = {
          ...comment,
          id: comment.id,
          userId: userId,
          movieId: movieId,
          content: content,
          rating: rating || 0,
          parentId: parentId || 0,
          likeCount: 0,
          dislikeCount: 0,
          status: 1,
          createTime: comment.createTime || new Date().toISOString(),
          user: userInfo,
          replies: []
        }

        commit('ADD_COMMENT', processedComment)
        return processedComment
      } catch (error) {
        console.error('[Vuex Comment] 提交评论失败:', error)
        throw error
      }
    },

    // 删除评论或回复
    async deleteComment({ commit }, { commentId, movieId, parentId }) {
      console.log('[Vuex Comment] 开始删除评论:', {
        commentId,
        movieId,
        parentId
      })

      try {
        await deleteComment(commentId, movieId)
        commit('REMOVE_COMMENT', { commentId, parentId })
        console.log('[Vuex Comment] 删除评论成功')
      } catch (error) {
        console.error('[Vuex Comment] 删除评论失败:', error)
        throw error
      }
    },

    // 点赞评论
    async likeComment({ commit }, { commentId, movieId, parentId }) {
      console.log('[Vuex Comment] 开始点赞评论:', {
        commentId,
        movieId,
        parentId
      })

      try {
        const response = await likeCommentApi(commentId, movieId)
        console.log('[Vuex Comment] 点赞评论响应:', response)

        commit('UPDATE_COMMENT', {
          commentId,
          parentId,
          data: {
            liked: true,
            likeCount: (response.likeCount || 0) 
          }
        })
        return response
      } catch (error) {
        console.error('[Vuex Comment] 点赞评论失败:', error)
        throw error
      }
    },

    // 取消点赞评论
    async unlikeComment({ commit }, { commentId, movieId, parentId }) {
      console.log('[Vuex Comment] 开始取消点赞:', {
        commentId,
        movieId,
        parentId
      })

      try {
        const response = await unlikeComment(commentId, movieId)
        console.log('[Vuex Comment] 取消点赞响应:', response)

        commit('UPDATE_COMMENT', {
          commentId,
          parentId,
          data: {
            liked: false,
            likeCount: Math.max((response.likeCount || 0) , 0)
          }
        })
        return response
      } catch (error) {
        console.error('[Vuex Comment] 取消点赞失败:', error)
        throw error
      }
    },

    // 点踩评论
    async dislikeComment({ commit }, { commentId, movieId, parentId }) {
      console.log('[Vuex Comment] 开始点踩评论:', {
        commentId,
        movieId,
        parentId
      })

      try {
        const response = await dislikeCommentApi(commentId, movieId)
        console.log('[Vuex Comment] 点踩评论响应:', response)

        commit('UPDATE_COMMENT', {
          commentId,
          parentId,
          data: {
            disliked: true,
            dislikeCount: (response.dislikeCount || 0) + 1
          }
        })
        return response
      } catch (error) {
        console.error('[Vuex Comment] 点踩评论失败:', error)
        throw error
      }
    },

    // 取消点踩评论
    async undislikeComment({ commit }, { commentId, movieId, parentId }) {
      console.log('[Vuex Comment] 开始取消点踩:', {
        commentId,
        movieId,
        parentId
      })

      try {
        const response = await undislikeComment(commentId, movieId)
        console.log('[Vuex Comment] 取消点踩响应:', response)

        commit('UPDATE_COMMENT', {
          commentId,
          parentId,
          data: {
            disliked: false,
            dislikeCount: Math.max((response.dislikeCount || 0) - 1, 0)
          }
        })
        return response
      } catch (error) {
        console.error('[Vuex Comment] 取消点踩失败:', error)
        throw error
      }
    }
  },

  getters: {
    commentsList: state => state.comments,
    commentsTotal: state => state.total,
    commentsLoading: state => state.loading,
    currentPage: state => state.currentPage,
    pageSize: state => state.pageSize
  }
}
