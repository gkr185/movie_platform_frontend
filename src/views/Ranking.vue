<template>
  <div class="ranking-page">
    <!-- 页面头部 -->
    <div class="ranking-header">
      <div class="header-content">
        <h1 class="page-title">
          <el-icon class="title-icon"><TrendCharts /></el-icon>
          排行榜
        </h1>
        <p class="page-subtitle">发现最热门和最受推荐的精彩电影</p>
      </div>
      <div class="header-decoration">
        <div class="decoration-item"></div>
        <div class="decoration-item"></div>
        <div class="decoration-item"></div>
      </div>
    </div>

    <!-- 排行榜内容 -->
  <div class="ranking-container">
      <el-tabs 
        v-model="activeTab" 
        @tab-click="handleTabClick"
        class="ranking-tabs"
        type="card"
      >
      <el-tab-pane label="热门榜" name="hot">
          <template #label>
            <div class="tab-label">
              <el-icon><Fire /></el-icon>
              <span>热门榜</span>
            </div>
          </template>
          <div class="tab-content">
            <ranking-list :list="hotList" type="hot" :loading="loading" @movie-click="handleMovieClick" />
          </div>
      </el-tab-pane>
        
      <el-tab-pane label="推荐榜" name="recommended">
          <template #label>
            <div class="tab-label">
              <el-icon><Star /></el-icon>
              <span>推荐榜</span>
            </div>
          </template>
          <div class="tab-content">
            <ranking-list :list="recommendedList" type="recommended" :loading="loading" @movie-click="handleMovieClick" />
          </div>
      </el-tab-pane>
        
      <el-tab-pane label="观看排行榜" name="view">
          <template #label>
            <div class="tab-label">
              <el-icon><VideoPlay /></el-icon>
              <span>观看榜</span>
            </div>
          </template>
          <div class="tab-content">
        <view-ranking-list 
          title="观看排行榜"
          :is-compact="false"
          :show-header="false"
          @movie-click="handleMovieClick"
        />
          </div>
      </el-tab-pane>
    </el-tabs>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { TrendCharts, Fire, Star, VideoPlay } from '@element-plus/icons-vue'
import RankingList from '@/components/RankingList.vue'
import ViewRankingList from '@/components/ViewRankingList.vue'
import { getHotMovies, getRecommendedMovies } from '@/api/movie'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'Ranking',
  components: {
    RankingList,
    ViewRankingList,
    TrendCharts,
    Fire,
    Star,
    VideoPlay
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const activeTab = ref(route.query.tab || 'hot')
    const loading = ref(false)
    const hotList = ref([])
    const recommendedList = ref([])

    // 获取排行榜数据
    const fetchRankingList = async (type) => {
      loading.value = true
      try {
        let movieList
        if (type === 'hot') {
          movieList = await getHotMovies()
          console.log('热门电影原始数据:', movieList)
          
          if (Array.isArray(movieList)) {
            hotList.value = movieList.map((movie, index) => ({
              id: movie.id,
              title: movie.title,
              cover: movie.posterUrl || movie.cover || '',
              score: Number(movie.rating) || 0,
              rank: index + 1,
              playCount: Number(movie.playCount) || 0,
              year: movie.year || (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : '未知'),
              category: movie.category || (movie.genres ? movie.genres.split(',')[0] : '未分类'),
              needVip: Boolean(movie.isVip === 1 || movie.needVip === true)
            }))
            console.log('处理后的热门电影数据:', hotList.value)
          } else {
            console.error('热门电影数据格式错误:', movieList)
            hotList.value = []
          }
        } else {
          movieList = await getRecommendedMovies()
          console.log('推荐电影原始数据:', movieList)
          
          if (Array.isArray(movieList)) {
            recommendedList.value = movieList.map((movie, index) => ({
              id: movie.id,
              title: movie.title,
              cover: movie.posterUrl || movie.cover || '',
              score: Number(movie.rating) || 0,
              rank: index + 1,
              rating: Number(movie.rating) || 0,
              year: movie.year || (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : '未知'),
              category: movie.category || (movie.genres ? movie.genres.split(',')[0] : '未分类'),
              needVip: Boolean(movie.isVip === 1 || movie.needVip === true)
            }))
            console.log('处理后的推荐电影数据:', recommendedList.value)
          } else {
            console.error('推荐电影数据格式错误:', movieList)
            recommendedList.value = []
          }
        }

        // 打印转换后的数据
        const currentList = type === 'hot' ? hotList.value : recommendedList.value
        console.log(`${type}排行榜数据:`, currentList)
        console.log(`${type}排行榜数据长度:`, currentList.length)
      } catch (error) {
        console.error('获取排行榜数据失败:', error)
        ElMessage.error('获取排行榜数据失败')
        // 出错时设置为空数组
        if (type === 'hot') {
          hotList.value = []
        } else {
          recommendedList.value = []
        }
      } finally {
        loading.value = false
      }
    }

    const handleTabClick = (tab) => {
      activeTab.value = tab.props.name
      if (tab.props.name !== 'view') {
        fetchRankingList(tab.props.name)
      }
    }

    // 处理电影点击事件
    const handleMovieClick = (movie) => {
      router.push(`/movie/${movie.id}`)
    }

    onMounted(() => {
      if (activeTab.value !== 'view') {
        fetchRankingList(activeTab.value)
      }
    })

    return {
      activeTab,
      loading,
      hotList,
      recommendedList,
      handleTabClick,
      handleMovieClick
    }
  }
}
</script>

<style lang="scss" scoped>
.ranking-page {
  min-height: 100vh;
  background: var(--ranking-bg);
  padding-bottom: 40px;
}

.ranking-header {
  position: relative;
  background: var(--ranking-header-gradient);
  color: white;
  padding: 60px 0 80px;
  margin-bottom: -40px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    opacity: var(--ranking-header-pattern-opacity);
  }

  .header-content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;

    .page-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      font-size: 48px;
      font-weight: 700;
      margin: 0 0 16px;
      text-shadow: var(--ranking-header-text-shadow);

      .title-icon {
        font-size: 52px;
        color: rgba(255, 255, 255, 0.9);
      }
    }

    .page-subtitle {
      font-size: 18px;
      margin: 0;
      opacity: 0.9;
      font-weight: 300;
    }
  }

  .header-decoration {
    position: absolute;
    top: 20px;
    right: 60px;
    display: flex;
    gap: 8px;
    opacity: 0.3;

    .decoration-item {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      animation: float 3s ease-in-out infinite;

      &:nth-child(2) {
        animation-delay: 0.5s;
      }

      &:nth-child(3) {
        animation-delay: 1s;
      }
    }
  }
}

.ranking-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 3;

  :deep(.ranking-tabs) {
    background: var(--ranking-tab-bg);
    border-radius: 12px;
    box-shadow: var(--ranking-card-shadow);
    overflow: hidden;

    .el-tabs__header {
      margin: 0;
      background: var(--ranking-tab-bg);
      border-bottom: 1px solid var(--ranking-border);

      .el-tabs__nav {
        border: none;
        border-radius: 0;

        .el-tabs__item {
          border: none;
          border-radius: 0;
          background: transparent;
          color: var(--ranking-meta-color);
          font-weight: 500;
          transition: all 0.3s ease;
          margin-right: 2px;

          &:hover {
            background: var(--ranking-card-hover-bg);
            color: var(--ranking-title-color);
          }

          &.is-active {
            background: var(--el-color-primary);
            color: white;
            
            .tab-label .el-icon {
              animation: bounce 0.6s ease;
            }
          }
        }
      }
    }

    .el-tabs__content {
      padding: 0;
    }
  }

  .tab-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;

    .el-icon {
      font-size: 18px;
      transition: transform 0.3s ease;
    }
  }

  .tab-content {
    padding: 30px;
    background: var(--ranking-tab-bg);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .ranking-header {
    padding: 40px 0 60px;
    margin-bottom: -30px;

    .header-content {
      .page-title {
        font-size: 36px;
        
        .title-icon {
          font-size: 40px;
        }
      }

      .page-subtitle {
        font-size: 16px;
      }
    }

    .header-decoration {
      display: none;
    }
  }

  .ranking-container {
    padding: 0 15px;

    .tab-content {
      padding: 20px 15px;
    }

    :deep(.ranking-tabs) {
      .tab-label {
        font-size: 14px;
        
        span {
          display: none;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .ranking-header {
    .header-content {
      .page-title {
        font-size: 28px;
        
        .title-icon {
          font-size: 32px;
        }
      }

      .page-subtitle {
        font-size: 14px;
      }
    }
  }

  .ranking-container {
    .tab-content {
      padding: 15px 10px;
    }
  }
}

// 动画
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-3px);
  }
  60% {
    transform: translateY(-2px);
  }
}
</style> 