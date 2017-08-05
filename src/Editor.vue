<template>
  <div id="editor">
    <div class="columns is-gapless">
      <div class="column is-2 func-div">
        <div class="has-text-centered has-text-white func-button" @click="save()">
          <span class="icon is-small"><i class="fa fa-floppy-o"></i></span>
          <span class="func-button-text">保存</span>
          <div v-show="toSaveFlag" class="to-save"></div>
        </div>
        <div class="line"></div>
        <div class="has-text-centered has-text-white func-button" @click="preview()">
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
            <div class="scene-name" @click="changeScene(scene)">{{scene.name}}</div>
            <figure class="image is-128x128" @click="changeScene(scene)">
              <img src="../static/panos/1.tiles/thumb.jpg">
            </figure>
            <div class="pencil" @click="showModifySceneName(scene)">
              <a class="button is-primary is-inverted is-outlined"><span class="icon"><i
                class="fa fa-pencil"></i></span></a>
            </div>
            <div class="home" @click="setWelcome(scene.index)">
              <a class="button is-primary is-inverted is-outlined"
                 :class="{'home-selected': scene.index == welcomeSceneIndex}">
                <span class="icon"><i class="fa fa-home"></i></span>
              </a>
            </div>
          </div>
        </div>
        <div v-show="module == 1" class="view-module has-text-white">
          <div class="view-content">
            <label class="label has-text-white">
              自动旋转
              <label class="switch is-info view-switch" :class="{'switch-checked':autoSpinFlag}">
                <input type="checkbox" v-model="autoSpinFlag" @change="updatedAutoSpin()">
              </label>
            </label>
            <label class="label has-text-white">
              等待时间（秒）
              <input class="input is-small" :disabled="!autoSpinFlag" v-model="autoSpinWaitingTime"
                     @change="updatedAutoSpin()">
            </label>
          </div>
          <div class="line"></div>
          <div class="view-content">
            <label class="label has-text-white">
              初始Fov
              <input class="input is-small">
            </label>
            <label class="label has-text-white">
              最小Fov
              <input class="input is-small">
            </label>
            <label class="label has-text-white">
              最大Fov
              <input class="input is-small">
            </label>
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
    <my-dialog :show="showModifySceneNameFlag" title="场景修改" v-on:close="closeModifySceneName">
      <div class="modify-scene-name">
        <div class="field">
          <label class="label">场景名称</label>
          <p class="control">
            <input class="input" v-model="toModifyScene.name">
          </p>
        </div>
        <span>场景名称</span>
        <a class="button" :disabled="!sceneNameValid" @click="modifySceneName()">确定</a>
      </div>
    </my-dialog>
  </div>
</template>

<script>

  import MyDialog from './components/MyDialog'
  import Slider from './components/Slider'

  export default {
    name: 'editor',
    components: {MyDialog, Slider},
    data() {
      return {
        //krpano对象
        krpano: document.getElementById("krpanoSWFObject"),
        //当前修改模块：0场景；1视角；2热点
        module: 1,
        //待保存标识
        toSaveFlag: false,
        //场景列表
        sceneList: [],
        //当前场景序号
        currentSceneIndex: 0,
        //欢迎页场景序号
        welcomeSceneIndex: 0,
        //展示修改场景名称标识
        showModifySceneNameFlag: false,
        //待修改场景对象
        toModifyScene: {},
        //自动旋转开启标识
        autoSpinFlag: false,
        //自动旋转等待时间
        autoSpinWaitingTime: 0
      }
    },
    computed: {
      sceneNameValid() {
        return this.toModifyScene.name && this.toModifyScene.name.length > 0 && this.toModifyScene.name.length < 10
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
        this.welcomeSceneIndex = this.krpano.get("scene").getItem(this.krpano.get('startscene')).index
        //初始化视角参数
        this.autoSpinWaitingTime = this.krpano.get("autorotate.waittime")
        this.autoSpinFlag = this.krpano.get("autorotate.enabled")
      },
      //切换操作模块
      changeModule(module) {
        this.module = module
      },
      //切换当前场景
      changeScene(scene) {
        if (this.currentSceneIndex == scene.index) return
        this.currentSceneIndex = scene.index
        this.krpano.call("loadscene(" + scene.name + ")");
        let autorotate = this.sceneList[this.currentSceneIndex].autorotate
        if (autorotate) {
          this.autoSpinFlag = autorotate.enabled
          this.autoSpinWaitingTime = autorotate.waitTime
          this.krpano.set("autorotate.enabled", autorotate.enabled)
          this.krpano.set("autorotate.waittime", autorotate.waitTime)
        } else {
          this.autoSpinFlag = this.krpano.get("autorotate.enabled")
          this.autoSpinWaitingTime = this.krpano.get("autorotate.waittime")
        }
        if (this.autoSpinFlag) this.krpano.get("autorotate").interrupt()
      },
      //设置为home页
      setWelcome(index) {
        this.welcomeSceneIndex = index
        this.toSaveFlag = true
      },
      //保存
      save() {
        let data = []
        this.sceneList.forEach((scene) => {
          data.push({
            index: scene.index,
            name: scene.name,
            welcomeFlag: scene.index == this.welcomeSceneIndex,
            autorotate: scene.autorotate
          })
        })
        console.log(data)
        this.toSaveFlag = false
      },
      //预览
      preview() {
        window.open('../static/tour.html')
      },
      //显示修改场景弹窗
      showModifySceneName(scene) {
        this.toModifyScene = {
          name: scene.name,
          index: scene.index
        }
        this.showModifySceneNameFlag = true
      },
      //修改场景名称
      modifySceneName() {
        if (!this.sceneNameValid) return
        //判断是否重复
        let repeatFlag = false
        for (let scene of this.sceneList) {
          if (scene.name == this.toModifyScene.name) {
            repeatFlag = true
            break
          }
        }
        if (repeatFlag) {
          alert('123')
          return
        }
        //修改场景名称（相关联的热点，当前场景scene名称也需修改）
        let oldName = this.sceneList[this.toModifyScene.index].name.toString()
        let newName = this.toModifyScene.name.toString()
        //修改krpano场景对象名称
        this.krpano.get("scene").renameItem(oldName, newName)
        this.sceneList[this.toModifyScene.index].name = newName
        //修改krpano热点指向场景名称
        //todo
        this.showModifySceneNameFlag = false
        this.toSaveFlag = true
      },
      //关闭修改场景弹窗
      closeModifySceneName() {
        this.showModifySceneNameFlag = false
      },
      //设为初始视角
      setDefaultView() {

      },
      //自动旋转变更
      updatedAutoSpin() {
        this.krpano.set("autorotate.enabled", this.autoSpinFlag)
        this.krpano.set("autorotate.waittime", this.autoSpinWaitingTime)
        if (this.autoSpinFlag) this.krpano.get("autorotate").interrupt()
        this.sceneList[this.currentSceneIndex].autorotate = {
          enabled: this.autoSpinFlag,
          waitTime: Number(this.autoSpinWaitingTime)
        }
        this.toSaveFlag = true
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~bulma/sass/utilities/variables';

  #editor {
    width: 100%;
  }

  .to-save {
    position: relative;
    top: -45px;
    left: 28px;
    width: 6px;
    height: 6px;
    background-color: red;
    border-radius: 3px;
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
      cursor: pointer;

      .scene-name {
        line-height: 36px;
        height: 36px;
        width: 164px;
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

      .pencil {
        position: relative;
        left: 128px;
        bottom: 128px;
        height: 64px;
        width: 36px;
      }

      .home {
        position: relative;
        left: 128px;
        bottom: 128px;
        height: 64px;
        width: 36px;

        .home-selected {
          background-color: #427afb !important;
        }
      }

      &:hover {
        border-color: #fbd14b;
      }
    }

    .scene-item-selected {
      border-color: #fbd14b;
    }
  }

  .modify-scene-name {
    padding: 30px;
    width: 20rem;

    a {
      margin-top: 20px;
      width: 100%;
    }
  }

  .view-module {

    input {
      height: 22px;
      width: 50px;
      float: right;
    }

    .view-content {
      padding: 18px 10px 10px 10px;
      height: auto;

      .view-switch {
        float: right;
      }

      label {
        font-weight: 100;
        font-size: 15px;
        margin-bottom: 15px;
        &:hover {
          color: white;
        }
      }
    }
  }

  .switch {
    --height: 22px;

    input {
      opacity: 0;
      display: inline-block;
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 1;
      cursor: pointer;
    }

    position: relative;
    border-radius: calc(0.8 * var(--height));
    width: calc(1.625 * var(--height));
    height: var(--height);
    background-color: $border;
    border: 1px solid $border;
    cursor: pointer;

    &:before,
    &:after {
      content: " ";
      position: absolute;
      top: 0;
      left: 0;
      height: calc(var(--height) - 2px);
      border-radius: calc((var(--height) - 2px) / 2);
      transition: .233s;
    }

    &:before {
      width: calc(1.625 * var(--height) - 2px);
      background-color: $grey-lighter;
    }

    &:after {
      width: calc(var(--height) - 2px);
      background-color: #FFF;
      box-shadow: 0 2px 3px rgba(17, 17, 17, 0.1);
    }
  }

  .switch-checked {
    border-color: $info;
    background-color: $info;
    &:before {
      transform: scale(0);
    }
    &:after {
      transform: translateX(calc(0.625 * var(--height)));
    }
  }

</style>
