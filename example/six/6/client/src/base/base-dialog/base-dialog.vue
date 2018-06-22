<template>
  <transition @beforeEnter="beforeEnter" @leave="leave">
    <div class="base-dialog-wrapper">
      <div class="base-dialog-mark"></div>
      <div class="base-dialog">
        <div class="base-dialog-conter">
          <slot name="slot">
            <div class="dialog-header">
              <h3>{{title}}</h3>
              <span class="dialog-close" @click="dialogClose">
                X
              </span>
            </div>
          </slot>
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import {addClass, removeClass} from 'common/js/dom'

const COMPONENTS_NAME = 'base-dialog'
const ANIMATION_ACTIVE = 'active'
const ANIMATION_UNACTIVE = 'unactive'

export default {
  name: COMPONENTS_NAME,
  props: {
    title: {
      type: String,
      defalut: ''
    },
    hasTitle: {
      type: Boolean,
      defalut: true
    }
  },
  methods: {
    dialogClose () {
      this.$emit('close')
    },
    beforeEnter (el) {
      const mark = el.querySelector('.base-dialog-mark')
      const conter = el.querySelector('.base-dialog-conter')
      mark && addClass(mark, ANIMATION_ACTIVE)
      conter && addClass(conter, ANIMATION_ACTIVE)
    },
    leave (el, done) {
      const mark = el.querySelector('.base-dialog-mark')
      const conter = el.querySelector('.base-dialog-conter')
      if (mark) {
        removeClass(mark, ANIMATION_ACTIVE)
        addClass(mark, ANIMATION_UNACTIVE)
      }
      if (conter) {
        removeClass(conter, ANIMATION_ACTIVE)
        addClass(conter, ANIMATION_UNACTIVE)
      }
      setTimeout(() => {
        done()
      }, 300)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.base-dialog-wrapper
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  z-index $zIndex-dialog
  .base-dialog-mark
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    z-index $zIndex-mark
    background-color rgba(0, 0, 0, 0.4)
    &.active
      animation amFadeIn .3s linear
      animation-fill-mode both
    &.unactive
      animation amFadeOut .3s linear
      animation-fill-mode both
  .base-dialog
    position fixed
    top 50%
    left 50%
    transform translate(-50%, -50%)
    z-index $zIndex-dialog
    &.active
      animation BombIn .3s linear
      animation-fill-mode both
    &.unactive
      animation BombOut .3s linear
      animation-fill-mode both
  .base-dialog-conter
    min-width 200px
    min-height 150px
    background-color $color-background
    border-top 2px solid $color-theme
    border-radius 3px
    &.active
      animation fadeInDown .3s linear
      animation-fill-mode both
    &.unactive
      animation fadeOutDown .3s linear
      animation-fill-mode both
  .dialog-header
    width 100%
    height 39px
    line-height 39px
    border-bottom 1px solid #f2f2f5
    cursor move
    h3
      margin-right 39px
      padding 0 0 0 16px
      font-size $font-size-md
      font-weight 700
      inline-block-top()
    .dialog-close
      float right
      width 39px
      height 39px
      line-height 39px
      font-size $font-size-md
      color #696e78
      cursor pointer
      text-align center
      background transparent
      transition background-color .3s
      inline-block-top()
      &:hover
        background-color $color-mark
@keyframes amFadeIn
  0%
    opacity 0
  100%
    opacity 1
@keyframes amFadeOut
  0%
    opacity 1
  100%
    opacity 0

@keyframes fadeInDown
  0%
    opacity 0
    transform translateY(-20px)
  100%
    opacity 1
    transform translateY(0)
@keyframes fadeOutDown
  0%
    opacity 1
    transform translateY(0)
  100%
    opacity 0
    transform translateY(20px)
</style>
