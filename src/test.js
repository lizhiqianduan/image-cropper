// import Cropper from '../build/lib.js'
// import Cropper from './lib.js'
console.log(Cropper)

var cropper = new Cropper('http://datagetter.cn:9000/datagetter.cn/public/original/wx_test_kid_oXWPn5V5YxiQVoSyK3IDFQ2XnqhM_.jpg_1621776883437_4289396_wx_test_kid_oXWPn5V5YxiQVoSyK3IDFQ2XnqhM_.jpg',{
    wrapW:300,
    wrapH:400,
    canvasDom:document.getElementById("canvas")
});

// cropper.get