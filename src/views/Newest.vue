<template>
  <div class="newest-container">
    <div class="page-header">
      <h2>最新上映</h2>
      <div class="filter-bar">
        <el-radio-group v-model="timeRange" @change="handleTimeRangeChange">
          <el-radio-button label="week">本周新片</el-radio-button>
          <el-radio-button label="month">本月新片</el-radio-button>
          <el-radio-button label="all">全部新片</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="3" animated />
    </div>

    <!-- 电影列表 -->
    <div v-else class="movie-grid">
      <el-empty v-if="movieList.length === 0" description="暂无最新电影" />
      <div v-else class="movie-list">
        <div v-for="movie in movieList" :key="movie.id" class="movie-card">
          <router-link :to="{ name: 'MovieDetail', params: { id: movie.id }}">
            <div class="movie-poster">
              <el-image :src="movie.cover" fit="cover">
                <template #error>
                  <div class="image-error">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
              <div v-if="movie.needVip" class="vip-tag">
                <el-tag size="small" type="warning">VIP</el-tag>
              </div>
            </div>
            <div class="movie-info">
              <h3 class="title" :title="movie.title">{{ movie.title }}</h3>
              <div class="meta">
                <span class="date">{{ formatDate(movie.releaseDate) }}</span>
                <el-rate
                  v-model="movie.rating"
                  disabled
                  text-color="#ff9900"
                  :show-score="true"
                  :score-template="movie.rating + '分'"
                />
              </div>
              <div class="category">{{ movie.category }}</div>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-container" v-if="total > pageSize">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[12, 24, 36, 48]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'
import { getNewMovies } from '@/api/movie'

export default {
  name: 'Newest',
  components: {
    Picture
  },
  setup() {
    const loading = ref(false)
    const movieList = ref([])
    const timeRange = ref('week')
    const currentPage = ref(1)
    const pageSize = ref(12)
    const total = ref(0)

    // 格式化日期
    const formatDate = (date) => {
      const d = new Date(date)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    }

    // 格式化电影数据
    const formatMovieData = (movie) => ({
      id: movie.id,
      title: movie.title,
      cover: movie.posterUrl || movie.cover,
      rating: movie.rating || 0,
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
      } catch (error) {
        console.error('获取最新电影失败:', error)
        ElMessage.error('获取最新电影失败')
      } finally {
        loading.value = false
      }
    }

    // 处理时间范围变化
    const handleTimeRangeChange = () => {
      currentPage.value = 1
      fetchMovies()
    }

    // 处理页码变化
    const handleCurrentChange = (page) => {
      currentPage.value = page
      fetchMovies()
    }

    // 处理每页数量变化
    const handleSizeChange = (size) => {
      pageSize.value = size
      currentPage.value = 1
      fetchMovies()
    }

    onMounted(() => {
      fetchMovies()
    })

    return {
      loading,
      movieList,
      timeRange,
      currentPage,
      pageSize,
      total,
      formatDate,
      handleTimeRangeChange,
      handleCurrentChange,
      handleSizeChange
    }
  }
}
</script>

<style lang="scss" scoped>
.newest-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.page-header {
  margin-bottom: 24px;
  
  h2 {
    margin: 0 0 16px;
    font-size: 24px;
    color: var(--text-color);
  }
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.movie-grid {
  min-height: 400px;
}

.movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.movie-card {
  background: var(--card-bg-color);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  a {
    text-decoration: none;
    color: inherit;
  }
}

.movie-poster {
  position: relative;
  width: 100%;
  padding-top: 150%; // 2:3 比例
  
  .el-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  .image-error {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--el-fill-color-lighter);
    color: var(--el-text-color-secondary);
  }
  
  .vip-tag {
    position: absolute;
    top: 8px;
    right: 8px;
  }
}

.movie-info {
  padding: 12px;
  
  .title {
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: 500;
    color: var(--text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    
    .date {
      font-size: 14px;
      color: var(--text-color-secondary);
    }
  }
  
  .category {
    font-size: 14px;
    color: var(--text-color-secondary);
  }
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.loading-container {
  padding: 24px;
}
</style> 