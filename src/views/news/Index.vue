<template>
  <div class="news-container">
    <!-- 资讯分类标签 -->
    <div class="news-categories">
      <el-tabs v-model="activeCategory" @tab-click="handleCategoryChange">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane label="电影资讯" name="movie"></el-tab-pane>
        <el-tab-pane label="行业动态" name="industry"></el-tab-pane>
        <el-tab-pane label="活动公告" name="activity"></el-tab-pane>
      </el-tabs>
    </div>

    <!-- 资讯列表 -->
    <div class="news-list">
      <el-card v-for="news in newsList" :key="news.id" class="news-item">
        <div class="news-content">
          <div class="news-image" v-if="news.image">
            <img :src="news.image" :alt="news.title">
          </div>
          <div class="news-info">
            <h3 class="news-title" @click="viewNewsDetail(news.id)">
              {{ news.title }}
            </h3>
            <p class="news-summary">{{ news.summary }}</p>
            <div class="news-meta">
              <span class="news-time">
                <i class="el-icon-time"></i>
                {{ news.publishTime }}
              </span>
              <span class="news-author">
                <i class="el-icon-user"></i>
                {{ news.author }}
              </span>
              <span class="news-category">
                <el-tag size="small" :type="news.categoryType">
                  {{ news.category }}
                </el-tag>
              </span>
            </div>
          </div>
        </div>
        <div class="news-actions">
          <div class="action-item">
            <el-button 
              type="text" 
              :class="{ 'liked': news.isLiked }"
              @click="handleLike(news)"
            >
              <i class="el-icon-star-off"></i>
              {{ news.likes }} 点赞
            </el-button>
          </div>
          <div class="action-item">
            <el-button type="text">
              <i class="el-icon-share"></i>
              分享
            </el-button>
          </div>
          <div class="action-item">
            <el-button type="text" @click="viewNewsDetail(news.id)">
              阅读全文
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 分页器 -->
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'News',
  data() {
    return {
      activeCategory: 'all',
      currentPage: 1,
      pageSize: 10,
      total: 100,
      newsList: [
        {
          id: 1,
          title: '《流浪地球3》确认立项，吴京继续主演',
          summary: '近日，科幻电影《流浪地球3》正式宣布立项，该片将继续由郭帆执导，吴京主演...',
          image: '/news/earth3.jpg',
          publishTime: '2024-01-20 14:30',
          author: '电影日报',
          category: '电影资讯',
          categoryType: 'primary',
          likes: 1234,
          isLiked: false
        },
        {
          id: 2,
          title: '2024年春节档电影票房突破50亿',
          summary: '据统计，2024年春节档电影票房已突破50亿元，创下历史新高...',
          publishTime: '2024-01-19 10:00',
          author: '行业观察',
          category: '行业动态',
          categoryType: 'success',
          likes: 856,
          isLiked: true
        }
      ]
    }
  },
  methods: {
    handleCategoryChange(tab) {
      // 处理分类切换
      this.fetchNewsList(tab.name)
    },
    handlePageChange(page) {
      this.currentPage = page
      this.fetchNewsList()
    },
    handleLike(news) {
      news.isLiked = !news.isLiked
      news.likes += news.isLiked ? 1 : -1
      // 调用点赞接口
    },
    viewNewsDetail(id) {
      this.$router.push(`/news/detail/${id}`)
    },
    fetchNewsList(category = this.activeCategory) {
      // 获取资讯列表数据
      console.log('获取资讯列表:', category, this.currentPage)
    }
  },
  created() {
    this.fetchNewsList()
  }
}
</script>

<style lang="scss" scoped>
.news-container {
  padding: 20px;

  .news-categories {
    margin-bottom: 20px;
  }

  .news-list {
    .news-item {
      margin-bottom: 20px;

      .news-content {
        display: flex;
        gap: 20px;

        .news-image {
          flex: 0 0 200px;
          height: 150px;
          overflow: hidden;
          border-radius: 4px;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .news-info {
          flex: 1;

          .news-title {
            margin: 0 0 10px;
            font-size: 18px;
            cursor: pointer;
            color: #303133;

            &:hover {
              color: #409EFF;
            }
          }

          .news-summary {
            color: #666;
            margin-bottom: 15px;
            line-height: 1.5;
          }

          .news-meta {
            color: #999;
            font-size: 13px;

            > span {
              margin-right: 15px;

              i {
                margin-right: 4px;
              }
            }
          }
        }
      }

      .news-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #eee;

        .action-item {
          margin-left: 20px;

          .el-button {
            font-size: 14px;

            i {
              margin-right: 4px;
            }

            &.liked {
              color: #ff4d4f;
            }
          }
        }
      }
    }
  }

  .pagination {
    text-align: center;
    margin-top: 30px;
  }
}
</style> 