<template>
  <base-dialog title="购物车" @close="goBack">
    <div class="cart-wrapper">
      <div class="cart-content">
        <div class="cart-content-scroll">
          <div class="cart-item"
            v-for="(cart, index) in cartList"
            :key="index">
            <div class="cart-image">
              <img :src="cart.image">
            </div>
            <div class="cart-info">
              <p class="cart-text">{{cart.name}}</p>
              <span class="cart-price">¥{{cart.price}}</span>
            </div>
            <el-button
              class="cart-button"
              type="text"
              size="mini"
              @click="_deleteCart(cart, index)">删除</el-button>
          </div>
        </div>
      </div>
      <div class="cart-button-wrapper">
        <div class="cart-button">
          <el-button type="primary" @click="pay()">
            去购物车结算
          </el-button>
        </div>
      </div>
    </div>
  </base-dialog>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { Button, Message } from 'element-ui'
import BaseDialog from 'base/base-dialog/base-dialog'
import { ERR_SUCCESS } from 'api/http-status'
import { getCart, deleteCart } from 'api/cart'

const COMPONENTS_NAME = 'the-cart'

export default {
  name: COMPONENTS_NAME,
  data () {
    return {
      cartList: []
    }
  },
  created () {
    this._getCart()
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    _deleteCart (item, index) {
      const { goodsid } = item // id是商品，搞错了
      deleteCart({ id: goodsid }).then(res => {
        if (res.code === ERR_SUCCESS) {
          this.cartList.splice(index, 1)
          Message({
            message: '删除成功！',
            type: 'success'
          })
        } else {
          Message.error(res.message)
        }
      })
    },
    pay () {
      Message({
        message: '结算成功！',
        type: 'success'
      })
    },
    _getCart () {
      const { id } = this.user
      getCart({ userid: id }).then(res => {
        if (res.code === ERR_SUCCESS) {
          this.cartList = res.data
        } else {
          Message.error(res.message)
        }
      })
    }
  },
  components: {
    [Button.name]: Button,
    [BaseDialog.name]: BaseDialog
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.cart-wrapper
  position relative
  width 420px
  height 480px
  .cart-content
    position absolute
    top 0px
    left  0px
    bottom 70px
    width 100%
    overflow hidden
    .cart-content-scroll
      width 100%
      height 100%
      overflow-y auto
      background-color $color-mark
  .cart-button-wrapper
    position absolute
    left  0px
    bottom 0px
    width 100%
    height 70px
    line-height 70px
    text-align right
    background-color $color-mark
  .cart-button
    margin-right 20px
    inline-block-top()

.cart-item
  position relative
  margin-bottom 10px
  padding 10px 20px
  background-color $color-background
  cursor pointer
  &:hover
    background-color rgba(255,255,255,.4)
    .cart-button
      display block
  .cart-image
    float left
    width 100px
    height 100px
    img
      width 100px
      height 100px
  .cart-info
    margin-left 100px
    padding-left 20px
    height 100px
    line-height 35px
    .cart-text
      color #333
   .cart-price
      color red
  .cart-button
    display none
    position absolute
    right 10px
    bottom 10px
</style>
