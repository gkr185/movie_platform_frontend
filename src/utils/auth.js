const TOKEN_KEY = 'movie_platform_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  return localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  return localStorage.removeItem(TOKEN_KEY)
}

// 检查是否已登录
export function isLoggedIn() {
  return !!getToken()
} 