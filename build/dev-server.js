require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {},
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

//提供保存接口start
var fs = require('fs')
var bodyParser = require('body-parser');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var builder = new xml2js.Builder();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.post('/server/save', function (req, res) {
  //读取xml文件
  fs.readFile('./static/tour.xml', 'utf8', function (err, data) {
    if (err) throw err;
    //xml转对象
    parser.parseString(data, function (parseErr, obj) {
      if (parseErr) throw parseErr;
      //根据请求参数修改dom节点
      var scenes = req.body
      scenes.forEach(function (scene) {
        var sceneObj = obj.krpano.scene[scene.index]
        //初始观察点
        var viewAttr = sceneObj.view[0].$
        if (scene.initH) viewAttr.hlookat = scene.initH
        if (scene.initV) viewAttr.vlookat = scene.initV
        if (scene.fov) viewAttr.fov = scene.fov
        if (scene.fovmax) viewAttr.fovmax = scene.fovmax
        if (scene.fovmin) viewAttr.fovmin = scene.fovmin
        delete viewAttr.maxpixelzoom
        //场景名称
        sceneObj.$.name = scene.name
        //热点
        if (scene.hotSpots) {
          sceneObj.hotspot = []
          scene.hotSpots.forEach(function (hotSpot) {
            sceneObj.hotspot.push({
              $: {
                ath: hotSpot.ath,
                atv: hotSpot.atv,
                linkedscene: hotSpot.linkedscene,
                name: hotSpot.name,
                style: hotSpot.style,
                dive: hotSpot.dive
              }
            })
          })
        }
        //自动旋转
        if (scene.autorotate) {
          sceneObj.autorotate = [{
            $: {
              enabled: scene.autorotate.enabled,
              waittime: scene.autorotate.waitTime,
              accel: '1.0',
              speed: '5.0',
              horizon: '0.0'
            }
          }]
        }
        //初始场景
        if (scene.welcomeFlag) {
          obj.krpano.action[0]._ = "if(startscene === null OR !scene[get(startscene)], copy(startscene,scene[" + scene.index
            + "].name); );loadscene(get(startscene), null, MERGE);if(startactions !== null, startactions() );js('onready');"
        }
      })
      //对象转回xml
      var xmlStr = builder.buildObject(obj)
      //写入文件
      fs.writeFile('./static/tour.xml', xmlStr, 'utf8', function (err) {
        if (err) throw err;
        res.send('保存成功')
      })
    })
  })
})
//提供保存接口end

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
