import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../views/Layout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/',
      component: Layout,
      children: [
        { path: '', component: () => import('../views/Home.vue') },
        { path: 'training', component: () => import('../views/Training.vue') },
        { path: 'match', component: () => import('../views/Match.vue') },
        { path: 'player', component: () => import('../views/Player.vue') },
        { path: 'development', component: () => import('../views/Development.vue') },
        { path: 'timeline', component: () => import('../views/Timeline.vue') },
        { path: 'training/:id', component: () => import('../views/TrainingDetail.vue') },
      ]
    }
  ]
})

// 未登录跳转到登录页
router.beforeEach((to) => {
  const user = localStorage.getItem('user')
  if (!user && to.path !== '/login') {
    return '/login'
  }
})

export default router