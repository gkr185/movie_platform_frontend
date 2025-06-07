<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="logo">
        <img src="@/assets/logo.png" alt="logo" class="logo-img">
        <span class="logo-text">在线电影平台</span>
      </router-link>

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

      <div class="menu-nav">
        <div 
          class="menu-button" 
          :class="{ 'is-active': modelValue }"
          @click="$emit('toggle-menu')"
        >
          <div class="icon-container">
            <div class="icon-wrapper">
              <el-icon class="icon"><Menu /></el-icon>
            </div>
            
            <div class="menu-text">
              <div class="text-container">
                <h3>MENU</h3>
                <h3 class="text-hover">MENU</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'TheNavbar',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchKeyword: ''
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
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  
  .logo-img {
    height: 40px;
    width: auto;
  }
  
  .logo-text {
    font-size: 1.5rem;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.02em;
  }
}

.search-box {
  flex: 0 1 300px;
  margin: 0 20px;
  
  :deep(.el-input__inner) {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: transparent;
    color: #fff;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }
  
  :deep(.el-input-group__append) {
    background-color: rgb(255, 115, 0);
    border-color: rgb(255, 115, 0);
    
    .el-button {
      color: #fff;
      border: none;
      
      &:hover {
        background-color: darken(rgb(255, 115, 0), 10%);
      }
    }
  }
}

.menu-nav {
  padding: 0 1.5rem;
}

.menu-button {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  user-select: none;
  
  &:hover {
    background-color: rgb(255, 115, 0);
  }
}

.icon-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-wrapper {
  position: relative;
  width: 20px;
  height: 20px;
  overflow: hidden;
}

.icon {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #fff;
  transition: transform 0.6s cubic-bezier(.16,1,.3,1);
}

.menu-text {
  position: relative;
  height: 20px;
  overflow: hidden;
}

.text-container {
  transform: translateY(0);
  transition: 0.6s cubic-bezier(.16,1,.3,1);
  
  h3 {
    font-size: 16px;
    letter-spacing: -0.01em;
    line-height: 20px;
    text-transform: uppercase;
    color: #fff;
    text-align: center;
    font-family: sans-serif;
    margin: 0;
  }

  .text-hover {
    color: #fff;
  }
}

.menu-button:hover {
  .text-container {
    transform: translateY(-20px);
  }
}

.menu-button.is-active {
  background-color: #409EFF;
  
  .icon {
    transform: rotate(180deg);
  }
}

@media (max-width: 768px) {
  .search-box {
    display: none;
  }
  
  .logo-text {
    display: none;
  }
}
</style> 