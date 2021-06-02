/**
 * 裁剪类的封装
 * @requires {Ycc} 依赖Ycc库
 * @author xiaohei
 */

import Ycc from '@datagetter.cn/ycc';

/**
 * 裁剪图片
 * @param {*} imageUrl 图片地址
 * @param {Object} options 配置参数
 * @param {HTMLCanvasElement} options.canvasDom canvas容器
 * @param {Number} options.wrapW 可视区宽度
 * @param {Number} options.wrapH 可视区高度
 * @param {Number} options.cropW 裁剪区的高
 * @param {String} options.maskColor 遮罩的色值
 * @param {String} options.lineColor 线条的色值
 * @param {Boolean} options.enableZoom 允许缩放
 * @param {Boolean} options.enableRotate 允许旋转
 * @param {Boolean} options.enableDrag 允许拖拽
 * @constructor
 */
function Cropper(imageUrl,options){
    // 默认参数
    options = Ycc.utils.extend({
        appenv:'h5',
        canvasDom:null,
        wrapW:800,
        wrapH:600,
        cropW:200,
        cropH:200,
        maskColor:'rgba(0,0,0,0.6)',
        lineColor:'#fff',
        enableZoom:true,
        enableRotate:true,
        enableDrag:true,
    },options);

    this.options = options;
    this.imageUrl = imageUrl;
    this.ycc = new Ycc({
        appenv:options.appenv,
        // debugDrawContainer:true
    });
    this.ycc.bindCanvas(this.ycc.createCanvas({canvasDom:options.canvasDom,width:options.wrapW,height:options.wrapH,dpiAdaptation:true}));
    this.layer = this.ycc.layerManager.newLayer({enableEventManager:true});

    // 图片UI
    this.imageUI = null;

    this.init();
}

Cropper.prototype.init = function(){
    var that = this;
    this.ycc.loader.loadResOneByOne([{url:this.imageUrl}],function (resArr) {
        console.log("loaded!",this);
        that._onImageLoad(resArr[0]);
    },function (image,err,index) {
        console.log('progress',index,image);
    });

    this.ycc.ticker.addFrameListener(function(){
        that.ycc.layerManager.reRenderAllLayerToStage();
    })

    this.ycc.ticker.start(60);
}

Cropper.prototype._onImageLoad = function(image){
    this._addImage(image);
    this._addCrop();
}

Cropper.prototype._addCrop = function(){
    var layer = this.layer;
    layer.addUI(new Ycc.UI.Rect({
        rect:new Ycc.Math.Rect(0,0,this.options.wrapW,this.options.wrapH/2-this.options.cropH/2),
        color:this.options.maskColor,
        ghost:true,
    }));

    layer.addUI(new Ycc.UI.Rect({
        rect:new Ycc.Math.Rect(0,this.options.wrapH-(this.options.wrapH/2-this.options.cropH/2),this.options.wrapW,this.options.wrapH/2-this.options.cropH/2),
        color:this.options.maskColor,
        ghost:true,
    }));

    layer.addUI(new Ycc.UI.Rect({
        rect:new Ycc.Math.Rect(0,this.options.wrapH/2-this.options.cropH/2,this.options.wrapW/2-this.options.cropW/2,this.options.cropH),
        color:this.options.maskColor,
        ghost:true,
    }));
    layer.addUI(new Ycc.UI.Rect({
        rect:new Ycc.Math.Rect(this.options.wrapW-(this.options.wrapW/2-this.options.cropW/2),this.options.wrapH/2-this.options.cropH/2,this.options.wrapW/2-this.options.cropW/2,this.options.cropH),
        color:this.options.maskColor,
        ghost:true,
    }));

    // 横纵线条 1
    layer.addUI(new Ycc.UI.Rect({
        rect:new Ycc.Math.Rect(0,this.options.wrapH/2-this.options.cropH/2,this.options.wrapW,1),
        color:this.options.lineColor,
        ghost:true,
    }));
    // 横纵线条 2
    layer.addUI(new Ycc.UI.Rect({
        rect:new Ycc.Math.Rect(this.options.wrapW/2-this.options.cropW/2,0,1,this.options.wrapH),
        color:this.options.lineColor,
        ghost:true,
    }));
    // 横纵线条 3
    layer.addUI(new Ycc.UI.Rect({
        rect:new Ycc.Math.Rect(this.options.wrapW/2+this.options.cropW/2,0,1,this.options.wrapH),
        color:this.options.lineColor,
        ghost:true,
    }));
    // 横纵线条 4
    layer.addUI(new Ycc.UI.Rect({
        rect:new Ycc.Math.Rect(0,this.options.wrapH/2+this.options.cropH/2,this.options.wrapW,1),
        color:this.options.lineColor,
        ghost:true,
    }));

    // 边框
    layer.addUI(new Ycc.UI.Rect({
        rect:new Ycc.Math.Rect((this.options.wrapW/2-this.options.cropW/2),this.options.wrapH/2-this.options.cropH/2,this.options.cropW,this.options.cropH),
        rectBorderWidth:1,
        rectBorderColor:this.options.lineColor,
        color:'transparent',
        ghost:true,
    }));
}


// 添加图片
Cropper.prototype._addImage = function(image){
    var ycc = this.ycc;
    var cropper = this;

    var ratioW = image.res.width/this.options.wrapW;
    var ratioH = image.res.height/this.options.wrapH;

    var scaleRatio = 1;
    var imageRect = null;
    if(ratioW<ratioH){
        scaleRatio = ratioH;
        imageRect = new Ycc.Math.Rect((this.options.wrapW-image.res.width/scaleRatio)/2,0,image.res.width/scaleRatio,image.res.height/scaleRatio);
    }else{
        scaleRatio = ratioW;
        imageRect = new Ycc.Math.Rect(0,(this.options.wrapH-image.res.height/scaleRatio)/2,image.res.width/scaleRatio,image.res.height/scaleRatio);
    }

    console.log('scaleRatio',scaleRatio,ratioW<ratioH)
    this.imageUI = new Ycc.UI.Image({
        rect:imageRect,
        fillMode:'scale',
        res:image.res
    });
    // 添加图片至图层
    this.layer.addUI(this.imageUI);


    // 缩放前的临时区域
    var tempRect = null;
    // 监听手势事件
    this.ycc.gesture.ondragstart = function(e) {
        console.log(e,1111);
        this.userData = {
            startPos:new Ycc.Math.Dot(e),
            startRect:new Ycc.Math.Rect(cropper.imageUI.rect)
        }
    };
    this.ycc.gesture.ondragging = function(e){
        if(this.ismutiltouching) return;
        if(!this.userData) return;
        if(!cropper.options.enableDrag) return;

        var startPos = this.userData.startPos;
        var startRect = this.userData.startRect;
        let deltaX = (e.x-startPos.x);
        let deltaY = (e.y-startPos.y);
        cropper.imageUI.rect.x = startRect.x+deltaX;
        cropper.imageUI.rect.y = startRect.y+deltaY;

        // 固定锚点在图片正中心
        cropper.imageUI.anchorX = imageRect.x+imageRect.width/2;
        cropper.imageUI.anchorY = imageRect.y+imageRect.height/2;
    }
    this.ycc.gesture.onmultistart = function(e){
        tempRect = new Ycc.Math.Rect(cropper.imageUI.rect); 
        // 将userdata设置成null 阻止缩放后立即响应拖拽
        this.userData = null;
    };
    // 绑定缩放事件
    this.ycc.gesture.onzoom = function(e){
        // alert('zoom '+e.zoomRate);
        if(!cropper.options.enableZoom) return;

        var rate = e.zoomRate;
        imageRect.width = tempRect.width*rate;
        imageRect.height =tempRect.height*rate;

        // 固定锚点在图片正中心
        imageRect.x = tempRect.x-(imageRect.width-tempRect.width)/2;
        imageRect.y = tempRect.y-(imageRect.height-tempRect.height)/2;
    };
    this.ycc.gesture.onrotate = function(e){
        if(!cropper.options.enableRotate) return;

        var angle = e.angle;
        cropper.imageUI.anchorX = imageRect.x+imageRect.width/2;
        cropper.imageUI.anchorY = imageRect.y+imageRect.height/2;
        cropper.imageUI.rotation += angle;
    };

}

/**
 * 获取imagedata
 * @param {*} canvasId canvas的ID 仅当appenv为wxapp时需要
 */
Cropper.prototype.getCropImage = function(canvasId){
    var x = (this.options.wrapW/2-this.options.cropW/2);
    var y = this.options.wrapH/2-this.options.cropH/2;
    var width = this.options.cropW;
    var height = this.options.cropH;

    if(this.options.appenv==='wxapp') return wx.canvasToTempFilePath({
        canvasId:canvasId,
        canvas:this.ycc.canvasDom,
        x:x,
        y:y,
        width:width,
        height:height,
        destWidth:width,
        destHeight:height,
        fileType:'jpg',
        quality:1
    })


    var ycc = this.ycc;
    return ycc.ctx.getImageData(x*this.ycc.dpi,y*this.ycc.dpi,width*this.ycc.dpi,height*this.ycc.dpi);
};

/**
 * 清空画布
 */
Cropper.prototype.clear = function(){
    this.ycc.layerManager.deleteAllLayer();
    this.ycc.ticker.stop();
}



///////////// 兼容es5模式
var g;
if(typeof window!=="undefined"){g=window}
else if(typeof global!=="undefined"){g=global}
else if(typeof self!=="undefined"){g=self}
else{g=this}
g.Cropper = Cropper;

// 导出模块
export default Cropper;

