<template>
  <div class="home">
    <!-- 轮播图 -->
    <movie-banner 
      :movies="banners" 
      @add-to-favorites="handleAddToFavorites"
    />

    <!-- 热门推荐 -->
    <movie-section
      title="热门推荐"
      type="hot"
    />

    <!-- 最新上映 -->
    <movie-section
      title="最新上映"
      type="new"
    />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import MovieBanner from '@/components/movie/MovieBanner.vue'
import MovieSection from '@/components/MovieSection.vue'

export default {
  name: 'Home',
  components: {
    MovieBanner,
    MovieSection
  },
  setup() {
    const store = useStore()
    const router = useRouter()

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

    // 获取轮播图数据
    store.dispatch('fetchBanners')

    return {
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