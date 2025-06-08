<template>
  <div class="comment-list">
    <!-- 排序选项 -->
    <div class="sort-options">
      <el-radio-group v-model="sortBy" size="small" @change="handleSortChange">
        <el-radio-button label="newest">最新</el-radio-button>
        <el-radio-button label="hottest">最热</el-radio-button>
        <el-radio-button label="score-desc">评分从高到低</el-radio-button>
        <el-radio-button label="score-asc">评分从低到高</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 评论列表 -->
    <div class="list-content" v-loading="loading">
      <template v-if="commentList.length">
        <comment-item
          v-for="comment in commentList"
          :key="comment.id"
          :comment="comment"
          @reply="handleReply"
        />
        
        <!-- 分页 -->
        <div class="pagination-wrapper">
          <el-pagination
            v-if="total > pageSize"
            v-model:currentPage="currentPage"
            :page-size="pageSize"
            :total="total"
            layout="prev, pager, next"
            @current-change="handlePageChange"
          />
        </div>
      </template>
      <el-empty v-else description="暂无评论" />
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
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
    
    const loading = computed(() => store.getters['comment/loading'])
    const commentList = computed(() => store.getters['comment/commentList'])
    const total = computed(() => store.getters['comment/total'])
    const isLoggedIn = computed(() => store.getters['user/isLoggedIn'])

    // 加载评论
    const loadComments = async () => {
      try {
        await store.dispatch('comment/fetchComments', {
          movieId: props.movieId,
          page: currentPage.value,
          pageSize: pageSize.value,
          sortBy: sortBy.value
        })
      } catch (error) {
        console.error('加载评论失败:', error)
      }
    }

    // 处理页码变化
    const handlePageChange = (page) => {
      currentPage.value = page
    }

    // 处理排序方式变化
    const handleSortChange = () => {
      currentPage.value = 1
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
        loadComments()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除失败')
        }
      }
    }

    // 监听分页和排序变化
    watch([currentPage, sortBy], () => {
      loadComments()
    })

    // 监听电影ID变化
    watch(() => props.movieId, () => {
      currentPage.value = 1
      sortBy.value = 'newest'
      loadComments()
    })

    // 组件挂载时加载评论
    onMounted(() => {
      loadComments()
    })

    return {
      currentPage,
      pageSize,
      sortBy,
      loading,
      commentList,
      total,
      handlePageChange,
      handleSortChange,
      handleReply,
      handleLike,
      handleDelete
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-list {
  .sort-options {
    margin-bottom: 20px;
  }

  .list-content {
    min-height: 200px;
  }

  .pagination-wrapper {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style> 