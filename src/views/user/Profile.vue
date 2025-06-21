<template>
  <div class="profile-page">
    <!-- 页面头部 -->
    <div class="profile-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">
            <el-icon class="title-icon"><User /></el-icon>
            个人中心
          </h1>
          <p class="page-subtitle">管理您的个人信息和偏好设置</p>
        </div>
        <div class="header-decoration">
          <div class="decoration-shape shape-1"></div>
          <div class="decoration-shape shape-2"></div>
          <div class="decoration-shape shape-3"></div>
        </div>
      </div>
    </div>

    <!-- 个人资料内容 -->
    <div class="profile-container">
      <div class="profile-content" v-loading="loading">
        <template v-if="userInfo">
          <!-- 用户信息卡片 -->
          <div class="user-info-section">
            <div class="user-card">
              <div class="user-avatar-container">
                <div class="avatar-wrapper">
                  <el-avatar :size="120" :src="userInfo.avatar" class="user-avatar">
                    <el-icon size="60"><UserFilled /></el-icon>
                  </el-avatar>
                </div>
              </div>
              
              <div class="user-details">
                <h2 class="username">{{ userInfo.username }}</h2>
                <div class="user-meta">
                  <div class="meta-item">
                    <el-icon><Message /></el-icon>
                    <span>{{ userInfo.email || '未设置邮箱' }}</span>
                  </div>
                  <div class="meta-item" v-if="userInfo.phone">
                    <el-icon><Phone /></el-icon>
                    <span>{{ userInfo.phone }}</span>
                  </div>
                  <div class="meta-item">
                    <el-icon><Calendar /></el-icon>
                    <span>{{ formatRegisterTime(userInfo.registerTime) }} 注册</span>
                  </div>
                </div>
                
                <div class="user-badges">
                  <el-tag v-if="isVIP" type="warning" size="large" class="member-tag">
                    VIP会员
                  </el-tag>
                  <el-tag v-else type="info" size="large" class="member-tag">
                    普通用户
                  </el-tag>
                  <el-tag class="days-tag">
                    {{ getDaysFromRegister(userInfo.registerTime) }} 
                  </el-tag>
                </div>
              </div>
            </div>
          </div>

          <!-- 统计数据区域 -->
          <div class="stats-section">
            <div class="section-header">
              <h3 class="section-title">
                <el-icon><TrendCharts /></el-icon>
                账户统计
              </h3>
              <p class="section-subtitle">您的观影数据一览</p>
            </div>
            
            <div class="stats-grid">
              <div class="stat-card watch-history">
                <div class="stat-icon-wrapper">
                  <el-icon class="stat-icon"><VideoPlay /></el-icon>
                  <div class="icon-bg"></div>
                </div>
                <div class="stat-content">
                  <h4 class="stat-title">观看历史</h4>
                  <div class="stat-value">{{ historyTotal || watchHistory.length }}</div>
                  <div class="stat-unit">部影片</div>
                  <div class="stat-description">总观看影片数量</div>
                </div>
                <div class="stat-trend">
                  <el-icon class="trend-icon"><CaretTop /></el-icon>
                </div>
              </div>

              <div class="stat-card favorites">
                <div class="stat-icon-wrapper">
                  <el-icon class="stat-icon"><Star /></el-icon>
                  <div class="icon-bg"></div>
                </div>
                <div class="stat-content">
                  <h4 class="stat-title">收藏影片</h4>
                  <div class="stat-value">{{ favorites.length }}</div>
                  <div class="stat-unit">部影片</div>
                  <div class="stat-description">已收藏的影片</div>
                </div>
                <div class="stat-trend">
                  <el-icon class="trend-icon"><Star /></el-icon>
                </div>
              </div>

              <div class="stat-card watch-time">
                <div class="stat-icon-wrapper">
                  <el-icon class="stat-icon"><Timer /></el-icon>
                  <div class="icon-bg"></div>
                </div>
                <div class="stat-content">
                  <h4 class="stat-title">观影时长</h4>
                  <div class="stat-value">{{ getTotalHours(totalWatchTime) }}</div>
                  <div class="stat-unit">小时</div>
                  <div class="stat-description">累计观看时长</div>
                </div>
                <div class="stat-trend">
                  <el-icon class="trend-icon"><Timer /></el-icon>
                </div>
              </div>

                             <div class="stat-card member-status" :class="{ 'vip-status': isVIP }">
                 <div class="stat-icon-wrapper">
                   <el-icon class="stat-icon">
                     <Trophy v-if="isVIP" />
                     <User v-else />
                   </el-icon>
                   <div class="icon-bg"></div>
                 </div>
                 <div class="stat-content">
                   <h4 class="stat-title">会员状态</h4>
                   <div class="stat-value">{{ isVIP ? 'VIP' : '普通' }}</div>
                   <div class="stat-unit">会员</div>
                   <div class="stat-description" v-if="isVIP && vipExpireTime">
                     {{ formatDate(vipExpireTime) }} 到期
                   </div>
                   <div class="stat-description" v-else>
                     升级享受更多权益
                   </div>
                 </div>
                 <div class="stat-trend">
                   <el-icon class="trend-icon">
                     <Trophy v-if="isVIP" />
                     <ArrowRight v-else />
                   </el-icon>
                 </div>
               </div>

              <div class="stat-card monthly-stats">
                <div class="stat-icon-wrapper">
                  <el-icon class="stat-icon"><Calendar /></el-icon>
                  <div class="icon-bg"></div>
                </div>
                <div class="stat-content">
                  <h4 class="stat-title">本月观影</h4>
                  <div class="stat-value">{{ monthlyStats.count || 0 }}</div>
                  <div class="stat-unit">部影片</div>
                  <div class="stat-description">{{ monthlyStats.hours || 0 }} 小时</div>
                </div>
                <div class="stat-trend">
                  <el-icon class="trend-icon"><TrendCharts /></el-icon>
                </div>
              </div>

              <div class="stat-card register-info">
                <div class="stat-icon-wrapper">
                  <el-icon class="stat-icon"><Clock /></el-icon>
                  <div class="icon-bg"></div>
                </div>
                <div class="stat-content">
                  <h4 class="stat-title">注册时间</h4>
                  <div class="stat-value">{{ getRegisterYear(userInfo.registerTime) }}</div>
                  <div class="stat-unit">年</div>
                  <div class="stat-description">{{ formatRegisterTime(userInfo.registerTime) }}</div>
                </div>
                <div class="stat-trend">
                  <el-icon class="trend-icon"><Clock /></el-icon>
                </div>
              </div>
            </div>
          </div>
        </template>
        
        <!-- 未登录状态 -->
        <div v-else class="empty-container">
          <el-empty description="请先登录">
            <template #image>
              <div class="empty-image">
                <el-icon size="100"><UserFilled /></el-icon>
              </div>
            </template>
            <template #description>
              <p class="empty-description">请先登录查看个人信息</p>
            </template>
            <el-button type="primary" @click="$router.push('/login')">
              立即登录
            </el-button>
          </el-empty>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { 
  UserFilled, 
  VideoPlay, 
  Star, 
  Timer, 
  Calendar, 
  TrendCharts, 
  Crown, 
  User,
  Camera,
  Message,
  Phone,
  CaretTop,
  ArrowRight,
  Clock,
  Trophy
} from '@element-plus/icons-vue'

export default {
  name: 'UserProfile',
  components: {
    UserFilled,
    VideoPlay,
    Star,
    Timer,
    Calendar,
    TrendCharts,
    Crown,
    User,
    Camera,
    Message,
    Phone,
    CaretTop,
    ArrowRight,
    Clock,
    Trophy
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
    const historyTotal = computed(() => store.getters['user/historyTotal'])
    
    // 新增统计数据
    const totalWatchTime = ref(0)
    const monthlyStats = ref({ count: 0, hours: 0 })

    // 加载用户信息
    const loadUserInfo = async () => {
      try {
        loading.value = true
        await store.dispatch('user/getCurrentUser')
        console.log('用户信息:', userInfo.value)
        console.log('VIP状态:', userInfo.value?.isVip)
        console.log('VIP到期时间:', userInfo.value?.vipExpireTime)
        console.log('计算属性isVIP:', isVIP.value)
      } catch (error) {
        ElMessage.error('获取用户信息失败')
        console.error('获取用户信息失败:', error)
      } finally {
        loading.value = false
      }
    }

    // 格式化观看时长
    const formatWatchTime = (minutes) => {
      if (!minutes || minutes === 0) return '0 小时'
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      if (hours > 0) {
        return remainingMinutes > 0 ? `${hours} 小时 ${remainingMinutes} 分钟` : `${hours} 小时`
      }
      return `${remainingMinutes} 分钟`
    }

    // 获取总观影小时数
    const getTotalHours = (minutes) => {
      if (!minutes || minutes === 0) return '0'
      return Math.round(minutes / 60 * 10) / 10
    }

    // 格式化日期
    const formatDate = (date) => {
      if (!date) return '未知'
      try {
        return new Date(date).toLocaleDateString('zh-CN')
      } catch (error) {
        return '未知'
      }
    }

    // 格式化注册时间
    const formatRegisterTime = (time) => {
      if (!time) return '未知'
      try {
        return new Date(time).toLocaleDateString('zh-CN')
      } catch (error) {
        return '未知'
      }
    }

    // 获取注册年份
    const getRegisterYear = (time) => {
      if (!time) return '未知'
      try {
        return new Date(time).getFullYear()
      } catch (error) {
        return '未知'
      }
    }

    // 计算注册天数
    const getDaysFromRegister = (time) => {
      if (!time) return ''
      try {
        const registerDate = new Date(time)
        const now = new Date()
        const diffTime = Math.abs(now - registerDate)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return `已注册 ${diffDays} 天`
      } catch (error) {
        return ''
      }
    }

    // 加载用户统计数据
    const loadUserStats = async () => {
      try {
        if (!userInfo.value?.id) return
        
        // 获取观看统计
        const watchStats = await store.dispatch('user/fetchWatchStats', 'month')
        if (watchStats) {
          totalWatchTime.value = watchStats.totalDuration || 0
          monthlyStats.value = {
            count: watchStats.totalCount || 0,
            hours: Math.round((watchStats.totalDuration || 0) / 60 * 10) / 10
          }
        }
        
        // 获取观看历史总数
        await store.dispatch('user/fetchHistoryList', { page: 0, size: 1 })
        
        // 获取收藏列表
        await store.dispatch('user/fetchFavorites')
      } catch (error) {
        console.error('加载用户统计失败:', error)
      }
    }

    // 组件挂载时加载用户信息
    onMounted(() => {
      loadUserInfo().then(() => {
        loadUserStats()
      })
    })

    return {
      userInfo,
      isVIP,
      vipExpireTime,
      watchHistory,
      favorites,
      historyTotal,
      totalWatchTime,
      monthlyStats,
      loading,
      formatWatchTime,
      getTotalHours,
      formatDate,
      formatRegisterTime,
      getRegisterYear,
      getDaysFromRegister
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background: var(--profile-bg);
  padding-bottom: 40px;
}

.profile-header {
  position: relative;
  background: var(--profile-header-gradient);
  color: white;
  padding: 60px 0 80px;
  margin-bottom: -40px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="hexagon" width="30" height="26" patternUnits="userSpaceOnUse"><polygon points="15,2 27,8 27,20 15,26 3,20 3,8" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23hexagon)"/></svg>');
    opacity: var(--profile-header-pattern-opacity);
  }

  .header-content {
    position: relative;
    z-index: 2;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-left {
      .page-title {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 48px;
        font-weight: 700;
        margin: 0 0 16px;
        text-shadow: var(--profile-header-text-shadow);

        .title-icon {
          font-size: 52px;
          color: rgba(255, 255, 255, 0.9);
        }
      }

      .page-subtitle {
        font-size: 18px;
        margin: 0;
        opacity: 0.9;
        font-weight: 300;
      }
    }

    .header-decoration {
      display: flex;
      gap: 15px;
      opacity: 0.3;

      .decoration-shape {
        width: 40px;
        height: 40px;
        border: 2px solid rgba(255, 255, 255, 0.6);
        animation: rotate 8s ease-in-out infinite;

        &.shape-1 {
          border-radius: 50%;
          animation-delay: 0s;
        }

        &.shape-2 {
          border-radius: 8px;
          animation-delay: 2s;
        }

        &.shape-3 {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          animation-delay: 4s;
        }
      }
    }
  }
}

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 3;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.user-info-section {
       .user-card {
       background: var(--profile-card-bg);
       border-radius: 24px;
       padding: 40px;
       box-shadow: var(--profile-card-shadow);
       border: 1px solid var(--profile-stat-border);
       display: flex;
       align-items: flex-start;
       gap: 40px;
       position: relative;
       overflow: visible;
       min-height: 200px;

      

       .user-avatar-container {
         position: relative;
         text-align: center;
         flex-shrink: 0;

         .avatar-wrapper {
           position: relative;
           display: inline-block;

           .user-avatar {
             box-shadow: var(--profile-avatar-shadow);
             border: 4px solid white;
           }
         }
       }

    .user-details {
      flex: 1;

      .username {
        font-size: 32px;
        font-weight: 700;
        color: var(--profile-title-color);
        margin: 0 0 20px;
      }

      .user-meta {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 24px;

        .meta-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--profile-text-color);
          font-size: 16px;

          .el-icon {
            font-size: 18px;
            color: var(--el-color-primary);
          }
        }
      }

      .user-badges {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-start;

        .member-tag {
          font-size: 14px;
          padding: 10px 18px;
          border-radius: 20px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;

          .el-icon {
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
        }

        .days-tag {
          background: var(--el-color-info-light-8);
          color: var(--el-color-info);
          border: none;
          padding: 10px 18px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          flex-shrink: 0;
        }
      }
    }
  }
}

.stats-section {
  .section-header {
    text-align: center;
    margin-bottom: 40px;

    .section-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      font-size: 28px;
      font-weight: 700;
      color: var(--profile-title-color);
      margin: 0 0 12px;

      .el-icon {
        font-size: 32px;
        color: var(--el-color-primary);
      }
    }

    .section-subtitle {
      font-size: 16px;
      color: var(--profile-meta-color);
      margin: 0;
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }

  .stat-card {
    background: var(--profile-stat-bg);
    border: 1px solid var(--profile-stat-border);
    border-radius: 20px;
    padding: 32px 24px;
    position: relative;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--el-color-primary), var(--el-color-success));
      transform: translateX(-100%);
      transition: transform 0.3s ease;
    }

    &:hover {
      transform: translateY(-8px);
      background: var(--profile-stat-hover-bg);
      border-color: var(--profile-stat-hover-border);
      box-shadow: var(--profile-card-hover-shadow);

      &::before {
        transform: translateX(0);
      }

      .stat-icon-wrapper {
        .stat-icon {
          transform: scale(1.2);
        }

        .icon-bg {
          transform: scale(1.3);
          opacity: 0.3;
        }
      }
    }

         .stat-icon-wrapper {
       position: relative;
       display: flex;
       align-items: center;
       justify-content: center;
       width: 60px;
       height: 60px;
       margin: 0 auto 20px;

       .stat-icon {
         font-size: 32px !important;
         color: var(--el-color-primary) !important;
         transition: transform 0.3s ease;
         z-index: 10 !important;
         position: relative;
         display: flex !important;
         align-items: center;
         justify-content: center;
       }

       .icon-bg {
         position: absolute;
         top: 0;
         left: 0;
         width: 100%;
         height: 100%;
         background: var(--el-color-primary-light-9);
         border-radius: 50%;
         transition: all 0.3s ease;
         opacity: 0.2;
         z-index: 1;
       }
     }

    .stat-content {
      text-align: center;

      .stat-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--profile-text-color);
        margin: 0 0 12px;
      }

      .stat-value {
        font-size: 36px;
        font-weight: 800;
        color: var(--profile-title-color);
        line-height: 1;
        margin-bottom: 4px;
      }

      .stat-unit {
        font-size: 14px;
        color: var(--profile-meta-color);
        margin-bottom: 12px;
      }

      .stat-description {
        font-size: 13px;
        color: var(--profile-meta-color);
        line-height: 1.4;
      }
    }

    .stat-trend {
      position: absolute;
      top: 20px;
      right: 20px;
      opacity: 0.3;

      .trend-icon {
        font-size: 20px;
        color: var(--el-color-success);
      }
    }

         // 特殊卡片样式
     &.vip-status {
       border-color: var(--el-color-warning);

       .stat-icon-wrapper {
         .stat-icon {
           color: var(--el-color-warning) !important;
         }

         .icon-bg {
           background: var(--el-color-warning-light-9);
         }
       }

       .stat-trend .trend-icon {
         color: var(--el-color-warning) !important;
       }
     }

     &.member-status {
       .stat-icon-wrapper {
         .stat-icon {
           z-index: 10;
           position: relative;
         }
       }
     }

    &.watch-history .stat-icon {
      color: var(--el-color-primary);
    }

    &.favorites .stat-icon {
      color: var(--el-color-warning);
    }

    &.watch-time .stat-icon {
      color: var(--el-color-success);
    }

    &.monthly-stats .stat-icon {
      color: var(--el-color-info);
    }

    &.register-info .stat-icon {
      color: var(--el-color-danger);
    }
  }
}

.empty-container {
  padding: 80px 0;
  text-align: center;

  .empty-image {
    color: var(--profile-meta-color);
    margin-bottom: 24px;
  }

  .empty-description {
    color: var(--profile-meta-color);
    font-size: 18px;
    margin: 0 0 24px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .profile-header {
    padding: 40px 0 60px;
    margin-bottom: -30px;

    .header-content {
      flex-direction: column;
      text-align: center;
      gap: 30px;

      .header-left {
        .page-title {
          font-size: 36px;

          .title-icon {
            font-size: 40px;
          }
        }

        .page-subtitle {
          font-size: 16px;
        }
      }

      .header-decoration {
        justify-content: center;

        .decoration-shape {
          width: 30px;
          height: 30px;
        }
      }
    }
  }

  .profile-container {
    padding: 0 15px;
  }

     .user-info-section {
     .user-card {
       flex-direction: column;
       text-align: center;
       padding: 30px 20px;
       gap: 20px;
       min-height: auto;

       .user-details {
         .username {
           font-size: 24px;
         }

         .user-meta {
           align-items: center;
         }

         .user-badges {
           justify-content: center;
           gap: 16px;
           margin-top: 16px;
           flex-direction: row;
           align-items: center;
         }
       }
     }
   }

  .stats-section {
    .stats-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .stat-card {
      padding: 24px 20px;
    }
  }
}

@media (max-width: 480px) {
  .profile-header {
    .header-content {
      .header-left {
        .page-title {
          font-size: 28px;

          .title-icon {
            font-size: 32px;
          }
        }

        .page-subtitle {
          font-size: 14px;
        }
      }
    }
  }

     .user-info-section {
     .user-card {
       padding: 20px 15px 40px;

       .user-avatar-container {
         padding-bottom: 40px;
       }

       .user-details {
         .username {
           font-size: 20px;
         }

         .user-meta {
           .meta-item {
             font-size: 14px;
           }
         }

         .user-badges {
           gap: 12px;
           flex-wrap: wrap;
           
           .member-tag, .days-tag {
             font-size: 13px;
             padding: 8px 14px;
           }
         }
       }
     }
   }

  .stats-section {
    .stat-card {
      padding: 20px 16px;

      .stat-content {
        .stat-value {
          font-size: 28px;
        }
      }
    }
  }
}

// 动画
@keyframes rotate {
  0%, 100% {
    transform: rotate(0deg) scale(1);
  }
  25% {
    transform: rotate(90deg) scale(1.1);
  }
  50% {
    transform: rotate(180deg) scale(1);
  }
  75% {
    transform: rotate(270deg) scale(1.1);
  }
}
</style> 