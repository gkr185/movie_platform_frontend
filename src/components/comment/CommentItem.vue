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
            <el-icon><ThumbsUp /></el-icon>
            {{ comment.likeCount || 0 }}
          </el-button>
          <el-button 
            type="text" 
            size="small"
            :class="{ 'is-disliked': comment.disliked }"
            @click="handleDislike"
          >
            <el-icon><ThumbsDown /></el-icon>
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
          @submit="handleReplySubmit"
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
import { ThumbsUp, ThumbsDown, ChatLineRound, Delete } from '@element-plus/icons-vue'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import CommentEditor from './CommentEditor.vue'
import ReplyItem from './ReplyItem.vue'

export default {
  name: 'CommentItem',
  
  components: {
    CommentEditor,
    ReplyItem,
    ThumbsUp,
    ThumbsDown,
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

    // 处理回复提交
    const handleReplySubmit = async (reply) => {
      try {
        await store.dispatch('comment/submitComment', {
          ...reply,
          movieId: props.movieId,
          parentId: props.comment.id
        })
        showReplyEditor.value = false
      } catch (error) {
        console.error('提交回复失败:', error)
      }
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
  padding: 16px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--comment-hover-bg);
  }

  &.is-reply {
    margin-left: 56px;
    background-color: var(--comment-reply-bg);
    border-radius: 6px;
  }
  
  .comment-avatar {
    flex-shrink: 0;

    .el-avatar {
      background: var(--el-color-primary);
      color: #fff;
      font-weight: bold;
    }
  }
  
  .comment-content {
    flex: 1;
    min-width: 0;

    .comment-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;

      .comment-info {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;

        .username {
          font-weight: 600;
          color: var(--comment-text);
        }

        .rating {
          display: flex;
          align-items: center;
        }

        .time {
          color: var(--comment-text-light);
          font-size: 12px;
        }
      }

      .comment-actions {
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
    
    .comment-text {
      color: var(--comment-text);
      line-height: 1.6;
      margin-bottom: 12px;
      word-break: break-word;
      white-space: pre-wrap;
    }
    
    .reply-editor {
      margin: 16px 0;
      padding: 12px;
      background-color: var(--comment-editor-bg);
      border: 1px solid var(--comment-editor-border);
      border-radius: 6px;
      transition: all 0.3s ease;

      &:hover {
        border-color: var(--el-color-primary);
        box-shadow: 0 0 8px rgba(var(--el-color-primary-rgb), 0.2);
      }
    }

    .replies-section {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--comment-divider);

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
</style>
