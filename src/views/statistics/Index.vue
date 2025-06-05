<template>
  <div class="statistics">
    <el-row :gutter="20">
      <!-- 数据概览卡片 -->
      <el-col :span="24">
        <el-card class="overview-card">
          <div class="card-header">
            <h2>数据概览</h2>
            <el-radio-group v-model="timeRange" size="small">
              <el-radio-button label="week">本周</el-radio-button>
              <el-radio-button label="month">本月</el-radio-button>
              <el-radio-button label="year">全年</el-radio-button>
            </el-radio-group>
          </div>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-title">总观影时长</div>
                <div class="stat-value">120小时</div>
                <div class="stat-compare">较上期 +20%</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-title">观影次数</div>
                <div class="stat-value">48次</div>
                <div class="stat-compare">较上期 +15%</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-title">收藏数量</div>
                <div class="stat-value">32部</div>
                <div class="stat-compare">较上期 +10%</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-title">评分数量</div>
                <div class="stat-value">25次</div>
                <div class="stat-compare">较上期 +5%</div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <!-- 观影时长趋势图 -->
      <el-col :span="16">
        <el-card class="chart-card">
          <div class="card-header">
            <h3>观影时长趋势</h3>
          </div>
          <div class="chart-container" style="height: 300px">
            <!-- 这里放echarts图表 -->
          </div>
        </el-card>
      </el-col>

      <!-- 偏好分类饼图 -->
      <el-col :span="8">
        <el-card class="chart-card">
          <div class="card-header">
            <h3>观影类型偏好</h3>
          </div>
          <div class="chart-container" style="height: 300px">
            <!-- 这里放echarts饼图 -->
          </div>
        </el-card>
      </el-col>

      <!-- 观影详情列表 -->
      <el-col :span="24">
        <el-card class="detail-card">
          <div class="card-header">
            <h3>观影详情</h3>
            <el-button type="text">查看更多</el-button>
          </div>
          <el-table :data="watchHistory" style="width: 100%">
            <el-table-column prop="date" label="观看日期" width="180"></el-table-column>
            <el-table-column prop="title" label="影片名称"></el-table-column>
            <el-table-column prop="duration" label="观看时长" width="120"></el-table-column>
            <el-table-column prop="progress" label="观看进度" width="120"></el-table-column>
            <el-table-column prop="category" label="分类" width="120"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Statistics',
  data() {
    return {
      timeRange: 'month',
      watchHistory: [
        {
          date: '2024-01-20',
          title: '流浪地球2',
          duration: '2小时30分',
          progress: '100%',
          category: '科幻'
        },
        // 更多数据...
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.statistics {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2, h3 {
      margin: 0;
    }
  }

  .overview-card {
    margin-bottom: 20px;
  }

  .stat-item {
    text-align: center;
    padding: 20px;

    .stat-title {
      color: #666;
      font-size: 14px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: bold;
      margin: 10px 0;
      color: #409EFF;
    }

    .stat-compare {
      font-size: 12px;
      color: #67C23A;
    }
  }

  .chart-card {
    margin-bottom: 20px;
  }

  .chart-container {
    background-color: #f5f7fa;
    border-radius: 4px;
  }
}
</style> 