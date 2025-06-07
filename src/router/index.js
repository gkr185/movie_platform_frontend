import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import store from '@/store'  // 直接导入 store

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/ranking',
    name: 'Ranking',
    component: () => import('@/views/Ranking.vue')
  },
  {
    path: '/category',
    name: 'Category',
    component: () => import('@/views/Category.vue')
  },
  {
    path: '/newest',
    name: 'Newest',
    component: () => import('@/views/Newest.vue')
  },
  {
    path: '/movie/:id',
    name: 'MovieDetail',
    component: () => import('@/views/MovieDetail.vue')
  },
  {
    path: '/news',
    name: 'News',
    component: () => import('@/views/news/Index.vue')
  },
  {
    path: '/news/detail/:id',
    name: 'NewsDetail',
    component: () => import('@/views/news/Detail.vue')
  },
  {
    // 用户相关路由
    path: '/user',
    component: () => import('@/views/user/Index.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/user/Login.vue')
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/user/Register.vue')
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('@/views/user/Profile.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'history',
        name: 'UserHistory',
        component: () => import('@/views/user/History.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'favorites',
        name: 'UserFavorites',
        component: () => import('@/views/user/Favorites.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'vip',
        name: 'UserVIP',
        component: () => import('@/views/user/VIP.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isLoggedIn = store.getters.isLoggedIn  // 直接使用 store

  if (requiresAuth && !isLoggedIn) {
    next({
      path: '/user/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

export default router
