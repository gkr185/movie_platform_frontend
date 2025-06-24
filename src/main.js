import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/assets/styles/theme.scss'
// 导入Element Plus中文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const app = createApp(App)

// 注册ElementPlus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(store)
app.use(router)
// 使用Element Plus并配置中文语言包
app.use(ElementPlus, {
  locale: zhCn,
})

// 初始化主题
document.documentElement.setAttribute('data-theme', store.state.theme)

// 在应用启动时初始化用户状态
store.dispatch('user/initUserState').then(() => {
  app.mount('#app')
}).catch(error => {
  console.error('初始化用户状态失败:', error)
  // 即使初始化失败也要启动应用
  app.mount('#app')
})
