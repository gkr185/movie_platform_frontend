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
            <el-icon><ThumbsUp /></el-icon>
            {{ reply.likeCount || 0 }}
          </el-button>
          <el-button 
            type="text" 
            size="small"
            :class="{ 'is-disliked': reply.disliked }"
            @click="handleDislike"
          >
            <el-icon><ThumbsDown /></el-icon>
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
import { ElMessageBox } from 'element-plus'
import { ThumbsUp, ThumbsDown, Delete } from '@element-plus/icons-vue'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default {
  name: 'ReplyItem',

  components: {
    ThumbsUp,
    ThumbsDown,
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
      }
    }

    // 处理点踩
    const handleDislike = async () => {
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
      }
    }

    // 处理删除
    const handleDelete = async () => {
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
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除回复失败:', error)
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
  padding: 12px;
  border-radius: 6px;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--comment-hover-bg);
  }

  .reply-avatar {
    flex-shrink: 0;

    .el-avatar {
      background: var(--el-color-primary);
      color: #fff;
      font-weight: bold;
    }
  }

  .reply-content {
    flex: 1;
    min-width: 0;

    .reply-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;

      .reply-info {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;

        .username {
          font-weight: 600;
          color: var(--comment-text);
        }

        .reply-to {
          color: var(--comment-text-light);
          font-size: 12px;
        }

        .reply-username {
          color: var(--el-color-primary);
          font-size: 12px;
        }

        .time {
          color: var(--comment-text-light);
          font-size: 12px;
        }
      }

      .reply-actions {
        display: flex;
        gap: 12px;

        .el-button {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--comment-action);
          padding: 0;
          height: auto;

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
    }
  }
}
</style>
