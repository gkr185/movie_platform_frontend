<template>
  <div class="ranking-list">
    <el-skeleton :loading="loading" animated :count="5" v-if="loading">
      <template #template>
        <div class="movie-item skeleton">
          <div class="rank-skeleton">
            <el-skeleton-item variant="circle" style="width: 40px; height: 40px" />
          </div>
          <el-skeleton-item variant="image" style="width: 120px; height: 160px; border-radius: 8px" />
          <div class="movie-info">
            <el-skeleton-item variant="text" style="width: 60%; height: 20px; margin-bottom: 10px" />
            <el-skeleton-item variant="text" style="width: 40%; height: 16px; margin-bottom: 8px" />
            <el-skeleton-item variant="text" style="width: 50%; height: 16px; margin-bottom: 8px" />
            <el-skeleton-item variant="text" style="width: 30%; height: 16px" />
          </div>
        </div>
      </template>
    </el-skeleton>

    <template v-else>
      <div v-if="!list || list.length === 0" class="empty-list">
        <el-empty description="暂无排行数据">
          <template #image>
            <div class="empty-image">
              <el-icon size="80"><TrendCharts /></el-icon>
            </div>
          </template>
          <template #description>
            <p class="empty-description">暂无排行数据</p>
          </template>
        </el-empty>
      </div>
      
      <div v-else class="movie-list">
        <div
          v-for="(movie, index) in list"
          :key="movie.id"
          class="movie-item"
          :class="{ 'top-movie': movie.rank <= 3 }"
          @click="handleMovieClick(movie)"
        >
          <!-- 排名 -->
          <div class="rank-container">
            <div class="rank" :class="getRankClass(movie.rank)">
              <span v-if="movie.rank <= 3" class="rank-crown">
                <el-icon><Crown /></el-icon>
              </span>
              <span class="rank-number">{{ movie.rank }}</span>
            </div>
            
            <!-- 排名变化指示器 -->
            <div class="rank-indicator" v-if="movie.rank <= 10">
              <div class="rank-trend">
                <el-icon :class="getRankTrendClass(index)">
                  <CaretTop v-if="index % 3 === 0" />
                  <CaretBottom v-else-if="index % 3 === 1" />
                  <Minus v-else />
                </el-icon>
              </div>
            </div>
          </div>
          
          <!-- 电影封面 -->
          <div class="movie-cover">
            <div class="image-wrapper">
              <el-image
                :src="movie.cover"
                fit="cover"
                loading="lazy"
                :alt="movie.title"
                class="movie-image"
              >
                <template #error>
                  <div class="image-error">
                    <el-icon><Picture /></el-icon>
                    <span>加载失败</span>
                  </div>
                </template>
              </el-image>
              
              <!-- 遮罩层 -->
              <div class="image-overlay">
                <div class="overlay-content">
                  <el-icon class="play-icon"><VideoPlay /></el-icon>
                  <span class="play-text">立即观看</span>
                </div>
              </div>
            </div>
            
            <!-- VIP标签 -->
            <div v-if="movie.needVip" class="vip-tag">
              <div class="vip-content">
                <el-icon><Crown /></el-icon>
                <span>VIP</span>
              </div>
            </div>
            
            <!-- 排名徽章 -->
            <div v-if="movie.rank <= 3" class="rank-badge" :class="`rank-${movie.rank}`">
              <span class="badge-text">{{ getRankText(movie.rank) }}</span>
            </div>
          </div>
          
          <!-- 电影信息 -->
          <div class="movie-info">
            <h3 class="title" :title="movie.title">{{ movie.title }}</h3>
            
            <div class="score-container">
              <el-rate
                :model-value="movie.score"
                disabled
                :colors="['#f7ba2a', '#f7ba2a', '#f7ba2a']"
                :max="5"
                :show-score="false"
                size="small"
                class="movie-rate"
              />
              <span class="score-text">{{ movie.score.toFixed(1) }}</span>
            </div>
            
            <div class="meta-info">
              <span class="year">{{ movie.year }}</span>
              <span class="separator">·</span>
              <span class="category">{{ movie.category }}</span>
            </div>
            
            <div class="stats-container">
              <div v-if="type === 'hot'" class="stat-item plays">
              </div>
              <div v-else class="stat-item rating">
                <el-icon class="stat-icon"><Star /></el-icon>
                <span class="stat-text">{{ movie.rating }} 评分</span>
              </div>
              
              <!-- 热度指示器 -->
              <div class="popularity-indicator" v-if="movie.rank <= 5">
                <div class="fire-icons">
                  <el-icon 
                    v-for="i in getFireCount(movie.rank)" 
                    :key="i"
                    class="fire-icon"
                    :style="{ animationDelay: `${i * 0.2}s` }"
                  >
                    <Sunny />
                  </el-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { 
  Picture, 
  VideoPlay, 
  Star, 
  Crown, 
  TrendCharts,
  CaretTop,
  CaretBottom,
  Minus,
  Sunny
} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'RankingList',
  
  components: {
    Picture,
    VideoPlay,
    Star,
    Crown,
    TrendCharts,
    CaretTop,
    CaretBottom,
    Minus,
    Sunny
  },
  
  props: {
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'hot',
      validator: (value) => ['hot', 'recommended'].includes(value)
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['movieClick'],
  
  setup(props, { emit }) {
    // 格式化数字（例如：1.2k, 1.5m）
    const formatNumber = (num) => {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
      }
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
      }
      return num.toString()
    }
    
    // 获取排名样式类
    const getRankClass = (rank) => {
      if (rank === 1) return 'rank-first'
      if (rank === 2) return 'rank-second'
      if (rank === 3) return 'rank-third'
      return ''
    }
    
    // 获取排名文本
    const getRankText = (rank) => {
      const texts = { 1: '冠军', 2: '亚军', 3: '季军' }
      return texts[rank] || ''
    }
    
    // 获取排名趋势样式
    const getRankTrendClass = (index) => {
      if (index % 3 === 0) return 'trend-up'
      if (index % 3 === 1) return 'trend-down'
      return 'trend-stable'
    }
    
    // 获取火焰图标数量
    const getFireCount = (rank) => {
      return Math.max(1, 6 - rank)
    }
    
    // 处理电影点击
    const handleMovieClick = (movie) => {
      emit('movieClick', movie)
    }
    
    return {
      formatNumber,
      getRankClass,
      getRankText,
      getRankTrendClass,
      getFireCount,
      handleMovieClick
    }
  }
})
</script>

<style lang="scss" scoped>
.ranking-list {
  padding: 0;
}

.movie-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.movie-item {
  display: flex;
  align-items: flex-start;
  padding: 20px;
  border-radius: 16px;
  background: var(--ranking-card-bg);
  border: 1px solid var(--ranking-border);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.03));
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--ranking-card-hover-shadow);
    background: var(--ranking-card-hover-bg);
    border-color: var(--el-color-primary-light-7);
    
    &::before {
      opacity: 1;
    }
    
    .movie-cover {
      .image-overlay {
        opacity: 1;
      }
      
      .movie-image {
        transform: scale(1.05);
      }
    }
    
    .rank {
      transform: scale(1.1);
    }
    
    .title {
      color: var(--el-color-primary);
    }
  }
  
  &.top-movie {
    background: linear-gradient(135deg, var(--ranking-card-bg), var(--ranking-card-bg));
    border: 2px solid var(--ranking-rank-top3-color);
  }
  
  &.skeleton {
    height: 200px;
    padding: 20px;
    
    .rank-skeleton {
      margin-right: 20px;
    }
  }
}

.rank-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
  min-width: 60px;
}

.rank {
  position: relative;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: var(--ranking-rank-color);
  background: var(--ranking-rank-bg);
  border-radius: 50%;
  transition: all 0.3s ease;
  
  .rank-crown {
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 16px;
    color: var(--ranking-rank-top3-color);
  }
  
  .rank-number {
    margin-top: 2px;
  }
  
  &.rank-first {
    background: linear-gradient(135deg, #ffd700, #ffed4e);
    color: #b8860b;
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
  }
  
  &.rank-second {
    background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
    color: #696969;
    box-shadow: 0 4px 15px rgba(192, 192, 192, 0.4);
  }
  
  &.rank-third {
    background: linear-gradient(135deg, #cd7f32, #daa520);
    color: #8b4513;
    box-shadow: 0 4px 15px rgba(205, 127, 50, 0.4);
  }
}

.rank-indicator {
  margin-top: 8px;
  
  .rank-trend {
    font-size: 12px;
    
    &.trend-up {
      color: #67c23a;
    }
    
    &.trend-down {
      color: #f56c6c;
    }
    
    &.trend-stable {
      color: var(--ranking-meta-color);
    }
  }
}

.movie-cover {
  position: relative;
  width: 120px;
  height: 160px;
  margin-right: 20px;
  border-radius: 12px;
  overflow: hidden;
  
  .image-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: 12px;
    overflow: hidden;
  }
  
  .movie-image {
    width: 100%;
    height: 100%;
    transition: transform 0.4s ease;
  }
  
  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    
    .overlay-content {
      text-align: center;
      color: white;
      
      .play-icon {
        font-size: 32px;
        margin-bottom: 8px;
      }
      
      .play-text {
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
  
  .image-error {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--ranking-rank-bg);
    color: var(--ranking-meta-color);
    
    .el-icon {
      font-size: 32px;
      margin-bottom: 8px;
    }
    
    span {
      font-size: 12px;
    }
  }
  
  .vip-tag {
    position: absolute;
    top: 8px;
    right: 8px;
    
    .vip-content {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      background: var(--ranking-vip-bg);
      color: white;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(255, 153, 0, 0.3);
      
      .el-icon {
        font-size: 12px;
      }
    }
  }
  
  .rank-badge {
    position: absolute;
    bottom: 8px;
    left: 8px;
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 10px;
    font-weight: 600;
    color: white;
    
    &.rank-1 {
      background: linear-gradient(135deg, #ffd700, #ffed4e);
      color: #b8860b;
    }
    
    &.rank-2 {
      background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
      color: #696969;
    }
    
    &.rank-3 {
      background: linear-gradient(135deg, #cd7f32, #daa520);
      color: #8b4513;
    }
  }
}

.movie-info {
  flex: 1;
  min-width: 0;
  
  .title {
    margin: 0 0 12px;
    font-size: 20px;
    font-weight: 600;
    color: var(--ranking-title-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: color 0.3s ease;
  }
  
  .score-container {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    
    .movie-rate {
      :deep(.el-rate__item) {
        margin-right: 4px;
      }
    }
    
    .score-text {
      font-size: 16px;
      font-weight: 600;
      color: #f7ba2a;
    }
  }
  
  .meta-info {
    color: var(--ranking-meta-color);
    font-size: 14px;
    margin-bottom: 12px;
    
    .separator {
      margin: 0 8px;
      opacity: 0.5;
    }
    
    .category {
      font-weight: 500;
    }
  }
  
  .stats-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .stat-item {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--ranking-stats-color);
      font-size: 14px;
      
      .stat-icon {
        font-size: 16px;
      }
    }
    
    .popularity-indicator {
      .fire-icons {
        display: flex;
        gap: 2px;
        
        .fire-icon {
          font-size: 14px;
          color: #ff6b35;
          animation: fire-flicker 2s ease-in-out infinite;
        }
      }
    }
  }
}

.empty-list {
  padding: 60px 0;
  text-align: center;
  
  .empty-image {
    color: var(--ranking-meta-color);
    margin-bottom: 20px;
  }
  
  .empty-description {
    color: var(--ranking-meta-color);
    font-size: 16px;
    margin: 0;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .movie-item {
    padding: 15px;
    flex-direction: column;
    gap: 15px;
    
    .rank-container {
      margin-right: 0;
      margin-bottom: 0;
      align-self: flex-start;
    }
    
    .movie-cover {
      width: 100px;
      height: 140px;
      margin-right: 0;
      align-self: center;
    }
    
    .movie-info {
      text-align: center;
    }
  }
}

@media (max-width: 480px) {
  .movie-item {
    padding: 12px;
    
    .rank {
      width: 40px;
      height: 40px;
      font-size: 16px;
    }
    
    .movie-cover {
      width: 80px;
      height: 110px;
    }
    
    .movie-info {
      .title {
        font-size: 16px;
      }
    }
  }
}

// 动画
@keyframes fire-flicker {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  25% {
    transform: scale(1.1) rotate(2deg);
    opacity: 0.8;
  }
  50% {
    transform: scale(0.9) rotate(-1deg);
    opacity: 1;
  }
  75% {
    transform: scale(1.05) rotate(1deg);
    opacity: 0.9;
  }
}
</style> 