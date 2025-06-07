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
        <el-card v-for="movie in filteredFavorites" :key="movie.id" class="movie-card">
          <div class="movie-poster">
            <el-image :src="movie.cover" fit="cover" />
            <div class="movie-actions">
              <el-button type="primary" @click="handleWatch(movie)">
                观看
              </el-button>
              <el-button type="danger" @click="handleRemoveFavorite(movie.id)">
                取消收藏
              </el-button>
            </div>
          </div>
          <div class="movie-info">
            <h3>{{ movie.title }}</h3>
            <div class="movie-meta">
              <el-rate
                v-model="movie.score"
                :max="10"
                :allow-half="true"
                disabled
                text-color="#ff9900"
              >
                <template #suffix>{{ movie.score }}分</template>
              </el-rate>
              <p class="add-time">收藏于 {{ formatDate(movie.addTime) }}</p>
            </div>
          </div>
        </el-card>
      </div>
    </template>
    <el-empty v-else description="请先登录" />
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'

export default {
  name: 'UserFavorites',
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

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    }

    const handleWatch = (movie) => {
      router.push({
        name: 'MovieDetail',
        params: { id: movie.id }
      })
    }

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
          ElMessage.error('操作失败')
        }
      }
    }

    return {
      searchQuery,
      filteredFavorites,
      formatDate,
      handleWatch,
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
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.movie-card {
  transition: transform 0.3s ease;
}

.movie-card:hover {
  transform: translateY(-5px);
}

.movie-poster {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
  border-radius: 8px;
}

.movie-poster .el-image {
  width: 100%;
  height: 100%;
}

.movie-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  display: flex;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.movie-poster:hover .movie-actions {
  opacity: 1;
}

.movie-info {
  padding: 15px 0;
}

.movie-info h3 {
  margin: 0 0 10px 0;
  color: var(--el-text-color-primary);
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.movie-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.add-time {
  margin: 0;
  color: var(--el-text-color-secondary);
  font-size: 14px;
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