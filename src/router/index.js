import { createRouter, createWebHistory } from 'vue-router'
import { LoginCallback, navigationGuard } from '@okta/okta-vue'
import HomeComponent from '@/components/Home'
import LoginComponent from '@/components/Login'
import ProfileComponent from '@/components/Profile'
import Balance from '@/components/Balance'
import Order from '@/components/Order'
import StocksAtt from '@/components/StocksAtt'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: HomeComponent,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/order',
      component: Order,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/stocks',
      component: StocksAtt,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/balance',
      component: Balance,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      component: LoginComponent,
    },
    {
      path: '/login/callback',
      component: LoginCallback
    },
    {
      path: '/profile',
      component: ProfileComponent,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach(navigationGuard)

export default router
