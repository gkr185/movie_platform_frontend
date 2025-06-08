<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <h2>页面未找到</h2>
      <p>抱歉，您访问的页面不存在</p>
      <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style lang="scss" scoped>
.not-found {
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-color);
  
  .content {
    text-align: center;
    padding: 40px;
    
    h1 {
      font-size: 72px;
      color: var(--text-color);
      margin: 0;
      line-height: 1;
    }
    
    h2 {
      font-size: 24px;
      color: var(--text-color);
      margin: 20px 0;
    }
    
    p {
      color: var(--text-color-light);
      margin-bottom: 30px;
    }
  }
}
</style> 