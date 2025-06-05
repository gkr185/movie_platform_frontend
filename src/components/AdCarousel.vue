<template>
  <div class="ad-carousel">
    <el-carousel 
      :interval="3000" 
      :autoplay="true"
      trigger="click"
      height="200px"
      @change="handleChange"
    >
      <el-carousel-item v-for="(ad, index) in advertisements" :key="index">
        <div class="ad-item" @click="handleAdClick(ad)">
          <img :src="ad.image" :alt="ad.title">
          <div class="ad-info" v-if="ad.showInfo">
            <h3>{{ ad.title }}</h3>
            <p>{{ ad.description }}</p>
          </div>
          <div class="ad-tag" v-if="ad.tag">{{ ad.tag }}</div>
        </div>
      </el-carousel-item>
    </el-carousel>

    <!-- 广告指示器 -->
    <div class="ad-indicators">
      <span 
        v-for="(ad, index) in advertisements" 
        :key="index"
        :class="['indicator', { active: currentIndex === index }]"
        @click="setCurrentAd(index)"
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdCarousel',
  data() {
    return {
      currentIndex: 0,
      advertisements: [
        {
          title: '新年特惠',
          description: '开通会员享受8折优惠',
          image: '/ads/new-year.jpg',
          tag: '限时',
          showInfo: true,
          link: '/vip'
        },
        {
          title: '新片推荐',
          description: '最新好莱坞大片',
          image: '/ads/new-movie.jpg',
          showInfo: true,
          link: '/movie/123'
        },
        {
          title: '活动专区',
          description: '参与互动赢取好礼',
          image: '/ads/activity.jpg',
          tag: '活动',
          showInfo: true,
          link: '/activity'
        }
      ]
    }
  },
  methods: {
    handleChange(index) {
      this.currentIndex = index
    },
    setCurrentAd(index) {
      this.currentIndex = index
    },
    handleAdClick(ad) {
      if (ad.link) {
        this.$router.push(ad.link)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ad-carousel {
  position: relative;
  margin: 20px 0;

  .ad-item {
    position: relative;
    height: 100%;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .ad-info {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 15px;
      background: linear-gradient(transparent, rgba(0,0,0,0.7));
      color: #fff;

      h3 {
        margin: 0 0 5px;
        font-size: 18px;
      }

      p {
        margin: 0;
        font-size: 14px;
        opacity: 0.8;
      }
    }

    .ad-tag {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 4px 8px;
      background-color: #ff4d4f;
      color: #fff;
      border-radius: 4px;
      font-size: 12px;
    }
  }

  .ad-indicators {
    position: absolute;
    bottom: 20px;
    right: 20px;
    z-index: 1;

    .indicator {
      display: inline-block;
      width: 8px;
      height: 8px;
      margin: 0 4px;
      border-radius: 50%;
      background-color: rgba(255,255,255,0.5);
      cursor: pointer;
      transition: all 0.3s;

      &.active {
        background-color: #fff;
        transform: scale(1.2);
      }
    }
  }
}

// 自定义 Element UI 轮播图样式
:deep(.el-carousel__arrow) {
  background-color: rgba(0,0,0,0.3);
  
  &:hover {
    background-color: rgba(0,0,0,0.5);
  }
}

:deep(.el-carousel__indicators) {
  display: none;
}
</style> 