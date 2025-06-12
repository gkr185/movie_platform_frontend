<template>
  <div class="comment-list">
    <div class="comment-header">
      <h3 class="title">评论 ({{ total }})</h3>
      <el-button 
        type="text"
        @click="scrollToEditor"
      >
        写评论
      </el-button>
    </div>
    
    <div class="comment-editor-section" ref="editor">
      <comment-editor
        :movie-id="movieId"
        @success="handleCommentSuccess"
      />
    </div>
    
    <div v-loading="loading" class="comment-list-content">
      <template v-if="comments.length">
        <comment-item
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          :movie-id="movieId"
          @reply-success="handleCommentSuccess"
          @delete-success="handleCommentSuccess"
        />
        
        <div class="pagination-wrapper">
          <el-pagination
            background
            layout="prev, pager, next"
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            @current-change="handlePageChange"
          />
        </div>
      </template>
      
      <el-empty
        v-else-if="!loading"
        description="暂无评论"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CommentEditor from './CommentEditor.vue'
import CommentItem from './CommentItem.vue'

export default {
  name: 'CommentList',
  
  components: {
    CommentEditor,
    CommentItem
  },
  
  props: {
    movieId: {
      type: [Number, String],
      required: true,
      validator(value) {
        if (!value) {
          console.error('[CommentList] movieId is required but got:', value)
          return false
        }
        return true
      }
    }
  },
  
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      error: null,
      isInitialized: false
    }
  },
  
  computed: {
    ...mapGetters('comment', [
      'commentsList',
      'commentsTotal',
      'commentsLoading'
    ]),
    
    comments() {
      return this.commentsList
    },
    
    total() {
      return this.commentsTotal
    },
    
    loading() {
      return this.commentsLoading
    }
  },
  
  watch: {
    movieId: {
      handler(newId, oldId) {
        console.log('[CommentList] movieId changed:', { newId, oldId })
        if (newId !== oldId || !this.isInitialized) {
          this.resetAndFetch()
        }
      },
      immediate: true
    }
  },

  created() {
    console.log('[CommentList] Component created for movieId:', this.movieId)
  },
  
  methods: {
    async fetchComments() {
      console.log('[CommentList] Fetching comments:', {
        movieId: this.movieId,
        page: this.currentPage,
        size: this.pageSize
      })

      try {
        await this.$store.dispatch('comment/fetchComments', {
          movieId: this.movieId,
          page: this.currentPage,
          size: this.pageSize
        })
        
        console.log('[CommentList] Comments fetched successfully:', {
          total: this.total,
          count: this.comments.length
        })
        
        this.isInitialized = true
        this.error = null
      } catch (error) {
        console.error('[CommentList] Failed to fetch comments:', error)
        this.error = error.message || '获取评论失败'
        this.$message.error(this.error)
      }
    },
    
    handlePageChange(page) {
      console.log('[CommentList] Page changed to:', page)
      this.currentPage = page
      this.fetchComments()
      // 滚动到评论列表顶部
      this.$el.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    },
    
    handleCommentSuccess() {
      console.log('[CommentList] New comment submitted, refreshing list')
      this.currentPage = 1
      this.fetchComments()
    },
    
    scrollToEditor() {
      console.log('[CommentList] Scrolling to editor')
      this.$refs.editor?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    },

    resetAndFetch() {
      console.log('[CommentList] Resetting state and fetching new comments')
      this.currentPage = 1
      this.error = null
      this.isInitialized = false
      this.fetchComments()
    }
  },

  beforeUnmount() {
    console.log('[CommentList] Component unmounting')
    if (!this.isInitialized) {
      console.warn('[CommentList] Component unmounted before initialization completed')
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-list {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  
  .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .title {
      font-size: 18px;
      font-weight: 500;
      margin: 0;
    }
  }
  
  .comment-list-content {
    min-height: 200px;
  }
  
  .pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>
