import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';

const { isAuthenticated } = useAuth();

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ],
});

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return { name: 'login' };
  }

  if (to.name === 'login' && isAuthenticated.value) {
    return { name: 'home' };
  }

  return true;
});

export default router;
