<template>
  <div class="comment-item" :class="{ 'is-reply': isReply }">
    <div class="comment-avatar">
      <el-avatar :size="40" :src="comment.user?.avatar">
        {{ comment.user?.username?.charAt(0)?.toUpperCase() }}
      </el-avatar>
    </div>
    
    <div class="comment-content">
      <div class="comment-header">
        <div class="comment-info">
          <span class="username">{{ comment.user?.username }}</span>
          <span class="rating" v-if="comment.rating">
            <el-rate
              v-model="comment.rating"
              disabled
              size="small"
              :max="5"
              :colors="['#F7BA2A', '#F7BA2A', '#F7BA2A']"
            />
          </span>
          <span class="time">{{ formatTime(comment.createTime) }}</span>
        </div>
        <div class="comment-actions">
          <el-button 
            type="text" 
            size="small"
            :class="{ 'is-liked': comment.liked }"
            @click="handleLike"
          >
            <el-icon><Like /></el-icon>
            {{ comment.likeCount || 0 }}
          </el-button>
          <el-button 
            type="text" 
            size="small"
            :class="{ 'is-disliked': comment.disliked }"
            @click="handleDislike"
          >
            <el-icon><DisLike /></el-icon>
            {{ comment.dislikeCount || 0 }}
          </el-button>
          <el-button 
            type="text" 
            size="small"
            @click="showReplyEditor = true"
          >
            <el-icon><ChatLineRound /></el-icon>
            回复
          </el-button>
          <el-button 
            v-if="canDelete"
            type="text" 
            size="small"
            class="delete-btn"
            @click="handleDelete"
          >
            <el-icon><Delete /></el-icon>
            删除
          </el-button>
        </div>
      </div>
      
      <div class="comment-text">{{ comment.content }}</div>
      
      <div v-if="showReplyEditor" class="reply-editor">
        <CommentEditor
          :movie-id="movieId"
          :parent-id="comment.id"
          :reply-to="comment.user?.username"
          @success="handleReplySubmit"
          @cancel="showReplyEditor = false"
        />
      </div>
      
      <div v-if="comment.replies?.length" class="replies-section">
        <div 
          v-for="reply in comment.replies" 
          :key="reply.id"
          class="reply-item"
        >
          <ReplyItem
            :reply="reply"
            :movie-id="movieId"
            :parent-id="comment.id"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { ElMessageBox } from 'element-plus'
import { Like, DisLike, ChatLineRound, Delete } from '@element-plus/icons-vue'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import CommentEditor from './CommentEditor.vue'
import ReplyItem from './ReplyItem.vue'

export default {
  name: 'CommentItem',
  
  components: {
    CommentEditor,
    ReplyItem,
    Like,
    DisLike,
    ChatLineRound,
    Delete
  },
  
  props: {
    comment: {
      type: Object,
      required: true
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
  
  setup(props) {
    const store = useStore()
    const showReplyEditor = ref(false)

    // 检查是否可以删除评论
    const canDelete = computed(() => {
      const currentUser = store.getters['user/currentUser']
      return currentUser && (
        currentUser.id === props.comment.user?.id ||
        currentUser.role === 'ADMIN'
      )
    })

    // 格式化时间
    const formatTime = (time) => {
      if (!time) return ''
      return formatDistanceToNow(new Date(time), {
        addSuffix: true,
        locale: zhCN
      })
    }

    // 处理点赞
    const handleLike = async () => {
      try {
        if (props.comment.liked) {
          await store.dispatch('comment/unlikeComment', {
            commentId: props.comment.id,
            movieId: props.movieId,
            parentId: props.isReply ? props.parentId : null
          })
        } else {
          await store.dispatch('comment/likeComment', {
            commentId: props.comment.id,
            movieId: props.movieId,
            parentId: props.isReply ? props.parentId : null
          })
        }
      } catch (error) {
        console.error('点赞操作失败:', error)
      }
    }

    // 处理点踩
    const handleDislike = async () => {
      try {
        if (props.comment.disliked) {
          await store.dispatch('comment/undislikeComment', {
            commentId: props.comment.id,
            movieId: props.movieId,
            parentId: props.isReply ? props.parentId : null
          })
        } else {
          await store.dispatch('comment/dislikeComment', {
            commentId: props.comment.id,
            movieId: props.movieId,
            parentId: props.isReply ? props.parentId : null
          })
        }
      } catch (error) {
        console.error('点踩操作失败:', error)
      }
    }

    // 处理删除
    const handleDelete = async () => {
      try {
        await ElMessageBox.confirm(
          '确定要删除这条评论吗？',
          '删除确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )

        await store.dispatch('comment/deleteComment', {
          commentId: props.comment.id,
          movieId: props.movieId,
          parentId: props.isReply ? props.parentId : null
        })
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除评论失败:', error)
        }
      }
    }

    // 处理回复提交成功
    const handleReplySubmit = () => {
      showReplyEditor.value = false
    }

    return {
      showReplyEditor,
      canDelete,
      formatTime,
      handleLike,
      handleDislike,
      handleDelete,
      handleReplySubmit
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-item {
  display: flex;
  gap: 16px;
  padding: 20px;
  border-radius: 16px;
  background: var(--comment-bg);
  border: 1px solid var(--comment-border);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  // 装饰性渐变效果
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(64, 158, 255, 0.02), rgba(103, 194, 58, 0.02));
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover {
    background: var(--comment-hover-bg);
    border-color: var(--el-color-primary-light-7);
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);

    &::before {
      opacity: 1;
    }

    .comment-avatar .el-avatar {
      transform: scale(1.05);
      border-color: var(--el-color-primary);
    }
  }

  &.is-reply {
    margin-left: 56px;
    background: var(--comment-reply-bg);
    border-radius: 12px;
    padding: 16px;
    border-left: 3px solid var(--el-color-primary-light-7);

    &:hover {
      border-left-color: var(--el-color-primary);
    }
  }
  
  .comment-avatar {
    flex-shrink: 0;

    .el-avatar {
      background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-light-3));
      color: white;
      font-weight: 700;
      border: 2px solid var(--border-color);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 15px rgba(64, 158, 255, 0.2);

      &:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(64, 158, 255, 0.3);
      }
    }
  }
  
  .comment-content {
    flex: 1;
    min-width: 0;

    .comment-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
      flex-wrap: wrap;
      gap: 8px;

      .comment-info {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;

        .username {
          font-weight: 700;
          color: var(--comment-text);
          font-size: 15px;
          text-decoration: none;
          transition: color 0.3s;

          &:hover {
            color: var(--el-color-primary);
          }
        }

        .rating {
          display: flex;
          align-items: center;
          padding: 4px 8px;
          background: var(--input-bg-color);
          border-radius: 8px;

          :deep(.el-rate) {
            .el-rate__icon {
              font-size: 14px;
              margin-right: 2px;
            }
          }
        }

        .time {
          color: var(--comment-text-light);
          font-size: 12px;
          padding: 4px 8px;
          background: var(--input-bg-color);
          border-radius: 8px;
          font-weight: 500;
        }
      }

      .comment-actions {
        display: flex;
        gap: 8px;
        align-items: center;

        .el-button {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--comment-action);
          padding: 6px 12px;
          height: auto;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          background: transparent;
          border: 1px solid transparent;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

          &:hover {
            color: var(--comment-action-hover);
            background: var(--input-bg-color);
            border-color: var(--border-color);
            transform: translateY(-1px);
          }

          &.is-liked {
            color: var(--el-color-primary);
            background: var(--el-color-primary-light-9);
            border-color: var(--el-color-primary-light-7);

            &:hover {
              background: var(--el-color-primary-light-8);
            }
          }

          &.is-disliked {
            color: var(--el-color-danger);
            background: var(--el-color-danger-light-9);
            border-color: var(--el-color-danger-light-7);

            &:hover {
              background: var(--el-color-danger-light-8);
            }
          }

          &.delete-btn {
            &:hover {
              color: var(--el-color-danger);
              background: var(--el-color-danger-light-9);
              border-color: var(--el-color-danger-light-7);
            }
          }

          .el-icon {
            font-size: 14px;
          }
        }
      }
    }
    
    .comment-text {
      color: var(--comment-text);
      line-height: 1.7;
      margin-bottom: 16px;
      word-break: break-word;
      white-space: pre-wrap;
      font-size: 14px;
      padding: 12px 16px;
      background: var(--input-bg-color);
      border-radius: 12px;
      border-left: 3px solid var(--el-color-primary-light-8);
      transition: all 0.3s;

      &:hover {
        background: var(--card-bg-color);
        border-left-color: var(--el-color-primary);
      }
    }
    
    .reply-editor {
      margin: 20px 0;
      padding: 16px;
      background: var(--comment-editor-bg);
      border: 2px solid var(--comment-editor-border);
      border-radius: 12px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        border-color: var(--el-color-primary);
        box-shadow: 0 4px 20px rgba(64, 158, 255, 0.1);
      }
    }

    .replies-section {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px solid var(--comment-divider);
      position: relative;

      &::before {
        content: '';
        position: absolute;
        top: -1px;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, var(--el-color-primary), transparent);
        opacity: 0.3;
      }

      .reply-item {
        &:not(:last-child) {
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--comment-divider);
        }
      }
    }
  }
}

// 新增动画效果
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.comment-item {
  animation: slideInLeft 0.3s ease-out;
}

// 响应式设计
@media (max-width: 768px) {
  .comment-item {
    padding: 16px;
    border-radius: 12px;
    gap: 12px;

    &.is-reply {
      margin-left: 40px;
      padding: 12px;
    }

    .comment-content {
      .comment-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;

        .comment-info {
          flex-wrap: wrap;
          gap: 8px;

          .username {
            font-size: 14px;
          }

          .time {
            font-size: 11px;
          }
        }

        .comment-actions {
          gap: 6px;
          flex-wrap: wrap;

          .el-button {
            padding: 4px 8px;
            font-size: 12px;
            gap: 4px;

            .el-icon {
              font-size: 12px;
            }
          }
        }
      }

      .comment-text {
        font-size: 13px;
        padding: 10px 12px;
        margin-bottom: 12px;
      }

      .reply-editor {
        margin: 16px 0;
        padding: 12px;
      }

      .replies-section {
        margin-top: 16px;
        padding-top: 16px;
      }
    }
  }
}

@media (max-width: 480px) {
  .comment-item {
    padding: 12px;

    &.is-reply {
      margin-left: 20px;
      padding: 10px;
    }

    .comment-avatar .el-avatar {
      width: 32px;
      height: 32px;
      font-size: 14px;
    }

    .comment-content {
      .comment-header {
        .comment-info {
          .username {
            font-size: 13px;
          }

          .rating :deep(.el-rate) {
            .el-rate__icon {
              font-size: 12px;
            }
          }
        }

        .comment-actions .el-button {
          padding: 3px 6px;
          font-size: 11px;
        }
      }

      .comment-text {
        font-size: 12px;
        padding: 8px 10px;
      }
    }
  }
}
</style>
