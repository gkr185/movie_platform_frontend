<template>
  <div class="history-container">
    <template v-if="isLoggedIn">
      <div class="history-header">
        <h2>观看历史</h2>
        <div class="header-actions">
          <el-button type="danger" plain @click="handleClearHistory" :disabled="!watchHistory.length">
            清空历史
          </el-button>
        </div>
      </div>

      <el-empty v-if="!watchHistory.length" description="暂无观看历史" />

      <div v-else class="history-list">
        <div class="toolbar">
          <el-button-group>
            <el-button size="small" type="primary" plain>全部</el-button>
            <el-button size="small">今天</el-button>
            <el-button size="small">本周</el-button>
            <el-button size="small">本月</el-button>
          </el-button-group>
        </div>

        <el-timeline>
          <el-timeline-item
            v-for="item in watchHistory"
            :key="item.id"
            :timestamp="item.date"
            placement="top"
          >
            <el-card class="history-card">
              <div class="history-content">
                <img :src="item.cover" class="history-cover">
                <div class="history-info">
                  <h3>{{ item.title }}</h3>
                  <p class="progress">观看至 {{ item.progress }}</p>
                  <div class="actions">
                    <el-button type="primary" size="small">继续观看</el-button>
                    <el-button type="text" size="small">删除记录</el-button>
                  </div>
                </div>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>

        <div class="load-more">
          <el-button type="text">加载更多</el-button>
        </div>
      </div>
    </template>
    <el-empty v-else description="请先登录" />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'

export default {
  name: 'WatchHistory',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const isLoggedIn = computed(() => store.getters.isLoggedIn)
    const watchHistory = computed(() => store.getters.watchHistory)

    const handleClearHistory = () => {
      // Implement the logic to clear the history
    }

    return {
      isLoggedIn,
      watchHistory,
      handleClearHistory
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
      }

      .history-info {
        flex: 1;

        h3 {
          margin: 0 0 8px;
          font-size: 16px;
          color: var(--text-color);
        }

        .progress {
          color: var(--text-color-light);
          margin: 0 0 15px;
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
    background-color: #409EFF;
  }

  :deep(.el-timeline-item__timestamp) {
    color: var(--text-color-light);
  }
}
</style> 