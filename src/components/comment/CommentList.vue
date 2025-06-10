<template>
  <div class="comment-list">
    <!-- 评论数量统计 -->
    <div class="comment-count">
      <div class="count-info">
        <el-icon><ChatRound /></el-icon>
        <span class="count-text">
          共 <span class="count-number">{{ total }}</span> 条评论
        </span>
      </div>
      <div class="sort-info" v-if="!isCollapsed">
        <el-tag size="small" type="info" effect="plain">
          按最新排序
        </el-tag>
      </div>
    </div>

    <!-- 评论列表 -->
    <div 
      class="comments-container"
      :class="{ 'is-collapsed': isCollapsed }"
      ref="commentsContainer"
      v-loading="loading"
    >
      <div class="comments-wrapper">
        <comment-item
          v-for="comment in commentList"
          :key="comment.id"
          :comment="comment"
          @reply="handleReply"
          @like="handleLike"
          @delete="handleDelete"
        />
      </div>

      <!-- 展开按钮 -->
      <div 
        class="expand-overlay"
        v-show="showExpandButton"
        @click="expandComments"
      >
        <div class="expand-button">
          <el-icon><ArrowDown /></el-icon>
          展开更多评论 (还有{{ remainingComments }}条)
        </div>
      </div>

      <!-- 收起按钮 -->
      <div 
        v-show="showCollapseButton"
        class="collapse-button"
        @click="collapseComments"
      >
        <el-icon><ArrowUp /></el-icon>
        收起评论
      </div>
    </div>

    <!-- 无评论提示 -->
    <div v-if="!loading && (!commentList || commentList.length === 0)" class="no-comments">
      <el-empty description="暂无评论" />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, ArrowUp, ChatRound } from '@element-plus/icons-vue'
import CommentItem from './CommentItem.vue'

export default {
  name: 'CommentList',
  components: {
    CommentItem,
    ArrowDown,
    ArrowUp,
    ChatRound
  },
  props: {
    movieId: {
      type: [Number, String],
      required: true
    }
  },
  emits: ['reply'],
  setup(props, { emit }) {
    const store = useStore()
    const isCollapsed = ref(true)
    const commentsContainer = ref(null)
    const currentPage = ref(1)
    const pageSize = ref(1) // 修改为默认显示5条评论
    const expandedPageSize = ref(10) // 展开时显示的评论数量

    // 从 store 获取状态
    const loading = computed(() => store.getters['comment/loading'])
    const commentList = computed(() => store.getters['comment/commentList'])
    const total = computed(() => store.getters['comment/total'])
    const isLoggedIn = computed(() => store.getters['user/isLoggedIn'])

    // 是否显示展开按钮
    const showExpandButton = computed(() => {
      return isCollapsed.value && total.value > pageSize.value
    })

    // 是否显示收起按钮
    const showCollapseButton = computed(() => {
      return !isCollapsed.value && total.value > pageSize.value
    })

    // 剩余评论数
    const remainingComments = computed(() => {
      return total.value - pageSize.value
    })

    // 加载评论
    const loadComments = async (page = 1, size = pageSize.value) => {
      try {
        await store.dispatch('comment/fetchComments', {
          movieId: props.movieId,
          page,
          pageSize: size,
          sortBy: 'newest'
        })
      } catch (error) {
        console.error('加载评论失败:', error)
        ElMessage.error('加载评论失败')
      }
    }

    // 展开评论
    const expandComments = async () => {
      if (loading.value) return
      try {
        await store.dispatch('comment/fetchComments', {
          movieId: props.movieId,
          page: 1,
          pageSize: expandedPageSize.value,
          sortBy: 'newest'
        })
        isCollapsed.value = false
      } catch (error) {
        console.error('加载更多评论失败:', error)
        ElMessage.error('加载更多评论失败')
      }
    }

    // 处理回复
    const handleReply = (comment) => {
      if (!isLoggedIn.value) {
        ElMessage.warning('请先登录')
        return
      }
      emit('reply', comment)
    }

    // 处理点赞
    const handleLike = async (commentId) => {
      if (!isLoggedIn.value) {
        ElMessage.warning('请先登录')
        return
      }
      try {
        await store.dispatch('comment/likeComment', commentId)
      } catch (error) {
        ElMessage.error('点赞失败')
      }
    }

    // 处理删除
    const handleDelete = async (commentId) => {
      try {
        await ElMessageBox.confirm(
          '确定要删除这条评论吗？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        await store.dispatch('comment/deleteComment', commentId)
        ElMessage.success('删除成功')
        loadComments()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除失败')
        }
      }
    }

    // 收起评论
    const collapseComments = async () => {
      if (loading.value) return
      try {
        await loadComments(1, pageSize.value)
        isCollapsed.value = true
        // 滚动到评论区顶部
        if (commentsContainer.value) {
          commentsContainer.value.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          })
        }
      } catch (error) {
        console.error('收起评论失败:', error)
        ElMessage.error('操作失败')
      }
    }

    // 初始加载
    onMounted(() => {
      loadComments()
    })

    return {
      loading,
      commentList,
      total,
      isCollapsed,
      commentsContainer,
      showExpandButton,
      showCollapseButton,
      remainingComments,
      handleReply,
      handleLike,
      handleDelete,
      expandComments,
      collapseComments,
      pageSize
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-list {
  .comment-count {
    margin-bottom: 20px;
    padding: 16px 20px;
    color: var(--comment-text);
    font-size: 14px;
    background: var(--comment-bg);
    border-radius: 8px;
    box-shadow: var(--card-shadow);
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--movie-section-shadow);
    }

    .count-info {
      display: flex;
      align-items: center;
      gap: 8px;

      .el-icon {
        font-size: 18px;
        color: var(--el-color-primary);
      }

      .count-text {
        color: var(--comment-text);

        .count-number {
          color: var(--el-color-primary);
          font-weight: 600;
          font-size: 16px;
          margin: 0 4px;
        }
      }
    }

    .sort-info {
      .el-tag {
        border-color: var(--comment-border);
        background: var(--comment-bg);
        color: var(--comment-text-light);
      }
    }
  }

  .comments-container {
    position: relative;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 8px;
    background: var(--comment-bg);
    box-shadow: var(--card-shadow);
    border: 1px solid var(--comment-border);

    &.is-collapsed {
      max-height: 280px;
      overflow: hidden;

      .comments-wrapper {
        mask-image: linear-gradient(to bottom, 
          rgba(0, 0, 0, 1) 60%, 
          rgba(0, 0, 0, 0.6) 80%,
          rgba(0, 0, 0, 0) 100%
        );
        -webkit-mask-image: linear-gradient(to bottom, 
          rgba(0, 0, 0, 1) 60%, 
          rgba(0, 0, 0, 0.6) 80%,
          rgba(0, 0, 0, 0) 100%
        );
      }
    }

    .comments-wrapper {
      padding: 20px;
    }
  }

  .expand-overlay {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 120px;
    background: linear-gradient(
      to bottom,
      rgba(var(--bg-color-rgb), 0) 0%,
      var(--comment-bg) 100%
    );
    display: flex;
    align-items: flex-end;
    justify-content: center;
    cursor: pointer;
    transition: opacity 0.3s;

    &:hover {
      .expand-button {
        transform: translateY(-4px);
        box-shadow: var(--card-shadow);
      }
    }
  }

  .expand-button,
  .collapse-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 24px;
    margin-bottom: 20px;
    color: var(--comment-action);
    font-size: 14px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 20px;
    background: var(--comment-bg);
    border: 1px solid var(--comment-border);
    cursor: pointer;

    &:hover {
      color: var(--comment-action-hover);
      background: var(--comment-hover-bg);
      border-color: var(--comment-action-hover);
      transform: translateY(-2px);
      box-shadow: var(--card-shadow);
    }

    &:active {
      transform: translateY(0);
    }

    .el-icon {
      font-size: 16px;
      transition: transform 0.3s;
    }

    &:hover .el-icon {
      transform: translateY(2px);
    }
  }

  .collapse-button {
    margin: 20px auto;
    width: fit-content;
  }

  .no-comments {
    padding: 60px 0;
    text-align: center;
    background: var(--comment-bg);
    border-radius: 8px;
    box-shadow: var(--card-shadow);
    border: 1px solid var(--comment-border);

    :deep(.el-empty) {
      padding: 40px;

      .el-empty__description {
        color: var(--comment-text-light);
      }
    }
  }
}

// 响应式设计
@media screen and (max-width: 768px) {
  .comment-list {
    .comment-count {
      padding: 12px 16px;
      font-size: 13px;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;

      .count-info {
        .count-number {
          font-size: 15px;
        }
      }
    }
  }
}
</style> 
