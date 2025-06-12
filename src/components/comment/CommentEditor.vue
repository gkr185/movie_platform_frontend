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
        
        <el-button
          type="primary"
          :disabled="!isLoggedIn || !content.trim() || !rating"
          @click="handleSubmit"
          :loading="submitting"
        >
          发表评论
        </el-button>
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
    ...mapGetters('user', ['isLoggedIn', 'username', 'userAvatar'])
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

      return true
    },

    async handleSubmit() {
      console.log('[CommentEditor] Attempting to submit comment')
      
      try {
        this.validateInput()
        
        console.log('[CommentEditor] Submitting comment:', {
          movieId: this.movieId,
          content: this.content,
          rating: this.rating,
          parentId: this.parentId
        })

        await this.$store.dispatch('comment/submitComment', {
          movieId: this.movieId,
          content: this.content,
          rating: this.rating,
          parentId: this.parentId
        })
        
        this.content = ''
        this.rating = 0
        
        this.$message.success('评论发表成功')
        
        this.$emit('success')
        
        console.log('[CommentEditor] Comment submitted successfully')
      } catch (error) {
        console.error('[CommentEditor] Failed to submit comment:', error)
        this.$message.error(error.message || '评论发表失败，请稍后重试')
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
  }
}
</script>

<style lang="scss" scoped>
.comment-editor {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);

  .editor-header {
    margin-bottom: 15px;
    
    .user-info {
      display: flex;
      align-items: center;
      
      .username {
        margin-left: 10px;
        font-weight: 500;
      }
    }
    
    .login-tip {
      color: #606266;
    }
  }

  .editor-content {
    .editor-footer {
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .rating {
        display: flex;
        align-items: center;
        
        .rating-label {
          margin-right: 10px;
          color: #606266;
        }
      }
    }
  }
}
</style>
