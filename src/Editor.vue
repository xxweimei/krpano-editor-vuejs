<template>
  <div id="editor">
    <div class="columns is-gapless">
      <div class="column is-2 func-div">
        <div class="has-text-centered has-text-white func-button">
          <span class="icon is-small"><i class="fa fa-floppy-o"></i></span>
          <span class="func-button-text">保存</span>
        </div>
        <div class="func-button"></div>
        <div class="has-text-centered has-text-white func-button func-selected">
          <span class="icon is-small"><i class="fa fa-eye"></i></span>
          <span class="func-button-text">视角</span>
        </div>
        <div class="has-text-centered has-text-white func-button">
          <span class="icon is-small"><i class="fa fa-dot-circle-o"></i></span>
          <span class="func-button-text">热点</span>
        </div>
      </div>
      <div class="column is-10"></div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'editor',
    components: {},
    data() {
      return {
        krpano: document.getElementById("krpanoSWFObject")
      }
    },
    methods: {
      onready() {
        //隐藏下方自带控制条
        this.krpano.set("layer[skin_control_bar].visible", false);
        this.krpano.set("layer[skin_splitter_bottom].visible", false);
        this.krpano.set("layer[skin_scroll_window].visible", false);
      }
    }
  }
</script>

<style lang="scss" scoped>

  #editor {
    width: 100%;
  }

  .func-button {
    cursor: pointer;
    height: 50px;
    border-bottom: solid 1px black;
    border-top: solid 1px #4b4b4b;
    .func-button-text {
      font-size: 5px;
    }
    span {
      width: 100%;
    }
  }

  .func-div {
    border-right: solid 1px black;
  }

  .func-selected {
    background-color: #427afb;
  }
</style>
