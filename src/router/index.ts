import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginView from '@/views/LoginView.vue'
import CalendarView from '@/views/CalendarView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: CalendarView,
      meta: { requiresAuth: true },
    },
    {
      path: '/',
      redirect: '/calendar',
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/calendar',
    },
  ],
})

// Guard pour protéger les routes
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  authStore.initializeAuth()

  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/calendar')
  } else {
    next()
  }
})

export default router
