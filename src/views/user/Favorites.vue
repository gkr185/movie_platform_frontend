<template>
  <div class="favorites-container">
    <template v-if="isLoggedIn">
      <div class="favorites-header">
        <h2>我的收藏</h2>
        <div class="header-actions">
          <el-input
            v-model="searchQuery"
            placeholder="搜索收藏的影片"
            prefix-icon="Search"
            clearable
            class="search-input"
          />
        </div>
      </div>

      <el-empty v-if="!filteredFavorites.length" :description="searchQuery ? '未找到匹配的影片' : '暂无收藏'" />

      <div v-else class="favorites-grid">
        <div v-for="movie in filteredFavorites" :key="movie.id" class="favorite-item">
          <movie-card :movie="formatMovieData(movie)" />
          <div class="favorite-actions">
            <el-button type="danger" size="small" @click.stop="handleRemoveFavorite(movie.id)">
              取消收藏
            </el-button>
          </div>
        </div>
      </div>
    </template>
    <el-empty v-else description="请先登录" />
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { format } from 'date-fns'
import MovieCard from '@/components/movie/MovieCard.vue'

export default {
  name: 'UserFavorites',
  components: {
    MovieCard
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const searchQuery = ref('')
    
    const isLoggedIn = computed(() => store.getters['user/isLoggedIn'])
    const favorites = computed(() => store.getters['user/favorites'])
    const filteredFavorites = computed(() => {
      if (!searchQuery.value) return favorites.value
      const query = searchQuery.value.toLowerCase()
      return favorites.value.filter(movie => 
        movie.title.toLowerCase().includes(query)
      )
    })

    // 格式化电影数据以适配 MovieCard 组件
    const formatMovieData = (movie) => {
      return {
        id: movie.id,
        title: movie.title,
        cover: movie.posterUrl,
        score: movie.rating,
        year: movie.releaseDate?.split('-')[0] || '',
        quality: movie.isVip ? 'VIP' : 'HD',
        createTime: movie.createTime
      }
    }

    // 获取收藏列表
    const fetchFavorites = async () => {
      try {
        await store.dispatch('user/fetchFavorites')
      } catch (error) {
        ElMessage.error('获取收藏列表失败')
      }
    }

    // 取消收藏
    const handleRemoveFavorite = async (movieId) => {
      try {
        await ElMessageBox.confirm(
          '确定要取消收藏这部影片吗？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        await store.dispatch('user/removeFromFavorites', movieId)
        ElMessage.success('已取消收藏')
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('取消收藏失败')
        }
      }
    }

    // 组件挂载时获取收藏列表
    onMounted(() => {
      if (isLoggedIn.value) {
        fetchFavorites()
      }
    })

    return {
      searchQuery,
      filteredFavorites,
      formatMovieData,
      handleRemoveFavorite,
      isLoggedIn
    }
  }
}
</script>

<style scoped>
.favorites-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.favorites-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.favorites-header h2 {
  margin: 0;
  color: var(--el-text-color-primary);
}

.search-input {
  width: 300px;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.favorite-item {
  position: relative;
}

.favorite-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  display: flex;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.favorite-item:hover .favorite-actions {
  opacity: 1;
}

@media (max-width: 768px) {
  .favorites-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .search-input {
    width: 100%;
  }

  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
}
</style>