<template>
  <div class="newest-page">
    <!-- 页面头部 -->
    <div class="newest-header">
      <div class="header-content">
        <h1 class="page-title">
          <el-icon class="title-icon"><Calendar /></el-icon>
          最新更新
        </h1>
        <p class="page-subtitle">探索近期最新上线的精彩影片</p>
      </div>
      <div class="header-decoration">
        <div class="decoration-circle"></div>
        <div class="decoration-circle"></div>
        <div class="decoration-circle"></div>
      </div>
    </div>

    <!-- 最新电影内容 -->
    <div class="newest-container">
      <!-- 筛选栏 -->
      <div class="filter-section">
        <div class="filter-content">
          <div class="filter-info">
            <el-icon class="info-icon"><InfoFilled /></el-icon>
            <span class="filter-text">共找到 {{ total }} 部最新电影</span>
          </div>
          <div class="view-options">
            <el-radio-group v-model="viewMode" size="small">
              <el-radio-button label="grid">
                <el-icon><Grid /></el-icon>
              </el-radio-button>
              <el-radio-button label="list">
                <el-icon><List /></el-icon>
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <div class="movie-skeleton-grid">
          <div v-for="i in 12" :key="i" class="movie-skeleton-card">
            <el-skeleton animated>
              <template #template>
                <el-skeleton-item variant="image" style="width: 100%; height: 280px; border-radius: 12px" />
                <div style="padding: 16px">
                  <el-skeleton-item variant="text" style="width: 80%; margin-bottom: 12px" />
                  <el-skeleton-item variant="text" style="width: 60%; margin-bottom: 8px" />
                  <el-skeleton-item variant="text" style="width: 40%" />
                </div>
              </template>
            </el-skeleton>
          </div>
        </div>
      </div>

      <!-- 电影列表 -->
      <div v-else class="movie-section">
        <div v-if="movieList.length === 0" class="empty-container">
          <el-empty description="暂无最新电影">
            <template #image>
              <div class="empty-image">
                <el-icon size="100"><VideoCamera /></el-icon>
              </div>
            </template>
            <template #description>
              <p class="empty-description">暂时没有最新上映的电影</p>
            </template>
          </el-empty>
        </div>
        
        <div v-else :class="['movie-list', `movie-list-${viewMode}`]">
          <div 
            v-for="movie in movieList" 
            :key="movie.id" 
            class="movie-card"
            @click="handleMovieClick(movie)"
          >
            <div class="movie-poster">
              <div class="image-wrapper">
                <el-image 
                  :src="movie.cover" 
                  fit="cover"
                  loading="lazy"
                  :alt="movie.title"
                  class="movie-image"
                >
                  <template #error>
                    <div class="image-error">
                      <el-icon size="32"><Picture /></el-icon>
                      <span>暂无封面</span>
                    </div>
                  </template>
                </el-image>
                
                <!-- 悬浮遮罩 -->
                <div class="image-overlay">
                  <div class="overlay-content">
                    <el-icon class="play-icon"><VideoPlay /></el-icon>
                    <span class="play-text">立即观看</span>
                  </div>
                </div>
              </div>
              
              <!-- VIP标签 -->
              <div v-if="movie.needVip" class="vip-tag">
                <div class="vip-content">
                  <el-icon><Crown /></el-icon>
                  <span>VIP</span>
                </div>
              </div>
              
              <!-- 最新标签 -->
              <div class="new-badge">
                <span class="badge-text">NEW</span>
              </div>
            </div>
            
            <div class="movie-info">
              <h3 class="movie-title" :title="movie.title">{{ movie.title }}</h3>
              
              <div class="movie-meta">
                <div class="release-date">
                  <el-icon class="date-icon"><Calendar /></el-icon>
                  <span class="date-text">{{ formatDate(movie.releaseDate) }}</span>
                </div>
                
                <div class="movie-rating">
                  <el-rate
                    :model-value="movie.rating"
                    disabled
                    :colors="['#f7ba2a', '#f7ba2a', '#f7ba2a']"
                    :max="5"
                    :show-score="false"
                    size="small"
                    class="rating-stars"
                  />
                  <span class="rating-text">{{ movie.rating.toFixed(1) }}</span>
                </div>
              </div>
              
              <div class="movie-category">
                <el-tag 
                  :type="getCategoryType(movie.category)"
                  size="small"
                  class="category-tag"
                >
                  {{ movie.category || '未分类' }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-container" v-if="total > pageSize && !loading">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          :page-sizes="[12, 24, 36, 48]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Picture, 
  Calendar, 
  VideoPlay, 
  Crown, 
  InfoFilled,
  Grid,
  List,
  VideoCamera
} from '@element-plus/icons-vue'
import { getNewMovies } from '@/api/movie'
import { useRouter } from 'vue-router'

export default {
  name: 'Newest',
  components: {
    Picture,
    Calendar,
    VideoPlay,
    Crown,
    InfoFilled,
    Grid,
    List,
    VideoCamera
  },
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const movieList = ref([])
    const currentPage = ref(1)
    const pageSize = ref(12)
    const total = ref(0)
    const viewMode = ref('grid')

    // 格式化日期
    const formatDate = (date) => {
      if (!date) return '未知'
      const d = new Date(date)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    }

    // 获取分类标签类型
    const getCategoryType = (category) => {
      const typeMap = {
        '动作': 'danger',
        '喜剧': 'warning',
        '爱情': 'success',
        '科幻': 'info',
        '悬疑': 'primary',
        '恐怖': 'danger',
        '剧情': '',
        '动画': 'success'
      }
      return typeMap[category] || ''
    }

    // 格式化电影数据
    const formatMovieData = (movie) => ({
      id: movie.id,
      title: movie.title,
      cover: movie.posterUrl || movie.cover,
      rating: Number(movie.rating) || 0,
      releaseDate: movie.releaseDate,
      category: (movie.genres || '').split(',')[0],
      needVip: movie.isVip === 1
    })

    // 获取电影列表
    const fetchMovies = async () => {
      loading.value = true
      try {
        const response = await getNewMovies()
        movieList.value = (response || []).map(formatMovieData)
        total.value = movieList.value.length
        console.log('最新电影数据:', movieList.value)
      } catch (error) {
        console.error('获取最新电影失败:', error)
        ElMessage.error('获取最新电影失败')
        movieList.value = []
        total.value = 0
      } finally {
        loading.value = false
      }
    }

    // 处理电影点击
    const handleMovieClick = (movie) => {
      router.push(`/movie/${movie.id}`)
    }

    // 处理页码变化
    const handleCurrentChange = (page) => {
      currentPage.value = page
      // 这里可以添加分页逻辑，目前先保持简单
    }

    // 处理每页数量变化
    const handleSizeChange = (size) => {
      pageSize.value = size
      currentPage.value = 1
      // 这里可以添加分页逻辑，目前先保持简单
    }

    onMounted(() => {
      fetchMovies()
    })

    return {
      loading,
      movieList,
      currentPage,
      pageSize,
      total,
      viewMode,
      formatDate,
      getCategoryType,
      handleMovieClick,
      handleCurrentChange,
      handleSizeChange
    }
  }
}
</script>

<style lang="scss" scoped>
.newest-page {
  min-height: 100vh;
  background: var(--newest-bg);
  padding-bottom: 40px;
}

.newest-header {
  position: relative;
  background: var(--newest-header-gradient);
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
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
    opacity: var(--newest-header-pattern-opacity);
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
      text-shadow: var(--newest-header-text-shadow);

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
    top: 30px;
    right: 80px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    opacity: 0.3;

    .decoration-circle {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      animation: pulse 2s ease-in-out infinite;

      &:nth-child(2) {
        animation-delay: 0.7s;
      }

      &:nth-child(3) {
        animation-delay: 1.4s;
      }
    }
  }
}

.newest-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 3;
}

.filter-section {
  background: var(--newest-card-bg);
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 32px;
  box-shadow: var(--newest-card-shadow);
  border: 1px solid var(--newest-border);

  .filter-content {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .filter-info {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--newest-meta-color);

      .info-icon {
        font-size: 18px;
        color: var(--newest-date-color);
      }

      .filter-text {
        font-size: 16px;
        font-weight: 500;
      }
    }

    .view-options {
      :deep(.el-radio-group) {
        .el-radio-button__inner {
          padding: 8px 12px;
          border-radius: 8px;
        }
      }
    }
  }
}

.movie-section {
  margin-bottom: 40px;
}

.movie-list {
  &.movie-list-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 24px;
  }

  &.movie-list-list {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .movie-card {
      display: flex;
      flex-direction: row;
      align-items: stretch;

      .movie-poster {
        width: 160px;
        height: auto;
        padding-top: 0;
        flex-shrink: 0;
        margin-right: 20px;

        .image-wrapper {
          height: 220px;
        }
      }

      .movie-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 20px;
      }
    }
  }
}

.movie-card {
  background: var(--newest-card-bg);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--newest-border);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.05));
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--newest-card-hover-shadow);
    background: var(--newest-card-hover-bg);
    border-color: var(--newest-date-color);

    &::before {
      opacity: 1;
    }

    .movie-poster {
      .image-overlay {
        opacity: 1;
      }

      .movie-image {
        transform: scale(1.05);
      }
    }

    .movie-title {
      color: var(--newest-date-color);
    }
  }
}

.movie-poster {
  position: relative;
  width: 100%;
  padding-top: 140%;

  .image-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    overflow: hidden;
  }

  .movie-image {
    width: 100%;
    height: 100%;
    transition: transform 0.4s ease;
  }

  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;

    .overlay-content {
      text-align: center;
      color: white;

      .play-icon {
        font-size: 36px;
        margin-bottom: 8px;
      }

      .play-text {
        font-size: 14px;
        font-weight: 600;
      }
    }
  }

  .image-error {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--newest-border);
    color: var(--newest-meta-color);
    gap: 8px;

    span {
      font-size: 12px;
    }
  }

  .vip-tag {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 2;

    .vip-content {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 6px 10px;
      background: var(--newest-vip-bg);
      color: white;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(255, 153, 0, 0.3);

      .el-icon {
        font-size: 12px;
      }
    }
  }

  .new-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 2;

    .badge-text {
      display: inline-block;
      padding: 4px 8px;
      background: var(--newest-date-color);
      color: white;
      border-radius: 8px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
  }
}

.movie-info {
  padding: 20px;

  .movie-title {
    margin: 0 0 16px;
    font-size: 18px;
    font-weight: 600;
    color: var(--newest-title-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: color 0.3s ease;
  }

  .movie-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    .release-date {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--newest-date-color);
      font-size: 14px;
      font-weight: 500;

      .date-icon {
        font-size: 16px;
      }
    }

    .movie-rating {
      display: flex;
      align-items: center;
      gap: 8px;

      .rating-stars {
        :deep(.el-rate__item) {
          margin-right: 2px;
        }
      }

      .rating-text {
        font-size: 14px;
        font-weight: 600;
        color: #f7ba2a;
      }
    }
  }

  .movie-category {
    .category-tag {
      font-weight: 500;
      border-radius: 12px;
      padding: 4px 12px;
    }
  }
}

.loading-container {
  margin-top: 40px;
}

.movie-skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
}

.movie-skeleton-card {
  background: var(--newest-card-bg);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--newest-border);
}

.empty-container {
  padding: 80px 0;
  text-align: center;

  .empty-image {
    color: var(--newest-meta-color);
    margin-bottom: 24px;
  }

  .empty-description {
    color: var(--newest-meta-color);
    font-size: 18px;
    margin: 0;
  }
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  padding: 24px 0;
}

// 响应式设计
@media (max-width: 768px) {
  .newest-header {
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

  .newest-container {
    padding: 0 15px;
  }

  .filter-section {
    .filter-content {
      flex-direction: column;
      gap: 16px;
      align-items: flex-start;
    }
  }

  .movie-list {
    &.movie-list-grid {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
    }

    &.movie-list-list {
      .movie-card {
        flex-direction: column;

        .movie-poster {
          width: 100%;
          margin-right: 0;
          margin-bottom: 16px;
        }
      }
    }
  }

  .movie-card {
    .movie-info {
      padding: 16px;

      .movie-title {
        font-size: 16px;
      }
    }
  }
}

@media (max-width: 480px) {
  .newest-header {
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

  .movie-list {
    &.movie-list-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 12px;
    }
  }

  .movie-card {
    .movie-info {
      padding: 12px;

      .movie-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }
  }
}

// 动画
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}
</style> 