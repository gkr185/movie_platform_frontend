import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

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
        path: '',
        name: 'UserCenter',
        component: () => import('@/views/user/Profile.vue')
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('@/views/user/Profile.vue')
      },
      {
        path: 'vip',
        name: 'UserVIP',
        component: () => import('@/views/user/VIP.vue')
      },
      {
        path: 'favorites',
        name: 'UserFavorites',
        component: () => import('@/views/user/Favorites.vue')
      },
      {
        path: 'history',
        name: 'UserHistory',
        component: () => import('@/views/user/History.vue')
      },
      {
        path: 'statistics',
        name: 'UserStatistics',
        component: () => import('@/views/statistics/Index.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/user/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/user/Register.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 需要登录的路由
  const requiresAuth = to.path.startsWith('/user')
  // 临时设置为true，实际项目中应该从vuex获取
  const isLoggedIn = true

  if (requiresAuth && !isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router
