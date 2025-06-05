<template>
  <div class="history">
    <h2>观看历史</h2>
    
    <!-- 工具栏 -->
    <div class="toolbar">
      <el-button-group>
        <el-button size="small" type="primary" plain>全部</el-button>
        <el-button size="small">今天</el-button>
        <el-button size="small">本周</el-button>
        <el-button size="small">本月</el-button>
      </el-button-group>
      
      <el-button type="danger" size="small" icon="el-icon-delete">清空历史</el-button>
    </div>

    <!-- 历史记录列表 -->
    <div class="history-list">
      <el-timeline>
        <el-timeline-item
          v-for="item in historyItems"
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

      <!-- 加载更多 -->
      <div class="load-more">
        <el-button type="text">加载更多</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserHistory',
  data() {
    return {
      historyItems: [
        {
          id: 1,
          title: '流浪地球2',
          cover: '@/assets/movie1.jpg',
          progress: '01:25:30',
          date: '2024-01-20 20:30'
        },
        {
          id: 2,
          title: '满江红',
          cover: '@/assets/movie2.jpg',
          progress: '00:45:12',
          date: '2024-01-19 15:20'
        }
        // 更多历史记录...
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.history {
  h2 {
    margin-bottom: 20px;
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .history-list {
    .history-card {
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
        }

        .progress {
          color: #666;
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

  // Timeline 样式优化
  ::v-deep .el-timeline-item__tail {
    border-left: 2px solid #e4e7ed;
  }

  ::v-deep .el-timeline-item__node {
    background-color: #409EFF;
  }

  ::v-deep .el-timeline-item__timestamp {
    color: #909399;
  }
}
</style> 