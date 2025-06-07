<template>
  <div class="nav-menu-wrapper" v-show="isOpen">
    <!-- 遮罩层 -->
    <transition name="fade">
      <div 
        class="menu-overlay" 
        v-show="isOpen && !isClosing"
        @click="close"
      ></div>
    </transition>

    <!-- 侧边菜单 -->
    <transition name="slide">
      <div class="side-menu" v-show="isOpen && !isClosing">
        <div>
          <!-- 使用 MenuButton 组件 -->
          <MenuButton 
            :is-open="isOpen" 
            @toggle-menu="close"
          />
          <!-- 使用 NavMenuItems 组件 -->
          <NavMenuItems 
            :is-closing="isClosing"
            @click="close" 
          />
        </div>
        <div class="bottom-actions">
          <!-- 用户信息部分（需要登录） -->
          <div class="user-actions" v-if="isLoggedIn">
            <div class="user-info">
              <el-avatar :size="32" :src="userAvatar"></el-avatar>
              <span class="username">{{ username }}</span>
            </div>
            <div class="action-buttons">
              <el-button type="text" @click="handleUserCenter">个人中心</el-button>
              <el-button type="text" @click="handleLogout">退出登录</el-button>
            </div>
          </div>
          <!-- 未登录状态显示登录按钮 -->
          <div class="login-action" v-else>
            <el-button type="text" @click="$router.push('/user/login')">登录</el-button>
          </div>
          <!-- 主题切换按钮（始终显示） -->
          <div class="theme-action">
            <el-button type="text" class="theme-toggle" @click="toggleTheme">
              <el-icon class="theme-icon">
                <Moon v-if="currentTheme === 'light'" />
                <Sunny v-else />
              </el-icon>
              {{ currentTheme === 'light' ? '深色模式' : '浅色模式' }}
            </el-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import NavMenuItems from './NavMenuItems.vue'
import MenuButton from './MenuButton.vue'
import { mapState } from 'vuex'
import { Moon, Sunny } from '@element-plus/icons-vue'

export default {
  name: 'NavMenu',
  components: {
    NavMenuItems,
    MenuButton,
    Moon,
    Sunny
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      isClosing: false
    }
  },
  computed: {
    ...mapState({
      isLoggedIn: state => !!state.token,
      username: state => state.user?.name || '',
      userAvatar: state => state.user?.avatar || '',
      currentTheme: state => state.theme
    })
  },
  methods: {
    close() {
      this.isClosing = true
      // 等待所有动画完成后再关闭
      const animationDuration = 500 // 总动画时长
      setTimeout(() => {
        this.$emit('update:isOpen', false)
        this.isClosing = false
      }, animationDuration)
    },
    handleUserCenter() {
      this.$router.push('/user/profile')
      this.close()
    },
    handleLogout() {
      this.$store.commit('LOGOUT')
      this.$message.success('退出登录成功')
      this.$router.push('/login')
      this.close()
    },
    toggleTheme() {
      this.$store.commit('TOGGLE_THEME')
    }
  },
  watch: {
    isOpen(val) {
      document.body.style.overflow = val ? 'hidden' : 'auto'
      if (val) {
        this.isClosing = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-menu-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
}

// 遮罩层动画
.fade-enter-active {
  transition: opacity 0.3s ease-out;
}

.fade-leave-active {
  transition: opacity 0.3s ease-in;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
}

// 侧边栏动画
.slide-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0, 1);
}

.slide-leave-active {
  transition: all 0.3s cubic-bezier(1, 0, 0.8, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.side-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 38vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #000000;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  overflow-y: auto;
}

.bottom-actions {
  padding: 20px 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.user-actions {
  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    
    .username {
      margin-left: 10px;
      color: #fff;
      font-size: 16px;
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    
    .el-button {
      color: #fff;
      
      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
}

.login-action {
  .el-button {
    color: #fff;
    font-size: 16px;
    
    &:hover {
      color: var(--el-color-primary);
    }
  }
}

.theme-action {
  .theme-toggle {
    color: #fff;
    display: flex;
    align-items: center;
    gap: 8px;
    
    .theme-icon {
      font-size: 18px;
    }
    
    &:hover {
      color: var(--el-color-primary);
    }
  }
}

@media (max-width: 768px) {
  .side-menu {
    width: 75vw;
  }
}
</style> 