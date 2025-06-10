<template>
  <div class="movie-detail" v-loading="loading">
    <template v-if="movie">
      <!-- 电影基本信息 -->
      <div class="movie-header">
        <div class="movie-poster">
          <el-image 
            :src="movie.cover" 
            :alt="movie.title"
            fit="cover"
            :preview-src-list="[movie.cover]"
          >
            <template #error>
              <div class="image-error">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
          <div class="movie-score">
            <div class="score">{{ movie.score }}</div>
            <div class="total">/10</div>
          </div>
        </div>
        
        <div class="movie-info">
          <div class="movie-title">
            <h1>{{ movie.title }}</h1>
            <div class="movie-year">{{ movie.year }}</div>
          </div>
          
          <div class="movie-tags">
            <el-tag 
              v-for="category in movieCategories" 
              :key="category.id"
              size="small"
              class="movie-tag"
              :type="category.parentId === 0 ? '' : 'info'"
            >{{ category.name }}</el-tag>
            <el-tag 
              size="small" 
              type="warning"
              v-if="movie.quality"
            >{{ movie.quality }}</el-tag>
          </div>

          <div class="movie-meta">
            <div class="meta-item">
              <span class="label">导演：</span>
              <span class="value">{{ movie.director || '暂无信息' }}</span>
            </div>
            <div class="meta-item">
              <span class="label">主演：</span>
              <span class="value">{{ movie.actors || '暂无信息' }}</span>
            </div>
            <div class="meta-item">
              <span class="label">类型：</span>
              <span class="value">{{ movie.category || '暂无信息' }}</span>
            </div>
            <div class="meta-item">
              <span class="label">上映时间：</span>
              <span class="value">{{ movie.releaseDate || '暂无信息' }}</span>
            </div>
            <div class="meta-item">
              <span class="label">片长：</span>
              <span class="value">{{ movie.duration || '暂无信息' }}</span>
            </div>
          </div>

          <div class="movie-actions">
            <el-button 
              type="primary" 
              @click="handleWatch"
            >
              <el-icon><VideoPlay /></el-icon>
              立即观看
            </el-button>
            <el-button 
              :type="isFavorite ? 'warning' : 'default'"
              @click="toggleFavorite"
            >
              <el-icon>
                <component :is="isFavorite ? Star : StarFilled" />
              </el-icon>
              {{ isFavorite ? '已收藏' : '收藏' }}
            </el-button>
            <el-button 
              @click="handleShare"
            >
              <el-icon><Share /></el-icon>
              分享
            </el-button>
          </div>

          <div class="movie-desc">
            <h3>剧情简介</h3>
            <p>{{ movie.description }}</p>
          </div>
        </div>
      </div>

      
      
      <!-- 评论区 -->
      <div class="movie-comments">
        <div class="section-header">
          <h2>评论区</h2>
        </div>

        <!-- 评论编辑器 -->
        <template v-if="isLoggedIn">
          <comment-editor
            :movie-id="movie.id"
            :reply-to="replyTo"
            @cancel="handleEditorCancel"
            @success="handleEditorSuccess"
          />
        </template>
        <div v-else class="login-tip">
          <el-alert
            title="登录后才能发表评论"
            type="info"
            :closable="false"
          >
            <template #default>
              <router-link to="/user/login" class="login-link">
                立即登录
              </router-link>
            </template>
          </el-alert>
        </div>

        <!-- 评论列表 -->
        <comment-list
          :movie-id="movie.id"
          @reply="handleReply"
        />
      </div>

      <!-- 相关推荐 -->
      <related-movies
        v-if="movie"
        :current-movie="movie"
        :limit="6"
      />

      <!-- 分享对话框 -->
      <el-dialog
        v-model="shareDialogVisible"
        title="分享影片"
        width="400px"
        center
        :append-to-body="true"
        :destroy-on-close="true"
      >
        <div class="share-content">
          <div class="qrcode">
            <!-- 这里可以放二维码组件 -->
          </div>
          <div class="share-links">
            <el-button type="primary" @click="copyLink">复制链接</el-button>
            <el-button type="success" icon="Wechat">微信</el-button>
            <el-button type="danger" icon="Share">微博</el-button>
          </div>
        </div>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { 
  VideoPlay, Star, StarFilled, Share, Picture
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import CommentEditor from '@/components/comment/CommentEditor.vue'
import CommentList from '@/components/comment/CommentList.vue'
import RelatedMovies from '@/components/movie/RelatedMovies.vue'

export default {
  name: 'MovieDetail',
  components: {
    CommentEditor,
    CommentList,
    RelatedMovies,
    VideoPlay,
    Star,
    StarFilled,
    Share,
    Picture
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    
    // 状态
    const loading = ref(true)
    const movie = ref(null)
    const isPlaying = ref(false)
    const shareDialogVisible = ref(false)
    const replyTo = ref(null)
    
    // 计算属性
    const isLoggedIn = computed(() => store.getters['user/isLoggedIn'])
    const isFavorite = computed(() => {
      if (!movie.value) return false
      return store.getters['movie/isFavorite'](movie.value.id)
    })
    const movieCategories = computed(() => {
      if (!movie.value) return []
      const categories = store.getters['category/getMovieCategories'](movie.value.id)
      console.log('Detail组件获取到的分类:', categories)
      return categories || []
    })
    
    // 播放器配置
    const playerOptions = {
      autoplay: false,
      controls: true,
      sources: [{
        type: "video/mp4",
        src: ""
      }]
    }
    
    // 方法
    const fetchMovieDetail = async () => {
      try {
        loading.value = true
        const id = route.params.id
        const movieData = await store.dispatch('movie/fetchMovieDetail', id)
        if (movieData) {
          movie.value = movieData
          // 获取电影分类
          const categories = await store.dispatch('category/fetchMovieCategories', id)
          console.log('Detail组件获取到的分类数据:', categories)
        } else {
          ElMessage.error('电影信息不存在')
          router.push('/404')
        }
      } catch (error) {
        console.error('获取电影信息失败:', error)
        ElMessage.error('获取电影信息失败')
        router.push('/404')
      } finally {
        loading.value = false
      }
    }

    const handleWatch = () => {
      // 直接跳转到播放页，在播放页面再处理登录和VIP权限
      router.push(`/movie/${movie.value.id}/play`)
    }

    const toggleFavorite = async () => {
      if (!isLoggedIn.value) {
        ElMessageBox.confirm(
          '登录后即可收藏喜欢的影片，是否立即登录？',
          '提示',
          {
            confirmButtonText: '立即登录',
            cancelButtonText: '暂不登录',
            type: 'info'
          }
        )
          .then(() => {
            router.push({
              path: '/user/login',
              query: { redirect: route.fullPath }
            })
          })
          .catch(() => {})
        return
      }
      
      try {
        if (isFavorite.value) {
          await store.dispatch('movie/removeFromFavorites', movie.value.id)
          ElMessage.success('已取消收藏')
        } else {
          await store.dispatch('movie/addToFavorites', movie.value)
          ElMessage.success('收藏成功')
        }
      } catch (error) {
        ElMessage.error('操作失败，请重试')
      }
    }

    const handleShare = () => {
      shareDialogVisible.value = true
    }

    const copyLink = () => {
      const link = window.location.href
      navigator.clipboard.writeText(link)
      ElMessage.success('链接已复制')
    }

    const handleReply = (comment) => {
      replyTo.value = comment
    }

    const handleEditorCancel = () => {
      replyTo.value = null
    }

    const handleEditorSuccess = () => {
      replyTo.value = null
    }

    // 生命周期钩子
    onMounted(() => {
      fetchMovieDetail()
    })

    onUnmounted(() => {
      // 清理组件状态
      movie.value = null
      loading.value = false
      shareDialogVisible.value = false
      replyTo.value = null
    })

    return {
      movie,
      loading,
      isPlaying,
      shareDialogVisible,
      isLoggedIn,
      isFavorite,
      movieCategories,
      replyTo,
      playerOptions,
      VideoPlay,
      Star,
      StarFilled,
      Share,
      handleWatch,
      toggleFavorite,
      handleShare,
      copyLink,
      handleReply,
      handleEditorCancel,
      handleEditorSuccess
    }
  }
}
</script>

<style lang="scss" scoped>
.movie-detail {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  color: var(--text-color);
  background-color: var(--movie-detail-bg);

  .movie-header {
    display: flex;
    gap: 30px;
    margin-bottom: 40px;
  }

  .movie-poster {
    flex-shrink: 0;
    width: 300px;
    position: relative;
    
    .el-image {
      width: 100%;
      height: 450px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: var(--movie-poster-shadow);
    }

    .image-error {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--input-bg-color);
      
      .el-icon {
        font-size: 48px;
        color: var(--text-color-light);
      }
    }

    .movie-score {
      position: absolute;
      right: -20px;
      top: 20px;
      background: var(--movie-score-bg);
      color: white;
      padding: 10px 15px;
      border-radius: 4px;
      box-shadow: var(--movie-poster-shadow);

      .score {
        font-size: 24px;
        font-weight: bold;
      }

      .total {
        font-size: 12px;
        opacity: 0.8;
      }
    }
  }

  .movie-info {
    flex: 1;

    .movie-title {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 20px;

      h1 {
        margin: 0;
        font-size: 28px;
        color: var(--text-color);
      }

      .movie-year {
        color: var(--text-color-light);
        font-size: 18px;
      }
    }

    .movie-tags {
      margin-bottom: 20px;

      .movie-tag {
        margin-right: 10px;
      }
    }
  }

  .movie-meta {
    margin-bottom: 30px;

    .meta-item {
      margin-bottom: 12px;
      display: flex;
      align-items: flex-start;

      .label {
        width: 80px;
        color: var(--text-color-light);
      }

      .value {
        flex: 1;
        color: var(--text-color);
      }
    }
  }

  .movie-actions {
    margin-bottom: 30px;
    display: flex;
    gap: 15px;

    .el-button {
      padding: 12px 24px;
    }
  }

  .movie-desc {
    h3 {
      margin-bottom: 15px;
      font-size: 18px;
      color: var(--text-color);
    }
    
    p {
      color: var(--text-color-light);
      line-height: 1.8;
      text-align: justify;
    }
  }

  .movie-player {
    margin-bottom: 40px;
    background: #000;
    border-radius: 8px;
    overflow: hidden;
  }

  .movie-comments {
    margin-top: 40px;
    padding: 30px;
    background-color: var(--movie-section-bg);
    border-radius: 8px;
    box-shadow: var(--movie-section-shadow);

    .section-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      h2 {
        margin: 0;
        font-size: 20px;
        color: var(--text-color);
      }
    }

    .login-tip {
      margin-bottom: 30px;

      .login-link {
        color: var(--el-color-primary);
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

.share-content {
  text-align: center;

  .qrcode {
    margin-bottom: 20px;
    padding: 20px;
    background: var(--input-bg-color);
    border-radius: 4px;
  }

  .share-links {
    display: flex;
    justify-content: center;
    gap: 15px;
  }
}

// 深色模式适配
html[data-theme='dark'] {
  .movie-detail {
    .image-error {
      background-color: var(--el-fill-color-darker);
    }
  }
}
</style> 