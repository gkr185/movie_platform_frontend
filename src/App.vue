<template>
  <div id="app">
    <nav-bar></nav-bar>
    <div class="main-container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'

export default {
  name: 'App',
  components: {
    NavBar
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
  background-color: #f5f6f7;
  
  .main-container {
    padding-top: 60px; // 导航栏的高度
    min-height: calc(100vh - 60px); // 减去导航栏高度
  }
}

// 全局滚动条样式
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
  &:hover {
    background: #a8a8a8;
  }
}

// Element UI 全局样式覆盖
.el-header {
  padding: 0 !important;
  height: 60px !important;
}

.el-menu {
  border: none !important;
  background-color: transparent !important;
}

.el-menu--horizontal > .el-menu-item {
  height: 60px !important;
  line-height: 60px !important;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
  display: flex;
  align-items: center;
}
</style>
