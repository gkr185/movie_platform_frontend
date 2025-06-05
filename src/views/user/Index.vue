<template>
  <div class="user-center">
    <el-container>
      <!-- 侧边栏导航 -->
      <el-aside width="200px">
        <el-menu
          :router="true"
          class="user-menu"
        >
          <el-menu-item index="/user/profile">
            <i class="el-icon-user"></i>
            <span>个人资料</span>
          </el-menu-item>
          <el-menu-item index="/user/vip">
            <i class="el-icon-trophy"></i>
            <span>会员中心</span>
          </el-menu-item>
          <el-menu-item index="/user/favorites">
            <i class="el-icon-star-off"></i>
            <span>我的收藏</span>
          </el-menu-item>
          <el-menu-item index="/user/history">
            <i class="el-icon-time"></i>
            <span>观看历史</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <!-- 主要内容区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'UserIndex'
}
</script>

<style lang="scss" scoped>
.user-center {
  min-height: calc(100vh - 60px);
  padding: 20px;

  .el-container {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
    overflow: hidden;
  }

  .el-aside {
    background-color: #f5f7fa;
    border-right: 1px solid #e6e6e6;
  }

  .user-menu {
    border-right: none;
  }

  .el-main {
    padding: 20px;
  }
}
</style> 