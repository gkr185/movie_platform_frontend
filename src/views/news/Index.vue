<template>
  <div class="news-page">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索新闻..."
        class="search-input"
        clearable
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <!-- 分类标签 -->
    <div class="category-tags">
      <el-tag
        :type="currentCategory === null ? 'primary' : 'info'"
        class="category-tag"
        @click="handleCategoryClick(null)"
      >
        全部
      </el-tag>
      <el-tag
        v-for="category in categories"
        :key="category.id"
        :type="currentCategory === category.id ? 'primary' : 'info'"
        class="category-tag"
        @click="handleCategoryClick(category.id)"
      >
        {{ category.name }}
      </el-tag>
    </div>

    <!-- 新闻列表 -->
    <div class="news-list" v-loading="loading">
      <template v-if="newsList.length > 0">
        <div
          v-for="news in newsList"
          :key="news.id"
          class="news-item"
          @click="goToDetail(news.id)"
        >
          <div class="news-cover">
            <el-image
              :src="news.cover_image"
              fit="cover"
              :preview-src-list="[news.cover_image]"
            >
              <template #error>
                <div class="image-error">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </div>
          <div class="news-content">
            <h3 class="news-title">{{ news.title }}</h3>
            <div class="news-meta">
              <span class="source">{{ news.source }}</span>
              <span class="author">{{ news.author }}</span>
              <span class="time">{{ formatTime(news.publishTime) }}</span>
            </div>
            <div class="news-category">
              <el-tag size="small" type="info">{{ news.category?.name }}</el-tag>
            </div>
          </div>
        </div>
      </template>
      <el-empty v-else description="暂无新闻" />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Search, Picture } from '@element-plus/icons-vue'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default {
  name: 'NewsIndex',
  components: {
    Search,
    Picture
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const searchKeyword = ref('')
    const currentCategory = ref(null)

    // 从store获取状态
    const newsList = computed(() => store.getters['news/newsList'] || [])
    const loading = computed(() => store.getters['news/loading'])
    const error = computed(() => store.getters['news/error'])
    const categories = computed(() => store.getters['news/categories'] || [])

    // 加载新闻列表
    const loadNews = async () => {
      try {
        await store.dispatch('news/fetchAllNews')
      } catch (error) {
        console.error('加载新闻失败:', error)
      }
    }

    // 加载分类列表
    const loadCategories = async () => {
      try {
        await store.dispatch('news/fetchActiveCategories')
      } catch (error) {
        console.error('加载分类失败:', error)
      }
    }

    // 处理分类点击
    const handleCategoryClick = async (categoryId) => {
      currentCategory.value = categoryId
      try {
        if (categoryId === null) {
          await loadNews()
        } else {
          await store.dispatch('news/fetchNewsByCategory', categoryId)
        }
      } catch (error) {
        console.error('加载分类新闻失败:', error)
      }
    }

    // 处理搜索
    const handleSearch = async () => {
      if (!searchKeyword.value.trim()) {
        await loadNews()
        return
      }
      try {
        await store.dispatch('news/searchNews', searchKeyword.value)
      } catch (error) {
        console.error('搜索新闻失败:', error)
      }
    }

    // 跳转到详情页
    const goToDetail = (id) => {
      router.push(`/news/${id}`)
    }

    // 格式化时间
    const formatTime = (time) => {
      if (!time) return '未知时间'
      return formatDistanceToNow(new Date(time), {
        addSuffix: true,
        locale: zhCN
      })
    }

    // 页面加载时获取新闻列表和分类
    onMounted(() => {
      loadNews()
      loadCategories()
    })

    return {
      searchKeyword,
      currentCategory,
      categories,
      newsList,
      loading,
      error,
      handleCategoryClick,
      handleSearch,
      goToDetail,
      formatTime
    }
  }
}
</script>

<style lang="scss" scoped>
.news-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  .search-bar {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;

    .search-input {
      flex: 1;
    }
  }

  .category-tags {
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    .category-tag {
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
      }
    }
  }

  .news-list {
    .news-item {
      display: flex;
      gap: 20px;
      padding: 20px;
      margin-bottom: 20px;
      background: var(--movie-section-bg);
      border-radius: 8px;
      box-shadow: var(--movie-section-shadow);
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--movie-section-shadow-hover);
      }

      .news-cover {
        flex-shrink: 0;
        width: 200px;
        height: 120px;
        border-radius: 4px;
        overflow: hidden;

        .el-image {
          width: 100%;
          height: 100%;
        }

        .image-error {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--input-bg-color);
          
          .el-icon {
            font-size: 32px;
            color: var(--text-color-light);
          }
        }
      }

      .news-content {
        flex: 1;
        min-width: 0;

        .news-title {
          margin: 0 0 10px;
          font-size: 18px;
          color: var(--text-color);
          line-height: 1.4;
        }

        .news-meta {
          margin-bottom: 10px;
          color: var(--text-color-light);
          font-size: 14px;

          span {
            margin-right: 15px;

            &:last-child {
              margin-right: 0;
            }
          }
        }

        .news-category {
          .el-tag {
            margin: 0;
          }
        }
      }
    }
  }
}

// 响应式设计
@media screen and (max-width: 768px) {
  .news-page {
    padding: 15px;

    .news-list {
      .news-item {
        flex-direction: column;
        gap: 15px;

        .news-cover {
          width: 100%;
          height: 180px;
        }
      }
    }
  }
}
</style> 