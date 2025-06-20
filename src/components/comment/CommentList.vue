<template>
  <div class="comment-list">
    <div class="comment-header">
      <h3 class="comment-title">
        评论 
        <span class="comment-count">({{ total }})</span>
      </h3>
      <el-button 
        type="primary" 
        size="small"
        @click="showEditor = true"
        :disabled="loading"
      >
        写评论
      </el-button>
    </div>

    <div v-if="showEditor" class="comment-editor-wrapper">
      <CommentEditor
        :movie-id="movieId"
        @submit="handleCommentSubmit"
        @cancel="showEditor = false"
      />
    </div>

    <div v-if="loading" class="comment-loading">
      <el-skeleton :rows="3" animated />
    </div>

    <div v-else-if="comments.length === 0" class="comment-empty">
      <el-empty description="暂无评论" />
    </div>

    <div v-else class="comment-items">
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        :movie-id="movieId"
      />
    </div>

    <div class="comment-pagination" v-if="total > pageSize">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import CommentItem from './CommentItem.vue'
import CommentEditor from './CommentEditor.vue'

export default {
  name: 'CommentList',
  
  components: {
    CommentItem,
    CommentEditor
  },

  props: {
    movieId: {
      type: [String, Number],
      required: true
    }
  },

  emits: ['update:currentPage', 'update:pageSize'],

  setup(props, { emit }) {
    const store = useStore()
    const showEditor = ref(false)
    
    // 从 store 获取状态
    const comments = computed(() => store.getters['comment/commentsList'])
    const total = computed(() => store.getters['comment/commentsTotal'])
    const loading = computed(() => store.getters['comment/commentsLoading'])
    const currentPage = computed({
      get: () => store.getters['comment/currentPage'],
      set: (val) => {
        store.commit('comment/SET_PAGE', { currentPage: val, pageSize: pageSize.value })
        emit('update:currentPage', val)
      }
    })
    const pageSize = computed({
      get: () => store.getters['comment/pageSize'],
      set: (val) => {
        store.commit('comment/SET_PAGE', { currentPage: currentPage.value, pageSize: val })
        emit('update:pageSize', val)
      }
    })

    // 获取评论列表
    const fetchComments = async () => {
      try {
        await store.dispatch('comment/fetchComments', {
          movieId: props.movieId,
          page: currentPage.value,
          pageSize: pageSize.value
        })
      } catch (error) {
        console.error('获取评论列表失败:', error)
      }
    }

    // 监听分页变化
    watch([currentPage, pageSize], () => {
      fetchComments()
    })

    // 处理评论提交
    const handleCommentSubmit = async (comment) => {
      try {
        await store.dispatch('comment/submitComment', {
          ...comment,
          movieId: props.movieId
        })
        showEditor.value = false
        // 如果不是第一页，跳转到第一页
        if (currentPage.value !== 1) {
          currentPage.value = 1
        } else {
          fetchComments()
        }
      } catch (error) {
        console.error('提交评论失败:', error)
      }
    }

    // 分页处理
    const handleSizeChange = (val) => {
      pageSize.value = val
      if (currentPage.value !== 1) {
        currentPage.value = 1
      }
    }

    const handleCurrentChange = (val) => {
      currentPage.value = val
    }

    onMounted(() => {
      fetchComments()
    })

    return {
      comments,
      total,
      loading,
      showEditor,
      currentPage,
      pageSize,
      handleCommentSubmit,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-list {
  background: var(--comment-bg);
  border: 1px solid var(--comment-border);
  border-radius: 20px;
  padding: 30px;
  box-shadow: var(--vip-card-shadow);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  // 装饰性渐变背景
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
    box-shadow: var(--vip-card-hover-shadow);

    &::before {
      opacity: 1;
    }
  }

  .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid var(--comment-divider);
    position: relative;

    // 装饰性底部渐变线
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--el-color-primary), var(--el-color-success), transparent);
      opacity: 0.6;
    }

    .comment-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--comment-text);
      margin: 0;
      display: flex;
      align-items: center;
      gap: 12px;

      // 图标装饰
      &::before {
        content: '💬';
        font-size: 1.25rem;
        display: inline-block;
      }

      .comment-count {
        font-size: 0.875rem;
        color: var(--comment-text-light);
        font-weight: 500;
        padding: 4px 12px;
        background: var(--input-bg-color);
        border-radius: 12px;
        border: 1px solid var(--border-color);
      }
    }

    .el-button {
      height: 44px;
      padding: 0 20px;
      border-radius: 12px;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(64, 158, 255, 0.3);
      }
    }
  }

  .comment-editor-wrapper {
    margin-bottom: 30px;
    padding: 20px;
    background: var(--comment-editor-bg);
    border: 2px solid var(--comment-editor-border);
    border-radius: 16px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    // 装饰性渐变边框
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-success));
      opacity: 0;
      border-radius: 16px;
      z-index: -1;
      transition: opacity 0.3s;
    }

    &:hover {
      border-color: var(--el-color-primary);
      box-shadow: 0 8px 30px rgba(64, 158, 255, 0.15);
      transform: translateY(-2px);

      &::before {
        opacity: 0.03;
      }
    }

    &:focus-within {
      border-color: var(--el-color-primary);
      box-shadow: 0 0 0 4px rgba(64, 158, 255, 0.1);

      &::before {
        opacity: 0.05;
      }
    }
  }

  .comment-loading {
    padding: 40px 0;
    text-align: center;

    .el-loading-spinner {
      .circular {
        width: 50px;
        height: 50px;
      }
    }
  }

  .comment-empty {
    padding: 60px 0;
    text-align: center;
    color: var(--comment-text-light);

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 20px;
      opacity: 0.5;
    }

    .empty-text {
      font-size: 1.125rem;
      font-weight: 500;
      margin-bottom: 10px;
    }

    .empty-subtitle {
      font-size: 0.875rem;
      opacity: 0.7;
    }
  }

  .comment-items {
    position: relative;

    > :not(:last-child) {
      margin-bottom: 24px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--comment-divider);
      position: relative;

      // 装饰性分隔线
      &::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--el-color-primary-light-8), transparent);
        opacity: 0.5;
      }
    }
  }

  .comment-pagination {
    margin-top: 30px;
    padding-top: 25px;
    border-top: 2px solid var(--comment-divider);
    display: flex;
    justify-content: center;
    position: relative;

    // 装饰性顶部渐变线
    &::before {
      content: '';
      position: absolute;
      top: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--el-color-primary), var(--el-color-success), transparent);
      opacity: 0.3;
    }

    :deep(.el-pagination) {
      .el-pager {
        li {
          border-radius: 8px;
          margin: 0 2px;
          transition: all 0.3s;

          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
          }

          &.is-active {
            background: var(--el-color-primary);
            color: white;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
          }
        }
      }

      .btn-prev,
      .btn-next {
        border-radius: 8px;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
        }
      }

      .el-select {
        .el-select__wrapper {
          border-radius: 8px;
          transition: all 0.3s;

          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);
          }
        }
      }
    }
  }
}

// 新增动画效果
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.comment-list {
  animation: fadeInUp 0.5s ease-out;
}

.comment-items > * {
  animation: fadeInUp 0.3s ease-out;
  animation-fill-mode: both;
}

.comment-items > *:nth-child(1) { animation-delay: 0.1s; }
.comment-items > *:nth-child(2) { animation-delay: 0.2s; }
.comment-items > *:nth-child(3) { animation-delay: 0.3s; }
.comment-items > *:nth-child(4) { animation-delay: 0.4s; }
.comment-items > *:nth-child(5) { animation-delay: 0.5s; }

// 响应式设计
@media (max-width: 768px) {
  .comment-list {
    padding: 20px;
    border-radius: 16px;

    .comment-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 24px;
      padding-bottom: 16px;

      .comment-title {
        font-size: 1.25rem;

        .comment-count {
          font-size: 0.75rem;
          padding: 3px 8px;
        }
      }

      .el-button {
        width: 100%;
        height: 40px;
      }
    }

    .comment-editor-wrapper {
      margin-bottom: 24px;
      padding: 16px;
      border-radius: 12px;
    }

    .comment-items {
      > :not(:last-child) {
        margin-bottom: 20px;
        padding-bottom: 20px;
      }
    }

    .comment-pagination {
      margin-top: 24px;
      padding-top: 20px;

      :deep(.el-pagination) {
        justify-content: center;
        flex-wrap: wrap;
        gap: 8px;
      }
    }
  }
}

@media (max-width: 480px) {
  .comment-list {
    padding: 16px;
    border-radius: 12px;

    .comment-header {
      margin-bottom: 20px;
      padding-bottom: 12px;

      .comment-title {
        font-size: 1.125rem;
        gap: 8px;

        &::before {
          font-size: 1rem;
        }

        .comment-count {
          font-size: 0.7rem;
          padding: 2px 6px;
        }
      }

      .el-button {
        height: 36px;
        font-size: 0.875rem;
      }
    }

    .comment-editor-wrapper {
      margin-bottom: 20px;
      padding: 12px;
    }

    .comment-empty {
      padding: 40px 0;

      .empty-icon {
        font-size: 3rem;
        margin-bottom: 16px;
      }

      .empty-text {
        font-size: 1rem;
      }

      .empty-subtitle {
        font-size: 0.8rem;
      }
    }

    .comment-items {
      > :not(:last-child) {
        margin-bottom: 16px;
        padding-bottom: 16px;
      }
    }

    .comment-pagination {
      margin-top: 20px;
      padding-top: 16px;

      :deep(.el-pagination) {
        .el-pager li,
        .btn-prev,
        .btn-next {
          width: 32px;
          height: 32px;
          min-width: 32px;
          font-size: 0.875rem;
        }
      }
    }
  }
}
</style>
