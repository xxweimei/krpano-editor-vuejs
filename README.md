# krpano-editor-vuejs

## 简介
此项目是基于原jquery版本编辑器逻辑用vuejs重构而来。
简化代码逻辑的同时美化了页面。
使用了bulma.io作为样式框架，使用了开源的vue-slider-component作为视角拖动条组件
如果觉得此项目对您有用，请不要吝啬您的star哦。

> [demo](https://xxweimei.github.io/krpano-vuejs.html)（无后台无法保存）

> [原jquery版本](https://github.com/xxweimei/krpano-editor-js)

## 食用说明书
+ clone项目到本地
+ 安装nodejs（已装的同学跳过）
+ 在项目根目录执行 `npm install` 安装相关依赖包
+ 在项目根目录执行 `npm run dev` 启动项目（默认弹出页面，未弹出访问`http://localhost:8080/`即可）
+ 在项目根目录执行 `npm run build` 打包项目
## 关于项目的一些说明
+ 使用简单的nodejs express提供静态资源服务器功能，以及提供保存接口实现本地tour.xml文件的修改，具体参考build/dev-server.js文件中注释点
+ 项目核心难点是对krpano的各种api和xml配置文件的理解，具体参考[官网文档](https://krpano.com/docu/)即可
+ 有bug可以提issue，或者添加Q群144518198，当然有不懂的同学也可以沟通，有时间一定耐心解答
+ 感谢Satan（QQ昵称）同学提供的全景图片
## TODO
+ 热点选中，视角lookat到热点位置
+ 视角拖动条下方数值框支持编辑（主要解决控件数值变动问题）
+ 场景列表模块页面美化，css优化
+ 预览功能完成，目前仅跳转保存完成结果页，后续支持预览当前未保存效果
+ 新增热点样式
+ 新增热点类型
+ 新增热点切换效果

## 捐赠
+ 如果觉得项目不错，请作者喝杯咖啡吧
+ <img src="https://xxweimei.github.io/blog/img/alipay.jpg" width="267" height="318"></img>
