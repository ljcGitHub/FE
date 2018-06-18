## token管理路由权限(三)
token校验是
1. 不存在token
2. 请求服务器，根据返回的状态码判断token失效或者过

符合以上2点，自动跳入登录页

vue-router有个[全局守卫](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html), 可以根据这个特点进行页面跳转判断
```
router.beforeEach((to, from, next) => {
  // ...
})
```
接口请求，推荐使用 [axios](https://www.kancloud.cn/yunye/axios/234845), 有拦截器的api，提供使用
```
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
    }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
    }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});
```
安装 axios， vue-router
```
npm install -S axios vue-router
```
新建 common/js/storage.js  ，关于token和vuex的数据存储到 sessionStorage
```
const DATA_STORAGE = 'beijiD'
const TOKEN_STORAGE = 'beijiT'

export const getStorage = function () {
  return window.sessionStorage.getItem(DATA_STORAGE)
}

export const setStorage = function (d) {
  window.sessionStorage.setItem(DATA_STORAGE, JSON.stringify(d))
}

export const clearStorage = function (d) {
  return window.sessionStorage.removeItem(DATA_STORAGE)
}

export const getToken = function () {
  return JSON.parse(window.sessionStorage.getItem(TOKEN_STORAGE))
}

export const setToken = function (d) {
  return window.sessionStorage.setItem(TOKEN_STORAGE, JSON.stringify(d))
}

export const clearToken = function (d) {
  return window.sessionStorage.removeItem(TOKEN_STORAGE)
}
```
关于请求返回的状态码，前后端要统一

新建 api/http-status.js
```
export const ERR_SUCCESS = 2000000 // 成功

export const ERR_FAILURE = 3000000 // 失败，参数无效

export const ERR_CEASE = 3000001 // 失败，token失效

export const ERR_ERROR = 5000000 // 错误
```
有以上的准备，开始修改 APP.vue 或者你可以创建js文件，管理这些。

```
import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router/index'
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
  render: h => h(App)
}).$mount('#app')

```
准备就绪，进入 client目录，启动客户端
```
cd client
npm run serve
```
输入 http://localhost:8080/ ， 会自动进入登录页，说明配置成功！