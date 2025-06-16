<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- 左侧区域：Logo和导航菜单 -->
      <div class="nav-left">
        <router-link to="/" class="logo">
          <img src="@/assets/logo.png" alt="logo" class="logo-img">
          <span class="logo-text">在线电影平台</span>
        </router-link>

        <div class="nav-menu">
          <router-link 
            v-for="item in menuItems" 
            :key="item.path"
            :to="item.path"
            class="nav-item"
            :class="{ 'active': $route.path === item.path }"
          >
            {{ item.text }}
          </router-link>
        </div>
      </div>

      <!-- 中间区域：搜索框 -->
      <div class="nav-center">
        <div class="search-box">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索电影"
            :prefix-icon="Search"
            @keyup.enter="handleSearch"
            @focus="showSearchHistory = true"
            clearable
            :loading="searchLoading"
          >
            <template #append>
              <el-button @click="handleSearch" :loading="searchLoading">搜索</el-button>
            </template>
          </el-input>
          
          <!-- 搜索历史 -->
          <div v-if="showSearchHistory && searchHistory.length > 0" class="search-history">
            <div class="history-header">
              <span>搜索历史</span>
              <el-button type="text" @click="clearSearchHistory">清空</el-button>
            </div>
            <div class="history-list">
              <div
                v-for="(item, index) in searchHistory"
                :key="index"
                class="history-item"
                @click="useHistoryItem(item)"
              >
                <el-icon><Clock /></el-icon>
                <span>{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧区域：主题切换和用户菜单 -->
      <div class="nav-right">
        <div class="theme-toggle">
          <el-button 
            type="text" 
            @click="toggleTheme"
          >
            <el-icon>
              <Moon v-if="currentTheme === 'light'" />
              <Sunny v-else />
            </el-icon>
          </el-button>
        </div>

        <div class="user-menu">
          <template v-if="isLoggedIn">
            <el-dropdown trigger="click">
              <div class="user-info">
                <el-avatar :size="32" :src="userAvatar">
                  <el-icon><UserFilled /></el-icon>
                </el-avatar>
                <div class="user-details">
                  <span class="username">{{ username }}</span>
                  <span class="vip-badge" v-if="isVIP">
                    <el-tag size="small" type="warning">VIP</el-tag>
                  </span>
                </div>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleUserCenter">个人中心</el-dropdown-item>
                  <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <el-button v-else type="primary" @click="handleLogin">登录</el-button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Search, Clock, Timer, Moon, Sunny, UserFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'TheNavbar',
  components: {
    Search,
    Clock,
    Timer,
    Moon,
    Sunny,
    UserFilled
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const searchKeyword = ref('')
    const showSearchHistory = ref(false)
    
    const menuItems = [
      { path: '/', text: '首页' },
      { path: '/category', text: '分类' },
      { path: '/ranking', text: '排行榜' },
      { path: '/newest', text: '最新上映' },
      { path: '/news', text: '资讯' }
    ]
    
    const searchHistory = ref(JSON.parse(localStorage.getItem('searchHistory') || '[]'))
    const currentTheme = computed(() => store.state.theme)
    const isLoggedIn = computed(() => store.getters['user/isLoggedIn'])
    const userInfo = computed(() => store.getters['user/userInfo'])
    const username = computed(() => userInfo.value?.username || '')
    const userAvatar = computed(() => userInfo.value?.avatar || '')
    const isVIP = computed(() => store.getters['user/isVIP'])
    
    const searchLoading = computed(() => store.getters['movie/searchLoading'])
    const searchError = computed(() => store.getters['movie/searchError'])
    
    const handleSearch = async () => {
      if (!searchKeyword.value.trim()) {
        ElMessage.warning('请输入搜索关键词')
        return
      }

      try {
        // 保存到搜索历史
        if (!searchHistory.value.includes(searchKeyword.value)) {
          searchHistory.value.unshift(searchKeyword.value)
          if (searchHistory.value.length > 10) {
            searchHistory.value.pop()
          }
          localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
        }

        // 执行搜索
        const results = await store.dispatch('movie/searchMovies', searchKeyword.value)
        
        // 跳转到搜索结果页
        router.push({
          path: '/search',
          query: { keyword: searchKeyword.value }
        })
        
        // 隐藏搜索历史
        showSearchHistory.value = false
      } catch (error) {
        console.error('搜索失败:', error)
        ElMessage.error(searchError.value || '搜索失败，请稍后重试')
      }
    }
    
    const useHistoryItem = (item) => {
      searchKeyword.value = item
      handleSearch()
    }
    
    const clearSearchHistory = () => {
      searchHistory.value = []
      localStorage.removeItem('searchHistory')
      showSearchHistory.value = false
    }
    
    const hideSearchHistory = () => {
      showSearchHistory.value = false
    }

    const toggleTheme = () => {
      store.dispatch('toggleTheme')
    }

    const handleUserCenter = () => {
      router.push('/user/profile')
    }

    const handleLogin = () => {
      router.push({
        path: '/user/login',
        query: { redirect: router.currentRoute.value.fullPath }
      })
    }

    const handleLogout = async () => {
      try {
        await store.dispatch('user/logout')
        ElMessage.success('退出登录成功')
        router.push('/')
      } catch (error) {
        ElMessage.error('退出登录失败')
      }
    }
    
    return {
      searchKeyword,
      showSearchHistory,
      searchHistory,
      menuItems,
      currentTheme,
      isLoggedIn,
      userInfo,
      username,
      userAvatar,
      isVIP,
      searchLoading,
      searchError,
      handleSearch,
      useHistoryItem,
      clearSearchHistory,
      hideSearchHistory,
      toggleTheme,
      handleUserCenter,
      handleLogin,
      handleLogout
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: var(--nav-bg-color);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0.75rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 3rem;
}

.logo {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  
  .logo-img {
    height: 36px;
    width: auto;
  }
  
  .logo-text {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-color);
    letter-spacing: -0.02em;
  }
}

.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-item {
  text-decoration: none;
  color: var(--text-color-light);
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  transition: all 0.3s;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background-color: rgb(255, 115, 0);
    transition: all 0.3s;
    transform: translateX(-50%);
  }

  &:hover,
  &.active {
    color: var(--text-color);

    &::after {
      width: 100%;
    }
  }
}

.nav-center {
  flex: 1;
  max-width: 400px;
  margin: 0 2rem;
}

.search-box {
  position: relative;
  width: 100%;
  
  :deep(.el-input__inner) {
    background-color: var(--input-bg-color);
    border-color: transparent;
    color: var(--text-color);
    height: 40px;
    
    &::placeholder {
      color: var(--text-color-light);
    }

    &:focus {
      background-color: var(--input-bg-color);
    }
  }
  
  :deep(.el-input-group__append) {
    background-color: rgb(255, 115, 0);
    border-color: rgb(255, 115, 0);
    padding: 0 1.25rem;
    
    .el-button {
      color: #fff;
      border: none;
      font-weight: 500;
      
      &:hover {
        background-color: darken(rgb(255, 115, 0), 10%);
      }
    }
  }
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.theme-toggle {
  .el-button {
    color: var(--text-color);
    font-size: 1.25rem;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.3s;
    
    &:hover {
      color: rgb(255, 115, 0);
      background-color: var(--input-bg-color);
    }
  }
}

.user-menu {
  .user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    padding: 0.375rem 0.75rem;
    border-radius: 2rem;
    transition: all 0.3s;

    &:hover {
      background-color: var(--input-bg-color);
    }

    .user-details {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .username {
        color: var(--text-color);
        font-size: 0.875rem;
        font-weight: 500;
      }

      .vip-badge {
        display: flex;
        align-items: center;
      }
    }
  }

  .el-button {
    background-color: rgb(255, 115, 0);
    border-color: rgb(255, 115, 0);
    padding: 0.5rem 1.25rem;
    border-radius: 2rem;
    font-weight: 500;

    &:hover {
      background-color: darken(rgb(255, 115, 0), 10%);
      border-color: darken(rgb(255, 115, 0), 10%);
    }
  }
}

.search-history {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: var(--card-bg-color);
  border-radius: 0.5rem;
  padding: 0.75rem 0;
  z-index: 100;
  box-shadow: var(--card-shadow);
  border: 1px solid var(--border-color);
  
  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem 0.75rem;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 0.5rem;
    
    span {
      color: var(--text-color);
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .el-button {
      color: var(--text-color-light);
      font-size: 0.75rem;
      padding: 0;
      
      &:hover {
        color: var(--text-color);
      }
    }
  }
  
  .history-list {
    max-height: 200px;
    overflow-y: auto;
  }
  
  .history-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    color: var(--text-color);
    transition: all 0.3s;
    
    &:hover {
      background: var(--input-bg-color);
    }
    
    .el-icon {
      font-size: 0.875rem;
      color: var(--text-color-light);
    }
    
    span {
      font-size: 0.875rem;
    }
  }
}

@media (max-width: 1200px) {
  .navbar-container {
    padding: 0.75rem 1.5rem;
  }

  .nav-left {
    gap: 2rem;
  }

  .nav-menu {
    gap: 1.5rem;
  }

  .nav-center {
    margin: 0 1.5rem;
  }
}

@media (max-width: 992px) {
  .nav-center {
    max-width: 300px;
    margin: 0 1rem;
  }

  .logo-text {
    display: none;
  }
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 0.75rem 1rem;
  }

  .nav-menu,
  .nav-center,
  .theme-toggle {
    display: none;
  }

  .nav-right {
    margin-left: auto;
  }

  .user-menu {
    .user-details {
      display: none;
    }
  }
}
</style> 