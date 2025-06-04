<template>
  <div class="category">
    <el-container>
      <el-aside width="200px">
        <el-menu
          default-active="1"
          class="category-menu"
        >
          <el-menu-item v-for="category in categories" :key="category.id" :index="category.id.toString()">
            {{ category.name }}
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <div class="movie-grid">
          <el-row :gutter="20">
            <el-col :span="4" v-for="movie in movies" :key="movie.id">
              <el-card :body-style="{ padding: '0px' }" class="movie-card">
                <img :src="movie.cover" class="movie-cover">
                <div class="movie-info">
                  <h3>{{ movie.title }}</h3>
                  <p>{{ movie.score }} 分</p>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'CategoryIndex',
  data() {
    return {
      categories: [
        { id: 1, name: '动作片' },
        { id: 2, name: '喜剧片' },
        { id: 3, name: '爱情片' },
        { id: 4, name: '科幻片' },
        { id: 5, name: '恐怖片' },
        { id: 6, name: '动画片' }
      ],
      movies: []
    }
  },
  methods: {
    fetchMovies() {
      // TODO: 从API获取电影列表
    }
  },
  created() {
    this.fetchMovies()
  }
}
</script>

<style lang="scss" scoped>
.category {
  height: calc(100vh - 60px);
  
  .el-container {
    height: 100%;
  }

  .category-menu {
    height: 100%;
    border-right: solid 1px #e6e6e6;
  }

  .movie-grid {
    padding: 20px;
  }

  .movie-card {
    margin-bottom: 20px;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
  }

  .movie-cover {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .movie-info {
    padding: 10px;

    h3 {
      margin: 0;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    p {
      margin: 5px 0 0;
      color: #ff9900;
    }
  }
}
</style> 