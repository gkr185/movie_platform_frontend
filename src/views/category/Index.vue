<template>
  <div class="category-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="title">电影分类</h1>
      <p class="subtitle">探索不同类型的精彩影片</p>
    </div>

    <!-- 分类导航 -->
    <div class="category-nav" v-loading="loading">
      <el-scrollbar>
        <div class="nav-wrapper">
          <div
            v-for="category in categories"
            :key="category.categoryId"
            class="category-item"
            :class="{ active: currentCategory?.categoryId === category.categoryId }"
            @click="selectCategory(category)"
          >
            <span class="category-name">{{ category.name }}</span>
            <span class="movie-count" v-if="category.movieCount">({{ category.movieCount }})</span>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <!-- 电影列表 -->
    <div class="movie-section">
      <div class="section-header" v-if="currentCategory">
        <h2>{{ currentCategory.name }}</h2>
        <p class="description">{{ currentCategory.description || `${currentCategory.name}分类下的所有电影` }}</p>
      </div>

      <div class="movie-grid" v-loading="moviesLoading">
        <el-empty 
          v-if="!moviesLoading && (!movies || movies.length === 0)"
          description="暂无相关电影"
        />
        <template v-else>
          <MovieCard
            v-for="movie in movies"
            :key="movie.categoryId"
            :movie="movie"
          />
        </template>
      </div>

      <!-- 分页器 -->
      <div class="pagination-wrapper" v-if="total > 0">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="size"
          :page-sizes="pageSizes"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import MovieCard from '@/components/movie/MovieCard.vue'
import { getCategoryTree, getCategoryDetail, getCategoryMovies } from '@/api/category'

export default {
  name: 'CategoryPage',
  components: {
    MovieCard
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const loading = ref(false)
    const moviesLoading = ref(false)
    const categories = ref([])
    const currentCategory = ref(null)
    const movies = ref([])
    const total = ref(0)
    const page = ref(1)
    const size = ref(10)
    const pageSizes = [10, 20, 30, 50]

    // 全部分类选项
    const allCategory = {
      categoryId: 'all',
      name: '全部',
      description: '显示所有电影',
      parentId: null,
      movieCount: 0
    }

    // 获取分类树
    const fetchCategories = async () => {
      loading.value = true
      try {
        const { data } = await getCategoryTree()
        // 将树形结构扁平化并添加"全部"选项
        const flattenCategories = flattenCategoryTree(data)
        categories.value = [allCategory, ...flattenCategories]
        // 默认选择"全部"分类
        await selectCategory(categories.value[0])
      } catch (error) {
        console.error('获取分类列表失败:', error)
        ElMessage.error('获取分类列表失败')
      } finally {
        loading.value = false
      }
    }

    // 扁平化分类树
    const flattenCategoryTree = (tree) => {
      const result = []
      const traverse = (nodes) => {
        nodes.forEach(node => {
          result.push({
            categoryId: node.categoryId,
            name: node.name,
            description: node.description,
            parentId: node.parentId,
            movieCount: node.movieCount
          })
          if (node.children && node.children.length > 0) {
            traverse(node.children)
          }
        })
      }
      traverse(tree)
      return result
    }

    // 选择分类
    const selectCategory = async (category) => {
      if (!category) {
        console.warn('无效的分类数据:', category)
        return
      }
      
      currentCategory.value = category
      page.value = 1 // 切换分类时重置页码
      
      if (category.categoryId !== 'all') {
        try {
          const { data } = await getCategoryDetail(category.categoryId)
          currentCategory.value = { ...currentCategory.value, ...data }
        } catch (error) {
          console.error('获取分类详情失败:', error)
        }
      }
      
      await fetchCategoryMovies()
    }

    // 获取分类电影
    const fetchCategoryMovies = async () => {
      if (!currentCategory.value) {
        console.warn('未选择有效分类')
        return
      }
      
      moviesLoading.value = true
      try {
        const { data } = await getCategoryMovies(
          currentCategory.value.categoryId === 'all' ? null : currentCategory.value.categoryId,
          {
            page: page.value,
            size: size.value
          }
        )
        movies.value = data.list
        total.value = data.total
      } catch (error) {
        console.error('获取分类电影失败:', error)
        ElMessage.error('获取分类电影失败')
        movies.value = []
        total.value = 0
      } finally {
        moviesLoading.value = false
      }
    }

    // 处理每页数量变化
    const handleSizeChange = async (newSize) => {
      size.value = newSize
      await fetchCategoryMovies()
    }

    // 处理页码变化
    const handlePageChange = async (newPage) => {
      page.value = newPage
      await fetchCategoryMovies()
    }

    // 跳转到电影详情
    const goToMovie = (movieId) => {
      router.push(`/movie/${movieId}`)
    }

    onMounted(() => {
      fetchCategories()
    })

    return {
      loading,
      moviesLoading,
      categories,
      currentCategory,
      movies,
      total,
      page,
      size,
      pageSizes,
      selectCategory,
      handleSizeChange,
      handlePageChange,
      goToMovie
    }
  }
}
</script>

<style lang="scss" scoped>
.category-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;

  .page-header {
    text-align: center;
    margin-bottom: 40px;

    .title {
      font-size: 32px;
      color: var(--text-color);
      margin: 0;
      font-weight: 600;
    }

    .subtitle {
      font-size: 16px;
      color: var(--text-color-light);
      margin: 10px 0 0;
    }
  }

  .category-nav {
    margin-bottom: 30px;
    background-color: var(--card-bg-color);
    border-radius: 8px;
    padding: 15px;
    box-shadow: var(--card-shadow);

    .nav-wrapper {
      display: flex;
      gap: 15px;
      padding: 5px;
    }

    .category-item {
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;
      background-color: var(--input-bg-color);
      color: var(--text-color);

      &:hover {
        background-color: var(--el-color-primary-light-9);
      }

      &.active {
        background-color: var(--el-color-primary);
        color: white;
      }

      .category-name {
        font-weight: 500;
      }

      .movie-count {
        font-size: 0.9em;
        margin-left: 4px;
        opacity: 0.8;
      }
    }
  }

  .movie-section {
    .section-header {
      margin-bottom: 20px;

      h2 {
        font-size: 24px;
        color: var(--text-color);
        margin: 0;
      }

      .description {
        color: var(--text-color-light);
        margin: 8px 0 0;
        font-size: 14px;
      }
    }

    .movie-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
      padding: 10px 0;
    }
  }

  .pagination-wrapper {
    margin-top: 40px;
    display: flex;
    justify-content: center;
  }
}
</style> 