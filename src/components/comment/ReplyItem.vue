<template>
  <div class="reply-item">
    <div class="reply-avatar">
      <el-avatar :size="32" :src="reply.user?.avatar">
        {{ reply.user?.username?.charAt(0)?.toUpperCase() }}
      </el-avatar>
    </div>

    <div class="reply-content">
      <div class="reply-header">
        <div class="reply-info">
          <span class="username">{{ reply.user?.username }}</span>
          <template v-if="reply.replyTo">
            <span class="reply-to">回复</span>
            <span class="reply-username">@{{ reply.replyTo }}</span>
          </template>
          <span class="time">{{ formatTime(reply.createTime) }}</span>
        </div>

        <div class="reply-actions">
          <el-button 
            type="text" 
            size="small"
            :class="{ 'is-liked': reply.liked }"
            @click="handleLike"
          >
            <el-icon><Like /></el-icon>
            {{ reply.likeCount || 0 }}
          </el-button>
          <el-button 
            type="text" 
            size="small"
            :class="{ 'is-disliked': reply.disliked }"
            @click="handleDislike"
          >
            <el-icon><DisLike /></el-icon>
            {{ reply.dislikeCount || 0 }}
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

      <div class="reply-text">{{ reply.content }}</div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Like, DisLike, Delete } from '@element-plus/icons-vue'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default {
  name: 'ReplyItem',

  components: {
    Like,
    DisLike,
    Delete
  },

  props: {
    reply: {
      type: Object,
      required: true
    },
    movieId: {
      type: [String, Number],
      required: true
    },
    parentId: {
      type: [String, Number],
      required: true
    }
  },

  setup(props) {
    const store = useStore()

    // 检查是否可以删除回复
    const canDelete = computed(() => {
      const currentUser = store.getters['user/currentUser']
      return currentUser && (
        currentUser.id === props.reply.user?.id ||
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
      console.log('点赞按钮被点击', props.reply.id)
      try {
        if (props.reply.liked) {
          await store.dispatch('comment/unlikeComment', {
            commentId: props.reply.id,
            movieId: props.movieId,
            parentId: props.parentId
          })
        } else {
          await store.dispatch('comment/likeComment', {
            commentId: props.reply.id,
            movieId: props.movieId,
            parentId: props.parentId
          })
        }
      } catch (error) {
        console.error('点赞操作失败:', error)
        ElMessage.error('点赞操作失败，请重试')
      }
    }

    // 处理点踩
    const handleDislike = async () => {
      console.log('点踩按钮被点击', props.reply.id)
      try {
        if (props.reply.disliked) {
          await store.dispatch('comment/undislikeComment', {
            commentId: props.reply.id,
            movieId: props.movieId,
            parentId: props.parentId
          })
        } else {
          await store.dispatch('comment/dislikeComment', {
            commentId: props.reply.id,
            movieId: props.movieId,
            parentId: props.parentId
          })
        }
      } catch (error) {
        console.error('点踩操作失败:', error)
        ElMessage.error('点踩操作失败，请重试')
      }
    }

    // 处理删除
    const handleDelete = async () => {
      console.log('删除按钮被点击', props.reply.id)
      try {
        await ElMessageBox.confirm(
          '确定要删除这条回复吗？',
          '删除确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )

        await store.dispatch('comment/deleteComment', {
          commentId: props.reply.id,
          movieId: props.movieId,
          parentId: props.parentId
        })
        
        ElMessage.success('回复删除成功')
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除回复失败:', error)
          ElMessage.error('删除失败，请重试')
        }
      }
    }

    return {
      canDelete,
      formatTime,
      handleLike,
      handleDislike,
      handleDelete
    }
  }
}
</script>

<style lang="scss" scoped>
.reply-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  background: var(--comment-reply-bg);
  border: 1px solid var(--comment-border);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  // 左侧装饰条
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, var(--el-color-primary), var(--el-color-primary-light-5));
    opacity: 0.7;
    transition: opacity 0.3s;
    pointer-events: none; // 防止伪元素阻止点击事件
  }

  // 装饰性背景渐变
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(64, 158, 255, 0.02), rgba(103, 194, 58, 0.02));
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none; // 防止伪元素阻止点击事件
  }

  &:hover {
    background: var(--comment-hover-bg);
    border-color: var(--el-color-primary-light-7);
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);

    &::before {
      opacity: 1;
      width: 4px;
    }

    &::after {
      opacity: 1;
    }

    .reply-avatar .el-avatar {
      transform: scale(1.05);
      border-color: var(--el-color-primary);
    }
  }

  .reply-avatar {
    flex-shrink: 0;

    .el-avatar {
      background: linear-gradient(135deg, var(--el-color-success), var(--el-color-success-light-3));
      color: white;
      font-weight: 700;
      border: 2px solid var(--border-color);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 3px 12px rgba(103, 194, 58, 0.2);
      font-size: 14px;

      &:hover {
        transform: scale(1.1);
        box-shadow: 0 5px 18px rgba(103, 194, 58, 0.3);
      }
    }
  }

  .reply-content {
    flex: 1;
    min-width: 0;

    .reply-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
      flex-wrap: wrap;
      gap: 8px;

      .reply-info {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;

        .username {
          font-weight: 700;
          color: var(--comment-text);
          font-size: 14px;
          text-decoration: none;
          transition: color 0.3s;

          &:hover {
            color: var(--el-color-success);
          }
        }

        .reply-to {
          color: var(--comment-text-light);
          font-size: 12px;
          padding: 2px 6px;
          background: var(--input-bg-color);
          border-radius: 6px;
          font-weight: 500;
        }

        .reply-username {
          color: var(--el-color-primary);
          font-size: 12px;
          font-weight: 600;
          padding: 2px 6px;
          background: var(--el-color-primary-light-9);
          border-radius: 6px;
          text-decoration: none;
          transition: all 0.3s;

          &:hover {
            background: var(--el-color-primary-light-8);
            color: var(--el-color-primary-dark-2);
          }
        }

        .time {
          color: var(--comment-text-light);
          font-size: 11px;
          padding: 3px 6px;
          background: var(--input-bg-color);
          border-radius: 6px;
          font-weight: 500;
        }
      }

      .reply-actions {
        display: flex;
        gap: 6px;
        align-items: center;

        .el-button {
          color: var(--comment-action);
          padding: 4px 8px;
          font-size: 12px;
          border: none;
          background: transparent;
          cursor: pointer;
          border-radius: 4px;
          transition: color 0.3s;

          &:hover {
            color: var(--comment-action-hover);
          }

          &.is-liked {
            color: var(--el-color-primary);
          }

          &.is-disliked {
            color: var(--el-color-danger);
          }

          &.delete-btn:hover {
            color: var(--el-color-danger);
          }

          .el-icon {
            font-size: 12px;
            margin-right: 4px;
          }
        }
      }
    }

    .reply-text {
      color: var(--comment-text);
      line-height: 1.6;
      word-break: break-word;
      white-space: pre-wrap;
      font-size: 13px;
      padding: 10px 12px;
      background: var(--input-bg-color);
      border-radius: 10px;
      border-left: 2px solid var(--el-color-success-light-8);
      transition: all 0.3s;

      &:hover {
        background: var(--card-bg-color);
        border-left-color: var(--el-color-success);
      }
    }
  }
}

// 新增动画效果
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.reply-item {
  animation: slideInRight 0.3s ease-out;
}

// 响应式设计
@media (max-width: 768px) {
  .reply-item {
    padding: 12px;
    border-radius: 10px;
    gap: 10px;

    .reply-avatar .el-avatar {
      width: 28px;
      height: 28px;
      font-size: 12px;
    }

    .reply-content {
      .reply-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        margin-bottom: 8px;

        .reply-info {
          gap: 8px;
          flex-wrap: wrap;

          .username {
            font-size: 13px;
          }

          .reply-to,
          .reply-username {
            font-size: 11px;
          }

          .time {
            font-size: 10px;
          }
        }

        .reply-actions {
          gap: 4px;
          flex-wrap: wrap;

          .el-button {
            padding: 3px 6px;
            font-size: 11px;
            gap: 3px;

            .el-icon {
              font-size: 11px;
            }
          }
        }
      }

      .reply-text {
        font-size: 12px;
        padding: 8px 10px;
      }
    }
  }
}

@media (max-width: 480px) {
  .reply-item {
    padding: 10px;
    gap: 8px;

    .reply-avatar .el-avatar {
      width: 24px;
      height: 24px;
      font-size: 11px;
    }

    .reply-content {
      .reply-header {
        margin-bottom: 6px;

        .reply-info {
          gap: 6px;

          .username {
            font-size: 12px;
          }

          .reply-to,
          .reply-username,
          .time {
            font-size: 10px;
            padding: 1px 4px;
          }
        }

        .reply-actions .el-button {
          padding: 2px 4px;
          font-size: 10px;
        }
      }

      .reply-text {
        font-size: 11px;
        padding: 6px 8px;
      }
    }
  }
}
</style>
