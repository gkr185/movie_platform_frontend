<template>
    <div class="menu-header">
      <!-- 顶部信息栏 -->
      <div class="top-bar">
        <div class="border"></div>
        <div class="content">
          <ul class="menu-title"><li>Menu</li></ul>
          <ul class="website"><li>movie.com</li></ul>
        </div>
      </div>
      
      <!-- 菜单按钮 -->
      <div class="menu-nav">
        <div 
          class="menu-button" 
          :class="{ 'is-active': isOpen }"
          @click="toggleMenu"
        >
          <div class="icon-container">
            <div class="icon-wrapper">
              <!-- 使用 Element Plus 图标 -->
              <el-icon class="icon icon-close"><Close /></el-icon>
            </div>
            
            <!-- 文字切换效果 -->
            <div class="menu-text">
              <div class="text-container">
                <h3>CLOSE</h3>
                <h3 class="text-hover">CLOSE</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
  
<script>
export default {
  name: 'MenuButton',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    toggleMenu() {
      this.$emit('toggle-menu')
    }
  }
}
</script>
  
<style lang="scss" scoped>
.menu-header {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-top: 15px;
  padding-bottom: 2rem;
  margin-bottom: 4rem;
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
  animation-delay: 0.2s;
}
  
.top-bar {
  display: flex;
  flex-direction: column;
  flex: 1 0 0px;
  padding: 0 0 0 1rem;

  .border {
    width: 100%;
    height: 8px;
    margin-top: 5px;
    border-bottom-width: 0px;
    border-color: rgba(255, 255, 255, 0.08);
    border-left-width: 1px;
    border-right-width: 1px;
    border-style: solid;
    border-top-width: 1px;
    opacity: 1;
  }

  .content{
    display: flex;
    justify-content: space-between;
    margin-top: 2px;
    margin-left: 14px;

    .menu-title,
    .website {
      font-size: 13px;
      letter-spacing: 0.02em;
      line-height: 16px;
      color: rgb(133, 133, 133);
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
  gap: 1rem;
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
  font-size: 20px;
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
  }

  .text-hover {
    color: #fff;
  }
}
  
// 激活状态
.menu-button:hover {
  .text-container {
    transform: translateY(-20px);
  }
    
  .icon-close {
    transform: translateY(0);
  }
    
  .icon-menu {
    transform: translateY(100%);
  }
}
  
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style> 