<template>
  <div class="comment-list">
    <!-- 评论统计 -->
    <div class="comment-stats">
      <h3>全部评论 ({{ total }})</h3>
      <el-select v-model="sortBy" size="small" @change="handleSortChange">
        <el-option label="最新" value="newest" />
        <el-option label="最热" value="hottest" />
        <el-option label="评分从高到低" value="score-desc" />
        <el-option label="评分从低到高" value="score-asc" />
      </el-select>
    </div>

    <!-- 评论列表 -->
    <div v-if="comments.length" class="comment-items">
      <comment-item
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        @reply="handleReply"
        @like="handleLike"
        @delete="handleDelete"
      />
    </div>
    <el-empty v-else description="暂无评论" />

    <!-- 分页 -->
    <div class="pagination-wrapper" v-if="total > pageSize">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import CommentItem from './CommentItem.vue'

export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    movieId: {
      type: [String, Number],
      required: true
    }
  },
  emits: ['reply'],
  setup(props, { emit }) {
    const store = useStore()
    const currentPage = ref(1)
    const pageSize = ref(10)
    const sortBy = ref('newest')
    
    const comments = computed(() => store.getters['comment/commentList'])
    const total = computed(() => store.getters['comment/total'])
    const isLoggedIn = computed(() => store.getters['user/isLoggedIn'])

    // 获取评论列表
    const fetchComments = async () => {
      try {
        await store.dispatch('comment/fetchComments', {
          movieId: props.movieId,
          page: currentPage.value,
          pageSize: pageSize.value,
          sortBy: sortBy.value
        })
      } catch (error) {
        ElMessage.error('获取评论失败')
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
        ElMessage.success('操作成功')
      } catch (error) {
        ElMessage.error('操作失败')
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
        fetchComments()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除失败')
        }
      }
    }

    // 处理排序方式改变
    const handleSortChange = () => {
      currentPage.value = 1
      fetchComments()
    }

    // 处理页码改变
    const handleCurrentChange = () => {
      fetchComments()
    }

    // 处理每页条数改变
    const handleSizeChange = () => {
      currentPage.value = 1
      fetchComments()
    }

    // 初始加载
    fetchComments()

    return {
      currentPage,
      pageSize,
      sortBy,
      comments,
      total,
      handleReply,
      handleLike,
      handleDelete,
      handleSortChange,
      handleCurrentChange,
      handleSizeChange
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-list {
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--comment-border);

    .total {
      font-size: 14px;
      color: var(--text-color-light);
    }

    .sort-options {
      display: flex;
      gap: 15px;

      .sort-item {
        color: var(--comment-action);
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: var(--comment-action-hover);
        }

        &.active {
          color: var(--comment-action-active);
          font-weight: 500;
        }
      }
    }
  }

  .empty-tip {
    text-align: center;
    padding: 40px 0;
    color: var(--text-color-light);
  }

  .load-more {
    text-align: center;
    margin-top: 20px;
  }

  .comment-items {
    .comment-item {
      &:last-child {
        border-bottom: none;
      }
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
}
</style> 