<template>
  <div>
    <transition name="fade">
      <div class="dialog" v-show="show">
        <div class="dialog-head">
          <h3>{{title}}</h3>
          <span class="dialog-close" @click="close"><a class="delete is-medium"></a></span>
        </div>
        <slot></slot>
      </div>
    </transition>
    <div class="alpha" v-show="show"></div>
  </div>
</template>
<script>
  export default {
    name: 'mydialog',
    props: {
      show: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ''
      }
    },
    methods: {
      close(){
        this.$emit('close')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .dialog {
    background-color: #fff;
    position: fixed;
    z-index: 999;
    left: 50%;
    top: 20%;
    transform: translate3d(-50%, 0, 0);
    transition: all .4s ease;
    height: auto;
  }

  .dialog-head {
    position: relative;
    height: 50px;
    background-color: #374D61;
    h3 {
      line-height: 50px;
      padding-left: 15px;
      color: #fff;
      font-size: 16px;
    }
  }

  .dialog-close {
    position: absolute;
    right: 10px;
    top: 12px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-active {
    opacity: 0
  }

  .alpha {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .5);
    z-index: 998;
  }
</style>
