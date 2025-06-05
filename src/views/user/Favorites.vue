<template>
  <div class="favorites">
    <h2>我的收藏</h2>
    
    <!-- 筛选工具栏 -->
    <div class="toolbar">
      <el-radio-group v-model="filterType" size="small">
        <el-radio-button label="all">全部</el-radio-button>
        <el-radio-button label="movie">电影</el-radio-button>
        <el-radio-button label="tv">电视剧</el-radio-button>
        <el-radio-button label="anime">动漫</el-radio-button>
      </el-radio-group>
      
      <el-input
        placeholder="搜索收藏内容"
        v-model="searchKeyword"
        prefix-icon="el-icon-search"
        class="search-input"
      >
      </el-input>
    </div>

    <!-- 收藏列表 -->
    <div class="favorites-list">
      <el-row :gutter="20">
        <el-col :span="6" v-for="item in favoriteItems" :key="item.id">
          <el-card :body-style="{ padding: '0px' }" class="favorite-card">
            <div class="card-cover">
              <img :src="item.cover">
              <div class="card-actions">
                <el-button type="text" icon="el-icon-video-play">观看</el-button>
                <el-button type="text" icon="el-icon-star-off">取消收藏</el-button>
              </div>
            </div>
            <div class="card-info">
              <h3>{{ item.title }}</h3>
              <p class="type">{{ item.type }}</p>
              <p class="date">收藏于 {{ item.date }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="100"
          :page-size="12"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserFavorites',
  data() {
    return {
      filterType: 'all',
      searchKeyword: '',
      favoriteItems: [
        {
          id: 1,
          title: '肖申克的救赎',
          type: '电影',
          cover: '@/assets/movie1.jpg',
          date: '2024-01-15'
        },
        {
          id: 2,
          title: '霸王别姬',
          type: '电影',
          cover: '@/assets/movie2.jpg',
          date: '2024-01-14'
        }
        // 更多收藏项...
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.favorites {
  h2 {
    margin-bottom: 20px;
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    .search-input {
      width: 200px;
    }
  }

  .favorites-list {
    .favorite-card {
      margin-bottom: 20px;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);

        .card-actions {
          opacity: 1;
        }
      }
    }

    .card-cover {
      position: relative;
      height: 200px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .card-actions {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 10px;
        background: linear-gradient(transparent, rgba(0,0,0,0.7));
        opacity: 0;
        transition: opacity 0.3s;
        display: flex;
        justify-content: space-around;

        .el-button {
          color: #fff;
          &:hover {
            color: #409EFF;
          }
        }
      }
    }

    .card-info {
      padding: 10px;

      h3 {
        margin: 0 0 5px;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      p {
        margin: 0;
        font-size: 12px;
        color: #666;

        &.date {
          color: #999;
        }
      }
    }
  }

  .pagination {
    margin-top: 30px;
    text-align: center;
  }
}
</style> 