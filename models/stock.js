var mongoose = require('mongoose'); //引入mongoose依赖
var Schema = mongoose.Schema;//mongoose的一切都是以Schema开始的

// 使用modules.exports导出Stock模块
module.exports = mongoose.model('Stock',new Schema({//利用模板的方式启动模板，并导出
    code:String,
    name:String,
    price:Number,
    des:String
}))
