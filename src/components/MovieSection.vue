<template>
  <div class="section">
    <div class="section-header">
      <h2>{{ title }}</h2>
      <el-button 
        type="text" 
        @click="handleViewMore"
      >查看更多</el-button>
    </div>
    <div class="movie-list">
      <el-row :gutter="20" v-if="!loading && currentList.length > 0">
        <el-col 
          :xs="12" 
          :sm="8" 
          :md="6" 
          :lg="4" 
          v-for="movie in currentList.slice(0, 6)" 
          :key="movie.id"
        >
          <movie-card :movie="movie" />
        </el-col>
      </el-row>
      <div v-if="loading" class="loading-wrapper">
        <el-skeleton :rows="3" animated />
      </div>
      <div v-if="!loading && currentList.length === 0" class="empty-wrapper">
        <el-empty description="暂无数据" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getHotMovies, getRecommendedMovies } from '@/api/movie'
import { useRouter } from 'vue-router'
import MovieCard from '@/components/movie/MovieCard.vue'

export default {
  name: 'MovieSection',
  components: {
    MovieCard
  },
  props: {
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      validator: (value) => ['hot', 'new'].includes(value)
    },
    moreLink: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    const loading = ref(false)
    const hotList = ref([])
    const recommendedList = ref([])

    const currentList = computed(() => {
      return props.type === 'hot' ? hotList.value : recommendedList.value
    })

    const handleViewMore = () => {
      if (props.type === 'hot') {
        router.push({
          path: '/ranking',
          query: { tab: 'hot' }
        })
      } else {
        router.push({
          path: '/ranking',
          query: { tab: 'recommended' }
        })
      }
    }

    // 获取排行榜数据
    const fetchRankingList = async (type) => {
      loading.value = true
      try {
        let movieList
        if (type === 'hot') {
          movieList = await getHotMovies()
          console.log('热门电影原始数据:', movieList)
          
          if (Array.isArray(movieList)) {
            hotList.value = movieList.map((movie, index) => ({
              id: movie.id,
              title: movie.title,
              cover: movie.posterUrl || movie.cover || '',
              score: Number(movie.rating) || 0,
              rank: index + 1,
              playCount: Number(movie.playCount) || 0,
              year: movie.year || (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : '未知'),
              category: movie.category || (movie.genres ? movie.genres.split(',')[0] : '未分类'),
              needVip: Boolean(movie.isVip === 1 || movie.needVip === true)
            }))
            console.log('处理后的热门电影数据:', hotList.value)
          } else {
            console.error('热门电影数据格式错误:', movieList)
            hotList.value = []
          }
        } else {
          movieList = await getRecommendedMovies()
          console.log('推荐电影原始数据:', movieList)
          
          if (Array.isArray(movieList)) {
            recommendedList.value = movieList.map((movie, index) => ({
              id: movie.id,
              title: movie.title,
              cover: movie.posterUrl || movie.cover || '',
              score: Number(movie.rating) || 0,
              rank: index + 1,
              rating: Number(movie.rating) || 0,
              year: movie.year || (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : '未知'),
              category: movie.category || (movie.genres ? movie.genres.split(',')[0] : '未分类'),
              needVip: Boolean(movie.isVip === 1 || movie.needVip === true)
            }))
            console.log('处理后的推荐电影数据:', recommendedList.value)
          } else {
            console.error('推荐电影数据格式错误:', movieList)
            recommendedList.value = []
          }
        }

        // 打印转换后的数据
        console.log(`${type}排行榜数据:`, currentList.value)
        console.log(`${type}排行榜数据长度:`, currentList.value.length)
      } catch (error) {
        console.error('获取排行榜数据失败:', error)
        ElMessage.error('获取排行榜数据失败')
        // 出错时设置为空数组
        if (type === 'hot') {
          hotList.value = []
        } else {
          recommendedList.value = []
        }
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchRankingList(props.type)
    })

    return {
      loading,
      currentList,
      handleViewMore
    }
  }
}
</script>

<style lang="scss" scoped>
.section {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto 30px;
  background-color: var(--card-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--border-color);

    h2 {
      margin: 0;
      font-size: 20px;
      color: var(--text-color);
    }
  }

  .movie-list {
    .el-col {
      margin-bottom: 20px;
    }
  }

  .loading-wrapper {
    padding: 20px;
  }

  .empty-wrapper {
    padding: 40px 0;
  }
}
</style> 