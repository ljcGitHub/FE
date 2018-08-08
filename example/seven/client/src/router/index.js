import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import('page/login/login') // 登录页面
const Home = () => import('page/home/home') // 首页页面
const TheCart = () => import('components/the-cart/the-cart') // 购物车

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [{
        path: 'cart',
        component: TheCart
      }]
    }
  ]
})
