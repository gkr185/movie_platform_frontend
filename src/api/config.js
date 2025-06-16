// API配置
export const API_BASE_URL = '' // 使用相对路径，让代理处理

// API 请求超时时间
export const API_TIMEOUT = 15000
export const TIMEOUT = API_TIMEOUT // 为了兼容性添加 TIMEOUT 别名

// API 接口路径
export const API_URLS = {
  // 电影相关接口
  MOVIE: {
    LIST: '/api/movies', // 获取电影列表
    DETAIL: '/api/movies/{movieId}', // 获取电影详情
    BY_CATEGORY: '/api/movies/categories/{categoryId}', // 按分类搜索电影
    CATEGORIES: '/api/movies/getCategories/{movieId}', // 获取电影的所有分类
    SEARCH: '/api/movies/search', // 按关键词搜索电影（标题、描述、导演、演员）
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
  },
  // 收藏相关接口
  FAVORITE: {
    ADD: '/api/favorites/{userId}/favorites/{movieId}', // 添加收藏
    REMOVE: '/api/favorites/{userId}/favorites/{movieId}', // 取消收藏
    LIST: '/api/favorites/{userId}/favorites' // 获取收藏列表
  },
  // 观看历史相关接口
  HISTORY: {
    ADD: '/api/history/{userId}/movies/{movieId}', // 添加/更新观看历史
    LIST: '/api/history/{userId}/movies/page', // 分页获取观看历史
    DELETE: '/api/history/{userId}/movies/{movieId}', // 删除单条观看历史
    CLEAR: '/api/history/{userId}/movies', // 清空观看历史
    DETAIL: '/api/history/{userId}/movies/{movieId}' // 获取特定电影的观看记录
  },
  // 新闻相关接口
  NEWS: {
    LIST: '/api/news/all',
    DETAIL: '/api/news/{id}',
    BY_CATEGORY: '/api/news/category/{categoryId}',
    SEARCH: '/api/news/keyword/{keyword}',
    ACTIVE_CATEGORIES: '/api/news/categories/active' // 获取启用的新闻分类
  },
  // 广告相关接口
  AD: {
    IMAGES: '/api/advertisements/images', // 获取所有图片广告
    VIDEO_RANDOM: '/api/advertisements/video/random', // 随机获取一个视频广告
  },
  // 支付相关接口
  PAYMENT: {
    GENERATE_QRCODE: '/api/payment/generate-qrcode', // 生成支付二维码
    CHECK_STATUS: '/api/payment/status/{orderId}', // 查询支付状态
    CALLBACK: '/api/payment/callback' // 支付回调处理
  },
  // 文件上传相关接口
  FILE: {
    UPLOAD: '/api/files/upload', // 上传单个文件
    UPLOAD_AND_UPDATE: '/api/files/upload-and-update', // 上传文件并更新数据库
    UPLOAD_BATCH: '/api/files/upload/batch', // 批量上传文件
    BY_CATEGORY: '/api/files/category/{category}', // 根据分类获取文件
    BY_RELATED_ID: '/api/files/related/{relatedId}', // 根据关联ID获取文件
    BY_CATEGORY_AND_RELATED: '/api/files/category/{category}/related/{relatedId}', // 根据分类和关联ID获取文件
    DELETE: '/api/files/{fileId}', // 删除文件
    BY_FILENAME: '/api/files/filename/{fileName}', // 根据文件名获取文件
    ALL: '/api/files/all', // 获取所有文件
    HEALTH: '/api/files/health' // 健康检查
  },
  // 电影观看统计相关接口
  MOVIE_VIEW: {
    ADD_VIP_VIEW: '/api/moviesView/{movieId}/users/{userId}', // 增加VIP用户观看次数
    BY_VIEW_COUNT: '/api/moviesView/movies', // 按观看次数排序的电影列表
    VIEW_COUNT: '/api/moviesView/{movieId}/count', // 获取特定电影的观看次数
    MOVIE_STATS: '/api/moviesView/movies/{movieId}/stats', // 电影观看统计
    USER_STATS: '/api/moviesView/users/{userId}/stats' // 用户观看统计
  }
}