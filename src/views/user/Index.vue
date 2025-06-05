<template>
  <div class="user-center">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <div class="user-sidebar">
          <div class="user-info">
            <el-avatar :size="64" icon="el-icon-user"></el-avatar>
            <h3>{{ username }}</h3>
            <p>{{ isVip ? 'VIP会员' : '普通用户' }}</p>
          </div>
          <el-menu
            :default-active="activeMenu"
            class="user-menu"
            router
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
            <el-menu-item index="/user/statistics">
              <i class="el-icon-data-line"></i>
              <span>数据统计</span>
            </el-menu-item>
          </el-menu>
        </div>
      </el-aside>

      <!-- 主内容区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'UserCenter',
  data() {
    return {
      username: '张三',
      isVip: true,
      activeMenu: this.$route.path
    }
  },
  watch: {
    $route(to) {
      this.activeMenu = to.path
    }
  }
}
</script>

<style lang="scss" scoped>
.user-center {
  min-height: calc(100vh - 60px);
  background-color: #f5f7fa;

  .el-container {
    height: 100%;
  }

  .el-aside {
    background-color: #fff;
    border-right: 1px solid #e6e6e6;
    
    .user-sidebar {
      height: 100%;

      .user-info {
        padding: 20px;
        text-align: center;
        border-bottom: 1px solid #e6e6e6;

        .el-avatar {
          margin-bottom: 10px;
        }

        h3 {
          margin: 10px 0 5px;
          font-size: 16px;
        }

        p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }
      }

      .user-menu {
        border-right: none;

        .el-menu-item {
          i {
            margin-right: 5px;
          }
        }
      }
    }
  }

  .el-main {
    padding: 20px;
    background-color: #fff;
    margin: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  }
}
</style> 