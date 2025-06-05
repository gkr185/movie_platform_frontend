<template>
  <div class="home">
    <!-- 轮播图 -->
    <div class="banner">
      <el-carousel height="400px">
        <el-carousel-item v-for="movie in hotMovies.slice(0, 3)" :key="movie.id">
          <img :src="movie.cover" :alt="movie.title">
          <div class="carousel-title">{{ movie.title }}</div>
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
          <el-col :span="4" v-for="movie in hotMovies" :key="movie.id">
            <el-card :body-style="{ padding: '0px' }" class="movie-card" @click="$router.push(`/movie/${movie.id}`)">
              <img :src="movie.cover" class="movie-cover">
              <div class="movie-info">
                <h3>{{ movie.title }}</h3>
                <p>{{ movie.score }} 分</p>
              </div>
            </el-card>
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
          <el-col :span="4" v-for="movie in newMovies" :key="movie.id">
            <el-card :body-style="{ padding: '0px' }" class="movie-card" @click="$router.push(`/movie/${movie.id}`)">
              <img :src="movie.cover" class="movie-cover">
              <div class="movie-info">
                <h3>{{ movie.title }}</h3>
                <p>{{ movie.score }} 分</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapGetters([
      'hotMovies',
      'newMovies'
    ])
  },
  created() {
    // 获取电影数据
    this.$store.dispatch('fetchHotMovies')
    this.$store.dispatch('fetchNewMovies')
  }
}
</script>

<style lang="scss" scoped>
.home {
  .banner {
    margin-bottom: 30px;
    width: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .carousel-title {
      position: absolute;
      bottom: 20px;
      left: 20px;
      color: #fff;
      font-size: 24px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }
  }

  .section {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto 30px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;

      h2 {
        margin: 0;
        font-size: 20px;
        color: #303133;
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
          background-color: #fff;

          h3 {
            margin: 0;
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #303133;
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