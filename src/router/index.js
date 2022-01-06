import { createRouter, createWebHistory } from 'vue-router'
import ThreadCreate from '@/pages/ThreadCreate'
import ThreadEdit from '@/pages/ThreadEdit'
import NotFound from '@/pages/NotFound'
// import sourceData from '@/data.json'
import store from '@/store'
import Register from '@/pages/Register'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "Home" */ '@/pages/Home')
  },
  {
    path: '/me',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "Profile" */ '@/pages/Profile'),
    meta: { toTop: true, smoothScroll: true, requiresAuth: true }
  },
  {
    path: '/me/edit',
    name: 'ProfileEdit',
    component: () => import(/* webpackChunkName: "Profile" */ '@/pages/Profile'),
    meta: { requiresAuth: true },
    props: { edit: true }
  },
  {
    path: '/forum/:id',
    name: 'Forum',
    component: () => import(/* webpackChunkName: "Forum" */ '@/pages/Forum'),
    props: true
  },
  {
    path: '/categories/:id',
    name: 'Category',
    component: () => import('@/pages/Category'),
    props: true
  },
  {
    path: '/thread/:id',
    name: 'ThreadShow',
    component: () => import('@/pages/ThreadShow'),
    props: true,
    async beforeEnter (to, from, next) {
      await store.dispatch('threads/fetchThread', { id: to.params.id, once: true })
      const threadExists = store.state.threads.items.find(t => t.id === to.params.id)
      if (threadExists) {
        return next()
      } else {
        next({
          name: 'NotFound',
          params: { pathMatch: to.path.slice(1).split('/') },
          query: to.query,
          hash: to.hash
        })
      }
    }
  },
  {
    path: '/forum/:forumId/thread/create',
    name: 'ThreadCreate',
    component: ThreadCreate,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/thread/:threadId/edit',
    name: 'ThreadEdit',
    component: ThreadEdit,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: () => import('@/pages/SignIn'),
    meta: { requiresGuest: true }
  },
  {
    path: '/logout',
    name: 'SignOut',
    async beforeEnter (to, from) {
      await store.dispatch('auth/signOut')
      return { name: 'Home' }
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior (to) {
    const scroll = {}
    if (to.meta.toTop) {
      scroll.top = 0
    }
    if (to.meta.smoothScroll) {
      scroll.behavior = 'smooth'
    }
    return scroll
  }
})
router.afterEach((to, from) => {
  store.dispatch('clearItems', { modules: ['categories', 'forums', 'posts', 'threads'] })
})
router.beforeEach(async (to, from) => {
  await store.dispatch('auth/initAuthentication')
  store.dispatch('unsubscribeAllSnapshots')
  if (to.meta.requiresAuth) {
    if (!store.state.auth.authId) {
      return { name: 'SignIn', query: { redirectTo: to.path } }
    }
  }
  if (to.meta.requiresGuest && store.state.auth.authId) {
    return { name: 'Home' }
  }
})
export default router
