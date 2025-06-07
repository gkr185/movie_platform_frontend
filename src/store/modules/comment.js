import { mockComments as mockCommentsData, mockReplies } from '../data'

export default {
  namespaced: true,

  state: {
    commentList: [],
    total: 0,
    loading: false
  },

  mutations: {
    SET_COMMENTS(state, { comments, total }) {
      state.commentList = comments
      state.total = total
    },

    SET_LOADING(state, loading) {
      state.loading = loading
    },

    ADD_COMMENT(state, comment) {
      state.commentList.unshift(comment)
      state.total++
    },

    UPDATE_COMMENT(state, { id, data }) {
      const index = state.commentList.findIndex(c => c.id === id)
      if (index > -1) {
        if (typeof data === 'function') {
          state.commentList[index] = { ...state.commentList[index], ...data(state.commentList[index]) }
        } else {
          state.commentList[index] = { ...state.commentList[index], ...data }
        }
      }
    },

    DELETE_COMMENT(state, id) {
      const index = state.commentList.findIndex(c => c.id === id)
      if (index > -1) {
        state.commentList.splice(index, 1)
        state.total--
      }
    },

    ADD_REPLY(state, { parentId, reply }) {
      const comment = state.commentList.find(c => c.id === parentId)
      if (comment) {
        if (!comment.replies) {
          comment.replies = []
        }
        comment.replies.push(reply)
        comment.replyCount = (comment.replyCount || 0) + 1
      }
    },

    SET_REPLIES(state, { parentId, replies }) {
      const comment = state.commentList.find(c => c.id === parentId)
      if (comment) {
        comment.replies = replies
      }
    }
  },

  actions: {
    async fetchComments({ commit }, { movieId, page = 1, pageSize = 10, sortBy = 'newest' }) {
      commit('SET_LOADING', true)
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500))

        let comments = mockCommentsData.get(Number(movieId)) || []
        
        // 排序
        comments = [...comments].sort((a, b) => {
          switch (sortBy) {
            case 'hottest':
              return b.likes - a.likes
            case 'score-desc':
              return b.score - a.score
            case 'score-asc':
              return a.score - b.score
            default: // newest
              return new Date(b.createTime) - new Date(a.createTime)
          }
        })

        // 分页
        const start = (page - 1) * pageSize
        const end = start + pageSize
        const pagedComments = comments.slice(start, end)

        commit('SET_COMMENTS', {
          comments: pagedComments,
          total: comments.length
        })
      } catch (error) {
        console.error('获取评论失败:', error)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async addComment({ commit, rootState }, { movieId, content, score, isPrivate }) {
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500))

        const currentUser = rootState.user.user
        if (!currentUser) {
          throw new Error('请先登录')
        }

        const newComment = {
          id: Date.now(),
          content,
          score,
          isPrivate,
          likes: 0,
          isLiked: false,
          createTime: new Date().toISOString(),
          user: {
            id: currentUser.id,
            name: currentUser.name,
            avatar: currentUser.avatar,
            isVIP: currentUser.vip
          },
          replies: [],
          replyCount: 0
        }

        // 更新模拟数据
        const movieComments = mockCommentsData.get(Number(movieId)) || []
        movieComments.unshift(newComment)
        mockCommentsData.set(Number(movieId), movieComments)

        commit('ADD_COMMENT', newComment)
        return newComment
      } catch (error) {
        console.error('发表评论失败:', error)
        throw error
      }
    },

    async addReply({ commit, rootState }, { parentId, content, replyTo }) {
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500))

        const currentUser = rootState.user.user
        if (!currentUser) {
          throw new Error('请先登录')
        }

        const newReply = {
          id: Date.now(),
          content,
          createTime: new Date().toISOString(),
          user: {
            id: currentUser.id,
            name: currentUser.name,
            avatar: currentUser.avatar,
            isVIP: currentUser.vip
          }
        }

        if (replyTo) {
          newReply.replyTo = {
            id: replyTo.id,
            name: replyTo.name
          }
        }

        // 更新模拟数据
        const replies = mockReplies.get(parentId) || []
        replies.push(newReply)
        mockReplies.set(parentId, replies)

        commit('ADD_REPLY', { parentId, reply: newReply })
        return newReply
      } catch (error) {
        console.error('发表回复失败:', error)
        throw error
      }
    },

    async likeComment({ commit, rootState }, commentId) {
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 300))

        if (!rootState.user.user) {
          throw new Error('请先登录')
        }

        commit('UPDATE_COMMENT', {
          id: commentId,
          data: comment => ({
            isLiked: !comment.isLiked,
            likes: comment.likes + (comment.isLiked ? -1 : 1)
          })
        })
      } catch (error) {
        console.error('点赞失败:', error)
        throw error
      }
    },

    async deleteComment({ commit }, commentId) {
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 300))
        commit('DELETE_COMMENT', commentId)
      } catch (error) {
        console.error('删除评论失败:', error)
        throw error
      }
    },

    async loadMoreReplies({ commit }, commentId) {
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const replies = mockReplies.get(commentId) || []
        commit('SET_REPLIES', { parentId: commentId, replies })
      } catch (error) {
        console.error('加载回复失败:', error)
        throw error
      }
    }
  },

  getters: {
    commentList: state => state.commentList,
    total: state => state.total,
    loading: state => state.loading
  }
} 