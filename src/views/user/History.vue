<template>
  <div class="history-container">
    <template v-if="isLoggedIn">
      <div class="history-header">
        <h2>观看历史</h2>
        <div class="header-actions">
          <el-button 
            type="danger" 
            plain 
            @click="handleClearHistory" 
            :disabled="!historyList?.length"
          >
            清空历史
          </el-button>
        </div>
      </div>

      <el-empty v-if="!historyList?.length" description="暂无观看历史" />

      <div v-else class="history-list">
        <div class="toolbar">
          <el-button-group>
            <el-button 
              size="small" 
              :type="currentFilter === 'all' ? 'primary' : ''" 
              @click="setFilter('all')"
            >全部</el-button>
            <el-button 
              size="small" 
              :type="currentFilter === 'today' ? 'primary' : ''" 
              @click="setFilter('today')"
            >今天</el-button>
            <el-button 
              size="small" 
              :type="currentFilter === 'week' ? 'primary' : ''" 
              @click="setFilter('week')"
            >本周</el-button>
            <el-button 
              size="small" 
              :type="currentFilter === 'month' ? 'primary' : ''" 
              @click="setFilter('month')"
            >本月</el-button>
          </el-button-group>
        </div>

        <el-timeline v-loading="loading">
          <el-timeline-item
            v-for="item in filteredHistory"
            :key="item.id"
            :timestamp="formatTime(item.createTime)"
            placement="top"
          >
            <el-card class="history-card">
              <div class="history-content">
                <img :src="item.posterUrl" class="history-cover" @click="handleContinueWatch(item)">
                <div class="history-info">
                  <h3>{{ item.title }}</h3>
                  <div class="meta-info">
                    <span class="genres">{{ item.genres }}</span>
                    <span class="duration">{{ item.runtime }}分钟</span>
                  </div>
                  <div class="progress-info">
                    <div class="progress-text">
                      观看至 {{ formatLastPosition(item.progress) }}
                      <span class="progress-percent">({{ formatProgress(item) }})</span>
                    </div>
                    <el-progress 
                      :percentage="(item.progress / item.runtime) * 100" 
                      :format="() => ''" 
                      :stroke-width="4"
                    />
                  </div>
                  <div class="actions">
                    <el-button 
                      type="primary" 
                      size="small"
                      @click="handleContinueWatch(item)"
                    >继续观看</el-button>
                    <el-button 
                      type="text" 
                      size="small"
                      @click="handleRemoveHistory(item.id)"
                    >删除记录</el-button>
                  </div>
                </div>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>

        <div class="load-more" v-if="hasMore">
          <el-button type="text" @click="loadMore" :loading="loading">加载更多</el-button>
        </div>
      </div>
    </template>
    <el-empty v-else description="请先登录" />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { format, isToday, isThisWeek, isThisMonth } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default {
  name: 'WatchHistory',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const currentFilter = ref('all')
    const pageSize = ref(10)
    const currentPage = ref(1)
    const loading = ref(false)
    
    const isLoggedIn = computed(() => store.getters['user/isLoggedIn'])
    const historyList = computed(() => store.getters['user/historyList'] || [])
    const historyTotal = computed(() => store.getters['user/historyTotal'] || 0)

    // 根据时间筛选历史记录
    const filteredHistory = computed(() => {
      if (!historyList.value) return []
      
      let filtered = [...historyList.value]
      
      switch (currentFilter.value) {
        case 'today':
          filtered = filtered.filter(item => 
            isToday(new Date(item.createTime))
          )
          break
        case 'week':
          filtered = filtered.filter(item => 
            isThisWeek(new Date(item.createTime), { locale: zhCN })
          )
          break
        case 'month':
          filtered = filtered.filter(item => 
            isThisMonth(new Date(item.createTime))
          )
          break
      }
      
      return filtered
    })

    const hasMore = computed(() => {
      return (historyTotal.value || 0) > currentPage.value * pageSize.value
    })

    // 获取观看历史列表
    const fetchHistoryList = async () => {
      if (!isLoggedIn.value) return
      
      try {
        loading.value = true
        const { records, total } = await store.dispatch('user/fetchHistoryList', {
          page: currentPage.value - 1, // 后端分页从0开始
          size: pageSize.value
        })
        console.log('获取到的观看历史:', { records, total })
      } catch (error) {
        console.error('获取观看历史失败:', error)
        ElMessage.error('获取观看历史失败')
      } finally {
        loading.value = false
      }
    }

    const handleClearHistory = async () => {
      if (!historyList.value?.length) return
      
      try {
        await ElMessageBox.confirm(
          '确定要清空所有观看历史吗？此操作不可恢复。',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        await store.dispatch('user/clearAllHistory')
        ElMessage.success('观看历史已清空')
      } catch (error) {
        if (error !== 'cancel') {
          console.error('清空历史失败:', error)
          ElMessage.error('操作失败，请重试')
        }
      }
    }

    const handleRemoveHistory = async (movieId) => {
      try {
        await store.dispatch('user/deleteHistory', movieId)
        ElMessage.success('记录已删除')
      } catch (error) {
        console.error('删除历史记录失败:', error)
        ElMessage.error('删除失败，请重试')
      }
    }

    const handleContinueWatch = (movie) => {
      router.push(`/movie/${movie.id}/play`)
    }

    const formatTime = (time) => {
      if (!time) return ''
      try {
        return format(new Date(time), 'yyyy-MM-dd HH:mm')
      } catch (error) {
        console.error('时间格式化失败:', error)
        return ''
      }
    }

    const formatProgress = (item) => {
      if (!item?.progress || !item?.runtime) return '0%'
      try {
        const percentage = (item.progress / item.runtime) * 100
        return `${Math.round(percentage)}%`
      } catch (error) {
        console.error('进度计算失败:', error)
        return '0%'
      }
    }

    const formatLastPosition = (seconds) => {
      if (!seconds) return '0:00'
      try {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = Math.floor(seconds % 60)
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
      } catch (error) {
        console.error('时间格式化失败:', error)
        return '0:00'
      }
    }

    const setFilter = (filter) => {
      currentFilter.value = filter
      currentPage.value = 1
      fetchHistoryList()
    }

    const loadMore = () => {
      currentPage.value++
      fetchHistoryList()
    }

    onMounted(() => {
      if (isLoggedIn.value) {
        fetchHistoryList()
      }
    })

    return {
      isLoggedIn,
      historyList,
      filteredHistory,
      currentFilter,
      hasMore,
      loading,
      handleClearHistory,
      handleRemoveHistory,
      handleContinueWatch,
      formatTime,
      formatProgress,
      formatLastPosition,
      setFilter,
      loadMore
    }
  }
}
</script>

<style lang="scss" scoped>
.history-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: var(--card-bg-color);
  color: var(--text-color);
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);

  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      margin: 0;
      color: var(--text-color);
    }

    .header-actions {
      .el-button + .el-button {
        margin-left: 10px;
      }
    }
  }

  .history-list {
    .toolbar {
      margin-bottom: 20px;
    }

    .history-card {
      background-color: var(--card-bg-color);
      border-color: var(--border-color);

      .history-content {
        display: flex;
        gap: 20px;
      }

      .history-cover {
        width: 160px;
        height: 90px;
        object-fit: cover;
        border-radius: 4px;
        cursor: pointer;
        transition: opacity 0.3s;

        &:hover {
          opacity: 0.8;
        }
      }

      .history-info {
        flex: 1;

        h3 {
          margin: 0 0 8px;
          font-size: 16px;
          color: var(--text-color);
        }

        .meta-info {
          margin-bottom: 10px;
          color: var(--text-color-light);

          span {
            margin-right: 15px;

            &:last-child {
              margin-right: 0;
            }
          }
        }

        .progress-info {
          margin-bottom: 15px;

          .progress-text {
            margin-bottom: 5px;
            color: var(--text-color-light);
            font-size: 14px;

            .progress-percent {
              margin-left: 10px;
              color: var(--el-color-primary);
            }
          }
        }

        .actions {
          .el-button + .el-button {
            margin-left: 10px;
          }
        }
      }
    }
  }

  .load-more {
    text-align: center;
    margin-top: 20px;
  }

  :deep(.el-timeline-item__tail) {
    border-left: 2px solid var(--border-color);
  }

  :deep(.el-timeline-item__node) {
    background-color: var(--el-color-primary);
  }

  :deep(.el-timeline-item__timestamp) {
    color: var(--text-color-light);
  }
}
</style> 