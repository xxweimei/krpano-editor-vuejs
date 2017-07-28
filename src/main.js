// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Editor from './Editor'
//noinspection ES6UnusedImports
import Bulma from 'bulma'

Vue.config.productionTip = false

/* eslint-disable no-new */
let vm = new Vue({
  el: '#editor',
  template: '<Editor ref="editor"/>',
  components: {Editor}
})

window.onready = function () {
  vm.$refs.editor.onready()
}


