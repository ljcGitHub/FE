import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import store from './store'
import {ERR_CEASE} from 'api/http-status'
import {getToken} from 'common/js/storage'

import 'common/css/index.styl'

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  const token = getToken()
  if (token === 'null' || token === null) {
    if (to.path === '/login') {
      next()
      return
    } else {
      next('/login')
    }
    return
  } else {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
  next()
})

axios.interceptors.response.use(function (response) {
  if (response.data.code === ERR_CEASE) {
    router.push('/login')
  }
  return response
}, function (error) {
  return Promise.reject(error)
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
