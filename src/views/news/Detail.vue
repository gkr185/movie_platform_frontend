<template>
  <div class="news-detail" v-loading="loading">
    <template v-if="news">
      <div class="news-header">
        <h1 class="news-title">{{ news.title }}</h1>
        <div class="news-meta">
          <span class="source">{{ news.source }}</span>
          <span class="author">{{ news.author }}</span>
          <span class="time">{{ formatTime(news.publishTime) }}</span>
          <el-tag size="small" type="info">{{ news.category?.name }}</el-tag>
        </div>
      </div>

      <div class="news-cover" v-if="news.cover_image">
        <el-image
          :src="news.cover_image"
          fit="cover"
          :preview-src-list="[news.cover_image]"
        >
          <template #error>
            <div class="image-error">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-image>
      </div>

      <div class="news-content" v-html="news.content"></div>

      <div class="news-actions">
        <el-button @click="goBack">
          <el-icon><Back /></el-icon>
          返回列表
        </el-button>
        <el-button type="primary" @click="handleShare">
          <el-icon><Share /></el-icon>
          分享
        </el-button>
      </div>
    </template>

    <el-empty v-else description="新闻不存在" />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { Back, Share, Picture } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default {
  name: 'NewsDetail',
  components: {
    Back,
    Share,
    Picture
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    // 从store获取状态
    const news = computed(() => store.getters['news/currentNews'])
    const loading = computed(() => store.getters['news/loading'])
    const error = computed(() => store.getters['news/error'])

    // 加载新闻详情
    const loadNewsDetail = async () => {
      try {
        const id = route.params.id
        await store.dispatch('news/fetchNewsDetail', id)
      } catch (error) {
        console.error('加载新闻详情失败:', error)
        ElMessage.error('加载新闻详情失败')
      }
    }

    // 返回列表
    const goBack = () => {
      router.push('/news')
    }

    // 分享
    const handleShare = () => {
      const url = window.location.href
      navigator.clipboard.writeText(url)
      ElMessage.success('链接已复制到剪贴板')
    }

    // 格式化时间
    const formatTime = (time) => {
      if (!time) return '未知时间'
      return formatDistanceToNow(new Date(time), {
        addSuffix: true,
        locale: zhCN
      })
    }

    // 页面加载时获取新闻详情
    onMounted(() => {
      loadNewsDetail()
    })

    return {
      news,
      loading,
      error,
      goBack,
      handleShare,
      formatTime
    }
  }
}
</script>

<style lang="scss" scoped>
.news-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  .news-header {
    margin-bottom: 30px;

    .news-title {
      margin: 0 0 20px;
      font-size: 28px;
      color: var(--text-color);
      line-height: 1.4;
    }

    .news-meta {
      color: var(--text-color-light);
      font-size: 14px;

      span {
        margin-right: 15px;

        &:last-child {
          margin-right: 0;
        }
      }

      .el-tag {
        margin-left: 15px;
      }
    }
  }

  .news-cover {
    margin-bottom: 30px;
    border-radius: 8px;
    overflow: hidden;

    .el-image {
      width: 100%;
      height: 400px;
    }

    .image-error {
      height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--input-bg-color);
      
      .el-icon {
        font-size: 48px;
        color: var(--text-color-light);
      }
    }
  }

  .news-content {
    margin-bottom: 40px;
    color: var(--text-color);
    line-height: 1.8;
    font-size: 16px;

    :deep(p) {
      margin-bottom: 20px;
    }

    :deep(img) {
      max-width: 100%;
      height: auto;
      margin: 20px 0;
      border-radius: 4px;
    }
  }

  .news-actions {
    display: flex;
    justify-content: center;
    gap: 20px;
    padding-top: 30px;
    border-top: 1px solid var(--border-color);
  }
}

// 响应式设计
@media screen and (max-width: 768px) {
  .news-detail {
    padding: 15px;

    .news-header {
      .news-title {
        font-size: 24px;
      }
    }

    .news-cover {
      .el-image {
        height: 250px;
      }

      .image-error {
        height: 250px;
      }
    }
  }
}
</style> 