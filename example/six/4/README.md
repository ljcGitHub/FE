## 服务器/客户端 登录联调(四)

#### 上一章，关于请求返回的状态码，前后端要统一

新建 客户端  client/api/http-status
```
export const ERR_SUCCESS = 2000000 // 成功

export const ERR_FAILURE = 3000000 // 失败，参数无效

export const ERR_CEASE = 3000001 // 失败，token失效

export const ERR_ERROR = 5000000 // 错误
```
由于项目是前后分离，服务端也需要和客户端一样

服务端: 新建 utils/http-status.js 和 客户端一样的js文件

服务端: 修改 utlis/router.js  
修改 Required，Auth 返回一致的错误code
```
import { ERR_FAILURE,ERR_CEASE } from '../utils/http-status'

...

export const Required = paramsObj => convert(async (ctx, next) => {

    ...

    if (erros.length > 0) {
    return (
      ctx.body = {
        code: ERR_FAILURE,
        message: `${erros.join(', ')} is required`,
        data: {}
      }
    )
  }
  await next()
}

export const Auth = convert(async (ctx, next) => {
  const token = ctx.header.authorization
  let code = ERR_SUCCESS, message = ''
  if(token && token.indexOf('Bearer ') > -1){
    const t = await verifyToken(token.split('Bearer ')[1])
    if (!t.verify) {
      code = ERR_CEASE
      message = t.msg
    }
  } else {
    code = ERR_CEASE
    message = 'permission denied'
  }
  if (code === ERR_CEASE) {
    ctx.body = {
      code,
      message,
      data: {}
    }
    return
  }
  await next()
})
```
同理，修改 router/user中 code的值（直接可以拷贝example中user）

启动服务端(记得mysql也要启动)：
> npm run start

启动客户端： 
> cd client

> npm run start

#### 单独封装请求接口的函数

客户端： 新增 api/user.js
```
import axios from 'axios'

// 登录
export function login ({ account, password }) {
  const url = '/api/login'
  return axios.post(url, { account, password }).then((res) => {
    return Promise.resolve(res.data)
  })
}
// 注册
export function logon ({ account, password }) {
  const url = '/api/logon'
  return axios.post(url, { account, password }).then((res) => {
    return Promise.resolve(res.data)
  })
}

```
#### 代理
由于客户端和服务端不同一个服务器，客户端在开发环境中，需要代理（记得重启客户端）

客户端： 修改 vue.config.js , 新增proxy代理
```
module.exports = {
  devServer: {
    proxy: 'http://localhost:3000'
  },
  
  ...
  
}
```

客户端： 修改page/login/login.vue
```
<template>
  <div class="login-page">
    <div class="login-input">
      <el-input
          class="login-input-item"
          placeholder="请输入账号"
          v-model="account"
          ref="userRef"
          clearable>
      </el-input>
      <el-input
          class="login-input-item"
          placeholder="请输入密码"
          type="password"
          v-model="password"
          ref="passwordRef"
          clearable>
      </el-input>
      <el-button
        class="login-input-item"
        type="primary"
        @click="handleClick"
        :loading="loadingLogin">
        登录
      </el-button>
      <div>
        <el-button
          class="login-input-item"
          @click="handleClick('logon')"
          :loading="loadingLogon">
          注册
        </el-button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Button, Input, Message } from 'element-ui'
import { login, logon } from 'api/user'
import { ERR_SUCCESS } from 'api/http-status'

const COMPONENTS_NAME = 'login-page'

export default {
  name: COMPONENTS_NAME,
  data () {
    return {
      loadingLogin: false,
      loadingLogon: false,
      account: '',
      password: ''
    }
  },
  methods: {
    verification () {
      const { account, password } = this
      if (account === '') {
        Message.error('账号不能为空，请输入账号！')
        this.$refs.userRef.focus()
        return true
      }
      if (password === '') {
        Message.error('密码不能为空，请输入密码！')
        this.$refs.passwordRef.focus()
        return true
      }
      return false
    },
    handleClick (type) {
      if (this.loadingLogin) return
      if (this.loadingLogon) return
      if (this.verification()) return
      const { account, password } = this
      if (type === 'logon') {
        this.loadingLogon = true
        logon({ account, password }).then(res => {
          if (res.code === ERR_SUCCESS) {
            this.account = ''
            this.password = ''
            Message({
              message: '注册成功！',
              type: 'success'
            })
          } else {
            Message.error(res.message)
          }
          this.loadingLogon = false
        })
      } else {
        this.loadingLogin = true
        login({ account, password }).then(res => {
          if (res.code === ERR_SUCCESS) {
            console.log(res.data)
            this.$router.replace('home')
          } else {
            Message.error(res.message)
          }
          this.loadingLogin = false
        })
      }
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
    height 260px
    border-radius 5px
    background-color $color-background
  .login-input-item
    margin-top 15px
    width 100%
</style>

```

#### vuex存储用户信息
vuex的目录如下
├─ store
│  ├─ actions.js          
│  ├─ getters.js          
│  ├─ index.js       
│  ├─ mutation-types.js   
│  ├─ mutations.js  
│  ├─ state.js  

##### state.js
```
const state = {
  user: {} // 当前用户
}

export default state

```
##### getters.js
```
export const user = state => state.user

```
##### mutation-types.js
```
export const SET_USER = 'SET_USER'

```

##### mutations.js
```
import * as types from './mutation-types'

const mutations = {
  [types.SET_USER] (state, user) {
    state.user = user
  }
}

export default mutations

```

##### actions.js
```
import * as types from './mutation-types'
import { setToken, clearStorage, clearToken } from 'common/js/storage'

export const setUser = function ({commit}, user) {
  setToken(user.token)
  commit(types.SET_USER, user)
}

export const userOut = function ({commit, state}) {
  clearStorage()
  clearToken()
}

```

引入vuex的store到APP中, 修改 main.js 
```
import store from './store'

...

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

##### 回到登录页，接下来我们要在登录接口，获取token并放入到store中
客户端： 修改 src/page/login/login.vue 中 
修改login接口和引入vuex mapActions
```
<template>
  <div class="login-page">
    <div class="login-input">
      <el-input
          class="login-input-item"
          placeholder="请输入账号"
          v-model="account"
          ref="userRef"
          clearable>
      </el-input>
      <el-input
          class="login-input-item"
          placeholder="请输入密码"
          type="password"
          v-model="password"
          ref="passwordRef"
          clearable>
      </el-input>
      <el-button
        class="login-input-item"
        type="primary"
        @click="handleClick"
        :loading="loadingLogin">
        登录
      </el-button>
      <div>
        <el-button
          class="login-input-item"
          @click="handleClick('logon')"
          :loading="loadingLogon">
          注册
        </el-button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapActions } from 'vuex'
import { Button, Input, Message } from 'element-ui'
import { login, logon } from 'api/user'
import { ERR_SUCCESS } from 'api/http-status'

const COMPONENTS_NAME = 'login-page'

export default {
  name: COMPONENTS_NAME,
  data () {
    return {
      loadingLogin: false,
      loadingLogon: false,
      account: '',
      password: ''
    }
  },
  created () {
    this.userOut()
  },
  methods: {
    verification () {
      const { account, password } = this
      if (account === '') {
        Message.error('账号不能为空，请输入账号！')
        this.$refs.userRef.focus()
        return true
      }
      if (password === '') {
        Message.error('密码不能为空，请输入密码！')
        this.$refs.passwordRef.focus()
        return true
      }
      return false
    },
    handleClick (type) {
      if (this.loadingLogin) return
      if (this.loadingLogon) return
      if (this.verification()) return
      const { account, password } = this
      if (type === 'logon') {
        this.loadingLogon = true
        logon({ account, password }).then(res => {
          if (res.code === ERR_SUCCESS) {
            this.account = ''
            this.password = ''
            Message({
              message: '注册成功！',
              type: 'success'
            })
          } else {
            Message.error(res.message)
          }
          this.loadingLogon = false
        })
      } else {
        this.loadingLogin = true
        login({ account, password }).then(res => {
          if (res.code === ERR_SUCCESS) {
            this.setUser(res.data)
            this.$router.replace('home')
          } else {
            Message.error(res.message)
          }
          this.loadingLogin = false
        })
      }
    },
    ...mapActions(['setUser', 'userOut'])
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
    height 260px
    border-radius 5px
    background-color $color-background
  .login-input-item
    margin-top 15px
    width 100%
</style>

```

打开 http://localhost:8080/login

###### 注册

输入账号为 newCustom

输入密码为 123456 

点击注册, 会返回注册成功，并且账号密码清空

###### 注册

输入账号为 newCustom

输入密码为 123456 

点击登录, 会跳入到 home页面，说明登录成功！

(发现问题或者不懂，麻烦issues给我，及时处理)