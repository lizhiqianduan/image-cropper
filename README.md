# image-cropper
Image Cropper used in multiple environments, such as WeChat, Web, H5, powerd by http://datagetter.cn

Image Cropper是一款兼容多平台的图片裁剪工具库，由 http://datagetter.cn 提供技术支持

# 优势
1. 完全开源，可任意扩展
2. 超高性能，完全基于canvas操作
3. 用法极简，纯函数式调用
4. 功能强大，拖拽、双击、缩放、旋转、多点触控....
5. 多平台兼容，小程序、H5、PC、UniAPP等，有canvas的地方就能用

# 安装
```
npm install @datagetter.cn/ycc-cropper --save
```
# 小程序用法
## wxml文件
```html
<canvas
  type="2d" id="myCanvas"
  bindtouchstart="touchevent" 
  bindtouchmove="touchevent"
  bindtouchend="touchevent">
</canvas>

<!-- 确认裁剪按钮 -->
<button type="primary" size="mini" bindtap="onCropClick">确认</button>
```
## page/index.js脚本文件
```Javascript
// miniprogram/pages/index.js
const Cropper = require('@datagetter.cn/ycc-cropper').default;

Page({
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const self = this;
    // 微信需绑定安全域名，此路径可为微信本地图片路径
    const imageTempUrl = 'http://datagetter.cn:9000/datagetter.cn/public/original/%E5%88%98%E4%BA%A6%E8%8F%B2.jpg';

    wx.createSelectorQuery().select('#myCanvas')
    .fields({ node: true, size: true })
    .exec((res) => {
        // 直接函数式调用 进行初始化
        self.cropper = new Cropper(imageTempUrl,{
            wrapW:wx.getSystemInfoSync().windowWidth,
            wrapH:wx.getSystemInfoSync().windowHeight,
            canvasDom:res[0].node,
            appenv:'wxapp'
        });
    })
  },

  // 确认按钮 处理裁剪后的图片
  async onCropClick(e){
    let res = await cropper.getCropImage('myCanvas');

    // 获取到临时文件路径 res.tempFilePath
    // do something with res.tempFilePath
  },

  // 捕获微信canvas事件
  touchevent(e){
    cropper.ycc.gesture.touchLifeTracer[e.type](e);
  },

})
```

# Web端用法
## HTML片段
```html
<canvas id="canvas"></canvas>

<!-- 确认裁剪按钮 -->
<button onclick="takePhoto()">确认</button>
```
## ES6模块调用
```Javascript es6
import Cropper from '../build/lib.js'

// 微信需绑定安全域名，此路径可为微信本地图片路径
const imageTempUrl = 'http://datagetter.cn:9000/datagetter.cn/public/original/%E5%88%98%E4%BA%A6%E8%8F%B2.jpg';

// 直接函数式调用 进行初始化
var cropper = new Cropper(imageTempUrl,{
    wrapW:300,
    wrapH:400,
    canvasDom:document.getElementById("canvas")
});

// 响应确认按钮
window.takePhoto = function (){
    var imgData = cropper.getCropImage();
    // 获取到临时文件路径 imgData
    // do something with imgData
}
```
### ES5 传统模式调用 可直接引入script脚本
```html
<script src="./node_modules/@datagetter.cn/ycc-cropper/build/lib.js"></script>
```
# new Cropper(imageUrl,option)详细说明
## 参数说明
| 参数名 | 类型 | 必填 | 默认值 | 描述 | 
| -- | -- | -- | -- | -- |
| imageUrl | String | 是 | null | 待裁切的原图地址，小程序内可为本地路径 |
| option.canvasDom | HTMLCanvasDocument | 是 | null | canvas的元素 |
| option.wrapW | Number | 否 | 800 | 可视区宽度 |
| option.wrapH | Number | 否 | 800 | 可视区高度 |
| option.cropW | Number | 否 | 200 | 裁剪区宽度 |
| option.wrapW | Number | 否 | 800 | 裁剪区高度 |
| option.maskColor | String | 否 | 'rgba(0,0,0,0.6)' | 遮罩的色值 |
| option.lineColor | String | 否 | '#fff' | 线条的色值 |
| option.enableZoom | Boolean | 否 | true | 允许双指缩放 |
| option.enableDoubleTapZoom | Boolean | 否 | true | 允许双击缩放 |
| option.enableRotate | Boolean | 否 | true | 允许旋转 |
| option.enableDrag | Boolean | 否 | true | 允许拖拽 |

## cropper对象 属性
| 属性 | 类型 | 描述 | 
| -- | -- | -- |
| options | Object | 只读，cropper实际运行使用的配置 |
| ycc | Ycc | 只读，cropper绑定的Ycc对象，参看[Ycc文档](http://www.lizhiqianduan.com/products/ycc/docs) |
| layer | Ycc.Layer | 只读，cropper绑定的Ycc.Layer对象，参看[Ycc文档](http://www.lizhiqianduan.com/products/ycc/docs) |
| imageUI | Ycc.UI.Image | 只读，图片的在Ycc的Image对象，参看[Ycc文档](http://www.lizhiqianduan.com/products/ycc/docs) |
| initImageRect | Ycc.Math.Rect | 只读，图片初始时在Ycc图层的位置信息，参看[Ycc文档](http://www.lizhiqianduan.com/products/ycc/docs) |



## cropper对象 方法
| 方法名 | 入参 | 出参 | 描述 | 
| -- | -- | -- | -- |
| getCropImage | canvasId{String} | image{FilePath\|ImageData} | 获取裁剪区的图片 小程序返回图片路径，H5、Web返回ImageData |
| clear |  |  | 清空当前画布所有内容，当多个Cropper实例公用同一个canvas时，可能需要调用 |

# 示例
- [Web端示例](http://datagetter.cn/demo/image-cropper/example/)
- [小程序示例](http://datagetter.cn/demo/image-cropper/example/wxapp.jpg)
- [H5端示例](http://datagetter.cn/demo/image-cropper/example/h5.png)

