<template>
  <div class="banner">
    <el-carousel height="800px" :interval="5000" arrow="always" indicator-position="none">
      <el-carousel-item v-for="banner in movies" :key="banner.id">
        <div class="slide-inner" :style="{ backgroundImage: `url(${banner.image})` }">
          <div class="container">
            <h6 class="tagline">{{ banner.subtitle }}</h6>
            <h2 class="name">{{ banner.title }}</h2>
            <ul class="features" v-if="!banner.type">
              <li>
                <div class="rate">
                  <svg class="circle-chart" viewBox="0 0 30 30" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                    <circle class="circle-chart__background" stroke="#2f3439" stroke-width="2" fill="none" cx="15" cy="15" r="14"></circle>
                    <circle class="circle-chart__circle" stroke="#4eb04b" stroke-width="2" :stroke-dasharray="`${banner.score * 10 || 0},100`" cx="15" cy="15" r="14"></circle>
                  </svg>
                  <b>{{ banner.score || '暂无' }}</b> IMDB评分
                </div>
              </li>
              <li>
                <div class="year">{{ banner.year || '暂无' }}</div>
              </li>
              <li>
                <div class="quality">
                  {{ banner.quality || '暂无' }} 
                  <b>{{ banner.resolution || '' }}</b>
                </div>
              </li>
              <li>
                <div class="tags">{{ banner.tags?.join(', ') || '暂无分类' }}</div>
              </li>
            </ul>
            <p class="description">{{ banner.description }}</p>
            
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import { VideoPlay, Plus } from '@element-plus/icons-vue'

export default {
  name: 'MovieBanner',
  props: {
    movies: {
      type: Array,
      required: true
    }
  },
  emits: ['add-to-favorites'],
  setup(props, { emit }) {
    const onAddToFavorites = (movie) => {
      if (movie) {
        emit('add-to-favorites', movie)
      }
    }

    return {
      VideoPlay,
      Plus,
      onAddToFavorites
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style> 