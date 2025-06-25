<template>
  <div class="category-page">
    <!-- 分类导航 -->
    <div class="category-nav">
      <div class="nav-container">
        <!-- 左侧根分类 -->
        <div class="root-categories">
          <div class="category-section-title">分类导航</div>
          <div class="root-category-list">
            <div 
              class="root-category-item"
              :class="{ 'active': currentCategoryId === 'all' }"
              @click="handleCategorySelect('all')"
            >
              <span class="category-name">全部电影</span>
              <span class="category-count" v-if="allMoviesCount > 0">{{ allMoviesCount }}</span>
            </div>
            <div 
              v-for="rootCategory in rootCategories"
              :key="rootCategory.id"
              class="root-category-item"
              :class="{ 'active': isRootCategoryActive(rootCategory.id) }"
              @click="handleCategorySelect(rootCategory.id)"
            >
              <span class="category-name">{{ rootCategory.name }}</span>
              <span class="category-count" v-if="rootCategory.children && rootCategory.children.length > 0">
                {{ rootCategory.children.length }}
              </span>
            </div>
          </div>
        </div>

        <!-- 右侧所有子分类 -->
        <div class="all-sub-categories">
          <div class="category-section-title">
            所有分类
            <span class="sub-title">
              ({{ totalSubCategoriesCount }} 个子分类)
            </span>
          </div>
          <div class="sub-categories-container">
            <!-- 按根分类分组显示子分类 -->
            <div 
              v-for="rootCategory in rootCategoriesWithChildren"
              :key="rootCategory.id"
              class="category-group"
            >
              <div class="group-header">
                <h4 class="group-title">{{ rootCategory.name }}</h4>
                <div class="group-actions">
                  <span 
                    class="select-all-btn"
                    :class="{ 'active': currentCategoryId === rootCategory.id }"
                    @click="handleCategorySelect(rootCategory.id)"
                  >
                    全部
                  </span>
                </div>
              </div>
              
              <div class="sub-category-row">
                <div 
                  v-for="subCategory in rootCategory.children"
                  :key="subCategory.id"
                  class="sub-category-item"
                  :class="{ 'active': currentCategoryId === subCategory.id }"
                  @click="handleCategorySelect(subCategory.id)"
                >
                  <span class="category-name">{{ subCategory.name }}</span>
                  <span class="category-description" v-if="subCategory.description">
                    {{ subCategory.description }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- 没有子分类的根分类 -->
            <div 
              v-if="rootCategoriesWithoutChildren.length > 0"
              class="category-group"
            >
              <div class="group-header">
                <h4 class="group-title">其他分类</h4>
              </div>
              
              <div class="sub-category-row">
                <div 
                  v-for="rootCategory in rootCategoriesWithoutChildren"
                  :key="rootCategory.id"
                  class="sub-category-item"
                  :class="{ 'active': currentCategoryId === rootCategory.id }"
                  @click="handleCategorySelect(rootCategory.id)"
                >
                  <span class="category-name">{{ rootCategory.name }}</span>
                  <span class="category-description" v-if="rootCategory.description">
                    {{ rootCategory.description }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 当前分类信息 -->
    <div class="current-category-info" v-if="currentCategoryInfo">
      <div class="category-breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <span @click="handleCategorySelect('all')" class="breadcrumb-link">全部电影</span>
          </el-breadcrumb-item>
          <el-breadcrumb-item v-if="currentCategoryInfo.parent">
            <span @click="handleCategorySelect(currentCategoryInfo.parent.id)" class="breadcrumb-link">
              {{ currentCategoryInfo.parent.name }}
            </span>
          </el-breadcrumb-item>
          <el-breadcrumb-item>{{ currentCategoryInfo.name }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="category-stats">
        <el-tag type="info" size="small">共 {{ pagination.total }} 部电影</el-tag>
      </div>
    </div>

    <!-- 电影列表区域 -->
    <div class="movie-container">
      <el-row :gutter="20" v-loading="loading">
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

      <!-- 空状态 -->
      <div v-if="categoryMovies.length === 0 && !loading" class="empty-state">
        <el-empty description="暂无电影数据" />
      </div>

      <!-- 分页器 -->
      <div class="pagination-container" v-if="pagination.total > 0">
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
import { ref, computed, onMounted } from 'vue'
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
    const currentCategoryId = ref('all')
    const loading = ref(false)
    const allMoviesCount = ref(0)

    // 计算属性
    const categories = computed(() => store.getters['category/categoryList'])
    const categoryTree = computed(() => store.getters['category/categoryTree'])
    const rootCategories = computed(() => store.getters['category/rootCategories'])
    const categoryMovies = computed(() => store.state.category.categoryMovies)
    const pagination = computed(() => store.state.category.pagination)
    
    // 有子分类的根分类
    const rootCategoriesWithChildren = computed(() => {
      return categoryTree.value
        .filter(cat => cat.children && cat.children.length > 0)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    })
    
    // 没有子分类的根分类
    const rootCategoriesWithoutChildren = computed(() => {
      return rootCategories.value
        .filter(cat => {
          const treeCategory = categoryTree.value.find(treeCat => treeCat.id === cat.id)
          return !treeCategory || !treeCategory.children || treeCategory.children.length === 0
        })
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    })
    
    // 总子分类数量
    const totalSubCategoriesCount = computed(() => {
      return rootCategoriesWithChildren.value.reduce((total, rootCat) => {
        return total + (rootCat.children ? rootCat.children.length : 0)
      }, 0) + rootCategoriesWithoutChildren.value.length
    })
    
    // 判断根分类是否活跃（当前选中的是该根分类或其子分类）
    const isRootCategoryActive = (rootCategoryId) => {
      if (currentCategoryId.value === rootCategoryId) return true
      
      // 检查当前选中的是否是该根分类的子分类
      const rootCategory = categoryTree.value.find(cat => cat.id === rootCategoryId)
      if (rootCategory && rootCategory.children) {
        return rootCategory.children.some(child => child.id === currentCategoryId.value)
      }
      
      return false
    }
    
    // 当前分类信息
    const currentCategoryInfo = computed(() => {
      if (currentCategoryId.value === 'all') return null
      return store.getters['category/getCategoryById'](Number(currentCategoryId.value))
    })

    // 获取分类列表
    const fetchCategories = async () => {
      try {
        await store.dispatch('category/fetchCategories')
      } catch (error) {
        ElMessage.error('获取分类列表失败')
        console.error('获取分类列表失败:', error)
      }
    }

    // 获取电影列表
    const fetchMovies = async (categoryId = 'all') => {
      try {
        loading.value = true
        const params = {
          page: currentPage.value,
          size: pageSize.value
        }

        if (categoryId === 'all') {
          await store.dispatch('category/fetchAllMovies', { params })
          // 更新全部电影数量
          allMoviesCount.value = pagination.value.total
        } else {
          await store.dispatch('category/fetchCategoryMovies', {
            categoryId: Number(categoryId),
            params
          })
        }
      } catch (error) {
        ElMessage.error('获取电影列表失败')
        console.error('获取电影列表失败:', error)
      } finally {
        loading.value = false
      }
    }

    // 处理分类选择（统一处理根分类和子分类）
    const handleCategorySelect = (categoryId) => {
      currentCategoryId.value = categoryId
      currentPage.value = 1
      fetchMovies(categoryId)
    }

    // 处理分页
    const handleSizeChange = (size) => {
      pageSize.value = size
      currentPage.value = 1
      fetchMovies(currentCategoryId.value)
    }

    const handleCurrentChange = (page) => {
      currentPage.value = page
      fetchMovies(currentCategoryId.value)
    }

    onMounted(() => {
      fetchCategories()
      fetchMovies('all')
    })

    return {
      categories,
      categoryTree,
      rootCategories,
      rootCategoriesWithChildren,
      rootCategoriesWithoutChildren,
      totalSubCategoriesCount,
      categoryMovies,
      pagination,
      currentPage,
      pageSize,
      currentCategoryId,
      currentCategoryInfo,
      loading,
      allMoviesCount,
      isRootCategoryActive,
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
  background-color: var(--bg-color);
}

.category-nav {
  margin-bottom: 30px;
  background: var(--card-bg-color);
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.nav-container {
  display: flex;
  min-height: 300px;
}

.root-categories {
  width: 200px;
  background: linear-gradient(135deg, var(--input-bg-color), var(--card-bg-color));
  border-right: 2px solid var(--border-color);
  
  .category-section-title {
    padding: 16px 16px 12px;
    font-size: 15px;
    font-weight: 600;
    color: var(--text-color);
    border-bottom: 1px solid var(--border-color);
    background: rgba(64, 158, 255, 0.05);
  }
  
  .root-category-list {
    padding: 8px 0;
  }
  
  .root-category-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--text-color);
    border-left: 2px solid transparent;
    margin: 1px 0;
    
    &:hover {
      background: rgba(64, 158, 255, 0.06);
      transform: translateX(1px);
    }
    
    &.active {
      background: rgba(64, 158, 255, 0.1);
      border-left-color: #409eff;
      color: #409eff;
      
      .category-count {
        background: #409eff;
        color: white;
      }
    }
    
    .category-name {
      flex: 1;
      font-size: 13px;
      font-weight: 400;
    }
    
    .category-count {
      padding: 1px 6px;
      background: var(--border-color);
      color: var(--text-color-light);
      border-radius: 8px;
      font-size: 11px;
      min-width: 16px;
      text-align: center;
      transition: all 0.2s ease;
    }
  }
}

.all-sub-categories {
  flex: 1;
  background: var(--card-bg-color);
  
  .category-section-title {
    padding: 20px 25px 15px;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-color);
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: 10px;
    
    .sub-title {
      font-size: 12px;
      color: var(--text-color-light);
      font-weight: normal;
    }
  }
  
  .sub-categories-container {
    padding: 20px 25px;
    max-height: 450px;
    overflow-y: auto;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: var(--input-bg-color);
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: var(--border-color);
      border-radius: 3px;
      
      &:hover {
        background: #409eff;
      }
    }
  }
}

.category-group {
  margin-bottom: 25px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 2px solid var(--border-color);
    
    .group-title {
      margin: 0;
      font-size: 15px;
      font-weight: 600;
      color: var(--text-color);
      display: flex;
      align-items: center;
      
      &::before {
        content: '';
        width: 4px;
        height: 16px;
        background: #409eff;
        border-radius: 2px;
        margin-right: 8px;
      }
    }
    
    .group-actions {
      .select-all-btn {
        padding: 4px 12px;
        font-size: 12px;
        background: var(--input-bg-color);
        color: var(--text-color-light);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          background: rgba(64, 158, 255, 0.1);
          color: #409eff;
        }
        
        &.active {
          background: #409eff;
          color: white;
        }
      }
    }
  }
  
  .sub-category-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .sub-category-item {
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: var(--card-bg-color);
    min-width: 100px;
    flex-shrink: 0;
    
    &:hover {
      border-color: #409eff;
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
      transform: translateY(-1px);
    }
    
    &.active {
      border-color: #409eff;
      background: rgba(64, 158, 255, 0.05);
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
      
      .category-name {
        color: #409eff;
        font-weight: 500;
      }
    }
    
    .category-name {
      display: block;
      font-size: 13px;
      color: var(--text-color);
      margin-bottom: 2px;
      transition: color 0.3s ease;
    }
    
    .category-description {
      font-size: 11px;
      color: var(--text-color-light);
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
}

.current-category-info {
  margin-bottom: 25px;
  padding: 15px 20px;
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.05), rgba(64, 158, 255, 0.02));
  border-radius: 8px;
  border-left: 4px solid #409eff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .category-breadcrumb {
    .breadcrumb-link {
      color: #409eff;
      cursor: pointer;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  .category-stats {
    flex-shrink: 0;
  }
}

.movie-container {
  margin-top: 20px;
}

.empty-state {
  padding: 60px 0;
  text-align: center;
}

.pagination-container {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

// 响应式设计
@media (max-width: 1024px) {
  .nav-container {
    flex-direction: column;
    min-height: auto;
  }
  
  .root-categories {
    width: 100%;
    
    .root-category-list {
      display: flex;
      overflow-x: auto;
      padding: 10px;
      gap: 10px;
      
      .root-category-item {
        flex-shrink: 0;
        white-space: nowrap;
        border-radius: 20px;
        border-left: none;
        border: 1px solid var(--border-color);
        
        &.active {
          border-color: #409eff;
        }
      }
    }
  }
  
  .all-sub-categories {
    .sub-categories-container {
      max-height: none;
      padding: 15px;
    }
    
    .sub-category-row {
      justify-content: center;
    }
  }
}

@media (max-width: 768px) {
  .category-page {
    padding: 15px;
  }
  
  .all-sub-categories {
    .sub-categories-container {
      padding: 10px;
    }
    
    .category-group {
      margin-bottom: 20px;
      
      .sub-category-row {
        gap: 6px;
        
        .sub-category-item {
          padding: 6px 10px;
          min-width: 80px;
          
          .category-name {
            font-size: 12px;
          }
          
          .category-description {
            font-size: 10px;
          }
        }
      }
    }
  }
  
  .current-category-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
