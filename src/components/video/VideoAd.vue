<template>
  <div class="video-ad" v-if="visible">
    <!-- 广告点击区域 -->
    <div 
      class="ad-click-area"
      v-if="currentAd?.link"
      @click="handleAdClick"
    >
      <div class="click-tip" v-if="showClickTip">
        <el-icon><Link /></el-icon>
        {{ currentAd.clickText || '点击查看详情' }}
      </div>
    </div>

    <video
      ref="adPlayer"
      class="ad-player"
      :src="currentAd?.url"
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
        <span class="ad-tag">{{ currentAd?.name || '广告' }}</span>
        <span class="ad-duration" v-if="!isVIP && !canSkip">
          {{ Math.max(0, Math.ceil(currentAd?.skipAfter - currentTime)) }}秒后可跳过
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
    <div v-if="isLoading" class="ad-loading">
      <el-icon class="loading-icon" :size="32"><Loading /></el-icon>
      <span>广告加载中...</span>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useStore } from 'vuex'
import { Loading, Link } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'VideoAd',
  components: {
    Loading,
    Link
  },
  props: {
    movieId: {
      type: [String, Number],
      required: true
    }
  },
  emits: ['skip', 'end'],
  setup(props, { emit }) {
    const store = useStore()
    const adPlayer = ref(null)
    const visible = ref(true)
    const currentTime = ref(0)
    const isLoading = ref(true)
    const showClickTip = ref(false)
    
    // 从 Vuex 获取当前广告
    const currentAd = computed(() => store.getters['ad/currentAd'])
    
    // 是否是VIP用户
    const isVIP = computed(() => store.getters['user/isVIP'])
    
    // 是否可以跳过广告
    const canSkip = computed(() => 
      isVIP.value || (currentAd.value && currentTime.value >= currentAd.value.skipAfter)
    )

    // 处理鼠标移入
    const handleMouseOver = () => {
      if (currentAd.value?.link) {
        showClickTip.value = true
      }
    }

    // 处理鼠标移出
    const handleMouseOut = () => {
      showClickTip.value = false
    }

    // 处理广告点击
    const handleAdClick = () => {
      if (currentAd.value?.link) {
        // 在新标签页中打开广告链接
        window.open(currentAd.value.link, '_blank')
        // 可以在这里添加广告点击统计等逻辑
      }
    }

    // 监听广告变化
    watch(currentAd, async (newAd) => {
      if (newAd && adPlayer.value) {
        isLoading.value = true
        adPlayer.value.load() // 重新加载视频
      }
    })

    // 处理广告时间更新
    const handleTimeUpdate = () => {
      if (adPlayer.value) {
        currentTime.value = adPlayer.value.currentTime
      }
    }

    // 处理广告结束
    const handleAdEnded = () => {
      visible.value = false
      store.dispatch('ad/clearCurrentAd')
      emit('end')
    }

    // 处理广告加载完成
    const handleAdLoaded = async () => {
      isLoading.value = false
      if (isVIP.value) {
        // VIP用户自动跳过广告
        handleSkip()
      } else if (currentAd.value) {
        try {
          // 设置默认音量
          if (adPlayer.value) {
            adPlayer.value.volume = 0.5 // 设置适中的音量
          }
          // 尝试播放
          await adPlayer.value?.play()
        } catch (error) {
          console.error('广告自动播放失败:', error)
          ElMessage.warning('请点击播放按钮开始播放')
          isLoading.value = false
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
      isLoading.value = true
    }

    // 处理广告可以播放
    const handleAdCanPlay = () => {
      isLoading.value = false
    }

    // 跳过广告
    const handleSkip = () => {
      if (canSkip.value) {
        visible.value = false
        store.dispatch('ad/clearCurrentAd')
        emit('skip')
      }
    }

    // 初始化广告
    const initAd = async () => {
      try {
        await store.dispatch('ad/selectAdForMovie', {
          movieId: props.movieId,
          type: 'pre-roll'
        })
      } catch (error) {
        console.error('初始化广告失败:', error)
        handleSkip()
      }
    }

    // 组件挂载时初始化
    onMounted(() => {
      initAd()
      // 设置默认音量
      if (adPlayer.value) {
        adPlayer.value.volume = 0.5 // 设置适中的音量
      }
    })

    // 组件卸载时清理
    onUnmounted(() => {
      if (adPlayer.value) {
        adPlayer.value.pause()
        adPlayer.value.src = ''
        adPlayer.value.load()
      }
      store.dispatch('ad/clearCurrentAd')
    })

    return {
      adPlayer,
      visible,
      currentTime,
      isVIP,
      canSkip,
      isLoading,
      currentAd,
      showClickTip,
      Loading,
      Link,
      handleTimeUpdate,
      handleAdEnded,
      handleAdLoaded,
      handleAdError,
      handleAdWaiting,
      handleAdCanPlay,
      handleSkip,
      handleMouseOver,
      handleMouseOut,
      handleAdClick
    }
  }
}
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
    height: calc(100% - 40px); // 留出控制栏的空间
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
    bottom: 85px; // 调整位置，避免与播放器控制栏重叠
    right: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 4px;
    z-index: 13; // 确保在点击区域上方

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
    z-index: 14; // 确保在最上层
    
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