<template>
  <div class="recommended-movies">
    <h2 class="section-title">相关推荐</h2>
    <div class="recommended-list">
      <div 
        v-for="movie in recommendedMovies" 
        :key="movie.id" 
        class="recommended-item"
        @click="goToMovie(movie.id)"
      >
        <el-image :src="movie.cover" fit="cover" />
        <div class="info">
          <h3 class="title">{{ movie.title }}</h3>
          <div class="meta">
            <span class="score">{{ movie.score }}分</span>
            <span class="year">{{ movie.year }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'RecommendedMovies',
  props: {
    movieId: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const store = useStore()
    const router = useRouter()

    const recommendedMovies = computed(() => 
      store.getters['movie/recommendedMovies']
    )

    const goToMovie = (movieId) => {
      router.push(`/movie/${movieId}`)
    }

    return {
      recommendedMovies,
      goToMovie
    }
  }
}
</script>

<style lang="scss" scoped>
.recommended-movies {
  .section-title {
    margin: 0 0 20px;
    font-size: 18px;
    color: var(--text-color);
  }

  .recommended-list {
    .recommended-item {
      margin-bottom: 20px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
      }

      .el-image {
        width: 100%;
        height: 168px;
        border-radius: 8px;
        overflow: hidden;
      }

      .info {
        padding: 10px;

        .title {
          margin: 0 0 5px;
          font-size: 14px;
          color: var(--text-color);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .meta {
          display: flex;
          justify-content: space-between;
          color: var(--text-color-secondary);
          font-size: 12px;

          .score {
            color: #ff9900;
            font-weight: 500;
          }
        }
      }
    }
  }
}
</style> 