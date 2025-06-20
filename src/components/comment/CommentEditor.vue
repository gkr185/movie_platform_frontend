<template>
  <div class="comment-editor">
    <div class="editor-header">
      <div class="user-info" v-if="isLoggedIn">
        <el-avatar :src="userAvatar" :size="40">{{ username.charAt(0) }}</el-avatar>
        <span class="username">{{ username }}</span>
      </div>
      <div v-else class="login-tip">
        <el-button type="text" @click="$router.push('/login')">登录</el-button>
        后发表评论
      </div>
    </div>
    
    <div class="editor-content">
      <el-input
        v-model="content"
        type="textarea"
        :rows="4"
        :placeholder="isLoggedIn ? '写下你的观后感...' : '请先登录'"
        :disabled="!isLoggedIn"
      />
      
      <div class="editor-footer">
        <div class="rating">
          <span class="rating-label">评分：</span>
          <el-rate
            v-model="rating"
            :colors="['#ff9900', '#ff9900', '#ff9900']"
            :disabled="!isLoggedIn"
          />
        </div>
        
        <div class="action-buttons">
          <el-button
            v-if="parentId"
            size="small"
            @click="$emit('cancel')"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            size="small"
            :disabled="!canSubmit"
            @click="handleSubmit"
            :loading="submitting"
          >
            {{ parentId ? '发表回复' : '发表评论' }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'CommentEditor',
  
  props: {
    movieId: {
      type: [Number, String],
      required: true,
      validator(value) {
        if (!value) {
          console.error('[CommentEditor] movieId is required but got:', value)
          return false
        }
        return true
      }
    },
    parentId: {
      type: [Number, String],
      default: 0
    },
    replyTo: {
      type: String,
      default: ''
    }
  },
  
  data() {
    return {
      content: '',
      rating: 0,
      submitting: false,
      error: null
    }
  },
  
  computed: {
    ...mapGetters('user', ['isLoggedIn', 'username', 'userAvatar', 'currentUser', 'userInfo']),
    
    // 获取当前用户信息，优先从userInfo获取
    currentUserInfo() {
      const userInfo = this.$store.getters['user/userInfo']
      const user = this.$store.getters['user/currentUser']
      console.log('[CommentEditor] Getting user info:', { userInfo, user })
      return userInfo || user
    },
    
    canSubmit() {
      return this.isLoggedIn && 
             this.content.trim() && 
             (this.parentId > 0 || this.rating > 0) && 
             !this.submitting
    }
  },
  
  watch: {
    content(newVal) {
      // 监控内容长度
      if (newVal.length > 500) {
        console.warn('[CommentEditor] Content length exceeds 500 characters')
        this.content = newVal.slice(0, 500)
        this.$message.warning('评论内容不能超过500字')
      }
    }
  },

  created() {
    console.log('[CommentEditor] Initialized with movieId:', this.movieId, 'parentId:', this.parentId)
  },
  
  methods: {
    validateInput() {
      console.log('[CommentEditor] Validating input:', {
        content: this.content,
        rating: this.rating,
        isLoggedIn: this.isLoggedIn
      })

      if (!this.isLoggedIn) {
        console.error('[CommentEditor] User not logged in')
        throw new Error('请先登录')
      }
      
      if (!this.content.trim()) {
        console.error('[CommentEditor] Empty content')
        throw new Error('请输入评论内容')
      }
      
      if (!this.rating && this.parentId === 0) {
        console.error('[CommentEditor] Rating required for main comment')
        throw new Error('请给出评分')
      }

      if (!this.currentUserInfo?.id) {
        console.error('[CommentEditor] User ID not found')
        throw new Error('用户信息不完整，请重新登录')
      }

      return true
    },

    async handleSubmit() {
      if (this.submitting) {
        return
      }

      console.log('[CommentEditor] Attempting to submit comment')
      this.submitting = true
      
      try {
        this.validateInput()
        
        const commentData = {
          movieId: Number(this.movieId),
          content: this.content.trim(),
          rating: this.rating,
          parentId: this.parentId ? Number(this.parentId) : 0,
          userId: this.currentUserInfo.id
        }

        if (this.replyTo) {
          commentData.replyTo = this.replyTo
        }
        
        console.log('[CommentEditor] Submitting comment:', commentData)

        await this.$store.dispatch('comment/submitComment', commentData)
        
        this.content = ''
        this.rating = 0
        
        this.$message.success('评论发表成功')
        this.$emit('success')
        this.$emit('cancel') // 发表成功后收起编辑器
        
        console.log('[CommentEditor] Comment submitted successfully')
      } catch (error) {
        console.error('[CommentEditor] Failed to submit comment:', error)
        this.$message.error(error.message || '评论发表失败，请稍后重试')
      } finally {
        this.submitting = false
      }
    },

    handleContentInput(event) {
      console.log('[CommentEditor] Content changed, length:', event.target.value.length)
    },

    handleRatingChange(value) {
      console.log('[CommentEditor] Rating changed to:', value)
    }
  },

  beforeUnmount() {
    console.log('[CommentEditor] Component unmounting, cleaning up...')
    // 清理未保存的内容
    if (this.content.trim() || this.rating) {
      console.warn('[CommentEditor] Unsaved content detected on unmount:', {
        content: this.content,
        rating: this.rating
      })
    }
  },

  emits: ['success', 'cancel']
}
</script>

<style lang="scss" scoped>
.comment-editor {
  background: var(--comment-editor-bg);
  border: 1px solid var(--comment-editor-border);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--el-color-primary-light-5);
    box-shadow: 0 2px 12px rgba(64, 158, 255, 0.1);
  }

  &:focus-within {
    border-color: var(--el-color-primary);
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
  }

  .editor-header {
    margin-bottom: 12px;
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .el-avatar {
        border: 1px solid var(--border-color);
        transition: all 0.3s;
      }
      
      .username {
        font-weight: 500;
        color: var(--text-color);
        font-size: 14px;
      }
    }
    
    .login-tip {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--text-color-light);
      font-size: 13px;

      .el-button {
        font-weight: 500;
        padding: 0;
        height: auto;
        color: var(--el-color-primary);
        font-size: 13px;
      }
    }
  }

  .editor-content {
    :deep(.el-textarea) {
      .el-textarea__inner {
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 12px;
        font-size: 13px;
        line-height: 1.5;
        resize: vertical;
        min-height: 80px;
        transition: all 0.3s;
        background: var(--input-bg-color);
        color: var(--text-color);

        &:focus {
          border-color: var(--el-color-primary);
          box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
        }

        &::placeholder {
          color: var(--text-color-light);
        }

        &:disabled {
          background: var(--input-bg-color);
          color: var(--text-color-light);
          cursor: not-allowed;
        }
      }
    }

    .editor-footer {
      margin-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;

      .rating {
        display: flex;
        align-items: center;
        gap: 8px;
        
        .rating-label {
          color: var(--text-color);
          font-weight: 500;
          font-size: 13px;
        }

        :deep(.el-rate) {
          .el-rate__icon {
            font-size: 16px;
            margin-right: 2px;
          }

          .el-rate__item.is-active .el-rate__icon {
            color: #ff9900;
          }
        }
      }

      .action-buttons {
        display: flex;
        gap: 8px;
        position: relative;
        z-index: 10;

        .el-button {
          height: 32px;
          padding: 0 12px;
          border-radius: 6px;
          font-weight: 500;
          font-size: 12px;
          transition: all 0.3s;
          position: relative;
          z-index: 11;
          pointer-events: auto;

          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .comment-editor {
    padding: 12px;

    .editor-content {
      .editor-footer {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;

        .rating {
          justify-content: center;
        }

        .action-buttons {
          .el-button {
            flex: 1;
            height: 28px;
          }
        }
      }
    }
  }
}
</style>
