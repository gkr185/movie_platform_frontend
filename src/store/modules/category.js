import { getCategories, getCategoryTree, getCategoryMovies, getAllMovies, getMovieCategories } from '@/api/category'
import { ElMessage } from 'element-plus'
import { getMoviePosterUrl } from '@/utils/image'

const state = {
  categories: [],
  categoryTree: [],
  currentCategory: null,
  categoryMovies: [],
  pagination: {
    page: 1,
    size: 10,
    total: 0
  }
}

// 构建分类树的辅助函数
const buildCategoryTree = (categories) => {
  const tree = []
  const categoryMap = {}

  // 先按sortOrder排序
  const sortedCategories = [...categories].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))

  // 创建所有节点的映射
  sortedCategories.forEach(category => {
    categoryMap[category.id] = {
      ...category,
      children: [],
      parent: null
    }
  })

  // 构建树结构并设置父子关系
  sortedCategories.forEach(category => {
    if (category.parentId === 0 || category.parentId === null) {
      // 根节点
      tree.push(categoryMap[category.id])
    } else if (categoryMap[category.parentId]) {
      // 子节点
      const child = categoryMap[category.id]
      const parent = categoryMap[category.parentId]
      child.parent = parent
      parent.children.push(child)
    }
  })

  // 对每个父节点的子节点也按sortOrder排序
  tree.forEach(rootCategory => {
    if (rootCategory.children && rootCategory.children.length > 0) {
      rootCategory.children.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    }
  })

  // 最后对根分类也按sortOrder排序
  tree.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))

  return tree
}

// 扁平化分类树，用于导航菜单显示
const flattenCategoryTree = (tree, level = 0) => {
  const result = []
  
  // 确保树结构已经按sortOrder排序
  const sortedTree = [...tree].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
  
  sortedTree.forEach(category => {
    // 添加层级标识符
    const displayName = level > 0 ? '　'.repeat(level) + '└ ' + category.name : category.name
    result.push({
      ...category,
      displayName,
      level
    })
    
    // 递归处理子分类（子分类也需要排序）
    if (category.children && category.children.length > 0) {
      const sortedChildren = [...category.children].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      result.push(...flattenCategoryTree(sortedChildren, level + 1))
    }
  })
  
  return result
}

const mutations = {
  SET_CATEGORIES(state, { list = [] }) {
    // 标准化分类数据
    const normalizedCategories = list.map(category => ({
      id: category.id,
      name: category.name || '',
      description: category.description || '',
      parentId: category.parentId || category.parent_id || 0,
      sortOrder: category.sortOrder || category.sort_order || 0,
      status: category.status || 1
    }))
    
    // 按sortOrder排序
    const sortedCategories = normalizedCategories.sort((a, b) => a.sortOrder - b.sortOrder)
    
    state.categories = sortedCategories
    
    // 构建分类树（内部已经处理排序）
    state.categoryTree = buildCategoryTree(sortedCategories)
  },
  SET_CATEGORY_TREE(state, tree) {
    state.categoryTree = tree
  },
  SET_CURRENT_CATEGORY(state, category) {
    state.currentCategory = category
  },
  SET_CATEGORY_MOVIES(state, { list, total }) {
    state.categoryMovies = list.map(movie => ({
      ...movie,
      // 统一使用cover字段，并处理URL
      cover: getMoviePosterUrl(movie),
      score: movie.rating || 0,
      year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 
            (movie.release_date ? new Date(movie.release_date).getFullYear() : ''),
      isVip: movie.isVip === 1 || movie.is_vip === 1,
      quality: movie.quality || 'HD'
    }))
    state.pagination.total = total
  },
  SET_PAGINATION(state, { page, size }) {
    state.pagination.page = page
    state.pagination.size = size
  }
}

const actions = {
  // 获取所有分类
  async fetchCategories({ commit }) {
    try {
      const response = await getCategories()
      console.log('获取分类列表API响应:', response)
      
      // 根据不同的响应格式处理数据
      let categories = []
      if (Array.isArray(response)) {
        categories = response
      } else if (response.data && Array.isArray(response.data)) {
        categories = response.data
      } else if (response.content && Array.isArray(response.content)) {
        categories = response.content
      }

      commit('SET_CATEGORIES', { list: categories })
      return categories
    } catch (error) {
      console.error('获取分类列表失败:', error)
      throw error
    }
  },

  // 获取分类树
  async fetchCategoryTree({ commit }) {
    try {
      const response = await getCategoryTree()
      commit('SET_CATEGORY_TREE', response.data)
      return response.data
    } catch (error) {
      console.error('获取分类树失败:', error)
      throw error
    }
  },

  // 获取分类下的电影
  async fetchCategoryMovies({ commit, state }, { categoryId, params = {} }) {
    try {
      const { page = state.pagination.page, size = state.pagination.size } = params
      const response = await getCategoryMovies(categoryId, { page, size, ...params })
      
      console.log('获取分类电影API响应:', {
        response,
        responseData: response.data,
        categoryId,
        params
      })

      // 处理返回的数组数据
      const list = Array.isArray(response) ? response : []
      const total = list.length

      // 转换数据格式以匹配 MovieCard 组件的需求
      const formattedList = list.map(movie => ({
        id: movie.id,
        title: movie.title || '',
        description: movie.description || '',
        // 关键修复：确保正确处理海报URL
        cover: getMoviePosterUrl(movie),
        score: movie.rating || 0,
        year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 
              (movie.release_date ? new Date(movie.release_date).getFullYear() : ''),
        quality: movie.quality || 'HD',
        isVip: movie.isVip === 1 || movie.is_vip === 1,
        // 保留原始数据
        posterUrl: movie.posterUrl || movie.poster_url || '',
        rating: movie.rating || 0,
        runtime: movie.runtime || 0,
        director: movie.director || '',
        actors: movie.actors || '',
        genres: movie.genres || ''
      }))

      commit('SET_CATEGORY_MOVIES', { list: formattedList, total })
      commit('SET_PAGINATION', { page, size })
      return formattedList
    } catch (error) {
      console.error('获取分类电影失败:', error)
      console.error('错误详情:', {
        error,
        stack: error.stack,
        categoryId,
        params
      })
      // 出错时设置空列表
      commit('SET_CATEGORY_MOVIES', { list: [], total: 0 })
      throw error
    }
  },

  // 获取所有电影
  async fetchAllMovies({ commit, state }, { params = {} }) {
    try {
      const { page = state.pagination.page, size = state.pagination.size } = params
      const response = await getAllMovies({ page, size, ...params })
      
      console.log('获取所有电影API响应:', response)
      
      // 处理后端返回的数据
      const list = response.content || response.data || []
      const total = response.totalElements || response.total || list.length
      
      // 转换电影数据格式
      const formattedList = list.map(movie => ({
        id: movie.id,
        title: movie.title || '',
        description: movie.description || '',
        // 关键修复：确保正确处理海报URL
        cover: getMoviePosterUrl(movie),
        score: movie.rating || 0,
        year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 
              (movie.release_date ? new Date(movie.release_date).getFullYear() : ''),
        quality: movie.quality || 'HD',
        isVip: movie.isVip === 1 || movie.is_vip === 1,
        // 保留原始数据
        posterUrl: movie.posterUrl || movie.poster_url || '',
        rating: movie.rating || 0,
        runtime: movie.runtime || 0,
        director: movie.director || '',
        actors: movie.actors || '',
        genres: movie.genres || ''
      }))
      
      commit('SET_CATEGORY_MOVIES', { list: formattedList, total })
      commit('SET_PAGINATION', { page, size })
      return formattedList
    } catch (error) {
      console.error('获取所有电影失败:', error)
      throw error
    }
  },

  // 设置当前分类
  setCurrentCategory({ commit }, category) {
    commit('SET_CURRENT_CATEGORY', category)
  },

  // 设置分页信息
  setPagination({ commit }, pagination) {
    commit('SET_PAGINATION', pagination)
  },

  // 获取电影的分类信息
  async fetchMovieCategories({ commit }, movieId) {
    try {
      if (!movieId) {
        ElMessage.warning('请选择有效的电影')
        return []
      }
      
      const response = await getMovieCategories(movieId)
      // 直接返回响应数据
      return response || []
      
    } catch (error) {
      console.error('获取电影分类失败:', error)
      ElMessage.error('获取电影分类失败，请稍后重试')
      return []
    }
  }
}

const getters = {
  categoryList: state => state.categories,
  categoryTree: state => state.categoryTree,
  // 用于导航菜单的扁平化分类列表
  flatCategoryList: state => flattenCategoryTree(state.categoryTree),
  // 只获取根分类（已排序）
  rootCategories: state => state.categories.filter(cat => cat.parentId === 0)
                                           .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
  currentCategory: state => state.currentCategory,
  categoryMovies: state => state.categoryMovies,
  pagination: state => state.pagination,
  getMovieCategories: state => movieId => {
    // 从 categories 中找到与电影相关的分类
    return state.categories.filter(category => 
      category.movies && category.movies.includes(movieId)
    )
  },
  // 根据ID获取分类（包括子分类）
  getCategoryById: state => categoryId => {
    const findCategory = (categories, id) => {
      for (const category of categories) {
        if (category.id === id) {
          return category
        }
        if (category.children && category.children.length > 0) {
          const found = findCategory(category.children, id)
          if (found) return found
        }
      }
      return null
    }
    return findCategory(state.categoryTree, categoryId)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
