<template>
  <div class="home">
    <!-- 轮播图 -->
    <div class="banner">
      <el-carousel height="800px" :interval="5000" arrow="always" indicator-position="none">
        <el-carousel-item v-for="movie in hotMovies.slice(0, 3)" :key="movie.id">
          <div class="slide-inner" :style="{ backgroundImage: `url(${movie.cover})` }">
            <div class="container">
              <h6 class="tagline">热门推荐</h6>
              <h2 class="name">{{ movie.title }}</h2>
              <ul class="features">
                <li>
                  <div class="rate">
                    <svg class="circle-chart" viewBox="0 0 30 30" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                      <circle class="circle-chart__background" stroke="#2f3439" stroke-width="2" fill="none" cx="15" cy="15" r="14"></circle>
                      <circle class="circle-chart__circle" stroke="#4eb04b" stroke-width="2" :stroke-dasharray="`${movie.score * 10},100`" cx="15" cy="15" r="14"></circle>
                    </svg>
                    <b>{{ movie.score }}</b> IMDB评分
                  </div>
                </li>
                <li>
                  <div class="year">{{ movie.year }}</div>
                </li>
                <li>
                  <div class="quality">{{ movie.quality }} <b>{{ movie.resolution }}</b></div>
                </li>
                <li>
                  <div class="tags">{{ movie.tags.join(', ') }}</div>
                </li>
              </ul>
              <p class="description">{{ movie.description }}</p>
              <div class="buttons">
                <router-link :to="{ name: 'MovieDetail', params: { id: movie.id }}" class="play-btn">
                  <el-icon><VideoPlay /></el-icon> 观看预告片
                </router-link>
                <el-button class="add-btn" :icon="Plus" circle @click="handleAddToFavorites(movie)"></el-button>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

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
import { VideoPlay, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import MovieCard from '@/components/movie/MovieCard.vue'

export default {
  name: 'Home',
  components: {
    MovieCard
  },
  setup() {
    const store = useStore()
    const router = useRouter()

    const hotMovies = computed(() => store.getters.hotMovies)
    const newMovies = computed(() => store.getters.newMovies)
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

    // 获取电影数据
    store.dispatch('fetchHotMovies')
    store.dispatch('fetchNewMovies')

    return {
      hotMovies,
      newMovies,
      VideoPlay,
      Plus,
      handleAddToFavorites
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  .banner {
    margin-bottom: 30px;
    width: 100%;

    .slide-inner {
      position: relative;
      height: 100%;
      background-size: cover;
      background-position: center;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 75%;
        background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
        pointer-events: none;
      }

      .container {
        position: relative;
        height: 100%;
        padding: 100px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        color: #fff;

        .tagline {
          font-size: 14px;
          font-weight: 600;
          color: #ff9900;
          margin-bottom: 10px;
          letter-spacing: 2px;
        }

        .name {
          font-size: 64px;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 30px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }

        .features {
          display: flex;
          align-items: center;
          gap: 30px;
          margin-bottom: 20px;
          padding: 0;
          list-style: none;

          li {
            .rate {
              display: flex;
              align-items: center;
              gap: 5px;
              
              b {
                font-size: 18px;
                margin: 0 5px;
              }
            }

            .year {
              font-size: 16px;
              font-weight: 600;
            }

            .quality {
              font-size: 14px;
              
              b {
                font-weight: 600;
              }
            }

            .tags {
              font-size: 14px;
              color: #ff9900;
            }
          }
        }

        .description {
          font-size: 16px;
          line-height: 1.6;
          max-width: 600px;
          margin-bottom: 30px;
          opacity: 0.8;
        }

        .buttons {
          display: flex;
          align-items: center;
          gap: 20px;

          .play-btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 15px 30px;
            background: #ff9900;
            color: #fff;
            border-radius: 30px;
            font-size: 16px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;

            &:hover {
              background: darken(#ff9900, 10%);
              transform: translateY(-2px);
            }

            i {
              font-size: 20px;
            }
          }

          .add-btn {
            width: 50px;
            height: 50px;
            border: 2px solid #fff;
            background: transparent;
            color: #fff;
            transition: all 0.3s ease;

            &:hover {
              background: #fff;
              color: #000;
            }
          }
        }
      }
    }
  }

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