<template>
  <div class="view-ranking-list">
    <el-card class="ranking-card" :class="{ 'compact': isCompact }">
      <template #header v-if="showHeader">
        <div class="section-header">
          <h2>
            <el-icon><TrendCharts /></el-icon>
            {{ title }}
          </h2>
          <el-button 
            type="text" 
            @click="refresh"
            :loading="loading"
            size="small"
          >
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>

      <div v-loading="loading" class="ranking-content">
        <div v-if="movieList.length === 0 && !loading" class="empty-state">
          <el-empty description="暂无观看数据" />
        </div>
        
        <div v-else class="ranking-list">
          <div 
            v-for="(movie, index) in displayMovies" 
            :key="movie.id"
            class="ranking-item"
            @click="goToMovie(movie.id)"
          >
            <div class="rank-number" :class="getRankClass(index)">
              {{ index + 1 }}
            </div>
            
            <div class="movie-poster">
              <img 
                :src="movie.posterUrl || movie.coverUrl || '/default-poster.jpg'" 
                :alt="movie.title"
                @error="handleImageError"
              />
            </div>
            
            <div class="movie-info">
              <h3 class="movie-title">{{ movie.title }}</h3>
              <div class="movie-meta">
                <span class="year">{{ movie.year || movie.releaseYear }}</span>
                <span class="rating" v-if="movie.rating">
                  <el-icon><Star /></el-icon>
                  {{ movie.rating }}
                </span>
              </div>
              <div class="movie-tags" v-if="movie.categories && movie.categories.length > 0">
                <el-tag 
                  v-for="category in movie.categories.slice(0, 3)" 
                  :key="category.id || category"
                  size="small"
                  effect="plain"
                >
                  {{ category.name || category }}
                </el-tag>
              </div>
            </div>
            
            <div class="view-stats">
              <div class="view-count">
                <el-icon><View /></el-icon>
                <span class="count">{{ formatViewCount(movie.viewCount || movie.totalViews || 0) }}</span>
              </div>
              <div class="view-label">观看次数</div>
            </div>
          </div>
        </div>

        <!-- 查看更多 -->
        <div v-if="isCompact && movieList.length > 0" class="more-action">
          <el-button 
            type="primary" 
            plain 
            @click="goToRankingPage"
            size="small"
          >
            查看完整排行榜
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>

        <!-- 分页 -->
        <div v-if="!isCompact && total > pageSize" class="pagination-container">
          <el-pagination
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            :page-sizes="[10, 20, 50, 100]"
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  TrendCharts, 
  Refresh, 
  View, 
  Star, 
  ArrowRight 
} from '@element-plus/icons-vue'
import axios from 'axios'
import { getToken } from '@/utils/auth'

export default {
  name: 'ViewRankingList',
  components: {
    TrendCharts,
    Refresh,
    View,
    Star,
    ArrowRight
  },
  props: {
    title: {
      type: String,
      default: '观看排行榜'
    },
    isCompact: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    limit: {
      type: Number,
      default: 10
    }
  },
  emits: ['movie-click'],
  setup(props, { emit }) {
    const router = useRouter()

    // 创建独立的axios实例避免循环依赖
    const viewApi = axios.create({
      baseURL: '', // 使用相对路径，让前端代理处理
      timeout: 10000
    })

    // 请求拦截器
    viewApi.interceptors.request.use(
      config => {
        const token = getToken()
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    viewApi.interceptors.response.use(
      response => {
        return response.data
      },
      error => {
        console.error('观看排行榜API请求失败:', error)
        throw error
      }
    )

    // 响应式数据
    const movieList = ref([])
    const loading = ref(false)
    const currentPage = ref(1)
    const pageSize = ref(props.isCompact ? props.limit : 20)
    const total = ref(0)

    // 计算属性
    const displayMovies = computed(() => {
      if (props.isCompact) {
        return movieList.value.slice(0, props.limit)
      }
      return movieList.value
    })

    // 获取观看排行榜数据
    const fetchViewRanking = async (page = 1, size = pageSize.value) => {
      try {
        loading.value = true
        const params = {
          page: page - 1, // 后端从0开始
          size: size
        }
        
        if (props.isCompact) {
          params.limit = props.limit
        }

        console.log('正在获取观看排行榜数据，参数:', params)
        const response = await viewApi.get('/api/moviesView/movies', { params })
        console.log('观看排行榜API响应:', response)
        
        // 处理响应数据（响应拦截器已经提取了data）
        let movies = []
        let totalCount = 0

        if (Array.isArray(response)) {
          movies = response
          totalCount = response.length
        } else if (response && Array.isArray(response.content)) {
          // 分页数据
          movies = response.content
          totalCount = response.totalElements || response.total || 0
        } else if (response && Array.isArray(response.data)) {
          movies = response.data
          totalCount = response.total || movies.length
        } else {
          console.warn('观看排行榜数据格式异常:', response)
          movies = []
          totalCount = 0
        }

        // 直接使用API返回的数据，后端应该已经按观看次数排序但不包含观看次数，需要单独获取
        if (movies.length > 0) {
          // 对于紧凑模式，只处理需要显示的数量以减少API调用
          const moviesToProcess = props.isCompact ? movies.slice(0, props.limit) : movies
          
          console.log(`开始获取${moviesToProcess.length}部电影的观看次数...`)
          
          const moviesWithViewCount = await Promise.all(
            moviesToProcess.map(async (movie, index) => {
              try {
                console.log(`正在获取电影 ${movie.title} (${movie.id}) 的观看次数...`)
                const viewCountResponse = await viewApi.get(`/api/moviesView/${movie.id}/count`)
                const viewCount = Number(viewCountResponse) || 0
                console.log(`电影 ${movie.title} 观看次数: ${viewCount}`)
                return {
                  ...movie,
                  viewCount: viewCount,
                  totalViews: viewCount
                }
              } catch (error) {
                console.warn(`获取电影${movie.title}(${movie.id})观看次数失败:`, error)
                return {
                  ...movie,
                  viewCount: 0,
                  totalViews: 0
                }
              }
            })
          )
          
          // 按观看次数重新排序
          moviesWithViewCount.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
          movieList.value = moviesWithViewCount
          
          console.log('最终电影列表:', movieList.value.map(m => ({ title: m.title, viewCount: m.viewCount })))
        } else {
          movieList.value = []
        }

        total.value = totalCount
        
        console.log('获取观看排行榜成功:', movieList.value.length, '部电影')
      } catch (error) {
        console.error('获取观看排行榜失败:', error)
        
        // 更详细的错误信息
        if (error.response) {
          console.error('错误响应:', error.response.data)
          console.error('错误状态:', error.response.status)
          ElMessage.error(`获取观看排行榜失败: ${error.response.data?.message || error.response.status}`)
        } else if (error.request) {
          console.error('网络请求失败:', error.request)
          ElMessage.error('网络连接失败，请检查网络设置')
        } else {
          console.error('请求配置错误:', error.message)
          ElMessage.error('请求配置错误')
        }
        
        movieList.value = []
        total.value = 0
      } finally {
        loading.value = false
      }
    }

    // 格式化观看次数
    const formatViewCount = (count) => {
      const num = Number(count) || 0
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万'
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k'
      }
      return num.toString()
    }

    // 获取排名样式类
    const getRankClass = (index) => {
      if (index === 0) return 'rank-first'
      if (index === 1) return 'rank-second'
      if (index === 2) return 'rank-third'
      return 'rank-normal'
    }

    // 刷新数据
    const refresh = () => {
      fetchViewRanking(currentPage.value, pageSize.value)
    }

    // 跳转到电影详情
    const goToMovie = (movieId) => {
      emit('movie-click', movieId)
      router.push(`/movie/${movieId}`)
    }

    // 跳转到完整排行榜页面
    const goToRankingPage = () => {
      router.push('/ranking?tab=view')
    }

    // 处理图片加载错误
    const handleImageError = (event) => {
      event.target.src = '/default-poster.jpg'
    }

    // 分页处理
    const handlePageChange = (page) => {
      currentPage.value = page
      fetchViewRanking(page, pageSize.value)
    }

    const handleSizeChange = (size) => {
      pageSize.value = size
      currentPage.value = 1
      fetchViewRanking(1, size)
    }

    // 监听props变化
    watch(() => props.limit, () => {
      if (props.isCompact) {
        pageSize.value = props.limit
      }
    })

    // 生命周期钩子
    onMounted(() => {
      fetchViewRanking()
    })

    return {
      movieList,
      loading,
      currentPage,
      pageSize,
      total,
      displayMovies,
      refresh,
      formatViewCount,
      getRankClass,
      goToMovie,
      goToRankingPage,
      handleImageError,
      handlePageChange,
      handleSizeChange
    }
  }
}
</script>

<style lang="scss" scoped>
.view-ranking-list {
  max-width: 1200px;
  margin: 0 auto;

  .ranking-card {
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    overflow: hidden;

    &.compact {
      margin-bottom: 30px;
    }

    :deep(.el-card__header) {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0;

        h2 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: white;
        }

        .el-button {
          color: white;
          border-color: rgba(255,255,255,0.3);

          &:hover {
            background-color: rgba(255,255,255,0.1);
            border-color: rgba(255,255,255,0.5);
          }
        }
      }
    }

    :deep(.el-card__body) {
      padding: 0;
    }
  }

  .ranking-content {
    min-height: 200px;

    .empty-state {
      padding: 40px 20px;
      text-align: center;
    }

    .ranking-list {
      .ranking-item {
        display: flex;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background-color: #f8f9ff;
          transform: translateX(4px);
        }

        &:last-child {
          border-bottom: none;
        }

        .rank-number {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: bold;
          border-radius: 50%;
          margin-right: 16px;
          flex-shrink: 0;

          &.rank-first {
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            color: #b8860b;
            box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
          }

          &.rank-second {
            background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
            color: #696969;
            box-shadow: 0 2px 8px rgba(192, 192, 192, 0.3);
          }

          &.rank-third {
            background: linear-gradient(135deg, #cd7f32, #daa520);
            color: #8b4513;
            box-shadow: 0 2px 8px rgba(205, 127, 50, 0.3);
          }

          &.rank-normal {
            background-color: #f5f5f5;
            color: #666;
          }
        }

        .movie-poster {
          width: 60px;
          height: 80px;
          margin-right: 16px;
          border-radius: 6px;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }

          &:hover img {
            transform: scale(1.05);
          }
        }

        .movie-info {
          flex: 1;
          min-width: 0;
          margin-right: 16px;

          .movie-title {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin: 0 0 8px 0;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .movie-meta {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 8px;

            .year {
              color: #666;
              font-size: 14px;
            }

            .rating {
              display: flex;
              align-items: center;
              gap: 4px;
              color: #ff9900;
              font-size: 14px;
              font-weight: 500;
            }
          }

          .movie-tags {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;

            .el-tag {
              font-size: 12px;
              height: 22px;
              line-height: 20px;
            }
          }
        }

        .view-stats {
          text-align: center;
          flex-shrink: 0;

          .view-count {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            font-size: 18px;
            font-weight: bold;
            color: #409eff;
            margin-bottom: 4px;

            .el-icon {
              font-size: 16px;
            }

            .count {
              font-family: 'Arial', sans-serif;
            }
          }

          .view-label {
            font-size: 12px;
            color: #999;
          }
        }
      }
    }

    .more-action {
      padding: 20px;
      text-align: center;
      border-top: 1px solid #f0f0f0;
      background-color: #fafafa;

      .el-button {
        padding: 8px 24px;
        font-size: 14px;
      }
    }

    .pagination-container {
      padding: 20px;
      border-top: 1px solid #f0f0f0;
      display: flex;
      justify-content: center;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .view-ranking-list {
    .ranking-content {
      .ranking-list {
        .ranking-item {
          padding: 12px 16px;

          .rank-number {
            width: 32px;
            height: 32px;
            font-size: 14px;
            margin-right: 12px;
          }

          .movie-poster {
            width: 50px;
            height: 66px;
            margin-right: 12px;
          }

          .movie-info {
            .movie-title {
              font-size: 14px;
              -webkit-line-clamp: 1;
            }

            .movie-meta {
              gap: 8px;

              .year, .rating {
                font-size: 12px;
              }
            }

            .movie-tags {
              display: none;
            }
          }

          .view-stats {
            .view-count {
              font-size: 16px;

              .el-icon {
                font-size: 14px;
              }
            }

            .view-label {
              font-size: 11px;
            }
          }
        }
      }
    }
  }
}
</style> 