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
              <img :src="scene.thumburl">
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
        <div class="view-module has-text-white" v-show="module == 1"
             @mousemove="moveInitFov()" @mouseup="stopMoveInitFov()">
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
            <div class="view-slider">
              <div class="view-top-slider" @mousedown="startMoveInitFov()">
                <span :style="{ left: initFovLeft + 'px'}"><i class="fa fa-map-marker"></i></span>
              </div>
              <vue-slider v-model="sliderValue" :max="180" :tooltipDir="['bottom','bottom']"
                          :dotSize="12" :show="module == 1"></vue-slider>
            </div>
            <div class="columns has-text-centered">
              <div class="column is-4">
                <span>最近</span>
                <input class="input is-small" v-model="minFov" disabled>
              </div>
              <div class="column is-4">
                <span>初始</span>
                <input class="input is-small" v-model="initFov" disabled>
              </div>
              <div class="column is-4">
                <span>最远</span>
                <input class="input is-small" v-model="maxFov" disabled>
              </div>
            </div>
          </div>
        </div>
        <div class="hotspot-module" v-show="module == 2">
          <div class="hotspot-add">
            <a class="button is-small is-info" @click="showHotspotDetail()">添加热点</a>
          </div>
          <div class="line"></div>
          <div class="hotspot-list">
            <div class="hotspot-item" v-for="hotspotItem in hotspotList" @click="showHotspotDetail(hotspotItem)"
                 :class="{'hotspot-item-selected':  selectedHotspot.name == hotspotItem.name}">
              <img :src="hotspotItem.url">
              <div>场景切换</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="hotspot-detail" v-show="showHotspotDetailFlag">
      <div class="hotspot-detail-header">
        <span>{{currentHotspot.name ? '编辑' : '新增'}}热点</span>
        <a class="delete is-large is-pulled-right" @click="hideHotspotDetail()"></a>
      </div>
      <div class="line"></div>
      <div class="hotspot-detail-content">
        <div class="field">
          <label class="label has-text-white">图标样式</label>
          <div class="columns is-multiline hotspot-detail-style-list">
            <div class="column is-4" v-for="style in hotspotStyleList">
              <div class="hotspot-detail-style" @click="selectHotspotStyle(style.name)"
                   :class="{'hotspot-detail-style-selected': style.name==currentHotspot.style}">
                <img :src="style.imgUrl">
              </div>
            </div>
          </div>
        </div>
        <div class="field">
          <label class="label has-text-white">热点类型</label>
          <div class="control">
            <div class="select is-info is-small">
              <select>
                <option>场景切换</option>
              </select>
            </div>
          </div>
        </div>
        <div class="field">
          <label class="label has-text-white">切换效果</label>
          <div class="control">
            <div class="select is-info is-small">
              <select>
                <option>淡入淡出</option>
              </select>
            </div>
          </div>
        </div>
        <div class="field">
          <label class="label has-text-white">目标场景</label>
          <div class="columns is-multiline hotspot-detail-scene-list">
            <div class="column is-6 has-text-centered" v-for="scene in sceneListExceptCurrent">
              <div class="hotspot-detail-scene" @click="selectHotspotLinkedScene(scene.name)"
                   :class="{'hotspot-detail-scene-selected': scene.name==currentHotspot.linkedscene}">
                <img :src="scene.thumburl">
                <span>{{scene.name}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="field hotspot-detail-button">
          <button class="button is-info" @click="saveCurrentHotspot()">确定</button>
        </div>
        <div class="field hotspot-detail-button" v-show="currentHotspot.name">
          <button class="button is-danger" @click="deleteCurrentHotspot()">删除</button>
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
      <a class="button is-info camera-button" @click="setDefaultView()">设为初始视角</a>
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
  import VueSlider from 'vue-slider-component'

  export default {
    name: 'editor',
    components: {MyDialog, VueSlider},
    data() {
      return {
        //krpano对象
        krpano: document.querySelector('#krpanoSWFObject'),
        //当前修改模块：0场景；1视角；2热点
        module: 0,
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
        autoSpinWaitingTime: 0,
        //最小fov
        minFov: 0,
        //最大fov
        maxFov: 180,
        //初始fov
        initFov: 90,
        //初始fov移动条移动开关
        initFovMoveFlag: false,
        //热点列表
        hotspotList: [],
        //选中移动热点
        selectedHotspot: {},
        //热点移动状态
        isHotspotMoving: false,
        //展示热点详情标识
        showHotspotDetailFlag: false,
        //当前热点
        currentHotspot: {
          style: null,
          linkedscene: null
        },
        //热点图标样式列表
        hotspotStyleList: [
          {
            name: 'skin_hotspotstyle',
            imgUrl: '../static/skin/vtourskin_hotspot.png'
          }
        ],
        //接口请求状态
        requesting: false
      }
    },
    computed: {
      //场景名称校验
      sceneNameValid() {
        return this.toModifyScene.name && this.toModifyScene.name.length > 0 && this.toModifyScene.name.length < 10
      },
      //视角拖动条范围值
      sliderValue: {
        get: function () {
          return [
            this.minFov,
            this.maxFov
          ]
        },
        set: function (val) {
          let min = Math.min(val[0], val[1])
          let max = Math.max(val[0], val[1])
          if (this.sceneList[this.currentSceneIndex]) {
            if (this.krpano.get('view.fovmin') != min) {
              this.krpano.set('view.fovmin', min)
              this.sceneList[this.currentSceneIndex].fovmin = min
              this.toSaveFlag = true
            }
            if (this.krpano.get('view.fovmax') != max) {
              this.krpano.set('view.fovmax', max)
              this.sceneList[this.currentSceneIndex].fovmax = max
              this.toSaveFlag = true
            }
          }
          this.minFov = min
          this.maxFov = max
        }
      },
      //视角拖动条上组件左偏移量
      initFovLeft: {
        get: function () {
          let sliderWidth = document.querySelector('#editor').clientWidth * 5 / 6 - 32
          return this.initFov * sliderWidth / 180
        },
        set: function (val) {
          let sliderWidth = document.querySelector('#editor').clientWidth * 5 / 6 - 32
          this.initFov = Math.round(val * 180 / sliderWidth)
        }
      },
      //除当前场景外场景列表
      sceneListExceptCurrent() {
        let scenes = []
        this.sceneList.forEach((scene) => {
          if (scene.index != this.currentSceneIndex) {
            scenes.push(scene)
          }
        })
        return scenes
      }
    },
    methods: {
      //入口js文件已将此函数定义到window，krpano加载完成后调用
      onready() {
        //隐藏下方自带控制条
        this.krpano.set('layer[skin_control_bar].visible', false);
        this.krpano.set('layer[skin_splitter_bottom].visible', false);
        this.krpano.set('layer[skin_scroll_window].visible', false);
        //初始化场景
        this.sceneList = this.krpano.get('scene').getArray()
        this.currentSceneIndex = this.krpano.get('scene').getItem(this.krpano.get('xml.scene')).index
        this.welcomeSceneIndex = this.krpano.get('scene').getItem(this.krpano.get('startscene')).index
        //热点移动事件初始化
        let thisVue = this
        let pano = document.querySelector('#pano')
        pano.onmouseup = function () {
          thisVue.isHotspotMoving = false
        }
        pano.onmouseout = function () {
          thisVue.isHotspotMoving = false
        }
        pano.onmousemove = function () {
          thisVue.moveHotspot()
        }
        //模块数据初始化
        this.initView()
        this.initHotSpot()

      },
      //根据krpano参数初始化视角和热点模块数据
      initView() {
        //初始化视角参数
        this.autoSpinWaitingTime = this.krpano.get('autorotate.waittime')
        this.autoSpinFlag = this.krpano.get('autorotate.enabled')
        this.minFov = this.krpano.get('view.fovmin')
        this.maxFov = this.krpano.get('view.fovmax')
        this.initFov = this.krpano.get('view.fov')
      },
      //热点初始化
      initHotSpot() {
        this.sceneList[this.currentSceneIndex].hotspots = []
        this.hotspotList = []
        this.krpano.get('hotspot').getArray().forEach((hotspot) => {
          if (hotspot.name != 'webvr_prev_scene' && hotspot.name != 'webvr_next_scene' && hotspot.name != 'vr_cursor') {
            this.hotspotList.push(hotspot)
            this.sceneList[this.currentSceneIndex].hotspots.push(hotspot)
            this.initHotspotEvent(hotspot)
          }
        })
      },
      //切换操作模块
      changeModule(module) {
        this.module = module
      },
      //切换当前场景
      changeScene(scene) {
        if (this.currentSceneIndex == scene.index) return
        this.currentSceneIndex = scene.index
        this.krpano.call('loadscene(' + scene.name + ')');
        let currentScene = this.sceneList[this.currentSceneIndex]
        //加载临时存储数据应用于krpano
        //自动旋转
        if (currentScene.autorotate) {
          this.krpano.set('autorotate.enabled', currentScene.autorotate.enabled)
          this.krpano.set('autorotate.waittime', currentScene.autorotate.waitTime)
        }
        if (this.autoSpinFlag) this.krpano.get('autorotate').interrupt()
        //视角
        if (currentScene.initH) this.krpano.set('view.hlookat', currentScene.initH)
        if (currentScene.initV) this.krpano.set('view.vlookat', currentScene.initV)
        if (currentScene.fovmax) this.krpano.set('view.fovmax', currentScene.fovmax)
        if (currentScene.fovmin) this.krpano.set('view.fovmin', currentScene.fovmin)
        if (currentScene.fov) this.krpano.set('view.fov', currentScene.fov)
        //热点
        if (currentScene.hotspots && currentScene.hotspotsModifyFlag) {
          //清除原有热点
          this.krpano.get('hotspot').getArray().forEach((hotspot) => {
            if (hotspot.name != 'webvr_prev_scene' && hotspot.name != 'webvr_next_scene' && hotspot.name != 'vr_cursor') {
              this.krpano.call('removehotspot(' + hotspot.name + ')')
            }
          })
          //添加存储数据热点
          currentScene.hotspots.forEach((hotspot) => {
            this.krpano.call('addhotspot(' + hotspot.name + ');');
            this.krpano.set('hotspot[' + hotspot.name + '].ath', hotspot.ath);
            this.krpano.set('hotspot[' + hotspot.name + '].atv', hotspot.atv);
            this.krpano.set('hotspot[' + hotspot.name + '].linkedscene', hotspot.linkedscene);
            this.krpano.set('hotspot[' + hotspot.name + '].dive', hotspot.dive);
            this.krpano.get('hotspot[' + hotspot.name + ']').loadstyle(hotspot.style);
          })
        }
        //初始化模块数据
        this.initView()
        this.initHotSpot()
      },
      //设置为home页
      setWelcome(index) {
        this.welcomeSceneIndex = index
        this.toSaveFlag = true
      },
      //保存
      save() {
        if (!this.toSaveFlag) return
        if (this.requesting) {
          alert('保存中，请稍后再试')
          return
        }
        this.requesting = true
        let data = []
        this.sceneList.forEach((scene) => {
          let sceneData = {
            index: scene.index,
            name: scene.name,
            welcomeFlag: scene.index == this.welcomeSceneIndex,
            autorotate: scene.autorotate ? scene.autorotate : null,
            fov: scene.fov ? scene.fov : null,
            fovmax: scene.fovmax ? scene.fovmax : null,
            fovmin: !isNaN(Number.parseInt(scene.fovmin)) ? scene.fovmin : null,
            initH: scene.initH ? scene.initH : null,
            initV: scene.initV ? scene.initV : null
          }
          if (scene.hotspots) {
            let hotSpots = []
            scene.hotspots.forEach((hotspot) => {
              hotSpots.push({
                ath: hotspot.ath,
                atv: hotspot.atv,
                name: hotspot.name,
                linkedscene: hotspot.linkedscene,
                style: hotspot.style,
                dive: hotspot.dive
              })
            })
            sceneData.hotSpots = hotSpots
          }
          data.push(sceneData)
        })
        console.log(data)
        fetch('/server/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify(data)
        }).then((res) => {
          this.requesting = false
          if (res.status === 200) {
            res.text().then((resText) => {
              this.toSaveFlag = false
              alert(resText)
            })
          } else {
            alert('系统异常')
          }
        }, () => {
          this.requesting = false
          alert('系统异常')
        })
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
          alert('场景名称重复')
          return
        }
        //修改场景名称（相关联的热点，当前场景scene名称也需修改）
        let oldName = this.sceneList[this.toModifyScene.index].name.toString()
        let newName = this.toModifyScene.name.toString()
        //修改krpano场景对象名称
        this.krpano.get('scene').renameItem(oldName, newName)
        this.sceneList[this.toModifyScene.index].name = newName
        //修改krpano热点指向场景名称
        this.sceneList.forEach((scene) => {
          if (scene.hotspots && scene.index != this.toModifyScene.index) {
            scene.hotspots.forEach((hotspot) => {
              if (hotspot.linkedscene == oldName) {
                hotspot.linkedscene = newName
                scene.hotspotsModifyFlag = true
                if (scene.index == this.currentSceneIndex)
                  this.krpano.set('hotspot[' + hotspot.name + '].linkedscene', newName)
              }
            })
          }
        })
        this.showModifySceneNameFlag = false
        this.toSaveFlag = true
      },
      //关闭修改场景弹窗
      closeModifySceneName() {
        this.showModifySceneNameFlag = false
      },
      //设为初始视角
      setDefaultView() {
        let fov = Math.round(this.krpano.get('view.fov'))
        this.initFov = fov
        this.sceneList[this.currentSceneIndex].fov = fov
        this.sceneList[this.currentSceneIndex].initH = this.krpano.get('view.hlookat')
        this.sceneList[this.currentSceneIndex].initV = this.krpano.get('view.vlookat')
        this.toSaveFlag = true
      },
      //自动旋转变更
      updatedAutoSpin() {
        this.krpano.set('autorotate.enabled', this.autoSpinFlag)
        this.krpano.set('autorotate.waittime', this.autoSpinWaitingTime)
        if (this.autoSpinFlag) this.krpano.get('autorotate').interrupt()
        this.sceneList[this.currentSceneIndex].autorotate = {
          enabled: this.autoSpinFlag,
          waitTime: Number(this.autoSpinWaitingTime)
        }
        this.toSaveFlag = true
      },
      //视角条拖动
      moveInitFov() {
        if (this.initFovMoveFlag) {
          let slider = document.querySelector('.view-top-slider')
          let left = window.event.clientX - slider.offsetLeft
          if (left < Math.round(this.minFov * slider.clientWidth / 180)) {
            if (left < -6) this.stopMoveInitFov()
            left = Math.round(this.minFov * slider.clientWidth / 180)
          } else if (left > Math.round(this.maxFov * slider.clientWidth / 180)) {
            if (left > slider.clientWidth + 6) this.stopMoveInitFov()
            left = Math.round(this.maxFov * slider.clientWidth / 180)
          }
          this.initFovLeft = left
          this.krpano.set('view.fov', this.initFov)
          this.sceneList[this.currentSceneIndex].fov = this.initFov
          this.toSaveFlag = true
        }
      },
      startMoveInitFov() {
        this.initFovMoveFlag = true
        this.moveInitFov()
      },
      stopMoveInitFov() {
        this.initFovMoveFlag = false
      },
      //热点事件初始化
      initHotspotEvent(hotspot) {
        let thisVue = this
        hotspot.ondown = function () {
          thisVue.selectedHotspot = hotspot
          thisVue.selectHotspot()
          thisVue.isHotspotMoving = true
        }
        hotspot.onover = function () {
          thisVue.selectedHotspot = hotspot
        }
        hotspot.onout = function () {
          thisVue.selectedHotspot = {}
        }
        hotspot.onclick = null
      },
      //热点坐标与鼠标坐标偏移计算
      selectHotspot() {
        this.krpano.call('screentosphere(mouse.x, mouse.y, mouseath, mouseatv);')
        this.selectedHotspot.athDis = this.selectedHotspot.ath - this.krpano.get('mouseath')
        this.selectedHotspot.atvDis = this.selectedHotspot.atv - this.krpano.get('mouseatv')
      },
      //热点移动
      moveHotspot() {
        if (this.isHotspotMoving) {
          this.krpano.call('screentosphere(mouse.x, mouse.y, mouseath, mouseatv);')
          this.krpano.set('hotspot[' + this.selectedHotspot.name + '].ath'
            , this.krpano.get("mouseath") + this.selectedHotspot.athDis)
          this.krpano.set('hotspot[' + this.selectedHotspot.name + '].atv'
            , this.krpano.get("mouseatv") + this.selectedHotspot.atvDis)
        }
      },
      //显示热点详情
      showHotspotDetail(hotspotItem) {
        this.currentHotspot = hotspotItem ? hotspotItem : {
          style: this.hotspotStyleList[0].name,
          linkedscene: this.sceneListExceptCurrent[0].name,
          dive: true
        }
        this.showHotspotDetailFlag = true
      },
      //隐藏热点详情
      hideHotspotDetail() {
        this.showHotspotDetailFlag = false
      },
      //选择热点图标样式
      selectHotspotStyle(name) {
        this.currentHotspot.style = name
      },
      //选择切换场景热点目标场景
      selectHotspotLinkedScene(name) {
        this.currentHotspot.linkedscene = name
      },
      //保存当前热点变动
      saveCurrentHotspot() {
        if (!this.currentHotspot.name) {
          // 计算中间位置的球面坐标
          this.krpano.set('halfHeight', this.krpano.get('stageheight') / 2)
          this.krpano.set('halfWidth', this.krpano.get('stagewidth') / 2)
          this.krpano.call('screentosphere(halfWidth,halfHeight,init_h,init_v);')
          let init_h = this.krpano.get('init_h')
          let init_v = this.krpano.get('init_v')
          //添加热点
          let name = 'spot' + new Date().getTime()
          this.krpano.call('addhotspot(' + name + ');')
          this.krpano.get('hotspot[' + name + ']').loadstyle(this.currentHotspot.style)
          this.krpano.set('hotspot[' + name + '].ath', init_h)
          this.krpano.set('hotspot[' + name + '].atv', init_v)
          this.krpano.set('hotspot[' + name + '].linkedscene', this.currentHotspot.linkedscene)
          this.krpano.set('hotspot[' + name + '].dive', this.currentHotspot.dive)
        }
        this.initHotSpot()
        this.showHotspotDetailFlag = false
        this.toSaveFlag = true
      },
      //删除热点
      deleteCurrentHotspot() {
        this.krpano.call('removehotspot(' + this.currentHotspot.name + ')')
        this.initHotSpot()
        this.showHotspotDetailFlag = false
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
    user-select: none;
  }

  .func-div {
    border-right: solid 1px black;
    user-select: none;

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
    user-select: none;

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
    user-select: none;

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
    user-select: none;

    input {
      text-align: center;
    }

    .view-content {
      margin: 20px 10px 23px 10px;
      height: auto;

      .view-switch {
        float: right;
      }

      .view-slider {
        padding-bottom: 35px;

        .view-top-slider {
          margin: 0 6px;
          position: relative;
          bottom: -7px;
          text-align: center;
          height: 21px;
          user-select: none;

          span {
            position: absolute;
            transform: translateX(-50%);
          }
        }
      }

      label {
        font-weight: 100;
        font-size: 15px;
        margin-bottom: 15px;
        input {
          height: 22px;
          float: right;
          width: 40px;
        }
        &:hover {
          color: white;
        }
      }

      span {
        width: 20px;
        cursor: pointer;
        user-select: none;
        font-size: 12px;
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

  .hotspot-module {
    div {
      height: auto;
    }

    .hotspot-add {
      padding: 10px;

      a {
        width: 100%;
        height: 30px;
      }
    }

    .hotspot-list {

      .hotspot-item {
        margin: 10px 0;
        padding: 4px 10px;
        background-color: #3a3a3a;
        cursor: pointer;
        div {
          line-height: 32px;
          height: auto;
          color: white;
          text-align: center;
        }
        img {
          height: 32px;
          width: auto;
          float: left;
        }
        &:hover {
          background-color: #427afb;
        }
      }

      .hotspot-item-selected {
        background-color: #427afb;
      }
    }
  }

  .hotspot-detail {
    height: 100%;
    width: 16.66%;
    background-color: #333333;
    z-index: 999;
    position: absolute;
    color: white;
    right: 0;
    top: 0;

    div {
      height: auto;
    }

    .hotspot-detail-header {
      height: 50px;
      line-height: 50px;
      padding-left: 20px;
      font-size: 18px;
      a {
        margin: 9px;
      }
    }

    .hotspot-detail-content {
      padding: 10px 0 10px 20px;
      label {
        font-weight: 100;
      }

      .hotspot-detail-style-list {
        width: 100%;
        max-height: 150px;
        overflow-y: auto;
        overflow-x: hidden;
        padding-right: 12px;

        .hotspot-detail-style {
          cursor: pointer;
          border: solid #333333 1px;
          &:hover {
            border-color: #fbd14b;
          }
        }

        .hotspot-detail-style-selected {
          border-color: #fbd14b;
        }
      }

      .hotspot-detail-scene-list {
        width: 100%;
        max-height: 350px;
        overflow-y: auto;
        overflow-x: hidden;
        padding-right: 12px;

        .hotspot-detail-scene {
          cursor: pointer;
          border: solid #333333 2px;
          &:hover {
            border-color: #fbd14b;
          }
        }
        .hotspot-detail-scene-selected {
          border-color: #fbd14b;
        }
      }

      .hotspot-detail-button {
        padding-right: 20px;
        button {
          width: 100%;
        }
      }
    }
  }

</style>
