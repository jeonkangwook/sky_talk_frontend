import { createRouter, createWebHistory } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import FriendListView from '../views/FriendListView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'friend',
      component: FriendListView,
      meta: { requiresAuth: true }
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../views/ChatListView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/settings/index.vue'),
      meta: { requiresAuth: true },
      redirect: ({ name: 'settings-list' }),
      children: [
        {
          path: 'list',
          name: 'settings-list',
          component: () => import('../views/settings/List.vue')
        }
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/join',
      name: 'join',
      component: () => import('../views/JoinView.vue'),
    },
    {
      path: '/find-account',
      name: 'find-account',
      component: () => import('../views/find-account/index.vue'),
      redirect: { name: 'find-account-id' },
      children: [
        {
          path: 'id',
          name: 'find-account-id',
          component: () => import('../views/find-account/Id.vue')
        },
        {
          path: 'password',
          name: 'find-account-pw',
          component: () => import('../views/find-account/Password.vue')
        },
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/404.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/profileCreate',
      name: 'profileCreate',
      component: () => import('../views/ProfileCreateView.vue'),
    },
    {
      path: '/chatRoom',
      name: 'chatRoom',
      component: () => import('../views/chatRoomView.vue'),
    },
    {
      path: '/chatChat',
      name: 'chatChat',
      component: () => import('../views/ChatChat.vue'),
    },
    {
      path: '/friendSetting',
      name: 'friendSetting',
      component: () => import('../views/FriendSetting.vue'),
    },
  ]
})


router.beforeEach(async (to, from) => {
  const { isLoggedIn } = useSessionStore()

  if (to.meta.requiresAuth && !isLoggedIn) {
    return { name: 'login' };
  }
})

export default router
