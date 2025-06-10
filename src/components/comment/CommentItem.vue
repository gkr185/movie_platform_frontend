<template>
  <div class="comment-item">
    <div class="comment-main">
      <!-- 用户头像 -->
      <div class="user-avatar">
        <el-avatar 
          :size="40"
          :src="comment.user.avatar"
          :alt="comment.user.name"
        >
          {{ comment.user.name.charAt(0) }}
        </el-avatar>
      </div>

      <div class="comment-content">
        <!-- 用户信息和评分 -->
        <div class="comment-header">
          <div class="user-info">
            <span class="username">{{ comment.user.name }}</span>
            <el-tag 
              v-if="comment.user.isVIP" 
              size="small" 
              type="warning"
              class="vip-tag"
            >VIP</el-tag>
          </div>
          <div class="comment-score" v-if="comment.score">
            <el-rate
              v-model="comment.score"
              disabled
              text-color="#ff9900"
              score-template="{value}"
            />
          </div>
        </div>

        <!-- 评论内容 -->
        <div class="comment-text">{{ comment.content }}</div>

        <!-- 评论时间和操作 -->
        <div class="comment-footer">
          <span class="comment-time">{{ comment.createTime }}</span>
          <div class="comment-actions">
            <el-button 
              type="primary" 
              link
              :class="{ 'is-liked': comment.isLiked }"
              @click="handleLike"
            >
              <el-icon><Thumb /></el-icon>
              {{ comment.likes || 0 }}
            </el-button>
            <el-button 
              type="primary" 
              link
              @click="handleReply"
            >
              <el-icon><ChatLineRound /></el-icon>
              回复
            </el-button>
            <el-button 
              v-if="canDelete"
              type="danger" 
              link
              @click="handleDelete"
            >
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </div>
        </div>

        <!-- 回复列表 -->
        <div v-if="comment.replies && comment.replies.length" class="reply-list">
          <div 
            v-for="reply in comment.replies" 
            :key="reply.id" 
            class="reply-item"
          >
            <div class="reply-avatar">
              <el-avatar 
                :size="32"
                :src="reply.user.avatar"
              >
                {{ reply.user.name.charAt(0) }}
              </el-avatar>
            </div>
            <div class="reply-content">
              <div class="reply-header">
                <span class="reply-username">{{ reply.user.name }}</span>
                <el-tag 
                  v-if="reply.user.isVIP" 
                  size="small" 
                  type="warning"
                  class="vip-tag"
                >VIP</el-tag>
                <template v-if="reply.replyTo">
                  <el-icon><Right /></el-icon>
                  <span class="reply-to">{{ reply.replyTo.name }}</span>
                </template>
              </div>
              <div class="reply-text">{{ reply.content }}</div>
              <div class="reply-footer">
                <span class="reply-time">{{ reply.createTime }}</span>
                <el-button 
                  type="primary" 
                  link
                  @click="handleReplyToReply(reply)"
                >回复</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { Thumb, ChatLineRound, Delete, Right } from '@element-plus/icons-vue'

export default {
  name: 'CommentItem',
  components: {
    Thumb,
    ChatLineRound,
    Delete,
    Right
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  emits: ['reply', 'like', 'delete'],
  setup(props, { emit }) {
    const store = useStore()
    const currentUser = computed(() => store.state.user.user)

    const canDelete = computed(() => {
      if (!currentUser.value) return false
      return currentUser.value.id === props.comment.user.id || currentUser.value.isAdmin
    })

    const handleLike = () => {
      emit('like', props.comment.id)
    }

    const handleReply = () => {
      emit('reply', props.comment)
    }

    const handleReplyToReply = (reply) => {
      emit('reply', { ...props.comment, replyTo: reply.user })
    }

    const handleDelete = () => {
      emit('delete', props.comment.id)
    }

    return {
      canDelete,
      handleLike,
      handleReply,
      handleReplyToReply,
      handleDelete
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-item {
  padding: 20px;
  border-bottom: 1px solid var(--comment-border);
  transition: background-color 0.3s;

  &:last-child {
    border-bottom: none;
  }

  

  .comment-main {
    display: flex;
    gap: 16px;
  }

  .user-avatar {
    flex-shrink: 0;
  }

  .comment-content {
    flex: 1;
    min-width: 0;
  }

  .comment-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .username {
      font-weight: 500;
      color: var(--comment-text);
    }

    .vip-tag {
      transform: scale(0.8);
      transform-origin: left center;
    }
  }

  .comment-text {
    color: var(--comment-text);
    line-height: 1.6;
    margin: 12px 0;
    word-break: break-word;
  }

  .comment-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;

    .comment-time {
      font-size: 13px;
      color: var(--comment-text-light);
    }

    .comment-actions {
      display: flex;
      gap: 16px;

      .el-button {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        color: var(--comment-action);

        &:hover {
          color: var(--comment-action-hover);
        }

        &.is-liked {
          color: var(--comment-action-active);
        }
      }
    }
  }

  .reply-list {
    margin-top: 16px;
    padding: 12px;
    background: var(--comment-reply-bg);
    border-radius: 8px;
  }

  .reply-item {
    display: flex;
    gap: 12px;
    padding: 12px;
    border-radius: 4px;
    transition: background-color 0.3s;

    &:hover {
      background: var(--comment-hover-bg);
    }

    .reply-content {
      flex: 1;
      min-width: 0;
    }

    .reply-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;

      .reply-username {
        font-weight: 500;
        color: var(--comment-text);
      }

      .reply-to {
        color: var(--comment-text-light);
      }

      .el-icon {
        font-size: 12px;
        color: var(--comment-text-light);
      }
    }

    .reply-text {
      color: var(--comment-text);
      line-height: 1.6;
      margin: 8px 0;
      word-break: break-word;
    }

    .reply-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 8px;

      .reply-time {
        font-size: 12px;
        color: var(--comment-text-light);
      }

      .el-button {
        color: var(--comment-action);
        &:hover {
          color: var(--comment-action-hover);
        }
      }
    }
  }
}

// 响应式设计
@media screen and (max-width: 768px) {
  .comment-item {
    padding: 16px;

    .comment-main {
      gap: 12px;
    }

    .user-avatar {
      :deep(.el-avatar) {
        width: 36px;
        height: 36px;
      }
    }

    .comment-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .comment-footer {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;

      .comment-actions {
        width: 100%;
        justify-content: space-between;
      }
    }

    .reply-list {
      margin-top: 12px;
      padding: 8px;
    }

    .reply-item {
      padding: 8px;

      .reply-avatar {
        :deep(.el-avatar) {
          width: 28px;
          height: 28px;
        }
      }
    }
  }
}

// 深色模式适配
html[data-theme='dark'] {
  .comment-item {
    

    .reply-list {
      background: var(--el-fill-color-dark);
    }

    .reply-item:hover {
      background: var(--el-fill-color-darker);
    }
  }
}
</style> 
