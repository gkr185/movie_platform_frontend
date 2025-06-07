<template>
  <div class="ranking-container">
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="热门榜" name="hot">
        <ranking-list :list="hotList" type="hot" />
      </el-tab-pane>
      <el-tab-pane label="好评榜" name="rating">
        <ranking-list :list="ratingList" type="rating" />
      </el-tab-pane>
      <el-tab-pane label="新片榜" name="new">
        <ranking-list :list="newList" type="new" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import RankingList from '@/components/RankingList.vue'

export default {
  name: 'Ranking',
  components: {
    RankingList
  },
  data() {
    return {
      activeTab: 'hot',
      hotList: [
        {
          id: 1,
          rank: 1,
          title: '流浪地球2',
          score: 9.5,
          hot: 9999,
          poster: '/posters/earth2.jpg',
          change: 0
        },
        {
          id: 2,
          rank: 2,
          title: '满江红',
          score: 9.3,
          hot: 8888,
          poster: '/posters/mjh.jpg',
          change: 1
        }
        // 更多数据...
      ],
      ratingList: [],
      newList: []
    }
  },
  methods: {
    handleTabClick(tab) {
      this.fetchRankingList(tab.name)
    },
    fetchRankingList(type) {
      // 获取排行榜数据
      console.log('获取排行榜:', type)
    }
  },
  created() {
    this.fetchRankingList(this.activeTab)
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