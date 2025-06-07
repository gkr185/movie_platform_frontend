<template>
  <div class="ranking-list">
    <div v-for="(item, index) in rankingList" :key="item.id" class="ranking-item">
      <div class="rank-number" :class="{ 'top3': index < 3 }">
        {{ item.rank }}
      </div>
      <div class="movie-poster">
        <img :src="item.poster" :alt="item.title">
        <div class="hover-info">
          <el-button type="primary" size="small" @click="playMovie(item.id)">
            立即观看
          </el-button>
        </div>
      </div>
      <div class="movie-info">
        <h3 class="movie-title" @click="viewDetail(item.id)">{{ item.title }}</h3>
        <div class="movie-score">
          <template v-if="type === 'hot'">
            <i class="el-icon-hot-water"></i>
            热度: {{ item.hot }}
          </template>
          <template v-else>
            <el-rate
              v-model="item.score"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}"
            >
            </el-rate>
          </template>
        </div>
        <div class="rank-change">
          <i 
            :class="[
              item.change > 0 ? 'el-icon-top' : item.change < 0 ? 'el-icon-bottom' : 'el-icon-minus',
              item.change > 0 ? 'up' : item.change < 0 ? 'down' : 'same'
            ]"
          ></i>
          <span>{{ Math.abs(item.change) || '持平' }}</span>
        </div>
      </div>
      <div class="actions">
        <el-button type="text" @click="addToFavorite(item.id)">
          <i class="el-icon-star-off"></i>
          收藏
        </el-button>
        <el-button type="text" @click="shareMovie(item.id)">
          <i class="el-icon-share"></i>
          分享
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'RankingList',
  props: {
    type: {
      type: String,
      default: 'hot'
    }
  },
  computed: {
    ...mapGetters(['hotRankings', 'scoreRankings']),
    rankingList() {
      return this.type === 'hot' ? this.hotRankings : this.scoreRankings
    }
  },
  created() {
    this.fetchRankings()
  },
  methods: {
    ...mapActions(['fetchRankings']),
    playMovie(id) {
      this.$router.push(`/movie/${id}`)
    },
    viewDetail(id) {
      this.$router.push(`/movie/${id}`)
    },
    addToFavorite(id) {
      // 添加到收藏
      console.log('添加收藏:', id)
    },
    shareMovie(id) {
      // 分享电影
      console.log('分享电影:', id)
    }
  }
}
</script>

<style lang="scss" scoped>
.ranking-list {
  .ranking-item {
    display: flex;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #eee;
    transition: all 0.3s;

    &:hover {
      background-color: #f5f7fa;
    }

    .rank-number {
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      color: #666;
      margin-right: 20px;

      &.top3 {
        color: #fff;
        border-radius: 50%;
        
        &:nth-child(1) {
          background-color: #f7ba2a;
        }
        &:nth-child(2) {
          background-color: #8492a6;
        }
        &:nth-child(3) {
          background-color: #d1a579;
        }
      }
    }

    .movie-poster {
      position: relative;
      width: 120px;
      height: 160px;
      margin-right: 20px;
      overflow: hidden;
      border-radius: 4px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .hover-info {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0,0,0,0.5);
        opacity: 0;
        transition: all 0.3s;
      }

      &:hover .hover-info {
        opacity: 1;
      }
    }

    .movie-info {
      flex: 1;

      .movie-title {
        margin: 0 0 10px;
        font-size: 16px;
        cursor: pointer;

        &:hover {
          color: #409EFF;
        }
      }

      .movie-score {
        margin-bottom: 10px;
        color: #ff9900;

        i {
          margin-right: 5px;
        }
      }

      .rank-change {
        font-size: 13px;

        i {
          margin-right: 4px;

          &.up {
            color: #67C23A;
          }
          &.down {
            color: #F56C6C;
          }
          &.same {
            color: #909399;
          }
        }
      }
    }

    .actions {
      .el-button {
        margin-left: 15px;

        i {
          margin-right: 4px;
        }
      }
    }
  }
}
</style> 