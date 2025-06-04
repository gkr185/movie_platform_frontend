<template>
    <div class="home">
      <!-- 顶部导航栏 -->
      <el-header class="header">
        <div class="logo">
          <img src="@/assets/logo.png" alt="logo">
          <span>在线电影平台</span>
        </div>
        <div class="nav-menu">
          <el-menu mode="horizontal" :router="true">
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item index="/category">分类</el-menu-item>
            <el-menu-item index="/ranking">排行榜</el-menu-item>
            <el-menu-item index="/newest">最新上映</el-menu-item>
          </el-menu>
        </div>
        <div class="user-actions">
          <el-input
            placeholder="搜索电影"
            prefix-icon="el-icon-search"
            v-model="searchKeyword"
            @keyup.enter="handleSearch"
          >
          </el-input>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button v-if="!isLogin" type="text" @click="$router.push('/login')">登录</el-button>
          <el-dropdown v-else>
            <span class="el-dropdown-link">
              {{ username }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <template v-slot:dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item>我的收藏</el-dropdown-item>
                <el-dropdown-item>观看历史</el-dropdown-item>
                <el-dropdown-item>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
  
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
    data() {
      return {
        searchKeyword: '',
        username: '用户名'
      }
    },
    computed: {
      ...mapGetters([
        'isLogin',
        'hotMovies',
        'newMovies'
      ])
    },
    methods: {
      handleSearch() {
        // 处理搜索逻辑
        console.log('搜索:', this.searchKeyword)
      }
    },
    created() {
      // 获取电影数据
      this.$store.dispatch('fetchHotMovies')
      this.$store.dispatch('fetchNewMovies')
    }
  }
  </script>
  
  <style scoped>
  .home {
    min-height: 100vh;
  }
  
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .logo {
    display: flex;
    align-items: center;
  }
  
  .logo img {
    height: 40px;
    margin-right: 10px;
  }
  
  .nav-menu {
    flex: 1;
    margin: 0 40px;
  }
  
  .user-actions {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .banner {
    margin-bottom: 30px;
  }
  
  .banner img {
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
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
  
  .section {
    padding: 20px;
    margin-bottom: 30px;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .movie-card {
    margin-bottom: 20px;
    transition: all 0.3s;
    cursor: pointer;
  }
  
  .movie-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .movie-cover {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .movie-info {
    padding: 10px;
  }
  
  .movie-info h3 {
    margin: 0;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .movie-info p {
    margin: 5px 0 0;
    color: #ff9900;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
    display: flex;
    align-items: center;
  }
  </style>