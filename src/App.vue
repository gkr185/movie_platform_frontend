<template>
  <div id="app" :data-theme="currentTheme">
    <nav-bar></nav-bar>
    <div class="main-container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
    NavBar
  },
  computed: {
    ...mapGetters(['currentTheme'])
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
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
  position: relative;
  
  .main-container {
    padding-top: 72px; // 导航栏的高度
    min-height: calc(100vh - 72px); // 减去导航栏高度
  }

  // 导航栏样式
  .nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000; // 确保导航栏在最上层
    background-color: var(--bg-color);
  }
}

:root {
  // 浅色主题变量
  --bg-color: #f5f5f5;
  --text-color: #333333;
  --text-color-light: #666666;
  --card-bg-color: #ffffff;
  --border-color: #e4e7ed;
  --input-bg-color: #f5f5f5;
}

// 深色主题变量
[data-theme='dark'] {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
  --text-color-light: #999999;
  --card-bg-color: #2a2a2a;
  --border-color: #4a4a4a;
  --input-bg-color: #333333;
}

// 全局滚动条样式
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--input-bg-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
  &:hover {
    background: var(--text-color-light);
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
  color: var(--text-color) !important;

  &:hover {
    color: rgb(255, 115, 0) !important;
  }

  &.is-active {
    color: rgb(255, 115, 0) !important;
    border-bottom-color: rgb(255, 115, 0) !important;
  }
}

.el-dropdown-link {
  cursor: pointer;
  color: var(--text-color);
  display: flex;
  align-items: center;

  &:hover {
    color: rgb(255, 115, 0);
  }
}

// 卡片样式适配主题
.el-card {
  background-color: var(--card-bg-color) !important;
  border-color: var(--border-color) !important;
  color: var(--text-color) !important;

  .el-card__header {
    border-bottom-color: var(--border-color) !important;
  }
}

// 按钮样式适配主题
.el-button--text {
  color: var(--text-color) !important;

  &:hover {
    color: rgb(255, 115, 0) !important;
  }
}

// 输入框样式适配主题
.el-input__inner {
  background-color: var(--input-bg-color) !important;
  border-color: var(--border-color) !important;
  color: var(--text-color) !important;

  &::placeholder {
    color: var(--text-color-light) !important;
  }
}

// 下拉菜单样式适配主题
.el-dropdown-menu {
  background-color: var(--card-bg-color) !important;
  border-color: var(--border-color) !important;

  .el-dropdown-menu__item {
    color: var(--text-color) !important;

    &:hover {
      background-color: var(--input-bg-color) !important;
      color: rgb(255, 115, 0) !important;
    }
  }
}

// 弹窗样式适配主题
.el-dialog {
  background-color: var(--card-bg-color) !important;
  
  .el-dialog__title {
    color: var(--text-color) !important;
  }
  
  .el-dialog__body {
    color: var(--text-color) !important;
  }
}

// 表格样式适配主题
.el-table {
  background-color: var(--card-bg-color) !important;
  color: var(--text-color) !important;
  
  tr {
    background-color: var(--card-bg-color) !important;
  }
  
  th.el-table__cell {
    background-color: var(--input-bg-color) !important;
    color: var(--text-color) !important;
    border-bottom-color: var(--border-color) !important;
  }
  
  td.el-table__cell {
    border-bottom-color: var(--border-color) !important;
  }
}

// 分页样式适配主题
.el-pagination {
  color: var(--text-color) !important;
  
  .el-pagination__total,
  .el-pagination__jump {
    color: var(--text-color) !important;
  }
  
  .el-input__inner {
    background-color: var(--input-bg-color) !important;
    color: var(--text-color) !important;
  }
  
  button {
    background-color: var(--card-bg-color) !important;
    color: var(--text-color) !important;
    
    &:disabled {
      color: var(--text-color-light) !important;
    }
  }
}
</style>
