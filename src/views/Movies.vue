<template>
  <div class="movies-container">
    <h1>电影</h1>
    <div class="movies-content">
      <!-- 电影内容将在这里显示 -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Movies'
}
</script>

<style lang="scss" scoped>
.movies-container {
  padding: 20px;
  
  h1 {
    color: var(--text-primary);
    margin-bottom: 20px;
  }
}
</style> 