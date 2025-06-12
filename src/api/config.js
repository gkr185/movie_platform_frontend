// API配置
export const API_BASE_URL = '' // 使用相对路径，让代理处理

// API 请求超时时间
export const TIMEOUT = 15000

// API 接口路径
export const API_URLS = {
  // 电影相关接口
  MOVIE: {
    LIST: '/api/movies', // 获取电影列表
    DETAIL: '/api/movies/{movieId}', // 获取电影详情
    BY_CATEGORY: '/api/movies/categories/{categoryId}', // 按分类搜索电影
    CATEGORIES: '/api/movies/getCategories/{movieId}', // 获取电影的所有分类
    RANKINGS: {
      HOT: '/api/movies/rankings/hot',
      RECOMMENDED: '/api/movies/rankings/recommended',
      NEW: '/api/movies/rankings/new'
    }
  },
  // 分类相关接口
  CATEGORY: {
    LIST: '/api/categories', // 获取所有分类
    TREE: '/api/categories/tree', // 获取分类树结构
    DETAIL: '/api/categories/{categoryId}', // 获取分类详情
  },
  // 用户相关接口
  USER: {
    REGISTER: '/api/users/register',
    LOGIN: '/api/users/login',
    PROFILE: '/api/users/{userId}',
    CHECK_USERNAME: '/api/users/check-username',
    CHANGE_PASSWORD: '/api/users/{userId}/password'
  },
  // 评论相关接口
  COMMENT: {
    CREATE: '/api/comments', // 创建评论
    LIST: '/api/comments/movies/{movieId}', // 获取电影评论列表
    UPDATE: '/api/comments/{commentId}', // 更新评论
    DELETE: '/api/comments/{commentId}', // 删除评论
    LIKE: '/api/comments/{commentId}/like', // 点赞评论
    UNLIKE: '/api/comments/{commentId}/unlike', // 取消点赞
    DISLIKE: '/api/comments/{commentId}/dislike', // 点踩评论
    UNDISLIKE: '/api/comments/{commentId}/undislike' // 取消点踩
  }
}