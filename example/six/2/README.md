## Vue环境搭建(二)

从jquery到现在的三大框架，个人还是比较推荐react和vue学习，这2者类似，都比较容易上手，但我比较喜欢Vue，简单易学，新老员工易过渡，文档友好。

#### Vue 环境搭建
在根目录下，以 client 文件夹存放前端项目代码（如果不是构建服务器渲染，建议分开）, 本文使用是 vue-cli 3.0构建Vue项目

安装最新版的 vue-cli
```
npm install -g @vue/cli
```
然后进入项目的目录，安装项目
```
vue create client
```
安装过程中，会有几个选择, 详情可以看[这文章](https://segmentfault.com/a/1190000014094732)
1. Please pick a preset: ==Manually select features== (自定义)


2. Check the features needed for your project: ==Babel,Router,Vuex,Css Pre-processors,Linter== (空格选择对应依赖的包)


3. Pick a CSS pre-processor(PostCSS, Autoprefixer and CSS Modules are supported by default) ： ==Stylus== (css预处理器可以选择自己喜欢的)


4. Pick a linter / formatter config: ==Standard==（eslint的规则我选择这个，是因为上一个版本也是选择这个语法规则）


5. Pick additional lint features: ==Lint on save==(选择保存校验)


6.Whrer do you prfer placing config for Babel, PostCSS, ESLint, etc.? :  ==In dedicated config files==(选择独立文件配置)


7. 最后就是选择 是否记录一下？： ==n==

进入目录，启动项目
```
npm run serve
```
看了一下目录，改变挺大，[vue-cli](https://cli.vuejs.org/config/#global-cli-config)详细配置

新建 vue.config.js
```
'use strict'
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, './', dir)
}

module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'development') {
      config.devtool = 'source-map'
    }
    config.resolve = {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': resolve('src'),
        'api': resolve('src/api'),
        'base': resolve('src/base'),
        'common': resolve('src/common'),
        'components': resolve('src/components'),
        'page': resolve('src/page')
      }
    }
  }
}

```
configureWebpack是自己配置webpack，以上选择source map 格式来增强调试过程。新建解析的import/require的别名，绝对地址引入模块。

#### client下，客户端项目的目录
```
├─ public
│  ├─ index.html
├─ src
│  ├─ api           接口
│  ├─ base          基础组件
│  ├─ common        全局
│  ├─ components    业务组件
│  ├─ page          页面组件
│  ├─ router        路由
│  ├─ store         数据
│  ├─ APP.vue
│  ├─ main.js
├─ .eslintrc.js
├─ .postcssrc.js
├─ babel.config.js
├─ package-lock.json
├─ package.json
├─ vue.config.js
```
#### 项目初始化
初始化项目UI， 新增 common/css 文件夹
新增 common/css/base.styl
```
body, html
  line-height 1
  font-family Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif
  -webkit-tap-highlight-color transparent
  height 100%
  background-color $color-mark
```
新增 common/css/reset.styl
```
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header,
menu, nav, output, ruby, section, summary,
time, mark, audio, video, input
  margin: 0
  padding: 0
  border: 0
  font-size: 100%
  font-weight: normal
  vertical-align: baseline

/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, menu, nav, section
  display: block

body
  line-height: 1
blockquote, q
  quotes: none
blockquote:before, blockquote:after,
q:before, q:after
  content: none
table
  border-collapse: collapse
  border-spacing: 0
a
  color: #7e8c8d
  -webkit-backface-visibility: hidden
  text-decoration: none
li
  list-style: none
body
  -webkit-text-size-adjust: none
  -webkit-tap-highlight-color: transparent
  -webkit-touch-callout: none   
  -webkit-font-smoothing: antialiased
  text-size-adjust: none
  text-rendering: optimizeLegibility
  -webkit-backface-visibility: hidden
  -webkit-user-drag: none
```
新增 common/css/variable.styl
```
// 颜色定义规范
$color-text = #333
$color-background = #fff
$color-mark = #f0f0f0
$color-theme = #4897f9

// 字体定义规范
$font-size-sm = 12px
$font-size-md = 14px
$font-size-lg = 16px
$font-size-sg = 18px
$font-size-mg = 20px

// 层级定义规范
$zIndex-brothers = 10
$zIndex-mark = 100
$zIndex-dialog = 2000
$zIndex-toast = 3000
```
新增 common/css/index.styl
```
@import "./reset.styl"
@import "./base.styl"
```

修改 main.js  引入重置浏览器的css样式
```
import Vue from 'vue'
import App from './App.vue'
import 'common/css/index.styl'

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')

```

#### 登录页面
新建 page/login/login.vue  

login文件夹和login组件（建议看[风格指南](https://cn.vuejs.org/v2/style-guide/), 书写组件的规范，当然你也可以自定义）
```
<template>
  <div>
    我是login组件
  </div>
</template>

<script type="text/ecmascript-6">
const COMPONENTS_NAME = 'login-page'

export default {
  name: COMPONENTS_NAME
}
</script>

```
新增 router/index.js , 引入 login组件
```
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import('page/login/login') // 登录页面

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
```
修改 App.vue
```
<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script type="text/ecmascript-6">
const COMPONENTS_NAME = 'app'

export default {
  name: COMPONENTS_NAME
}
</script>
```
输入 [http://localhost:8080/login](http://localhost:8080/login) 能看到页面显示

> 我是login组件

#### 引入 element-ui 库
好的前端不可能为了一个组件引入一个库，所以采用按需加载，具体可以看[element](http://element.eleme.io/#/zh-CN/component/quickstart)文档
```
npm install element-ui -S
npm install babel-plugin-component -D
```
修改 babel.config.js
```
module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    [
      'component',
      {
        'libraryName': 'element-ui',
        'styleLibraryName': 'theme-chalk'
      }
    ]
  ]
}
```

修改 page/login/login.vue (记得重启一下客户端)
```
<template>
  <div class="login-page">
    <div class="login-input">
      <el-input
          class="login-input-item"
          placeholder="请输入账号"
          v-model="account"
          clearable>
      </el-input>
      <el-input
          class="login-input-item"
          placeholder="请输入密码"
          type="password"
          v-model="password"
          clearable>
      </el-input>
      <el-button
        class="login-input-item"
        type="primary"
        :loading="loading">
        登录
      </el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Button, Input } from 'element-ui'

const COMPONENTS_NAME = 'login-page'

export default {
  name: COMPONENTS_NAME,
  data () {
    return {
      loading: false,
      account: '',
      password: ''
    }
  },
  components: {
    [Button.name]: Button,
    [Input.name]: Input
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.login-page
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  background-color $color-mark
  z-index $zIndex-brothers
  .login-input
    position absolute
    top 50%
    left 50%
    margin -100px 0 0 -170px
    padding 10px 20px
    width 340px
    height 200px
    border-radius 5px
    background-color $color-background
  .login-input-item
    margin-top 15px
    width 100%
</style>

```

关于Vue环境搭建已完成

