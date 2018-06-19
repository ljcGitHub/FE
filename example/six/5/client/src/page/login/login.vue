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
