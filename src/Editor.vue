<template>
  <div id="editor">
    <div class="columns is-gapless">
      <div class="column is-2 func-div">
        <div class="has-text-centered has-text-white func-button">
          <span class="icon is-small"><i class="fa fa-floppy-o"></i></span>
          <span class="func-button-text">保存</span>
        </div>
        <div class="line"></div>
        <div class="has-text-centered has-text-white func-button">
          <span class="icon is-small"><i class="fa fa-search"></i></span>
          <span class="func-button-text">预览</span>
        </div>
        <div class="line"></div>
        <div style="height: 100px"></div>
        <div class="line"></div>
        <div class="has-text-centered has-text-white func-button"
             :class="{'func-selected' : module == 0}" @click="changeModule(0)">
          <span class="icon is-small"><i class="fa fa-window-restore"></i></span>
          <span class="func-button-text">场景</span>
        </div>
        <div class="line"></div>
        <div class="has-text-centered has-text-white func-button"
             :class="{'func-selected' : module == 1}" @click="changeModule(1)">
          <span class="icon is-small"><i class="fa fa-eye"></i></span>
          <span class="func-button-text">视角</span>
        </div>
        <div class="line"></div>
        <div class="has-text-centered has-text-white func-button"
             :class="{'func-selected' : module == 2}" @click="changeModule(2)">
          <span class="icon is-small"><i class="fa fa-dot-circle-o"></i></span>
          <span class="func-button-text">热点</span>
        </div>
        <div class="line"></div>
      </div>
      <div class="column is-10">
        <div class="scene-module has-text-white" v-show="module == 0">
          <h5 class="title is-5 has-text-white scene-title">场景列表</h5>
          <div class="line"></div>
          <div class="scene-item" v-for="scene in sceneList"
               :class="{'scene-item-selected' : scene.index == currentSceneIndex}">
            <div class="scene-name">{{scene.name}}</div>
            <figure class="image is-128x128">
              <img src="../static/panos/1.tiles/thumb.jpg">
            </figure>
            <div class="a-pencil">
              <a class="button is-primary is-inverted is-outlined"><span class="icon"><i
                class="fa fa-pencil"></i></span></a>
            </div>
            <div class="a-home">
              <a class="button is-primary is-inverted is-outlined"><span class="icon"><i class="fa fa-home"></i></span></a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="camera" v-show="module == 1">
      <div class="camera-top"></div>
      <div class="camera-bottom"></div>
      <div class="camera-left"></div>
      <div class="camera-right"></div>
      <div class="camera-left-top"></div>
      <div class="camera-top-left"></div>
      <div class="camera-top-right"></div>
      <div class="camera-right-top"></div>
      <div class="camera-left-bottom"></div>
      <div class="camera-bottom-left"></div>
      <div class="camera-bottom-right"></div>
      <div class="camera-right-bottom"></div>
      <a class="button is-info camera-button">设为初始视角</a>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'editor',
    components: {},
    data() {
      return {
        //krpano对象
        krpano: document.getElementById("krpanoSWFObject"),
        //当前修改模块：0场景；1视角；2热点
        module: 0,
        //场景列表
        sceneList: [],
        //当前场景序号
        currentSceneIndex: 0
      }
    },
    methods: {
      //入口js文件已将此函数定义到window，krpano加载完成后调用
      onready() {
        //隐藏下方自带控制条
        this.krpano.set("layer[skin_control_bar].visible", false);
        this.krpano.set("layer[skin_splitter_bottom].visible", false);
        this.krpano.set("layer[skin_scroll_window].visible", false);
        //初始化场景
        this.sceneList = this.krpano.get("scene").getArray()
        this.currentSceneIndex = this.krpano.get("scene").getItem(this.krpano.get("xml.scene")).index
      },
      changeModule(module) {
        this.module = module
      }
    }
  }
</script>

<style lang="scss" scoped>

  #editor {
    width: 100%;
  }

  .line {
    width: 100%;
    height: 0;
    border-top: solid black 1px;
    border-bottom: solid 1px #4b4b4b;
  }

  .func-div {
    border-right: solid 1px black;

    .func-button {
      cursor: pointer;
      height: 50px;
      .func-button-text {
        font-size: 5px;
      }
      span {
        width: 100%;
      }
    }

    .func-selected {
      background-color: #427afb;
    }
  }

  .camera {
    .camera-button {
      position: absolute;
      left: 42%;
      top: 30%;
      transform: translate(-61px, 0);
    }

    .camera-top {
      position: absolute;
      width: 32%;
      height: 0;
      border-top: white 1px dotted;
      top: 25%;
      left: 26%;
    }

    .camera-bottom {
      position: absolute;
      width: 32%;
      height: 0;
      border-top: white 1px dotted;
      top: 75%;
      left: 26%;
    }

    .camera-left {
      position: absolute;
      width: 0;
      height: 40%;
      border-left: white 1px dotted;
      top: 30%;
      left: 22%;
    }

    .camera-right {
      position: absolute;
      width: 0;
      height: 40%;
      border-right: white 1px dotted;
      top: 30%;
      right: 38%;
    }

    .camera-left-top {
      position: absolute;
      width: 0;
      height: 5%;
      border: white 2px solid;
      top: 25%;
      left: 22%;
    }

    .camera-top-left {
      position: absolute;
      width: 4%;
      height: 0;
      border: white 2px solid;
      top: 25%;
      left: 22%;
    }

    .camera-top-right {
      position: absolute;
      width: 4%;
      height: 0;
      border: white 2px solid;
      top: 25%;
      right: 38%;
    }

    .camera-right-top {
      position: absolute;
      width: 0;
      height: 5%;
      border: white 2px solid;
      top: 25%;
      right: 38%;
    }

    .camera-left-bottom {
      position: absolute;
      width: 0;
      height: 5%;
      border: white 2px solid;
      bottom: 25%;
      left: 22%;
    }

    .camera-bottom-left {
      position: absolute;
      width: 4%;
      height: 0;
      border: white 2px solid;
      bottom: 25%;
      left: 22%;
    }

    .camera-bottom-right {
      position: absolute;
      width: 4%;
      height: 0;
      border: white 2px solid;
      bottom: 25%;
      right: 38%;
    }

    .camera-right-bottom {
      position: absolute;
      width: 0;
      height: 5%;
      border: white 2px solid;
      bottom: 25%;
      right: 38%;
    }
  }

  .scene-module {
    .scene-title {
      line-height: 50px;
      padding-left: 10px;
      margin: 0;
    }

    .scene-item {
      margin: 10px 0 10px 10px;
      height: 168px;
      width: 168px;
      border: 2px #333333 solid;

      .scene-name {
        line-height: 36px;
        height: 36px;
        width: 168px;
        padding-left: 5px;
      }

      a {
        height: 64px;
        width: 36px;
        background-color: rgb(70, 70, 70) !important;
        border-radius: 0;
        border: 0;
        &:hover {
          background-color: #427afb !important;
          color: white !important;
        }
      }
      .a-pencil {
        position: relative;
        left: 128px;
        bottom: 128px;
        height: 64px;
        width: 36px;
      }

      .a-home {
        position: relative;
        left: 128px;
        bottom: 128px;
        height: 64px;
        width: 36px;
      }
    }

    .scene-item-selected {
      border-color: #fbd14b;
    }
  }

</style>
