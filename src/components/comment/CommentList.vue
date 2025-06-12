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
  background-color: var(--comment-bg);
  border-radius: 8px;
  padding: 20px;
  box-shadow: var(--card-shadow);

  .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--comment-divider);

    .comment-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--comment-text);
      margin: 0;

      .comment-count {
        font-size: 14px;
        color: var(--comment-text-light);
        margin-left: 5px;
      }
    }
  }

  .comment-editor-wrapper {
    margin-bottom: 20px;
    padding: 15px;
    background-color: var(--comment-editor-bg);
    border: 1px solid var(--comment-editor-border);
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      border-color: var(--el-color-primary);
      box-shadow: 0 0 8px rgba(var(--el-color-primary-rgb), 0.2);
    }
  }

  .comment-loading {
    padding: 20px 0;
  }

  .comment-empty {
    padding: 40px 0;
    color: var(--comment-text-light);
  }

  .comment-items {
    > :not(:last-child) {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--comment-divider);
    }
  }

  .comment-pagination {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid var(--comment-divider);
    display: flex;
    justify-content: center;
  }
}
</style>
