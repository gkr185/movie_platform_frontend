<template>
  <div class="movie-layout">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'MovieLayout'
}
</script>

<style lang="scss" scoped>
.movie-layout {
  min-height: calc(100vh - 60px);
  padding: 40px;
  background-color: var(--bg-color);
  transition: background-color 0.3s;

  :deep(.el-loading-mask) {
    background-color: var(--bg-color);
    opacity: 0.9;
  }

  :deep(.el-loading-spinner) {
    .el-loading-text {
      color: var(--text-color);
    }

    .path {
      stroke: var(--el-color-primary);
    }
  }
}
</style> 