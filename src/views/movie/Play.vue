<template>
  <div class="movie-play">
    <!-- 播放器区域 -->
    <div class="player-section">
      <div class="player-wrapper">
        <div class="video-container">
          <!-- 广告组件 -->
          <video-ad
            v-if="showAd"
            :movie-id="movieId"
            @skip="handleAdSkip"
            @end="handleAdEnd"
          />

          <!-- 主视频播放器 -->
          <video
            ref="videoPlayer"
            class="video-player"
            controls
            preload="auto"
            crossorigin="anonymous"
            playsinline
            webkit-playsinline
            x5-video-player-type="h5"
            x5-video-player-fullscreen="true"
            @timeupdate="handleTimeUpdate"
            @loadedmetadata="handleVideoLoaded"
            @ended="handleVideoEnded"
            @error="handleVideoError"
            @play="handlePlay"
            @pause="handlePause"
            @volumechange="handleVolumeChange"
            @waiting="handleVideoWaiting"
            @canplay="handleVideoCanPlay"
            @progress="handleProgress"
            @suspend="handleVideoSuspend"
            @stalled="handleVideoStalled"
          >
            <source :type="'video/mp4'" />
            您的浏览器不支持 HTML5 视频播放
          </video>

          <!-- 加载状态 -->
          <div v-if="isLoading" class="video-loading">
            <el-icon class="loading-icon" :size="32"><Loading /></el-icon>
            <span>视频加载中...</span>
          </div>
        </div>
      </div>
    </div>

    <div class="content-section">
      <div class="main-content">
        <!-- 影片信息 -->
        <div class="movie-info">
          <h1 class="title">{{ currentMovie?.title }}</h1>
          <div class="meta">
            <span>
              <el-icon><Calendar /></el-icon>
              {{ currentMovie?.year }}
            </span>
            <span>
              <el-icon><VideoCamera /></el-icon>
              {{ currentMovie?.quality }}
            </span>
            <span>
              <el-icon><Timer /></el-icon>
              {{ currentMovie?.duration }}
            </span>
          </div>
          <div class="tags">
            <el-tag 
              v-for="tag in currentMovie?.tags" 
              :key="tag"
              class="tag"
              effect="plain"
              size="small"
            >{{ tag }}</el-tag>
          </div>
          <p class="description">{{ currentMovie?.description }}</p>
        </div>

        <!-- 评论区域 -->
        <div class="comments-section">
          <h2 class="section-title">
            <el-icon><ChatLineRound /></el-icon>
            评论区
          </h2>
          <template v-if="isLoggedIn">
            <comment-editor
              :movie-id="movieId"
              @success="handleCommentSuccess"
            />
          </template>
          <div v-else class="login-tip">
            <el-alert
              title="登录后才能发表评论"
              type="info"
              :closable="false"
            >
              <template #default>
                <router-link to="/user/login" class="login-link">
                  立即登录
                </router-link>
              </template>
            </el-alert>
          </div>

          <comment-list
            :movie-id="movieId"
            @reply="handleReply"
          />
        </div>
      </div>

      <!-- 相关推荐 -->
      <div class="sidebar">
        <related-movies
          :movie-id="movieId"
          :default-mode="'list'"
          :limit="8"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  Loading,
  VideoPlay,
  Share,
  ChatLineRound,
  Calendar,
  VideoCamera,
  Timer
} from '@element-plus/icons-vue'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import CommentEditor from '@/components/comment/CommentEditor.vue'
import CommentList from '@/components/comment/CommentList.vue'
import RelatedMovies from '@/components/movie/RelatedMovies.vue'
import VideoAd from '@/components/video/VideoAd.vue'

export default {
  name: 'MoviePlay',
  components: {
    CommentEditor,
    CommentList,
    RelatedMovies,
    VideoAd,
    Loading,
    VideoPlay,
    Share,
    ChatLineRound,
    Calendar,
    VideoCamera,
    Timer
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const videoPlayer = ref(null)
    const isLoading = ref(true)
    const showAd = ref(false)
    const videoBlob = ref(null)
    const playbackTimer = ref(null)
    const updateTimer = ref(null)
    const lastUpdateTime = ref(0)

    // 获取电影ID
    const movieId = computed(() => route.params.id)

    // 获取登录状态
    const isLoggedIn = computed(() => store.getters['user/isLoggedIn'])

    // 获取当前电影信息
    const currentMovie = computed(() => {
      const movie = store.getters['movie/currentMovie']
      if (!movie || movie.id !== parseInt(movieId.value)) {
        return null
      }
      return movie
    })

    // 获取播放状态
    const playbackState = computed(() => 
      store.getters['movie/playbackState']
    )

    // 获取当前广告
    const currentAd = computed(() => store.getters['ad/currentAd'])

    // 创建视频 Blob URL
    const createVideoBlobUrl = async (url) => {
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const blob = await response.blob()
        if (videoBlob.value) {
          URL.revokeObjectURL(videoBlob.value)
        }
        videoBlob.value = URL.createObjectURL(blob)
        return videoBlob.value
      } catch (error) {
        console.error('加载视频失败:', error)
        ElMessage.error('加载视频失败，请刷新页面重试')
        throw error
      }
    }

    // 处理视频加载暂停
    const handleVideoSuspend = () => {
      console.log('视频加载暂停')
      isLoading.value = true
    }

    // 处理视频加载停滞
    const handleVideoStalled = () => {
      console.log('视频加载停滞')
      isLoading.value = true
      // 尝试重新加载视频
      if (videoPlayer.value) {
        videoPlayer.value.load()
      }
    }

    // 处理广告跳过
    const handleAdSkip = () => {
      showAd.value = false
      store.dispatch('ad/clearCurrentAd')
      ElMessage.success(store.getters['user/isVIP'] ? 'VIP已自动跳过广告' : '已跳过广告')
      if (videoPlayer.value) {
        videoPlayer.value.play().catch(() => {
          ElMessage.warning('自动播放被浏览器阻止，请手动点击播放')
        })
      }
    }

    // 处理广告结束
    const handleAdEnd = () => {
      showAd.value = false
      store.dispatch('ad/clearCurrentAd')
      if (videoPlayer.value) {
        videoPlayer.value.play().catch(() => {
          ElMessage.warning('自动播放被浏览器阻止，请手动点击播放')
        })
      }
    }

    // 处理视频加载完成
    const handleVideoLoaded = () => {
      if (videoPlayer.value) {
        const duration = videoPlayer.value.duration
        
        // 设置视频缓冲策略
        try {
          if ('buffered' in videoPlayer.value) {
            // 设置较大的缓冲区
            videoPlayer.value.preload = 'auto'
          }
        } catch (error) {
          console.error('设置缓冲策略失败:', error)
        }

        store.dispatch('movie/updatePlaybackState', {
          duration,
          currentTime: 0
        })

        // 恢复上次播放进度
        const progress = store.getters['movie/watchProgress'].get(movieId.value)
        if (progress && progress > 0 && progress < 1) {
          const targetTime = progress * duration
          videoPlayer.value.currentTime = targetTime
        }

        // 如果没有显示广告，自动开始播放
        if (!showAd.value) {
          videoPlayer.value.play().catch(() => {
            ElMessage.warning('自动播放被浏览器阻止，请手动点击播放')
          })
        }
      }
    }

    // 处理视频加载完成
    const handleVideoWaiting = () => {
      isLoading.value = true
    }

    // 处理视频可以播放
    const handleVideoCanPlay = () => {
      isLoading.value = false
    }

    // 处理视频缓冲进度
    const handleProgress = () => {
      if (videoPlayer.value) {
        const buffered = videoPlayer.value.buffered
        if (buffered.length > 0) {
          const bufferedEnd = buffered.end(buffered.length - 1)
          const duration = videoPlayer.value.duration
          const bufferedPercent = (bufferedEnd / duration) * 100
          // 如果缓冲足够，隐藏加载状态
          if (bufferedPercent > 15) {
            isLoading.value = false
          }
        }
      }
    }

    // 优化的时间更新处理
    const handleTimeUpdate = () => {
      if (videoPlayer.value) {
        const now = Date.now()
        // 限制更新频率，每200ms更新一次
        if (now - lastUpdateTime.value >= 200) {
          const currentTime = videoPlayer.value.currentTime
          const duration = videoPlayer.value.duration
          
          // 更新播放状态
          store.dispatch('movie/updatePlaybackState', {
            currentTime,
            duration
          })

          // 节流保存观看进度
          if (playbackTimer.value) {
            clearTimeout(playbackTimer.value)
          }
          playbackTimer.value = setTimeout(() => {
            store.dispatch('movie/updateWatchProgress', {
              movieId: movieId.value,
              progress: currentTime / duration
            })
          }, 2000) // 每2秒保存一次进度

          lastUpdateTime.value = now
        }
      }
    }

    // 处理播放/暂停
    const handlePlay = () => {
      store.dispatch('movie/updatePlaybackState', {
        isPlaying: true
      })
    }

    const handlePause = () => {
      store.dispatch('movie/updatePlaybackState', {
        isPlaying: false
      })
      // 暂停时立即保存进度
      if (videoPlayer.value) {
        const currentTime = videoPlayer.value.currentTime
        const duration = videoPlayer.value.duration
        store.dispatch('movie/updateWatchProgress', {
          movieId: movieId.value,
          progress: currentTime / duration
        })
      }
    }

    // 处理音量变化
    const handleVolumeChange = () => {
      if (videoPlayer.value) {
        store.dispatch('movie/updatePlaybackState', {
          volume: videoPlayer.value.volume
        })
      }
    }

    // 处理视频播放结束
    const handleVideoEnded = () => {
      store.dispatch('movie/updatePlaybackState', {
        isPlaying: false,
        currentTime: videoPlayer.value?.duration || 0
      })
      store.dispatch('movie/updateWatchProgress', {
        movieId: movieId.value,
        progress: 1
      })
    }

    // 处理视频错误
    const handleVideoError = (e) => {
      console.error('视频加载失败:', e)
      isLoading.value = false
      ElMessage.error('视频加载失败，请刷新页面重试')
    }

    // 处理视频源变化
    watch(() => currentMovie.value?.videoUrl, async (newUrl) => {
      if (newUrl) {
        isLoading.value = true
        try {
          const blobUrl = await createVideoBlobUrl(newUrl)
          if (videoPlayer.value) {
            videoPlayer.value.src = blobUrl
          }
        } catch (error) {
          ElMessage.error('视频加载失败')
        }
      }
    }, { immediate: true })

    // 加载电影数据
    const loadMovieData = async (id) => {
      isLoading.value = true
      try {
        // 检查用户是否登录
        if (!store.getters['user/isLoggedIn']) {
          ElMessage.warning('请先登录后观看')
          router.push({
            path: '/user/login',
            query: { redirect: route.fullPath }
          })
          return
        }

        try {
          // 重置状态
          store.dispatch('movie/resetPlaybackState')
          showAd.value = true // 重置广告状态
          
          // 选择并设置广告
          await store.dispatch('ad/selectAdForMovie', {
            movieId: id,
            type: 'pre-roll'
          })
          
          // 开始播放，获取电影信息
          const movieData = await store.dispatch('movie/startPlayback', id)
          
          // 检查 VIP 权限
          if (movieData.needVIP && !store.getters['user/isVIP']) {
            ElMessage.warning('该视频需要 VIP 会员才能观看')
            router.push({
              path: '/user/vip',
              query: { redirect: route.fullPath }
            })
            return
          }

          // 加载其他数据
          await Promise.all([
            store.dispatch('movie/fetchRecommendedMovies', id)
          ])

          // 等待视频元数据加载完成
          if (videoPlayer.value) {
            await new Promise((resolve) => {
              if (videoPlayer.value.readyState >= 1) {
                resolve()
              } else {
                videoPlayer.value.addEventListener('loadedmetadata', resolve, { once: true })
              }
            })
          }

          // 恢复上次播放进度
          const progress = store.getters['movie/watchProgress'].get(id)
          if (progress && videoPlayer.value) {
            const targetTime = progress * videoPlayer.value.duration
            if (targetTime > 0 && targetTime < videoPlayer.value.duration) {
              videoPlayer.value.currentTime = targetTime
              ElMessage.info(`已恢复至上次播放位置：${Math.floor(targetTime / 60)}分${Math.floor(targetTime % 60)}秒`)
            }
          }

          // 设置默认清晰度
          if (movieData.defaultQuality) {
            store.dispatch('movie/updatePlaybackState', {
              quality: movieData.defaultQuality
            })
          }

          // 设置默认字幕
          if (movieData.subtitles?.length > 0) {
            const track = document.createElement('track')
            track.kind = 'subtitles'
            track.label = '中文'
            track.srclang = 'zh'
            track.src = movieData.subtitles.find(s => s.language === 'zh')?.url
            if (track.src) {
              videoPlayer.value.appendChild(track)
              track.default = true
            }
          }

        } catch (error) {
          if (error.message === '视频不存在') {
            ElMessage.error('视频不存在')
          } else {
            ElMessage.error('加载视频失败，请稍后重试')
            console.error('加载电影数据失败:', error)
          }
          router.push('/404')
        }
      } catch (error) {
        console.error('权限检查失败:', error)
        ElMessage.error('系统错误，请稍后重试')
        router.push('/404')
      } finally {
        isLoading.value = false
      }
    }

    // 生命周期钩子
    onMounted(() => {
      showAd.value = true // 初始化广告状态
      loadMovieData(movieId.value)
    })

    onUnmounted(() => {
      // 清理资源
      if (videoBlob.value) {
        URL.revokeObjectURL(videoBlob.value)
      }
      if (playbackTimer.value) {
        clearTimeout(playbackTimer.value)
      }
      if (updateTimer.value) {
        clearTimeout(updateTimer.value)
      }
      showAd.value = false // 重置广告状态
    })

    // 监听路由变化
    watch(() => route.params.id, (newId, oldId) => {
      if (newId !== oldId) {
        showAd.value = true // 切换视频时重置广告状态
        loadMovieData(newId)
      }
    })

    // 监听电影信息变化
    watch(currentMovie, (newMovie) => {
      if (newMovie && videoPlayer.value) {
        // 更新视频源后重置播放器状态
        videoPlayer.value.currentTime = 0
        videoPlayer.value.volume = playbackState.value.volume
        if (playbackState.value.isPlaying) {
          videoPlayer.value.play().catch(() => {
            // 自动播放可能被浏览器阻止，忽略错误
          })
        }
      }
    })

    // 监听播放状态变化
    watch(() => playbackState.value.currentTime, (newTime) => {
      if (videoPlayer.value && Math.abs(videoPlayer.value.currentTime - newTime) > 1) {
        // 只在时间差异大于1秒时更新，避免频繁更新
        videoPlayer.value.currentTime = newTime
      }
    }, { flush: 'post' }) // 使用 post 钩子，避免同步更新

    watch(() => playbackState.value.volume, (newVolume) => {
      if (videoPlayer.value && Math.abs(videoPlayer.value.volume - newVolume) > 0.1) {
        videoPlayer.value.volume = newVolume
      }
    }, { flush: 'post' })

    watch(() => playbackState.value.isPlaying, (isPlaying) => {
      if (videoPlayer.value) {
        if (isPlaying && videoPlayer.value.paused) {
          // 使用 requestAnimationFrame 优化播放状态更新
          requestAnimationFrame(() => {
            videoPlayer.value.play().catch(() => {
              // 自动播放可能被浏览器阻止，忽略错误
            })
          })
        } else if (!isPlaying && !videoPlayer.value.paused) {
          requestAnimationFrame(() => {
            videoPlayer.value.pause()
          })
        }
      }
    }, { flush: 'post' })

    // 评论成功回调
    const handleCommentSuccess = () => {
      // CommentList 组件会自动刷新评论列表
    }

    // 处理回复
    const handleReply = (comment) => {
      if (!isLoggedIn.value) {
        ElMessage.warning('请先登录')
        return
      }
      // 滚动到评论编辑器
      const editor = document.querySelector('.comment-editor')
      if (editor) {
        editor.scrollIntoView({ behavior: 'smooth' })
      }
    }

    // 格式化时间
    const formatTime = (time) => {
      return formatDistanceToNow(new Date(time), {
        addSuffix: true,
        locale: zhCN
      })
    }

    // 跳转到电影详情页
    const goToMovie = (movieId) => {
      router.push(`/movie/${movieId}`)
    }

    return {
      videoPlayer,
      currentMovie,
      playbackState,
      isLoading,
      isLoggedIn,
      movieId,
      Loading,
      handleTimeUpdate,
      handleVideoLoaded,
      handleVideoEnded,
      handleVideoError,
      handlePlay,
      handlePause,
      handleVolumeChange,
      handleVideoWaiting,
      handleVideoCanPlay,
      handleProgress,
      handleVideoSuspend,
      handleVideoStalled,
      formatTime,
      goToMovie,
      handleCommentSuccess,
      handleReply,
      showAd,
      handleAdSkip,
      handleAdEnd
    }
  }
}
</script>

<style lang="scss" scoped>
.movie-play {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 20px;

  .player-section {
    position: relative;
    background-color: #000;
    margin: 0 -20px 20px;
    z-index: 1;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    .player-wrapper {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding-top: 42.85%; // 更改为 21:9 宽高比
      position: relative;

      .video-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #000;

        .video-player {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          z-index: 1;
        }

        .video-loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: #fff;
          text-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
          z-index: 5;

          .loading-icon {
            animation: rotate 1s linear infinite;
          }

          span {
            font-size: 14px;
            opacity: 0.9;
          }
        }
      }
    }
  }

  .content-section {
    display: flex;
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;

    .main-content {
      flex: 1;
      min-width: 0;

      .movie-info {
        margin-bottom: 20px;
        padding: 16px;
        background: var(--movie-section-bg);
        border-radius: 8px;
        box-shadow: var(--movie-section-shadow);

        .title {
          margin: 0 0 12px;
          font-size: 20px;
          color: var(--text-color);
          font-weight: 600;
        }

        .meta {
          margin-bottom: 12px;
          color: var(--text-color-light);
          font-size: 14px;

          span {
            margin-right: 16px;
            display: inline-flex;
            align-items: center;
            gap: 4px;

            &:last-child {
              margin-right: 0;
            }
          }
        }

        .tags {
          margin-bottom: 12px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;

          .tag {
            margin: 0;
          }
        }

        .description {
          margin: 0;
          color: var(--text-color-light);
          line-height: 1.6;
          font-size: 14px;
        }
      }

      .comments-section {
        padding: 16px;
        background: var(--movie-section-bg);
        border-radius: 8px;
        box-shadow: var(--movie-section-shadow);

        .section-title {
          margin: 0 0 16px;
          font-size: 16px;
          color: var(--text-color);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;

          .el-icon {
            color: var(--el-color-primary);
          }
        }

        .login-tip {
          margin-bottom: 20px;

          .login-link {
            color: var(--el-color-primary);
            text-decoration: none;
            font-weight: 500;

            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }

    .sidebar {
      width: 280px;
      flex-shrink: 0;
    }
  }
}

// 响应式设计
@media screen and (max-width: 1200px) {
  .movie-play {
    padding: 0 16px;

    .player-section {
      margin: 0 -16px 16px;

      .player-wrapper {
        padding-top: 56.25%; // 在小屏幕上改回 16:9
      }
    }
  }
}

@media screen and (max-width: 992px) {
  .movie-play {
    .content-section {
      flex-direction: column;

      .sidebar {
        width: 100%;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .movie-play {
    padding: 0 12px;

    .player-section {
      margin: 0 -12px 12px;
    }

    .content-section {
      gap: 16px;

      .main-content {
        .movie-info,
        .comments-section {
          padding: 12px;

          .title {
            font-size: 18px;
          }

          .meta {
            font-size: 13px;
            flex-wrap: wrap;
            gap: 8px;

            span {
              margin-right: 12px;
            }
          }
        }
      }
    }
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 