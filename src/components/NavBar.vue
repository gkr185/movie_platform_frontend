<template>
  <el-header class="nav-header">
    <div class="nav-container">
      <!-- Logo区域 -->
      <div class="logo" @click="$router.push('/')">
        <img src="@/assets/logo.png" alt="logo">
        <span>在线电影平台</span>
      </div>

      <!-- 主导航菜单 -->
      <el-menu 
        mode="horizontal" 
        :router="true"
        :default-active="activeMenu"
        class="main-menu"
      >
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/category">分类</el-menu-item>
        <el-menu-item index="/ranking">排行榜</el-menu-item>
        <el-menu-item index="/newest">最新上映</el-menu-item>
        <el-menu-item index="/news">资讯</el-menu-item>
      </el-menu>

      <!-- 搜索框 -->
      <div class="search-box">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索电影"
          prefix-icon="el-icon-search"
          @keyup.enter="handleSearch"
          clearable
        >
          <template #append>
            <el-button @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
      </div>

      <!-- 用户操作区 -->
      <div class="user-actions">
        <template v-if="isLoggedIn">
          <el-dropdown trigger="click" @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="32" icon="el-icon-user"></el-avatar>
              <span class="username">{{ username }}</span>
              <i class="el-icon-arrow-down"></i>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <i class="el-icon-user"></i> 个人中心
                </el-dropdown-item>
                <el-dropdown-item command="vip">
                  <i class="el-icon-trophy"></i> 会员中心
                </el-dropdown-item>
                <el-dropdown-item command="favorites">
                  <i class="el-icon-star-off"></i> 我的收藏
                </el-dropdown-item>
                <el-dropdown-item command="history">
                  <i class="el-icon-time"></i> 观看历史
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <i class="el-icon-switch-button"></i> 退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <el-button type="text" @click="$router.push('/login')">登录</el-button>
          <el-button type="primary" @click="$router.push('/register')">注册</el-button>
        </template>
      </div>
    </div>
  </el-header>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      searchKeyword: '',
      isLoggedIn: true, // 实际项目中从vuex获取
      username: '张三',
      activeMenu: '/'
    }
  },
  watch: {
    $route: {
      handler(route) {
        this.activeMenu = route.path
      },
      immediate: true
    }
  },
  methods: {
    handleSearch() {
      if (this.searchKeyword.trim()) {
        this.$router.push({
          path: '/search',
          query: { keyword: this.searchKeyword }
        })
      }
    },
    handleCommand(command) {
      switch (command) {
        case 'profile':
        case 'vip':
        case 'favorites':
        case 'history':
          this.$router.push(`/user/${command}`)
          break
        case 'logout':
          this.handleLogout()
          break
      }
    },
    handleLogout() {
      // 实际项目中调用退出登录接口
      this.$message.success('退出登录成功')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 20px;

    .logo {
      display: flex;
      align-items: center;
      cursor: pointer;
      margin-right: 40px;

      img {
        height: 40px;
        margin-right: 10px;
      }

      span {
        font-size: 18px;
        font-weight: bold;
        color: #409EFF;
      }
    }

    .main-menu {
      border-bottom: none;
      margin-right: 20px;
    }

    .search-box {
      width: 300px;
      margin-right: 20px;
    }

    .user-actions {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px;

      .user-info {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 5px 10px;
        border-radius: 4px;
        transition: all 0.3s;

        &:hover {
          background-color: #f5f7fa;
        }

        .username {
          margin: 0 5px;
          font-size: 14px;
        }
      }
    }
  }
}

// 为了防止导航栏遮挡内容
:deep(#app) {
  padding-top: 60px;
}
</style> 