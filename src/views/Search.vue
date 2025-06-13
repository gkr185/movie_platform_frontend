<template>
  <div class="search-page">
    <!-- 搜索头部 -->
    <div class="search-header">
      <div class="search-info">
        <h2>搜索结果</h2>
        <p v-if="keyword">关键词：{{ keyword }}</p>
      </div>
      <div class="search-stats" v-if="!searchLoading && !searchError">
        <span>找到 {{ searchResults.length }} 个相关结果</span>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="searchLoading" class="search-loading">
      <el-skeleton :rows="3" animated />
      <el-skeleton :rows="3" animated />
    </div>

    <!-- 错误提示 -->
    <el-empty
      v-else-if="searchError"
      :description="searchError"
      class="search-error"
    >
      <template #image>
        <el-icon :size="60"><Warning /></el-icon>
      </template>
      <el-button type="primary" @click="retrySearch">重试</el-button>
    </el-empty>

    <!-- 无结果提示 -->
    <el-empty
      v-else-if="searchResults.length === 0"
      description="未找到相关电影"
      class="search-empty"
    >
      <template #image>
        <el-icon :size="60"><Search /></el-icon>
      </template>
    </el-empty>

    <!-- 搜索结果 -->
    <div v-else class="search-results">
      <el-row :gutter="20">
        <el-col
          v-for="movie in searchResults"
          :key="movie.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          :xl="4"
        >
          <movie-card :movie="movie" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { Search, Warning } from '@element-plus/icons-vue'
import MovieCard from '@/components/movie/MovieCard.vue'

const store = useStore()
const route = useRoute()

// 获取搜索关键词
const keyword = computed(() => route.query.keyword || '')

// 获取搜索状态
const searchResults = computed(() => store.getters['movie/searchResults'])
const searchLoading = computed(() => store.getters['movie/searchLoading'])
const searchError = computed(() => store.getters['movie/searchError'])

// 执行搜索
const performSearch = async () => {
  if (keyword.value) {
    await store.dispatch('movie/searchMovies', keyword.value)
  }
}

// 重试搜索
const retrySearch = () => {
  performSearch()
}

// 监听路由变化
watch(
  () => route.query.keyword,
  (newKeyword) => {
    if (newKeyword) {
      performSearch()
    }
  }
)

// 组件挂载时执行搜索
onMounted(() => {
  if (keyword.value) {
    performSearch()
  }
})
</script>

<style lang="scss" scoped>
.search-page {
  padding: 20px;
  min-height: calc(100vh - 60px);
  background-color: var(--bg-color);
  transition: background-color 0.3s;

  .search-header {
    margin-bottom: 30px;
    padding: 20px;
    background-color: var(--card-bg-color);
    border-radius: 8px;
    box-shadow: var(--card-shadow);

    .search-info {
      h2 {
        margin: 0 0 10px;
        color: var(--text-color);
        font-size: 24px;
      }

      p {
        margin: 0;
        color: var(--text-color-light);
        font-size: 14px;
      }
    }

    .search-stats {
      margin-top: 10px;
      color: var(--text-color-light);
      font-size: 14px;
    }
  }

  .search-loading {
    padding: 20px;
    background-color: var(--card-bg-color);
    border-radius: 8px;
    box-shadow: var(--card-shadow);

    .el-skeleton {
      margin-bottom: 20px;
    }
  }

  .search-error,
  .search-empty {
    padding: 40px;
    background-color: var(--card-bg-color);
    border-radius: 8px;
    box-shadow: var(--card-shadow);

    .el-icon {
      color: var(--text-color-light);
    }
  }

  .search-results {
    .el-row {
      margin: 0 -10px;
    }

    .el-col {
      padding: 10px;
    }
  }
}

// 响应式调整
@media screen and (max-width: 768px) {
  .search-page {
    padding: 10px;

    .search-header {
      padding: 15px;
      margin-bottom: 20px;

      .search-info {
        h2 {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
