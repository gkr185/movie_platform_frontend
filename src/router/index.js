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
    // 电影相关路由
    path: '/movie',
    name: 'MovieIndex',
    component: () => import('@/views/movie/Index.vue')
  },
  {
    path: '/movie/:id',
    name: 'MovieDetail',
    component: () => import('@/views/movie/Detail.vue'),
    props: true
  },
  {
    path: '/movie/:id/play',
    name: 'MoviePlay',
    component: () => import('@/views/movie/Play.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    // 用户相关路由
    path: '/user',
    component: () => import('@/views/user/Index.vue'),
    children: [
      {
        path: '',
        redirect: to => {
          const isLoggedIn = store.getters['user/isLoggedIn']
          if (isLoggedIn) {
            return '/user/profile'
          } else {
            return '/'
          }
        }
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/user/Login.vue'),
        meta: { requiresGuest: true }
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/user/Register.vue'),
        meta: { requiresGuest: true }
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('@/views/user/Profile.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'update-profile',
        name: 'UpdateProfile',
        component: () => import('@/views/user/UpdateProfile.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'change-password',
        name: 'ChangePassword',
        component: () => import('@/views/user/ChangePassword.vue'),
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
      },
      {
        path: 'statistics',
        name: 'UserStatistics',
        component: () => import('@/views/user/Statistics.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/newest',
    name: 'Newest',
    component: () => import('@/views/Newest.vue'),
    meta: {
      title: '最新上映',
      requiresAuth: false
    }
  },
  {
    path: '/category',
    name: 'Category',
    component: () => import('@/views/category/Index.vue'),
    meta: {
      title: '电影分类',
      keepAlive: true
    }
  },
  // 添加404路由
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  
  // 初始化用户状态
  if (store.getters['user/token'] && !store.getters['user/userInfo']) {
    try {
      await store.dispatch('user/initUserState')
    } catch (error) {
      console.error('初始化用户状态失败:', error)
      // 如果初始化失败，且目标路由需要认证，则跳转到登录页
      if (requiresAuth) {
        next({
          path: '/user/login',
          query: { redirect: to.fullPath }
        })
        return
      }
    }
  }

  const isLoggedIn = store.getters['user/isLoggedIn']

  if (requiresAuth && !isLoggedIn) {
    next({
      path: '/user/login',
      query: { redirect: to.fullPath }
    })
  } else if (requiresGuest && isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
