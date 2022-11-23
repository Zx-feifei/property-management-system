import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Login/RegisterPage.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login/IndexPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
