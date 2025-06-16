<template>
  <div class="user-center">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '240px'" class="user-aside">
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
          <el-scrollbar>
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
        <el-main>
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { 
  User, UserFilled, Trophy, Star, Timer, 
  DataLine, Fold, Expand, Plus, SwitchButton, Edit, Lock, ChatLineSquare 
} from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'

export default {
  name: 'UserCenter',
  components: {
    User, UserFilled, Trophy, Star, Timer, 
    DataLine, Fold, Expand, Plus, SwitchButton, Edit, Lock, ChatLineSquare
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const isCollapse = ref(false)
    const loading = ref(false)

    // 从store获取用户信息
    const userInfo = computed(() => store.getters['user/userInfo'])
    const username = computed(() => userInfo.value?.username || '未登录')
    const userAvatar = computed(() => userInfo.value?.avatar || '')
    const isVIP = computed(() => store.getters['user/isVIP'])
    const vipExpireTime = computed(() => store.getters['user/vipExpireTime'])
    const activeMenu = computed(() => route.path)
    const isLoggedIn = computed(() => store.getters['user/isLoggedIn'])

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
      isCollapse.value = !isCollapse.value
    }

    const handleSelect = (index) => {
      if (!isLoggedIn.value && index !== '/user/login' && index !== '/user/register') {
        ElMessage.warning('请先登录')
        router.push('/user/login')
        return
      }
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

    // 组件挂载时加载用户信息
    onMounted(() => {
      loadUserInfo()
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
      handleLogout
    }
  }
}
</script>

<style lang="scss" scoped>
.user-center {
  min-height: calc(100vh - 60px);
  background-color: var(--bg-color);

  .el-container {
    height: 100%;
  }
}

.user-aside {
  transition: width 0.3s;
  background-color: var(--card-bg-color);
  border-right: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
}

.user-sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;

  .user-info {
    padding: 20px;
    text-align: center;
    border-bottom: 1px solid var(--border-color);
    transition: all 0.3s;

    &.collapsed {
      padding: 10px;

      .avatar-wrapper {
        margin-bottom: 0;
      }
    }

    .avatar-wrapper {
      margin-bottom: 10px;
      transition: all 0.3s;

      .el-avatar {
        border: 2px solid var(--border-color);
        transition: all 0.3s;

        &:hover {
          transform: scale(1.05);
        }
      }
    }

    .user-details {
      h3 {
        margin: 10px 0 5px;
        font-size: 16px;
        color: var(--text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      p {
        margin: 0;
        color: var(--text-color-light);
        font-size: 14px;

        &.vip-text {
          color: #e6a23c;
        }

        .el-tag {
          margin-left: 5px;
        }
      }
    }
  }
}

.user-menu {
  flex: 1;
  border-right: none;
  background-color: transparent;

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

.collapse-btn {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  background-color: var(--input-bg-color);
  transition: all 0.3s;

  &:hover {
    background-color: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
  }
}

.main-container {
  background-color: var(--bg-color);
  
  .el-main {
    padding: 20px;
    overflow-x: hidden;
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
</style> 