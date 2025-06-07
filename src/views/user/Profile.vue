<template>
  <div class="profile-container">
    <el-card class="profile-card" v-if="currentUser">
      <div class="profile-header">
        <div class="avatar-container">
          <el-avatar :size="100" :src="currentUser.avatar" />
          <div class="vip-badge" v-if="isVIP">
            <el-tag type="warning">VIP</el-tag>
            <span class="expire-date">到期时间: {{ vipExpireDate }}</span>
          </div>
        </div>
        <div class="user-info">
          <h2>{{ currentUser.name }}</h2>
          <p>{{ currentUser.email }}</p>
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
          </div>
          <div class="stat-item">
            <h4>注册时间</h4>
            <p>2024-01-01</p>
          </div>
        </div>
      </div>
    </el-card>
    <el-empty v-else description="请先登录" />
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

export default {
  name: 'UserProfile',
  setup() {
    const store = useStore()
    
    const currentUser = computed(() => store.getters.currentUser)
    const isVIP = computed(() => store.getters.isVIP)
    const vipExpireDate = computed(() => store.getters.vipExpireDate)
    const watchHistory = computed(() => store.getters.watchHistory)
    const favorites = computed(() => store.getters.favorites)
    
    const settings = computed(() => store.getters.userSettings || {
      theme: 'light',
      playbackQuality: '1080p',
      autoPlay: true,
      notifications: true
    })

    const isDarkTheme = computed(() => settings.value.theme === 'dark')

    const handleThemeChange = async (value) => {
      try {
        await store.dispatch('updateUserSettings', {
          theme: value ? 'dark' : 'light'
        })
        store.commit('TOGGLE_THEME')
        ElMessage.success('主题设置已更新')
      } catch (error) {
        ElMessage.error('更新设置失败')
      }
    }

    const handleSettingChange = async () => {
      try {
        await store.dispatch('updateUserSettings', settings.value)
        ElMessage.success('设置已更新')
      } catch (error) {
        ElMessage.error('更新设置失败')
      }
    }

    return {
      currentUser,
      isVIP,
      vipExpireDate,
      watchHistory,
      favorites,
      settings,
      isDarkTheme,
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
}

.expire-date {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.user-info h2 {
  margin: 0 0 10px 0;
  color: var(--el-text-color-primary);
}

.user-info p {
  margin: 0;
  color: var(--el-text-color-secondary);
}

.settings-section,
.stats-section {
  margin: 20px 0;
}

.settings-section h3,
.stats-section h3 {
  margin-bottom: 20px;
  color: var(--el-text-color-primary);
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
</style> 