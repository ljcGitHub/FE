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
