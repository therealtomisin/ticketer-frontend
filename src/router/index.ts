import { createRouter, createWebHistory } from 'vue-router'
// import Login from '@/views/LoginView.vue'
import Auth from '@/views/AuthView.vue'
import TicketListView from '@/views/TicketListView.vue'
import Dashboard from '@/views/DashboardView.vue'
import { useAuthStore } from '@/stores/auth'
import TicketDetail from '@/views/TicketDetail.vue'
import VerifyTokenView from '@/views/VerifyTokenView.vue'

const routes = [
  { path: '/', redirect: '/tickets' },
  { path: '/:mode(login|signup)', component: Auth },
  // { path: '/signup', component: Auth },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/tickets',
    component: TicketListView,
    meta: { requresAuth: true },
  },
  {
    path: '/tickets/:id',
    component: TicketDetail,
    meta: { requresAuth: true },
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
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.token) {
    next('/login')
  } else {
    next()
  }
})

export default router
