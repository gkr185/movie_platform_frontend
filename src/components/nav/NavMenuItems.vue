<template>
  <div class="nav-menu">
    <router-link 
      v-for="(item, index) in menuItems" 
      :key="item.path"
      :to="item.path"
      class="menu-item"
      :class="{ 
        'active': $route.path === item.path,
        'menu-item-leave': isClosing
      }"
      :style="{ '--delay': `${index * 0.1}s` }"
      @click="$emit('click')"
    >
      <span class="menu-number">/0{{ index + 1 }}</span>
      <div class="menu-content" :class="{ 'active': $route.path === item.path }">
        <div class="menu-text">
          <div class="text-container">
            <h3>{{ item.text }}</h3>
            <h3 class="text-hover">{{ item.text }}</h3>
          </div>
        </div>
        <div class="menu-dot">
          <div class="dot" :class="{ 'active': $route.path === item.path }"></div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'NavMenuItems',
  props: {
    isClosing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      menuItems: [
        { path: '/', text: '首页' },
        { path: '/category', text: '分类' },
        { path: '/ranking', text: '排行榜' },
        { path: '/newest', text: '最新上映' },
        { path: '/news', text: '资讯' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-menu {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  opacity: 0;
  padding: 0 32px;
  animation: fadeIn 0.5s ease forwards;
  animation-delay: 0.3s;
}

.menu-item {
  opacity: 0;
  text-decoration: none;
  transform: translateY(20px);
  animation: slideIn 0.5s ease forwards;
  animation-delay: calc(0.4s + var(--delay));
  display: flex;
  flex: 0 0 auto;
  flex-flow: row;
  gap: 12px;
  padding: 1.5rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-top: none;
  
  &:first-child {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  
  &:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
}

.menu-number {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-shrink: 0;
  font-size: 12px;
  color: rgb(133, 133, 133);
  letter-spacing: -0.2px;
  line-height: 32px;
}

.menu-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &.active {
    width: auto;
    display: flex;
    align-items: center;
  }
}

.menu-text {
  position: relative;
  height: 32px;
  overflow: hidden;
}

.text-container {
  transform: translateY(0);
  transition: 0.6s cubic-bezier(.16,1,.3,1);
  
  h3 {
    font-size: 32px;
    font-weight: 900;
    letter-spacing: -0.2px;
    line-height: 32px;
    text-transform: uppercase;
    color: #fff;
    text-align: center;
    font-family: sans-serif;
  }

  .text-hover {
    color: #fff;
  }
}

.menu-dot {
  padding: 0 0 0 4px;
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #fff;
    opacity: 0.2;
    transition: all 0.3s;
    
    &.active {
      opacity: 1;
      background-color: rgb(255, 115, 0);
    }
  }
}

.menu-item:hover {
  .text-container {
    transform: translateY(-32px);
  }
  
  .dot {
    opacity: 1;
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

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(20px);
  }
}
</style> 