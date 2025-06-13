<template>
  <div class="statistics">
    <el-row :gutter="20">
      <!-- 数据概览卡片 -->
      <el-col :span="24">
        <el-card class="overview-card">
          <div class="card-header">
            <h2>数据概览</h2>
            <el-radio-group 
              v-model="timeRange" 
              size="small"
              @change="handleTimeRangeChange"
            >
              <el-radio-button label="week">本周</el-radio-button>
              <el-radio-button label="month">本月</el-radio-button>
              <el-radio-button label="year">全年</el-radio-button>
            </el-radio-group>
          </div>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-title">总观影时长</div>
                <div class="stat-value">{{ watchStats?.totalDuration || '0' }}小时</div>
                <div class="stat-compare" :class="{ 'up': watchStats?.durationGrowth > 0 }">
                  较上期 {{ watchStats?.durationGrowth > 0 ? '+' : '' }}{{ watchStats?.durationGrowth }}%
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-title">观影次数</div>
                <div class="stat-value">{{ watchStats?.totalCount || '0' }}次</div>
                <div class="stat-compare" :class="{ 'up': watchStats?.countGrowth > 0 }">
                  较上期 {{ watchStats?.countGrowth > 0 ? '+' : '' }}{{ watchStats?.countGrowth }}%
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-title">收藏数量</div>
                <div class="stat-value">{{ watchStats?.favoriteCount || '0' }}部</div>
                <div class="stat-compare" :class="{ 'up': watchStats?.favoriteGrowth > 0 }">
                  较上期 {{ watchStats?.favoriteGrowth > 0 ? '+' : '' }}{{ watchStats?.favoriteGrowth }}%
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-title">评分数量</div>
                <div class="stat-value">{{ watchStats?.ratingCount || '0' }}次</div>
                <div class="stat-compare" :class="{ 'up': watchStats?.ratingGrowth > 0 }">
                  较上期 {{ watchStats?.ratingGrowth > 0 ? '+' : '' }}{{ watchStats?.ratingGrowth }}%
                </div>
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
          <div class="chart-container trend-chart" style="height: 300px">
            <!-- echarts图表由setup中的方法初始化 -->
          </div>
        </el-card>
      </el-col>

      <!-- 偏好分类饼图 -->
      <el-col :span="8">
        <el-card class="chart-card">
          <div class="card-header">
            <h3>观影类型偏好</h3>
          </div>
          <div class="chart-container pie-chart" style="height: 300px">
            <!-- echarts饼图由setup中的方法初始化 -->
          </div>
        </el-card>
      </el-col>

      <!-- 观影详情列表 -->
      <el-col :span="24">
        <el-card class="detail-card">
          <div class="card-header">
            <h3>观影详情</h3>
            <el-button type="text" @click="$router.push('/user/history')">查看更多</el-button>
          </div>
          <el-table :data="historyList?.slice(0, 5)" style="width: 100%">
            <el-table-column prop="watchTime" label="观看日期" width="180">
              <template #default="{ row }">
                {{ formatDate(row.watchTime) }}
              </template>
            </el-table-column>
            <el-table-column prop="title" label="影片名称"></el-table-column>
            <el-table-column prop="duration" label="观看时长" width="120">
              <template #default="{ row }">
                {{ formatDuration(row.duration) }}
              </template>
            </el-table-column>
            <el-table-column prop="progress" label="观看进度" width="120">
              <template #default="{ row }">
                {{ formatProgress(row.progress) }}
              </template>
            </el-table-column>
            <el-table-column prop="category" label="分类" width="120"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { onMounted, ref, computed, nextTick } from 'vue'
import { useStore } from 'vuex'
import * as echarts from 'echarts/core'
import { LineChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { ElMessage } from 'element-plus'

// 注册必需的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  LineChart,
  PieChart,
  CanvasRenderer
])

export default {
  name: 'Statistics',
  setup() {
    const store = useStore()
    const timeRange = ref('month')
    const trendChart = ref(null)
    const pieChart = ref(null)
    const loading = ref(false)

    const historyList = computed(() => store.getters['user/historyList'] || [])
    const watchStats = computed(() => store.getters['user/watchStats'] || {
      totalDuration: 0,
      totalCount: 0,
      favoriteCount: 0,
      ratingCount: 0,
      durationGrowth: 0,
      countGrowth: 0,
      favoriteGrowth: 0,
      ratingGrowth: 0,
      dates: [],
      durations: []
    })
    const watchPreferences = computed(() => store.getters['user/watchPreferences'] || [
      { value: 0, name: '科幻' },
      { value: 0, name: '动作' },
      { value: 0, name: '喜剧' },
      { value: 0, name: '剧情' },
      { value: 0, name: '其他' }
    ])

    // 获取观看历史列表
    const fetchHistoryList = async () => {
      if (!store.getters['user/isLoggedIn']) return
      
      try {
        loading.value = true
        const { records, total } = await store.dispatch('user/fetchHistoryList', {
          page: 0, // 后端分页从0开始
          size: 5
        })
        console.log('获取到的观看历史:', { records, total })
      } catch (error) {
        console.error('获取观看历史失败:', error)
        ElMessage.error('获取观看历史失败')
      } finally {
        loading.value = false
      }
    }

    // 获取观影统计数据
    const fetchWatchStats = async (range) => {
      try {
        loading.value = true
        await store.dispatch('user/fetchWatchStats', range)
      } catch (error) {
        console.error('获取观影统计失败:', error)
        ElMessage.error('获取观影统计失败')
      } finally {
        loading.value = false
      }
    }

    // 获取观影偏好数据
    const fetchWatchPreferences = async () => {
      try {
        loading.value = true
        await store.dispatch('user/fetchWatchPreferences')
      } catch (error) {
        console.error('获取观影偏好失败:', error)
        ElMessage.error('获取观影偏好失败')
      } finally {
        loading.value = false
      }
    }

    const initTrendChart = async () => {
      try {
        await nextTick()
        const chartDom = document.querySelector('.trend-chart')
        if (!chartDom) {
          console.error('找不到趋势图表容器')
          return
        }

        if (!trendChart.value) {
          trendChart.value = echarts.init(chartDom)
        }

        const dates = watchStats.value.dates || []
        const durations = watchStats.value.durations || []

        const option = {
          grid: {
            top: 40,
            right: 40,
            bottom: 40,
            left: 60
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: dates
          },
          yAxis: {
            type: 'value',
            name: '观影时长(小时)'
          },
          series: [{
            name: '观影时长',
            data: durations,
            type: 'line',
            smooth: true,
            areaStyle: {
              opacity: 0.3
            },
            itemStyle: {
              color: '#409EFF'
            }
          }]
        }

        trendChart.value.setOption(option)
      } catch (error) {
        console.error('初始化趋势图表失败:', error)
      }
    }

    const initPieChart = async () => {
      try {
        await nextTick()
        const chartDom = document.querySelector('.pie-chart')
        if (!chartDom) {
          console.error('找不到饼图容器')
          return
        }

        if (!pieChart.value) {
          pieChart.value = echarts.init(chartDom)
        }

        // 确保数据有效
        const validData = watchPreferences.value.filter(item => item && item.value > 0)

        const option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            right: 10,
            top: 'center'
          },
          series: [{
            name: '观影类型',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: validData.length > 0 ? validData : [{ value: 100, name: '暂无数据' }]
          }]
        }

        pieChart.value.setOption(option)
      } catch (error) {
        console.error('初始化饼图失败:', error)
      }
    }

    const handleResize = () => {
      trendChart.value?.resize()
      pieChart.value?.resize()
    }

    const handleTimeRangeChange = async (newRange) => {
      await fetchWatchStats(newRange)
      if (trendChart.value) {
        initTrendChart()
      }
    }

    // 格式化日期
    const formatDate = (dateStr) => {
      if (!dateStr) return '未知时间'
      try {
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) return '未知时间'
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch (error) {
        console.error('日期格式化错误:', error)
        return '未知时间'
      }
    }

    // 格式化时长
    const formatDuration = (duration) => {
      if (!duration && duration !== 0) return '未知时长'
      try {
        const hours = Math.floor(duration / 60)
        const minutes = duration % 60
        return `${hours}小时${minutes}分`
      } catch (error) {
        console.error('时长格式化错误:', error)
        return '未知时长'
      }
    }

    // 格式化进度
    const formatProgress = (progress) => {
      if (!progress && progress !== 0) return '0%'
      try {
        const percentage = Math.round(progress * 100)
        return `${percentage}%`
      } catch (error) {
        console.error('进度格式化错误:', error)
        return '0%'
      }
    }

    onMounted(async () => {
      await fetchWatchStats(timeRange.value)
      await fetchWatchPreferences()
      await fetchHistoryList()
      
      initTrendChart()
      initPieChart()
      
      window.addEventListener('resize', handleResize)
    })

    return {
      timeRange,
      historyList,
      watchStats,
      watchPreferences,
      loading,
      handleTimeRangeChange,
      formatDate,
      formatDuration,
      formatProgress
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
      color: var(--el-text-color-secondary);
      font-size: 14px;
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: var(--el-text-color-primary);
      margin-bottom: 8px;
    }

    .stat-compare {
      font-size: 12px;
      color: var(--el-color-danger);

      &.up {
        color: var(--el-color-success);
      }
    }
  }

  .chart-card {
    margin-bottom: 20px;
  }

  .chart-container {
    width: 100%;
  }

  .detail-card {
    margin-bottom: 20px;
  }
}
</style> 