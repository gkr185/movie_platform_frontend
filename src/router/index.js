import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/category',
    name: 'category',
    component: () => import('../views/category/Index.vue')
  },
  {
    path: '/movie/:id',
    name: 'movie-detail',
    component: () => import('../views/movie/Detail.vue')
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('../views/user/Index.vue'),
    children: [
      {
        path: 'profile',
        name: 'user-profile',
        component: () => import('../views/user/Profile.vue')
      },
      {
        path: 'history',
        name: 'watch-history',
        component: () => import('../views/user/History.vue')
      },
      {
        path: 'favorites',
        name: 'favorites',
        component: () => import('../views/user/Favorites.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/user/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/user/Register.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
