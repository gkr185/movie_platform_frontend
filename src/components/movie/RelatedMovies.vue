<template>
  <div class="related-movies" :class="{ 'list-mode': mode === 'list' }">
    <div class="section-header">
      <h2 class="section-title">
        <el-icon><VideoPlay /></el-icon>
        相关推荐
      </h2>
      <div class="view-mode">
        <el-radio-group v-model="mode" size="small">
          <el-radio-button label="grid">
            <el-icon><Grid /></el-icon>
          </el-radio-button>
          <el-radio-button label="list">
            <el-icon><List /></el-icon>
          </el-radio-button>
        </el-radio-group>
      </div>
    </div>
    
    <!-- 网格模式 -->
    <div v-if="mode === 'grid'" class="movies-grid" v-loading="loading">
      <movie-card
        v-for="movie in relatedMovies"
        :key="movie.id"
        :movie="movie"
        class="movie-item"
        @click="goToMovie(movie.id)"
      />
    </div>

    <!-- 列表模式 -->
    <div v-else class="movies-list" v-loading="loading">
      <div 
        v-for="movie in relatedMovies" 
        :key="movie.id" 
        class="list-item"
        @click="goToMovie(movie.id)"
      >
        <el-image :src="movie.cover" fit="cover" />
        <div class="info">
          <h3 class="title">{{ movie.title }}</h3>
          <div class="meta">
            <span class="score">
              <el-icon><Star /></el-icon>
              {{ movie.score }}分
            </span>
            <span class="year">
              <el-icon><Calendar /></el-icon>
              {{ movie.year }}
            </span>
          </div>
        </div>
      </div>
    </div>
      
    <div v-if="!loading && relatedMovies.length === 0" class="empty-tip">
      <el-empty description="暂无相关推荐" />
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { VideoPlay, Grid, List, Star, Calendar } from '@element-plus/icons-vue'
import MovieCard from './MovieCard.vue'

export default {
  name: 'RelatedMovies',
  components: {
    MovieCard,
    VideoPlay,
    Grid,
    List,
    Star,
    Calendar
  },
  props: {
    currentMovie: {
      type: Object,
      default: null
    },
    movieId: {
      type: [String, Number],
      default: null
    },
    limit: {
      type: Number,
      default: 6
    },
    defaultMode: {
      type: String,
      default: 'grid',
      validator: value => ['grid', 'list'].includes(value)
    }
  },
  setup(props) {
    const store = useStore()
    const router = useRouter()
    const loading = ref(false)
    const relatedMovies = ref([])
    const mode = ref(props.defaultMode)

    // 获取相关电影
    const fetchRelatedMovies = async () => {
      const id = props.movieId || props.currentMovie?.id
      if (!id) {
        relatedMovies.value = []
        return
      }
      
      try {
        loading.value = true
        let movies = []
        
        if (props.currentMovie?.category) {
          // 通过分类获取相关电影
          movies = await store.dispatch('movie/fetchMoviesByCategory', {
            category: props.currentMovie.category,
            excludeId: id,
            limit: props.limit
          }) || []
        } else {
          // 通过推荐算法获取相关电影
          movies = await store.dispatch('movie/fetchRecommendedMovies', {
            movieId: id,
            limit: props.limit
          }) || []
        }
        
        relatedMovies.value = movies
      } catch (error) {
        console.error('获取相关电影失败:', error)
        relatedMovies.value = []
      } finally {
        loading.value = false
      }
    }

    // 跳转到电影详情
    const goToMovie = (movieId) => {
      router.push(`/movie/${movieId}`)
    }

    // 监听当前电影变化
    watch(
      [() => props.currentMovie?.id, () => props.movieId],
      ([newMovieId, newId]) => {
        if (newMovieId || newId) {
          fetchRelatedMovies()
        }
      },
      { immediate: true }
    )

    return {
      loading,
      relatedMovies,
      mode,
      goToMovie
    }
  }
}
</script>

<style lang="scss" scoped>
.related-movies {
  padding: 20px;
  background-color: var(--movie-section-bg);
  border-radius: 8px;
  box-shadow: var(--movie-section-shadow);

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    .section-title {
      margin: 0;
      font-size: 16px;
      color: var(--text-color);
      display: flex;
      align-items: center;
      gap: 8px;

      .el-icon {
        color: var(--el-color-primary);
      }
    }
  }

  // 网格模式
  .movies-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
    min-height: 200px;

    .movie-item {
      cursor: pointer;
      transition: transform 0.3s;

      &:hover {
        transform: translateY(-5px);
      }
    }
  }

  // 列表模式
  .movies-list {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .list-item {
      display: flex;
      gap: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 8px;
      border-radius: 8px;

      &:hover {
        background: var(--el-fill-color-light);
        transform: translateX(5px);
      }

      .el-image {
        width: 120px;
        height: 68px;
        border-radius: 4px;
        overflow: hidden;
        flex-shrink: 0;
      }

      .info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .title {
          margin: 0;
          font-size: 14px;
          color: var(--text-color);
          font-weight: 500;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .meta {
          display: flex;
          gap: 16px;
          color: var(--text-color-light);
          font-size: 13px;

          span {
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .score {
            color: var(--el-color-warning);
            font-weight: 500;
          }

          .el-icon {
            font-size: 14px;
          }
        }
      }
    }
  }

  .empty-tip {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    color: var(--text-color-light);
  }
}

// 响应式设计
@media (max-width: 992px) {
  .related-movies {
    .movies-grid {
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 12px;
    }
  }
}

@media (max-width: 768px) {
  .related-movies {
    padding: 16px;

    .section-header {
      margin-bottom: 16px;

      .section-title {
        font-size: 15px;
      }
    }

    .movies-grid {
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 10px;
    }

    .movies-list {
      gap: 12px;

      .list-item {
        padding: 6px;

        .el-image {
          width: 100px;
          height: 56px;
        }

        .info {
          .title {
            font-size: 13px;
          }

          .meta {
            font-size: 12px;
            gap: 12px;
          }
        }
      }
    }
  }
}
</style> 