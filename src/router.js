import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './views/Index.vue'
import Login from './views/Login'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/index',
    name: 'home',
    component: Home
  }
  /*
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('./views/About.vue')
  }
  */
]

const router = new VueRouter({
  routes
})

export default router
