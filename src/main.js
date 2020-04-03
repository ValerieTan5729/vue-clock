import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import { initMenu } from './utils/menu'
import { postRequest, putRequest, getRequest, deleteRequest } from './utils/api'
import 'font-awesome/css/font-awesome.min.css'

Vue.prototype.postRequest = postRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.getRequest = getRequest
Vue.prototype.deleteRequest = deleteRequest

Vue.config.productionTip = false

Vue.use(ElementUI, { size: 'small' })

router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    next()
  } else {
    if (window.sessionStorage.getItem('user')) {
      initMenu(router, store)
      next()
    } else {
      next('/?redirect=' + to.path)
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
