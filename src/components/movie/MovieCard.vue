<template>
  <el-card 
    :body-style="{ padding: '0px' }" 
    class="movie-card" 
    @click="handleClick"
  >
    <el-image 
      :src="movie.cover" 
      class="movie-cover"
      fit="cover"
    >
      <template #error>
        <div class="image-error">
          <el-icon><Picture /></el-icon>
        </div>
      </template>
    </el-image>
    <div class="movie-info">
      <h3>{{ movie.title }}</h3>
      <div class="movie-meta">
        <span class="score">
          <el-icon><Star /></el-icon>
          {{ movie.score }}
        </span>
        <span class="year">{{ movie.year }}</span>
      </div>
      <div class="movie-tags">
        <el-tag 
          v-if="movie.quality" 
          size="small" 
          type="warning"
        >{{ movie.quality }}</el-tag>
      </div>
    </div>
  </el-card>
</template>

<script>
import { Picture, Star } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

export default {
  name: 'MovieCard',
  components: {
    Picture,
    Star
  },
  props: {
    movie: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()

    const handleClick = () => {
      router.push({
        name: 'MovieDetail',
        params: { id: props.movie.id }
      })
    }

    return {
      handleClick
    }
  }
}
</script>

<style lang="scss" scoped>
.movie-card {
  margin-bottom: 20px;
  transition: all 0.3s;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--card-bg-color);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }

  .movie-cover {
    width: 100%;
    height: 280px;
  }

  .image-error {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--el-fill-color-light);
    
    .el-icon {
      font-size: 48px;
      color: var(--el-text-color-secondary);
    }
  }

  .movie-info {
    padding: 12px;
    background-color: var(--card-bg-color);

    h3 {
      margin: 0 0 8px;
      font-size: 14px;
      line-height: 1.4;
      height: 40px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      color: var(--text-color);
    }

    .movie-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .score {
        color: #ff9900;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 4px;

        .el-icon {
          font-size: 14px;
        }
      }

      .year {
        color: var(--text-color-light);
        font-size: 12px;
      }
    }

    .movie-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
  }
}

// 深色模式适配
html[data-theme='dark'] {
  .movie-card {
    .image-error {
      background-color: var(--el-fill-color-darker);
    }
  }
}
</style> 