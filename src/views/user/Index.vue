<template>
  <div class="user-center">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="user-sidebar">
          <div class="user-info">
            <el-avatar :size="64" :src="userAvatar">
              <el-icon><UserFilled /></el-icon>
            </el-avatar>
            <template v-if="!isCollapse">
              <h3>{{ username }}</h3>
              <p :class="{ 'vip-text': isVIP }">
                {{ isVIP ? 'VIP会员' : '普通用户' }}
                <el-tag v-if="isVIP" size="small" type="warning">
                  {{ vipExpireDate ? `到期时间：${formatDate(vipExpireDate)}` : 'VIP' }}
                </el-tag>
              </p>
            </template>
          </div>
          <el-menu
            :default-active="activeMenu"
            class="user-menu"
            router
            :collapse="isCollapse"
            @select="handleSelect"
          >
            <el-menu-item index="/user/profile">
              <el-icon><User /></el-icon>
              <template #title>个人资料</template>
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
            <el-menu-item index="/user/statistics">
              <el-icon><DataLine /></el-icon>
              <template #title>数据统计</template>
            </el-menu-item>
          </el-menu>
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
      <el-main>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { 
  User, UserFilled, Trophy, Star, Timer, 
  DataLine, Fold, Expand 
} from '@element-plus/icons-vue'

export default {
  name: 'UserCenter',
  components: {
    User, UserFilled, Trophy, Star, Timer, 
    DataLine, Fold, Expand
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const isCollapse = ref(false)

    const username = computed(() => store.state.user?.name || '未登录')
    const userAvatar = computed(() => store.state.user?.avatar || '')
    const isVIP = computed(() => store.getters.isVIP)
    const vipExpireDate = computed(() => store.getters.vipExpireDate)
    const activeMenu = computed(() => route.path)

    const toggleCollapse = () => {
      isCollapse.value = !isCollapse.value
    }

    const handleSelect = (index) => {
      // 可以在这里添加菜单选择的处理逻辑
    }

    const formatDate = (date) => {
      if (!date) return ''
      return new Date(date).toLocaleDateString()
    }

    return {
      username,
      userAvatar,
      isVIP,
      vipExpireDate,
      activeMenu,
      isCollapse,
      toggleCollapse,
      handleSelect,
      formatDate
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

  .el-aside {
    background-color: var(--card-bg-color);
    border-right: 1px solid var(--border-color);
    transition: width 0.3s;
    
    .user-sidebar {
      height: 100%;
      position: relative;

      .user-info {
        padding: 20px;
        text-align: center;
        border-bottom: 1px solid var(--border-color);
        transition: all 0.3s;

        .el-avatar {
          margin-bottom: 10px;
          border: 2px solid var(--border-color);
          transition: transform 0.3s;

          &:hover {
            transform: scale(1.05);
          }
        }

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

      .user-menu {
        border-right: none;
        background-color: transparent;

        .el-menu-item {
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
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        background-color: var(--input-bg-color);
        transition: all 0.3s;

        &:hover {
          background-color: var(--el-color-primary-light-9);
          color: var(--el-color-primary);
        }
      }
    }
  }

  .el-main {
    padding: 20px;
    background-color: var(--bg-color);
    margin: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}

// 路由过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 响应式设计
@media screen and (max-width: 768px) {
  .user-center {
    .el-aside {
      position: fixed;
      z-index: 1000;
      height: 100vh;
    }

    .el-main {
      margin-left: 64px;
    }
  }
}
</style> 