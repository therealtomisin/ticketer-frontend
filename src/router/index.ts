import { createRouter, createWebHistory } from 'vue-router'
// import Login from '@/views/LoginView.vue'
import TicketListView from '@/views/TicketListView.vue'
import { useAuthStore } from '@/stores/auth'
import TicketDetail from '@/views/TicketDetail.vue'
import VerifyTokenView from '@/views/VerifyTokenView.vue'
import AuthView from '@/views/AuthView.vue'

const routes = [
  { path: '/', redirect: '/tickets' },

  { path: '/signup', component: AuthView },

  { path: '/login', component: AuthView },
  // { path: '/signup', component: Auth },
  {
    path: '/tickets',
    component: TicketListView,
    meta: { requiresAuth: true },
  },
  {
    path: '/tickets/:id',
    component: TicketDetail,
    meta: { requiresAuth: true },
  },
  {
    path: '/verify',
    component: VerifyTokenView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _, next) => {
  if (to.path !== '/login' && to.path !== '/signup') {
    const auth = useAuthStore()
    if (to.meta.requiresAuth && !auth.token) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
