<template>
  <div class="home">
    <!-- 轮播图 -->
    <movie-banner 
      :movies="banners" 
      @add-to-favorites="handleAddToFavorites"
    />

    <!-- 热门推荐 -->
    <div class="section">
      <div class="section-header">
        <h2>热门推荐</h2>
        <el-button type="text" @click="$router.push('/category')">查看更多</el-button>
      </div>
      <div class="movie-list">
        <el-row :gutter="20">
          <el-col :xs="12" :sm="8" :md="6" :lg="4" v-for="movie in hotMovies" :key="movie.id">
            <movie-card :movie="movie" />
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 最新上映 -->
    <div class="section">
      <div class="section-header">
        <h2>最新上映</h2>
        <el-button type="text" @click="$router.push('/newest')">查看更多</el-button>
      </div>
      <div class="movie-list">
        <el-row :gutter="20">
          <el-col :xs="12" :sm="8" :md="6" :lg="4" v-for="movie in newMovies" :key="movie.id">
            <movie-card :movie="movie" />
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import MovieCard from '@/components/movie/MovieCard.vue'
import MovieBanner from '@/components/movie/MovieBanner.vue'

export default {
  name: 'Home',
  components: {
    MovieCard,
    MovieBanner
  },
  setup() {
    const store = useStore()
    const router = useRouter()

    const hotMovies = computed(() => store.getters.hotMovies)
    const newMovies = computed(() => store.getters.newMovies)
    const banners = computed(() => store.getters.banners)
    const isLoggedIn = computed(() => store.getters.isLoggedIn)

    const handleAddToFavorites = async (movie) => {
      if (!isLoggedIn.value) {
        router.push({
          path: '/user/login',
          query: { redirect: router.currentRoute.value.fullPath }
        })
        return
      }

      try {
        await store.dispatch('addToFavorites', movie)
        ElMessage.success('已添加到收藏')
      } catch (error) {
        ElMessage.error('添加收藏失败')
      }
    }

    // 获取数据
    store.dispatch('fetchHotMovies')
    store.dispatch('fetchNewMovies')
    store.dispatch('fetchBanners')

    return {
      hotMovies,
      newMovies,
      banners,
      handleAddToFavorites
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  .section {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto 30px;
    background-color: var(--card-bg-color);
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid var(--border-color);

      h2 {
        margin: 0;
        font-size: 20px;
        color: var(--text-color);
      }
    }

    .movie-list {
      .movie-card {
        margin-bottom: 20px;
        transition: all 0.3s;
        cursor: pointer;
        border: none;
        border-radius: 8px;
        overflow: hidden;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .movie-cover {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .movie-info {
          padding: 12px;
          background-color: var(--card-bg-color);

          h3 {
            margin: 0;
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: var(--text-color);
          }

          p {
            margin: 8px 0 0;
            color: #ff9900;
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>