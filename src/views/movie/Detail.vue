<template>
  <div class="movie-detail">
    <div class="movie-header">
      <div class="movie-poster">
        <img :src="movie.cover" :alt="movie.title">
      </div>
      <div class="movie-info">
        <h1>{{ movie.title }}</h1>
        <div class="movie-meta">
          <span>评分：{{ movie.score }}</span>
          <span>导演：{{ movie.director }}</span>
          <span>主演：{{ movie.actors }}</span>
          <span>类型：{{ movie.category }}</span>
          <span>上映时间：{{ movie.releaseDate }}</span>
        </div>
        <div class="movie-actions">
          <el-button type="primary" icon="el-icon-video-play">立即观看</el-button>
          <el-button icon="el-icon-star-off">收藏</el-button>
        </div>
        <div class="movie-desc">
          <h3>剧情简介</h3>
          <p>{{ movie.description }}</p>
        </div>
      </div>
    </div>
    
    <div class="movie-comments">
      <h2>评论区</h2>
      <div class="comment-form">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="写下你的评论..."
          v-model="commentContent"
        >
        </el-input>
        <el-button type="primary" @click="submitComment">发表评论</el-button>
      </div>
      <div class="comment-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <el-avatar :src="comment.avatar"></el-avatar>
          <div class="comment-content">
            <div class="comment-header">
              <span class="username">{{ comment.username }}</span>
              <span class="time">{{ comment.time }}</span>
            </div>
            <p>{{ comment.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MovieDetail',
  data() {
    return {
      movie: {
        title: '',
        cover: '',
        score: 0,
        director: '',
        actors: '',
        category: '',
        releaseDate: '',
        description: ''
      },
      commentContent: '',
      comments: []
    }
  },
  methods: {
    fetchMovieDetail() {
      // TODO: 获取电影详情
    },
    fetchComments() {
      // TODO: 获取评论列表
    },
    submitComment() {
      // TODO: 提交评论
    }
  },
  created() {
    this.fetchMovieDetail()
    this.fetchComments()
  }
}
</script>

<style lang="scss" scoped>
.movie-detail {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  .movie-header {
    display: flex;
    gap: 30px;
    margin-bottom: 40px;
  }

  .movie-poster {
    flex-shrink: 0;
    width: 300px;
    
    img {
      width: 100%;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }

  .movie-info {
    flex: 1;

    h1 {
      margin: 0 0 20px;
      font-size: 24px;
    }
  }

  .movie-meta {
    margin-bottom: 20px;

    span {
      display: block;
      margin-bottom: 10px;
      color: #666;
    }
  }

  .movie-actions {
    margin-bottom: 30px;
    
    .el-button {
      margin-right: 15px;
    }
  }

  .movie-desc {
    h3 {
      margin-bottom: 10px;
    }
    
    p {
      color: #666;
      line-height: 1.6;
    }
  }

  .movie-comments {
    h2 {
      margin-bottom: 20px;
    }
  }

  .comment-form {
    margin-bottom: 30px;

    .el-button {
      margin-top: 15px;
    }
  }

  .comment-item {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }
  }

  .comment-content {
    flex: 1;
  }

  .comment-header {
    margin-bottom: 8px;

    .username {
      font-weight: bold;
      margin-right: 10px;
    }

    .time {
      color: #999;
      font-size: 12px;
    }
  }
}
</style> 