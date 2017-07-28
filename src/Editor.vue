<template>
  <div id="editor">

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
      onready(){
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
    position: absolute;
    left: 0;
    top: 0;
  }

</style>
