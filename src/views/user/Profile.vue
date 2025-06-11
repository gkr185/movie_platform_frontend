<template>
  <div class="profile-container">
    <el-card class="profile-card" v-loading="loading">
      <template v-if="userInfo">
      <div class="profile-header">
        <div class="avatar-container">
            <el-avatar :size="100" :src="userInfo.avatar">
              <el-icon><UserFilled /></el-icon>
            </el-avatar>
          <div class="vip-badge" v-if="isVIP">
            <el-tag type="warning">VIP</el-tag>
              <span class="expire-date">到期时间: {{ new Date(vipExpireTime).toLocaleDateString() }}</span>
          </div>
        </div>
        <div class="user-info">
            <h2>{{ userInfo.username }}</h2>
            <p>{{ userInfo.email }}</p>
            <p v-if="userInfo.phone">{{ userInfo.phone }}</p>
        </div>
      </div>

      <el-divider />

      <div class="settings-section">
        <h3>个人设置</h3>
        <el-form :model="settings" label-width="120px">
          <el-form-item label="主题模式">
            <el-switch
              v-model="isDarkTheme"
              active-text="深色"
              inactive-text="浅色"
              @change="handleThemeChange"
            />
          </el-form-item>
          <el-form-item label="播放画质">
            <el-select v-model="settings.playbackQuality" @change="handleSettingChange">
              <el-option label="720p" value="720p" />
              <el-option label="1080p" value="1080p" />
              <el-option 
                label="4K" 
                value="4k"
                :disabled="!isVIP"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="自动播放">
            <el-switch
              v-model="settings.autoPlay"
              @change="handleSettingChange"
            />
          </el-form-item>
          <el-form-item label="消息通知">
            <el-switch
              v-model="settings.notifications"
              @change="handleSettingChange"
            />
          </el-form-item>
        </el-form>
      </div>

      <el-divider />

      <div class="stats-section">
        <h3>账户统计</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <h4>观看历史</h4>
            <p>{{ watchHistory.length }} 部</p>
          </div>
          <div class="stat-item">
            <h4>收藏影片</h4>
            <p>{{ favorites.length }} 部</p>
          </div>
          <div class="stat-item">
            <h4>会员状态</h4>
            <p>{{ isVIP ? 'VIP会员' : '普通用户' }}</p>
              <p class="debug-info">is_vip: {{ userInfo?.is_vip }}</p>
          </div>
          <div class="stat-item">
            <h4>注册时间</h4>
              <p>{{ new Date(userInfo.registerTime).toLocaleDateString() }}</p>
            </div>
          </div>
        </div>
      </template>
      <el-empty v-else description="请先登录" />
    </el-card>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { UserFilled } from '@element-plus/icons-vue'
import { updateUserInfo } from '@/api/user'

export default {
  name: 'UserProfile',
  components: {
    UserFilled
  },
  setup() {
    const store = useStore()
    const loading = ref(false)
    
    // 从store获取用户信息
    const userInfo = computed(() => store.getters['user/userInfo'])
    const isVIP = computed(() => userInfo.value?.isVip === 1)
    const vipExpireTime = computed(() => userInfo.value?.vipExpireTime)
    const watchHistory = computed(() => store.state.user.watchHistory)
    const favorites = computed(() => store.state.user.favorites)
    
    const settings = ref({
      theme: 'light',
      playbackQuality: '1080p',
      autoPlay: true,
      notifications: true
    })

    // 初始化用户设置
    const initUserSettings = () => {
      if (userInfo.value && userInfo.value.settings) {
        settings.value = { ...settings.value, ...userInfo.value.settings }
      }
    }

    const isDarkTheme = computed(() => settings.value.theme === 'dark')

    // 加载用户信息
    const loadUserInfo = async () => {
      try {
        loading.value = true
        await store.dispatch('user/getUserInfo')
        console.log('用户信息:', userInfo.value)
        console.log('VIP状态:', userInfo.value?.isVip)
        console.log('VIP到期时间:', userInfo.value?.vipExpireTime)
        console.log('计算属性isVIP:', isVIP.value)
        initUserSettings()
      } catch (error) {
        ElMessage.error('获取用户信息失败')
        console.error('获取用户信息失败:', error)
      } finally {
        loading.value = false
      }
    }

    // 处理主题变更
    const handleThemeChange = async (value) => {
      try {
        loading.value = true
        const newSettings = {
          ...settings.value,
          theme: value ? 'dark' : 'light'
        }
        
        await store.dispatch('user/updateUserSettings', newSettings)
        settings.value = newSettings
        document.documentElement.setAttribute('data-theme', value ? 'dark' : 'light')
        ElMessage.success('主题设置已更新')
      } catch (error) {
        ElMessage.error('更新设置失败')
        console.error('更新主题设置失败:', error)
      } finally {
        loading.value = false
      }
    }

    // 处理设置变更
    const handleSettingChange = async () => {
      try {
        loading.value = true
        await store.dispatch('user/updateUserSettings', settings.value)
        ElMessage.success('设置已更新')
      } catch (error) {
        ElMessage.error('更新设置失败')
        console.error('更新设置失败:', error)
      } finally {
        loading.value = false
      }
    }

    // 组件挂载时加载用户信息
    onMounted(() => {
      loadUserInfo()
    })

    return {
      userInfo,
      isVIP,
      vipExpireTime,
      watchHistory,
      favorites,
      settings,
      isDarkTheme,
      loading,
      handleThemeChange,
      handleSettingChange
    }
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}

.profile-card {
  border-radius: 8px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 20px;
}

.avatar-container {
  position: relative;
}

.vip-badge {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.expire-date {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}

.user-info h2 {
  margin: 0 0 10px 0;
  color: var(--text-color);
}

.user-info p {
  margin: 0;
  color: var(--text-color);
}

.settings-section,
.stats-section {
  margin: 20px 0;
}

.settings-section h3,
.stats-section h3 {
  margin-bottom: 20px;
  color: var(--text-color);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background-color: var(--el-bg-color-page);
  border-radius: 8px;
}

.stat-item h4 {
  margin: 0 0 10px 0;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.stat-item p {
  margin: 0;
  color: var(--el-text-color-primary);
  font-size: 24px;
  font-weight: bold;
}

.debug-info {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}
</style> 