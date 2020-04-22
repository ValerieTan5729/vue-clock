import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './views/Index.vue'
import Login from './views/Login'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
    hidden: true
  },
  {
    path: '/index',
    name: 'home',
    component: Home,
    hidden: true
  }
]

const router = new VueRouter({
  routes
})

router.selfAddRoutes = function (params) {
  // 先初始化路由再动态添加路由, 避免出现Duplicate named routes definition警告
  // 原因:addRoutes方法仅仅是帮你注入新的路由, 并没有帮你剔除原有的其它路由(可能会出现路由重名的情况)
  router.matcher = new VueRouter({ routes }).matcher
  router.addRoutes(params)
}

export default router
