<template>
  <div class="comment-item" :class="{ 'is-reply': isReply }">
    <div class="comment-avatar">
      <el-avatar :size="40" :src="comment.userAvatar">
        {{ comment.username?.charAt(0) }}
      </el-avatar>
    </div>
    
    <div class="comment-content">
      <div class="comment-header">
        <span class="username">{{ comment.username }}</span>
        <template v-if="comment.replyTo">
          <span class="reply-to">回复</span>
          <span class="reply-username">@{{ comment.replyTo.username }}</span>
        </template>
        <el-rate
          v-if="!isReply"
          v-model="comment.rating"
          disabled
          :colors="['#ff9900', '#ff9900', '#ff9900']"
        />
      </div>
      
      <div class="comment-text">{{ comment.content }}</div>
      
      <div class="comment-footer">
        <span class="time">{{ formatTime(comment.createTime) }}</span>
        
        <div class="actions">
          <el-button 
            type="text" 
            size="small"
            :class="{ active: comment.liked }"
            @click="handleLike"
          >
            <i class="el-icon-thumb"></i>
            {{ comment.likeCount || 0 }}
          </el-button>
          
          <el-button 
            type="text" 
            size="small"
            :class="{ active: comment.disliked }"
            @click="handleDislike"
          >
            <i class="el-icon-thumb" style="transform: rotate(180deg)"></i>
            {{ comment.dislikeCount || 0 }}
          </el-button>
          
          <el-button 
            type="text" 
            size="small"
            @click="handleReply"
          >
            <i class="el-icon-chat-line-round"></i>
            回复
          </el-button>
          
          <el-button 
            v-if="canDelete"
            type="text" 
            size="small"
            @click="handleDelete"
          >
            <i class="el-icon-delete"></i>
            删除
          </el-button>
        </div>
      </div>

      <!-- 回复框 -->
      <div v-if="showReplyEditor" class="reply-editor">
        <comment-editor
          :movie-id="movieId"
          :parent-id="isReply ? comment.parentId : comment.id"
          :reply-to="comment"
          @success="handleReplySuccess"
        />
      </div>
      
      <!-- 回复列表 -->
      <transition name="fade">
        <div v-if="hasReplies" class="reply-list">
          <div class="reply-count" v-if="!isReply">
            {{ comment.replies.length }}条回复
          </div>
          <comment-item
            v-for="reply in comment.replies"
            :key="reply.id"
            :comment="reply"
            :movie-id="movieId"
            :is-reply="true"
            @reply-success="handleReplySuccess"
            @delete-success="handleDeleteSuccess"
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import CommentEditor from './CommentEditor.vue'

export default {
  name: 'CommentItem',
  
  components: {
    CommentEditor
  },
  
  props: {
    comment: {
      type: Object,
      required: true,
      validator: function(obj) {
        return obj.id !== undefined && obj.content !== undefined
      }
    },
    movieId: {
      type: [String, Number],
      required: true
    },
    isReply: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      showReplyEditor: false
    }
  },
  
  computed: {
    ...mapState('user', ['currentUser']),
    
    canDelete() {
      return this.currentUser && 
        (this.currentUser.id === this.comment.userId || this.currentUser.role === 'admin')
    },

    hasReplies() {
      return !this.isReply && Array.isArray(this.comment.replies) && this.comment.replies.length > 0
    }
  },

  methods: {
    ...mapActions('comment', [
      'likeComment',
      'dislikeComment',
      'deleteComment'
    ]),

    formatTime(time) {
      if (!time) return ''
      return formatDistanceToNow(new Date(time), {
        addSuffix: true,
        locale: zhCN
      })
    },
    
    async handleLike() {
      if (!this.currentUser) {
        this.$message.warning('请先登录')
        return
      }

      try {
        await this.likeComment({
          commentId: this.comment.id,
          movieId: this.movieId,
          parentId: this.isReply ? this.comment.parentId : null
        })
        this.$message.success('点赞成功')
      } catch (error) {
        console.error('点赞失败:', error)
        this.$message.error('点赞失败，请稍后重试')
      }
    },
    
    async handleDislike() {
      if (!this.currentUser) {
        this.$message.warning('请先登录')
        return
      }

      try {
        await this.dislikeComment({
          commentId: this.comment.id,
          movieId: this.movieId,
          parentId: this.isReply ? this.comment.parentId : null
        })
        this.$message.success('已取消点赞')
      } catch (error) {
        console.error('操作失败:', error)
        this.$message.error('操作失败，请稍后重试')
      }
    },
    
    handleReply() {
      if (!this.currentUser) {
        this.$message.warning('请先登录')
        return
      }
      this.showReplyEditor = !this.showReplyEditor
    },
    
    handleReplySuccess() {
      this.showReplyEditor = false
      this.$emit('reply-success')
    },
    
    async handleDelete() {
      try {
        await this.$confirm('确定要删除这条评论吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        await this.deleteComment({
          commentId: this.comment.id,
          movieId: this.movieId,
          parentId: this.isReply ? this.comment.parentId : null
        })

        this.$emit('delete-success')
        this.$message.success('删除成功')
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除失败:', error)
          this.$message.error('删除失败，请稍后重试')
        }
      }
    },

    handleDeleteSuccess() {
      this.$emit('delete-success')
    }
  },

  beforeUnmount() {
    console.log('[CommentItem] Component unmounting, comment:', this.comment.id)
    if (this.showReplyEditor) {
      console.warn('[CommentItem] Reply editor was open on unmount')
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-item {
  display: flex;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
  
  &.is-reply {
    padding: 15px 0;
    margin-left: 20px;
    border-bottom: none;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      left: -10px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #f0f0f0;
    }
  }
  
  .comment-avatar {
    margin-right: 15px;
    flex-shrink: 0;
  }
  
  .comment-content {
    flex: 1;
    min-width: 0; // 防止内容溢出
    
    .comment-header {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      
      .username {
        font-weight: 500;
        margin-right: 15px;
        color: #333;
      }

      .reply-to {
        color: #999;
        margin: 0 5px;
      }

      .reply-username {
        color: #409EFF;
        margin-right: 15px;
      }

      .el-rate {
        line-height: 1;
      }
    }
    
    .comment-text {
      line-height: 1.6;
      color: #333;
      margin-bottom: 8px;
      word-break: break-word;
    }
    
    .comment-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      
      .time {
        color: #999;
        font-size: 13px;
      }
      
      .actions {
        .el-button {
          margin-left: 15px;
          padding: 0;
          
          &.active {
            color: #409EFF;
          }
          
          i {
            margin-right: 3px;
          }

          &:first-child {
            margin-left: 0;
          }
        }
      }
    }

    .reply-editor {
      margin: 12px 0;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 4px;
    }
    
    .reply-list {
      margin-top: 12px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 4px;

      .reply-count {
        font-size: 13px;
        color: #666;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid #eee;
      }
    }
  }
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
