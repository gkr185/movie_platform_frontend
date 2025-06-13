<template>
  <div class="video-ad" v-if="visible">
    <!-- 广告点击区域 -->
    <div 
      class="ad-click-area"
      v-if="currentVideoAd?.linkUrl"
      @click="handleAdClick"
    >
      <div class="click-tip" v-if="showClickTip">
        <el-icon><Link /></el-icon>
        点击查看详情
      </div>
    </div>

    <video
      ref="adPlayer"
      class="ad-player"
      :src="currentVideoAd?.videoUrl"
      @timeupdate="handleTimeUpdate"
      @ended="handleAdEnded"
      @loadedmetadata="handleAdLoaded"
      @error="handleAdError"
      @waiting="handleAdWaiting"
      @canplay="handleAdCanPlay"
      @mouseover="handleMouseOver"
      @mouseout="handleMouseOut"
      controls
      autoplay
      playsinline
      webkit-playsinline
      x5-video-player-type="h5"
      x5-video-player-fullscreen="true"
    ></video>

    <!-- 广告控制栏 -->
    <div class="ad-controls">
      <div class="ad-info">
        <span class="ad-tag">广告</span>
        <span class="ad-title">{{ currentVideoAd?.title }}</span>
        <span class="ad-duration" v-if="!isVIP && !canSkip">
          {{ Math.max(0, Math.ceil(skipAfter - currentTime)) }}秒后可跳过
        </span>
        <span class="ad-duration" v-else-if="!isVIP && canSkip">
          点击跳过广告
        </span>
        <span class="ad-duration" v-else>
          VIP已自动跳过广告
        </span>
      </div>

      <!-- 跳过按钮 -->
      <el-button
        v-if="!isVIP"
        class="skip-button"
        :disabled="!canSkip"
        @click="handleSkip"
        size="small"
      >
        跳过广告
      </el-button>
    </div>

    <!-- 加载提示 -->
    <div v-if="loading" class="ad-loading">
      <el-icon class="loading-icon" :size="32"><Loading /></el-icon>
      <span>广告加载中...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useStore } from 'vuex'
import { Loading, Link } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  movieId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['skip', 'end'])

const store = useStore()
const adPlayer = ref(null)
const visible = ref(true)
const currentTime = ref(0)
const showClickTip = ref(false)
const skipAfter = 15 // 15秒后可跳过

// 从 Vuex 获取状态
const currentVideoAd = computed(() => {
  const ad = store.getters['ad/currentVideoAd']
  console.log('广告组件获取当前广告:', ad)
  return ad
})
const loading = computed(() => store.getters['ad/loading'])
const isVIP = computed(() => store.getters['user/isVIP'])

// 是否可以跳过广告
const canSkip = computed(() => {
  const can = isVIP.value || currentTime.value >= skipAfter
  console.log('广告是否可以跳过:', can, 'VIP:', isVIP.value, '当前时间:', currentTime.value)
  return can
})

// 处理鼠标移入
const handleMouseOver = () => {
  if (currentVideoAd.value?.linkUrl) {
    showClickTip.value = true
  }
}

// 处理鼠标移出
const handleMouseOut = () => {
  showClickTip.value = false
}

// 处理广告点击
const handleAdClick = () => {
  if (currentVideoAd.value?.linkUrl) {
    window.open(currentVideoAd.value.linkUrl, '_blank')
  }
}

// 监听广告变化
watch(currentVideoAd, async (newAd) => {
  console.log('广告数据发生变化:', newAd)
  if (newAd && adPlayer.value) {
    console.log('重新加载广告视频')
    adPlayer.value.load()
  }
})

// 处理广告时间更新
const handleTimeUpdate = () => {
  if (adPlayer.value) {
    currentTime.value = adPlayer.value.currentTime
    console.log('广告播放进度:', currentTime.value)
  }
}

// 处理广告结束
const handleAdEnded = () => {
  console.log('广告播放结束')
  visible.value = false
  store.dispatch('ad/clearCurrentVideoAd')
  emit('end')
}

// 处理广告加载完成
const handleAdLoaded = async () => {
  console.log('广告视频加载完成，VIP状态:', isVIP.value)
  if (isVIP.value) {
    console.log('VIP用户自动跳过广告')
    handleSkip()
  } else if (currentVideoAd.value) {
    try {
      if (adPlayer.value) {
        adPlayer.value.volume = 0.5
      }
      console.log('开始播放广告')
      await adPlayer.value?.play()
    } catch (error) {
      console.error('广告自动播放失败:', error)
      ElMessage.warning('请点击播放按钮开始播放')
    }
  }
}

// 处理广告加载错误
const handleAdError = (error) => {
  console.error('广告加载错误:', error)
  ElMessage.error('广告加载失败，已自动跳过')
  handleSkip()
}

// 处理广告加载中
const handleAdWaiting = () => {
  // 加载状态由 Vuex 管理
}

// 处理广告可以播放
const handleAdCanPlay = () => {
  // 加载状态由 Vuex 管理
}

// 跳过广告
const handleSkip = () => {
  console.log('尝试跳过广告，当前状态:', { canSkip: canSkip.value, isVIP: isVIP.value })
  if (canSkip.value) {
    console.log('执行跳过广告')
    visible.value = false
    store.dispatch('ad/clearCurrentVideoAd')
    emit('skip')
  }
}

// 初始化广告
const initAd = async () => {
  console.log('开始初始化广告')
  try {
    await store.dispatch('ad/fetchVideoAds')
    console.log('广告初始化成功')
  } catch (error) {
    console.error('初始化广告失败:', error)
    handleSkip()
  }
}

// 组件挂载时初始化
onMounted(() => {
  console.log('广告组件挂载')
  initAd()
  if (adPlayer.value) {
    adPlayer.value.volume = 0.5
  }
})

// 组件卸载时清理
onUnmounted(() => {
  console.log('广告组件卸载')
  if (adPlayer.value) {
    adPlayer.value.pause()
    adPlayer.value.src = ''
    adPlayer.value.load()
  }
  store.dispatch('ad/clearCurrentVideoAd')
})
</script>

<style lang="scss" scoped>
.video-ad {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  z-index: 10;

  .ad-click-area {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100% - 40px);
    z-index: 12;
    cursor: pointer;

    .click-tip {
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      padding: 8px 16px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      transition: opacity 0.3s;
      
      .el-icon {
        font-size: 16px;
      }
    }

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }

  .ad-player {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .ad-controls {
    position: absolute;
    bottom: 85px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 4px;
    z-index: 13;

    .ad-info {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-right: 10px;
      color: #fff;

      .ad-tag {
        background: rgba(255, 255, 255, 0.2);
        padding: 2px 6px;
        border-radius: 2px;
        font-size: 12px;
      }

      .ad-title {
        font-size: 14px;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .ad-duration {
        font-size: 14px;
      }
    }

    .skip-button {
      background: var(--el-color-primary);
      color: #fff;
      border: none;

      &:disabled {
        background: rgba(255, 255, 255, 0.2);
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }

  .ad-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    color: #fff;
    z-index: 14;
    
    .loading-icon {
      animation: rotate 1s linear infinite;
    }

    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
}
</style> 