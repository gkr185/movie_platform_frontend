import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { Menu, Close, Sunny, Moon } from '@element-plus/icons-vue'
import '@/assets/styles/theme.scss'

const app = createApp(App)

// 注册图标组件
app.component('Menu', Menu)
app.component('Close', Close)
app.component('Sunny', Sunny)
app.component('Moon', Moon)

app.use(store)
app.use(router)
app.use(ElementPlus)

// 初始化主题
document.documentElement.setAttribute('data-theme', store.state.theme)

app.mount('#app')
