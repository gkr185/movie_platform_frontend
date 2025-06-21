<template>
  <div class="category-page">
    <!-- 分类导航 -->
    <div class="category-nav" :class="{ 'nav-fixed': isNavFixed }">
      <el-menu
        mode="horizontal"
        :default-active="currentCategoryId"
        @select="handleCategorySelect"
      >
        <el-menu-item index="all">全部电影</el-menu-item>
        <el-menu-item
          v-for="category in categories"
          :key="category.id"
          :index="String(category.id)"
        >
          {{ category.name }}
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 电影列表区域 -->
    <div class="movie-container">
      <el-row :gutter="20">
        <el-col 
          v-for="movie in categoryMovies"
          :key="movie.id"
          :xs="12"
          :sm="8"
          :md="6"
          :lg="4"
          :xl="4"
        >
          <movie-card :movie="movie" />
        </el-col>
      </el-row>

      <!-- 分页器 -->
      <div class="pagination-container">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="pagination.total"
          :page-sizes="[12, 24, 36, 48]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import MovieCard from '@/components/movie/MovieCard.vue'

export default {
  name: 'CategoryIndex',
  components: {
    MovieCard
  },
  setup() {
    const store = useStore()
    const currentPage = ref(1)
    const pageSize = ref(12)
    const isNavFixed = ref(false)
    const currentCategoryId = ref('all')

    // 计算属性
    const categories = computed(() => store.state.category.categories)
    const categoryMovies = computed(() => store.state.category.categoryMovies)
    const pagination = computed(() => store.state.category.pagination)

    // 获取分类列表
    const fetchCategories = async () => {
      try {
        await store.dispatch('category/fetchCategories')
      } catch (error) {
        ElMessage.error('获取分类列表失败')
      }
    }

    // 获取电影列表
    const fetchMovies = async (categoryId = 'all') => {
      try {
        const params = {
          page: currentPage.value,
          size: pageSize.value
        }

        if (categoryId === 'all') {
          await store.dispatch('category/fetchAllMovies', { params })
        } else {
          await store.dispatch('category/fetchCategoryMovies', {
            categoryId,
            params
          })
        }
      } catch (error) {
        ElMessage.error('获取电影列表失败')
      }
    }

    // 处理分类选择
    const handleCategorySelect = (categoryId) => {
      currentCategoryId.value = categoryId
      currentPage.value = 1
      fetchMovies(categoryId)
    }

    // 处理分页
    const handleSizeChange = (size) => {
      pageSize.value = size
      fetchMovies(currentCategoryId.value)
    }

    const handleCurrentChange = (page) => {
      currentPage.value = page
      fetchMovies(currentCategoryId.value)
    }

    // 处理导航栏固定
    const handleScroll = () => {
      isNavFixed.value = window.scrollY > 60
    }

    onMounted(() => {
      fetchCategories()
      fetchMovies('all')
      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      categories,
      categoryMovies,
      pagination,
      currentPage,
      pageSize,
      isNavFixed,
      currentCategoryId,
      handleCategorySelect,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style lang="scss" scoped>
.category-page {
  padding: 20px;
  min-height: 100vh;
}

.category-nav {
  margin-bottom: 20px;
  background-color: var(--nav-bg-color);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 0 20px;
  transition: all 0.3s ease;

  &.nav-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    border-radius: 0;
    padding: 0 40px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
}

.movie-container {
  margin-top: 20px;
}

.pagination-container {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}
</style>
