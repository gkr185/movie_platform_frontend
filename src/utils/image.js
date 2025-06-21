/**
 * 图片URL处理工具函数
 */

/**
 * 处理图片URL，将相对路径转换为完整URL
 * @param {string} url - 原始URL
 * @param {string} baseUrl - 基础URL（可选）
 * @returns {string} 处理后的完整URL
 */
export function processImageUrl(url, baseUrl) {
  if (!url) return ''
  
  // 如果已经是完整URL，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // 如果是相对路径，添加基础URL
  if (url.startsWith('/')) {
    // 优先使用传入的baseUrl，否则使用环境变量或当前域名
    const finalBaseUrl = baseUrl || 
                         process.env.VUE_APP_API_BASE_URL || 
                         process.env.VUE_APP_BASE_URL || 
                         window.location.origin
    return finalBaseUrl + url
  }
  
  return url
}

/**
 * 获取默认海报图片
 * @returns {string} 默认海报URL
 */
export function getDefaultPoster() {
  return '/default-poster.jpg'
}

/**
 * 获取默认头像图片
 * @returns {string} 默认头像URL
 */
export function getDefaultAvatar() {
  return '/default-avatar.jpg'
}

/**
 * 处理电影海报URL
 * @param {Object} movie - 电影对象
 * @returns {string} 处理后的海报URL
 */
export function getMoviePosterUrl(movie) {
  if (!movie) return getDefaultPoster()
  
  const posterUrl = movie.posterUrl || movie.poster_url || movie.cover || movie.image
  return processImageUrl(posterUrl) || getDefaultPoster()
}

/**
 * 处理用户头像URL
 * @param {Object} user - 用户对象
 * @returns {string} 处理后的头像URL
 */
export function getUserAvatarUrl(user) {
  if (!user) return getDefaultAvatar()
  
  const avatarUrl = user.avatar || user.avatarUrl || user.avatar_url
  return processImageUrl(avatarUrl) || getDefaultAvatar()
} 