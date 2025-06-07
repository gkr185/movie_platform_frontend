<template>
  <div class="comment-item">
    <!-- 用户头像 -->
    <div class="user-avatar">
      <el-avatar :size="40" :src="comment.user.avatar">
        <el-icon><UserFilled /></el-icon>
      </el-avatar>
    </div>

    <!-- 评论内容 -->
    <div class="comment-content">
      <!-- 用户信息和评分 -->
      <div class="comment-header">
        <div class="user-info">
          <span class="username">{{ comment.user.name }}</span>
          <el-tag v-if="comment.user.isVIP" size="small" type="warning">VIP</el-tag>
        </div>
        <div class="rating">
          <el-rate
            v-model="comment.score"
            disabled
            :max="10"
            :allow-half="true"
            text-color="#ff9900"
          >
            <template #suffix>{{ comment.score }}分</template>
          </el-rate>
        </div>
      </div>

      <!-- 评论文本 -->
      <div class="comment-text">{{ comment.content }}</div>

      <!-- 评论时间和操作 -->
      <div class="comment-footer">
        <span class="time">{{ formatTime(comment.createTime) }}</span>
        <div class="actions">
          <el-button 
            type="text" 
            size="small"
            :class="{ 'liked': comment.isLiked }"
            @click="$emit('like', comment.id)"
          >
            <el-icon><ThumbsUp /></el-icon>
            {{ comment.likes > 0 ? comment.likes : '点赞' }}
          </el-button>
          <el-button 
            type="text" 
            size="small"
            @click="$emit('reply', comment)"
          >
            <el-icon><ChatDotRound /></el-icon>
            回复
          </el-button>
          <el-button 
            v-if="canDelete"
            type="text" 
            size="small"
            @click="$emit('delete', comment.id)"
          >
            <el-icon><Delete /></el-icon>
            删除
          </el-button>
        </div>
      </div>

      <!-- 回复列表 -->
      <div v-if="comment.replies?.length" class="reply-list">
        <div 
          v-for="reply in comment.replies" 
          :key="reply.id" 
          class="reply-item"
        >
          <div class="reply-content">
            <span class="reply-user">{{ reply.user.name }}</span>
            <template v-if="reply.replyTo">
              回复
              <span class="reply-to">@{{ reply.replyTo.name }}</span>
            </template>：
            <span class="reply-text">{{ reply.content }}</span>
          </div>
          <div class="reply-footer">
            <span class="time">{{ formatTime(reply.createTime) }}</span>
            <div class="actions">
              <el-button 
                type="text" 
                size="small"
                @click="$emit('reply', { ...comment, replyTo: reply.user })"
              >
                回复
              </el-button>
            </div>
          </div>
        </div>
        <div v-if="comment.replyCount > comment.replies.length" class="more-replies">
          <el-button type="text" @click="loadMoreReplies(comment.id)">
            查看更多回复 ({{ comment.replyCount - comment.replies.length }})
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { UserFilled, ThumbsUp, ChatDotRound, Delete } from '@element-plus/icons-vue'
import { format } from 'date-fns'

export default {
  name: 'CommentItem',
  components: {
    UserFilled,
    ThumbsUp,
    ChatDotRound,
    Delete
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  emits: ['reply', 'like', 'delete'],
  setup(props) {
    const store = useStore()
    
    const currentUser = computed(() => store.getters['user/currentUser'])
    const canDelete = computed(() => {
      return currentUser.value && (
        currentUser.value.id === props.comment.user.id || 
        currentUser.value.isAdmin
      )
    })

    const formatTime = (time) => {
      if (!time) return ''
      return format(new Date(time), 'yyyy-MM-dd HH:mm')
    }

    const loadMoreReplies = async (commentId) => {
      try {
        await store.dispatch('comment/loadMoreReplies', commentId)
      } catch (error) {
        ElMessage.error('加载回复失败')
      }
    }

    return {
      canDelete,
      formatTime,
      loadMoreReplies
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-item {
  padding: 20px;
  border-bottom: 1px solid var(--comment-border);
  background-color: var(--comment-bg);
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--comment-hover-bg);
  }

  .comment-header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 12px;
    }

    .user-info {
      flex: 1;

      .username {
        font-weight: 500;
        color: var(--comment-text);
        margin-bottom: 4px;
      }

      .meta-info {
        font-size: 12px;
        color: var(--comment-text-light);

        .rating {
          margin-right: 10px;
          color: var(--el-color-warning);
        }

        .time {
          color: var(--comment-text-light);
        }
      }
    }
  }

  .comment-content {
    margin-left: 52px;

    .text {
      color: var(--comment-text);
      line-height: 1.6;
      margin-bottom: 15px;
      word-break: break-all;
    }

    .actions {
      display: flex;
      gap: 15px;

      .action-item {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--comment-action);
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: var(--comment-action-hover);
        }

        &.active {
          color: var(--comment-action-active);
        }

        .count {
          font-size: 12px;
        }
      }
    }
  }

  .reply-list {
    margin: 15px 0 0 52px;
    padding: 15px;
    background-color: var(--comment-reply-bg);
    border-radius: 4px;

    .reply-item {
      padding: 10px 0;
      border-bottom: 1px solid var(--comment-divider);

      &:last-child {
        border-bottom: none;
      }

      .reply-header {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        .username {
          font-weight: 500;
          color: var(--comment-text);
        }

        .reply-to {
          margin: 0 8px;
          color: var(--comment-text-light);
        }

        .time {
          font-size: 12px;
          color: var(--comment-text-light);
        }
      }

      .reply-content {
        color: var(--comment-text);
        line-height: 1.6;
      }
    }
  }
}
</style> 