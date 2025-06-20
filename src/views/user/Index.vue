<template>
  <div class="user-center">
    <el-container class="user-container">
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : sidebarWidth" class="user-aside">
        <div class="user-sidebar">
          <!-- 用户信息区域 -->
          <div class="user-info" :class="{ 'collapsed': isCollapse }">
            <div class="avatar-wrapper">
              <el-avatar :size="isCollapse ? 40 : 64" :src="userAvatar">
                <el-icon><UserFilled /></el-icon>
              </el-avatar>
            </div>
            <transition name="fade">
              <div v-if="!isCollapse" class="user-details">
                <h3>{{ username }}</h3>
                <p v-if="isLoggedIn" :class="{ 'vip-text': isVIP }">
                  {{ isVIP ? 'VIP会员' : '普通用户' }}
                  <el-tag v-if="isVIP" size="small" type="warning">
                    {{ vipExpireTime ? `到期时间：${formatDate(vipExpireTime)}` : 'VIP' }}
                  </el-tag>
                </p>
              </div>
            </transition>
          </div>

          <!-- 菜单区域 -->
          <div class="menu-container">
            <el-scrollbar class="menu-scrollbar">
              <el-menu
                :default-active="activeMenu"
                class="user-menu"
                router
                :collapse="isCollapse"
                :collapse-transition="false"
                @select="handleSelect"
              >
                <!-- 未登录时显示的菜单项 -->
                <template v-if="!isLoggedIn">
                  <el-menu-item index="/user/login">
                    <el-icon><User /></el-icon>
                    <template #title>登录</template>
                  </el-menu-item>
                  <el-menu-item index="/user/register">
                    <el-icon><Plus /></el-icon>
                    <template #title>注册</template>
                  </el-menu-item>
                </template>

                <!-- 已登录时显示的菜单项 -->
                <template v-else>
                  <el-menu-item index="/user/profile">
                    <el-icon><User /></el-icon>
                    <span>个人资料</span>
                  </el-menu-item>
                  <el-menu-item index="/user/update-profile">
                    <el-icon><Edit /></el-icon>
                    <span>修改资料</span>
                  </el-menu-item>
                  <el-menu-item index="/user/change-password">
                    <el-icon><Lock /></el-icon>
                    <span>修改密码</span>
                  </el-menu-item>
                  <el-menu-item index="/user/vip">
                    <el-icon><Trophy /></el-icon>
                    <template #title>会员中心</template>
                  </el-menu-item>
                  <el-menu-item index="/user/favorites">
                    <el-icon><Star /></el-icon>
                    <template #title>我的收藏</template>
                  </el-menu-item>
                  <el-menu-item index="/user/history">
                    <el-icon><Timer /></el-icon>
                    <template #title>观看历史</template>
                  </el-menu-item>
                  <el-menu-item index="/user/feedback">
                    <el-icon><ChatLineSquare /></el-icon>
                    <template #title>用户反馈</template>
                  </el-menu-item>
                  <el-divider />
                  <el-menu-item @click="handleLogout">
                    <el-icon><SwitchButton /></el-icon>
                    <template #title>退出登录</template>
                  </el-menu-item>
                </template>
              </el-menu>
            </el-scrollbar>
          </div>

          <!-- 折叠按钮 -->
          <div class="collapse-btn" @click="toggleCollapse">
            <el-icon :size="20">
              <Fold v-if="!isCollapse" />
              <Expand v-else />
            </el-icon>
          </div>
        </div>
      </el-aside>

      <!-- 主内容区 -->
      <el-container class="main-container">
        <el-main class="main-content">
          <div class="content-wrapper">
            <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>

    <!-- 移动端抽屉式侧边栏 -->
    <el-drawer
      v-model="drawerVisible"
      direction="ltr"
      :show-close="false"
      :size="sidebarWidth"
      class="mobile-drawer"
      @close="drawerVisible = false"
    >
      <template #header>
        <div class="drawer-header">
          <span>用户中心</span>
          <el-button type="text" @click="drawerVisible = false">
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
      </template>
      <div class="drawer-content">
        <!-- 这里放置移动端的侧边栏内容 -->
        <div class="user-info mobile">
          <div class="avatar-wrapper">
            <el-avatar :size="64" :src="userAvatar">
              <el-icon><UserFilled /></el-icon>
            </el-avatar>
          </div>
          <div class="user-details">
            <h3>{{ username }}</h3>
            <p v-if="isLoggedIn" :class="{ 'vip-text': isVIP }">
              {{ isVIP ? 'VIP会员' : '普通用户' }}
              <el-tag v-if="isVIP" size="small" type="warning">
                {{ vipExpireTime ? `到期时间：${formatDate(vipExpireTime)}` : 'VIP' }}
              </el-tag>
            </p>
          </div>
        </div>
        
        <el-menu
          :default-active="activeMenu"
          class="mobile-menu"
          router
          @select="handleMobileSelect"
        >
          <!-- 菜单项与桌面版相同 -->
          <template v-if="!isLoggedIn">
            <el-menu-item index="/user/login">
              <el-icon><User /></el-icon>
              <span>登录</span>
            </el-menu-item>
            <el-menu-item index="/user/register">
              <el-icon><Plus /></el-icon>
              <span>注册</span>
            </el-menu-item>
          </template>
          <template v-else>
            <el-menu-item index="/user/profile">
              <el-icon><User /></el-icon>
              <span>个人资料</span>
            </el-menu-item>
            <el-menu-item index="/user/update-profile">
              <el-icon><Edit /></el-icon>
              <span>修改资料</span>
            </el-menu-item>
            <el-menu-item index="/user/change-password">
              <el-icon><Lock /></el-icon>
              <span>修改密码</span>
            </el-menu-item>
            <el-menu-item index="/user/vip">
              <el-icon><Trophy /></el-icon>
              <span>会员中心</span>
            </el-menu-item>
            <el-menu-item index="/user/favorites">
              <el-icon><Star /></el-icon>
              <span>我的收藏</span>
            </el-menu-item>
            <el-menu-item index="/user/history">
              <el-icon><Timer /></el-icon>
              <span>观看历史</span>
            </el-menu-item>
            <el-menu-item index="/user/feedback">
              <el-icon><ChatLineSquare /></el-icon>
              <span>用户反馈</span>
            </el-menu-item>
            <el-divider />
            <el-menu-item @click="handleLogout">
              <el-icon><SwitchButton /></el-icon>
              <span>退出登录</span>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
    </el-drawer>

    <!-- 移动端菜单按钮 -->
    <el-button 
      v-if="isMobile" 
      class="mobile-menu-btn" 
      type="primary" 
      circle 
      @click="drawerVisible = true"
    >
      <el-icon><Menu /></el-icon>
    </el-button>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { 
  User, UserFilled, Trophy, Star, Timer, 
  DataLine, Fold, Expand, Plus, SwitchButton, Edit, Lock, ChatLineSquare,
  Close, Menu
} from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'

export default {
  name: 'UserCenter',
  components: {
    User, UserFilled, Trophy, Star, Timer, 
    DataLine, Fold, Expand, Plus, SwitchButton, Edit, Lock, ChatLineSquare,
    Close, Menu
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const isCollapse = ref(false)
    const loading = ref(false)
    const drawerVisible = ref(false)
    const isMobile = ref(false)
    const sidebarWidth = ref('240px')

    // 从store获取用户信息
    const userInfo = computed(() => store.getters['user/userInfo'])
    const username = computed(() => userInfo.value?.username || '未登录')
    const userAvatar = computed(() => userInfo.value?.avatar || '')
    const isVIP = computed(() => store.getters['user/isVIP'])
    const vipExpireTime = computed(() => store.getters['user/vipExpireTime'])
    const activeMenu = computed(() => route.path)
    const isLoggedIn = computed(() => store.getters['user/isLoggedIn'])

    // 响应式处理
    const handleResize = () => {
      const width = window.innerWidth
      isMobile.value = width < 768
      
      if (width < 1200) {
        sidebarWidth.value = '200px'
      } else {
        sidebarWidth.value = '240px'
      }
      
      // 移动端自动折叠侧边栏
      if (isMobile.value) {
        isCollapse.value = true
      }
    }

    // 加载用户信息
    const loadUserInfo = async () => {
      if (isLoggedIn.value && !userInfo.value) {
        try {
          loading.value = true
          await store.dispatch('user/getUserInfo')
        } catch (error) {
          console.error('获取用户信息失败:', error)
          // 如果获取用户信息失败，可能是token过期，需要重新登录
          if (error.response && error.response.status === 401) {
            await handleLogout(true)
          }
        } finally {
          loading.value = false
        }
      }
    }

    const toggleCollapse = () => {
      if (!isMobile.value) {
        isCollapse.value = !isCollapse.value
      }
    }

    const handleSelect = (index) => {
      if (!isLoggedIn.value && index !== '/user/login' && index !== '/user/register') {
        ElMessage.warning('请先登录')
        router.push('/user/login')
        return
      }
    }

    const handleMobileSelect = (index) => {
      handleSelect(index)
      drawerVisible.value = false
    }

    const formatDate = (date) => {
      if (!date) return ''
      return new Date(date).toLocaleDateString()
    }

    const handleLogout = async (silent = false) => {
      try {
        if (!silent) {
          await ElMessageBox.confirm(
            '确定要退出登录吗？',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
        }
        await store.dispatch('user/logout')
        router.push('/')
        if (!silent) {
          ElMessage.success('已成功退出登录')
        }
      } catch (error) {
        if (error !== 'cancel' && !silent) {
          ElMessage.error('退出登录失败，请重试')
        }
      }
    }

    // 组件挂载时加载用户信息和设置响应式处理
    onMounted(() => {
      loadUserInfo()
      handleResize()
      window.addEventListener('resize', handleResize)
    })

    // 组件卸载时清理响应式处理
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
    })

    return {
      username,
      userAvatar,
      isVIP,
      vipExpireTime,
      activeMenu,
      isCollapse,
      loading,
      toggleCollapse,
      handleSelect,
      formatDate,
      isLoggedIn,
      handleLogout,
      drawerVisible,
      isMobile,
      sidebarWidth,
      handleMobileSelect
    }
  }
}
</script>

<style lang="scss" scoped>
.user-center {
  position: relative;
  height: 92vh;
  background-color: var(--bg-color);
  overflow: hidden;
}

.user-container {
  height: 100%;
  width: 100%;
}

.user-aside {
  transition: width 0.3s ease;
  background-color: var(--card-bg-color);
  border-right: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
  height: 100vh;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    display: none;
  }
}

.user-sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;

  .user-info {
    flex-shrink: 0;
    padding: 20px;
    text-align: center;
    border-bottom: 1px solid var(--border-color);
    transition: all 0.3s ease;
    background-color: var(--card-bg-color);

    &.collapsed {
      padding: 15px 10px;

      .avatar-wrapper {
        margin-bottom: 0;
      }
    }

    &.mobile {
      border-bottom: none;
      padding: 15px;
    }

    .avatar-wrapper {
      margin-bottom: 15px;
      transition: all 0.3s ease;

      .el-avatar {
        border: 3px solid var(--border-color);
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        &:hover {
          transform: scale(1.05);
          border-color: var(--el-color-primary);
        }
      }
    }

    .user-details {
      h3 {
        margin: 10px 0 8px;
        font-size: 18px;
        font-weight: 600;
        color: var(--text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      p {
        margin: 0;
        color: var(--text-color-light);
        font-size: 14px;
        line-height: 1.5;

        &.vip-text {
          color: #e6a23c;
          font-weight: 500;
        }

        .el-tag {
          margin-left: 8px;
          font-size: 12px;
        }
      }
    }
  }
}

.menu-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.menu-scrollbar {
  flex: 1;
}

.user-menu {
  border-right: none;
  background-color: transparent;
  height: 100%;

  :deep(.el-menu-item) {
    height: 54px;
    line-height: 54px;
    color: var(--text-color);
    margin: 2px 8px;
    border-radius: 8px;
    transition: all 0.3s ease;

    .el-icon {
      font-size: 18px;
      color: var(--text-color);
      margin-right: 12px;
      transition: all 0.3s ease;
    }

    span {
      font-size: 14px;
      font-weight: 500;
    }

    &:hover {
      background-color: var(--el-color-primary-light-9);
      color: var(--el-color-primary);
      transform: translateX(4px);

      .el-icon {
        color: var(--el-color-primary);
      }
    }

    &.is-active {
      background-color: var(--el-color-primary);
      color: white;

      .el-icon {
        color: white;
      }
    }
  }

  :deep(.el-divider) {
    margin: 12px 16px;
  }
}

.collapse-btn {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  background-color: var(--input-bg-color);
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;

  &:hover {
    background-color: var(--el-color-primary);
    color: white;
    transform: translateX(-50%) scale(1.1);
  }

  @media (max-width: 768px) {
    display: none;
  }
}

.main-container {
  background-color: var(--bg-color);
  height: 100vh;
  overflow: hidden;
}

.main-content {
  padding: 0;
  height: 100%;
  overflow: hidden;
}

.content-wrapper {
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  background-color: var(--bg-color);

  // 自定义滚动条
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
      background: var(--text-color-light);
    }
  }
}

// 动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
}

.drawer-content {
  padding: 20px;
}

.mobile-drawer {
  .el-drawer__body {
    padding: 0;
  }
}

.mobile-menu {
  :deep(.el-menu-item) {
    height: 50px;
    line-height: 50px;
    color: var(--text-color);

    .el-icon {
      font-size: 18px;
      color: var(--text-color);
    }

    &:hover, &.is-active {
      background-color: var(--input-bg-color);
      color: var(--el-color-primary);

      .el-icon {
        color: var(--el-color-primary);
      }
    }
  }
}

.mobile-menu-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.1);
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .user-center {
    .user-aside {
      width: 200px !important;
    }
  }
}

@media (max-width: 768px) {
  .user-center {
    .user-aside {
      display: none;
    }
    
    .main-content {
      padding: 0;
    }
    
    .content-wrapper {
      padding: 15px;
    }
  }
}

@media (max-width: 480px) {
  .user-center {
    .content-wrapper {
      padding: 10px;
    }
  }
}
</style> 