<template>
  <div class="ranking-list">
    <el-skeleton :loading="loading" animated :count="10" v-if="loading">
      <template #template>
        <div class="movie-item skeleton">
          <el-skeleton-item variant="image" style="width: 120px; height: 160px" />
          <div class="movie-info">
            <el-skeleton-item variant="text" style="width: 50%" />
            <el-skeleton-item variant="text" style="width: 30%" />
          </div>
        </div>
      </template>
    </el-skeleton>

    <template v-else>
      <div v-if="!list || list.length === 0" class="empty-list">
        <el-empty description="暂无排行数据" />
      </div>
      
      <div v-else class="movie-list">
        <router-link
          v-for="movie in list"
          :key="movie.id"
          :to="{ name: 'MovieDetail', params: { id: movie.id }}"
          class="movie-item"
        >
          <!-- 排名 -->
          <div class="rank" :class="{ 'top-3': movie.rank <= 3 }">
            {{ movie.rank }}
          </div>
          
          <!-- 电影封面 -->
          <div class="movie-cover">
            <el-image
              :src="movie.cover"
              fit="cover"
              loading="lazy"
              :alt="movie.title"
            >
              <template #error>
                <div class="image-error">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            
            <!-- VIP标签 -->
            <div v-if="movie.needVip" class="vip-tag">
              <el-tag size="small" type="warning">VIP</el-tag>
            </div>
          </div>
          
          <!-- 电影信息 -->
          <div class="movie-info">
            <h3 class="title" :title="movie.title">{{ movie.title }}</h3>
            
            <div class="score">
              <el-rate
                :model-value="movie.score"
                disabled
                text-color="#ff9900"
                score-template="{value}"
                :show-score="true"
              />
            </div>
            
            <div class="meta">
              <span class="year">{{ movie.year }}</span>
              <span class="separator">·</span>
              <span class="category">{{ movie.category }}</span>
            </div>
            
            <div class="stats">
              <span v-if="type === 'hot'" class="plays">
                <el-icon><VideoPlay /></el-icon>
                {{ formatNumber(movie.playCount) }}
              </span>
              <span v-else class="rating">
                <el-icon><Star /></el-icon>
                {{ movie.rating }}
              </span>
            </div>
          </div>
        </router-link>
      </div>
    </template>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { Picture, VideoPlay, Star } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'RankingList',
  
  components: {
    Picture,
    VideoPlay,
    Star
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
  
  setup() {
    // 格式化数字（例如：1.2k, 1.5m）
    const formatNumber = (num) => {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'm'
      }
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k'
      }
      return num.toString()
    }
    
    return {
      formatNumber
    }
  }
})
</script>

<style lang="scss" scoped>
.ranking-list {
  padding: 20px 0;
}

.movie-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.movie-item {
  display: flex;
  align-items: flex-start;
  padding: 15px;
  border-radius: 8px;
  background-color: var(--el-bg-color);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  &.skeleton {
    height: 160px;
  }
}

.rank {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: var(--el-text-color-regular);
  
  &.top-3 {
    color: #ff9900;
    font-size: 28px;
  }
}

.movie-cover {
  position: relative;
  width: 120px;
  height: 160px;
  margin: 0 15px;
  border-radius: 4px;
  overflow: hidden;
  
  .el-image {
    width: 100%;
    height: 100%;
  }
  
  .image-error {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--el-fill-color-lighter);
    color: var(--el-text-color-secondary);
  }
  
  .vip-tag {
    position: absolute;
    top: 5px;
    right: 5px;
  }
}

.movie-info {
  flex: 1;
  min-width: 0;
  
  .title {
    margin: 0 0 10px;
    font-size: 18px;
    font-weight: 500;
    color: var(--el-text-color-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .score {
    margin-bottom: 10px;
  }
  
  .meta {
    color: var(--el-text-color-secondary);
    font-size: 14px;
    margin-bottom: 10px;
    
    .separator {
      margin: 0 5px;
    }
  }
  
  .stats {
    display: flex;
    align-items: center;
    color: var(--el-text-color-secondary);
    font-size: 14px;
    
    .el-icon {
      margin-right: 5px;
    }
    
    .plays, .rating {
      display: flex;
      align-items: center;
    }
  }
}

.empty-list {
  padding: 40px 0;
  text-align: center;
}
</style> 