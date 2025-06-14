<template>
  <div class="ranking-container">
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="热门榜" name="hot">
        <ranking-list :list="hotList" type="hot" :loading="loading" />
      </el-tab-pane>
      <el-tab-pane label="推荐榜" name="recommended">
        <ranking-list :list="recommendedList" type="recommended" :loading="loading" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import RankingList from '@/components/RankingList.vue'
import { getHotMovies, getRecommendedMovies } from '@/api/movie'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
  name: 'Ranking',
  components: {
    RankingList
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const activeTab = ref(route.query.tab || 'hot')
    const loading = ref(false)
    const hotList = ref([])
    const recommendedList = ref([])

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
        const currentList = type === 'hot' ? hotList.value : recommendedList.value
        console.log(`${type}排行榜数据:`, currentList)
        console.log(`${type}排行榜数据长度:`, currentList.length)
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

    const handleTabClick = (tab) => {
      activeTab.value = tab.props.name
      fetchRankingList(tab.props.name)
    }

    onMounted(() => {
      fetchRankingList(activeTab.value)
    })

    return {
      activeTab,
      loading,
      hotList,
      recommendedList,
      handleTabClick
    }
  }
}
</script>

<style lang="scss" scoped>
.ranking-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: var(--card-bg-color);
  color: var(--text-color);
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}
</style> 