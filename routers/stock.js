var express = require("express");
var Stock = require("../models/stock");

var router = express.Router();

// 根据code查询股票
router.get('/',function(req,res){
    // 根据分类查找
    var {code} = req.query;
    var whereObj = {};
    if(code){
        var reg = new RegExp('^'+code+'$');
        whereObj = {code:reg}
    }
    //var reg = new RegExp('^'+category+'$')与/^category$/的区别
    //前者中的category是拼接上的一个变量，是动态的，
    //后者是静态的只能匹配'category'这个内容

    Stock.find(whereObj,function(err,stocks){
        res.json({
            success:true,
            data:stocks
        })
    })
})

// 添加股票
router.post('/',function(req,res){
    var title = req.body.title;
    console.log(req);
    var stock = new Stock({
        code:req.body.code,
        name:req.body.name,
        price:req.body.price,
        des:req.body.des
    })
    stock.save(function(err){
        if(err){
            res.json({
                success:false,
                message:"股票添加失败"
            })
        }
    })
    res.json({success:true,message:"股票添加成功"})
})

// 更新股票
router.put('/',function(req,res){
    // 解构赋值
    var {code} = req.body;
    Stock.findOneAndUpdate({code:code},function(err,stock){
        if(err){
            res.json({
                success:false,message:"更新股票失败"
            })
        }
    })
    res.json({success:true,message:"更新股票成功！"})
})

// 删除股票
router.delete('/',function(req,res){
    // 解构赋值
    var {code} = req.body;
    Stock.remove({title:title},function(err){
        if(err){
            res.json({
                success:false,messge:"删除股票成功！"
            })
        }
    })
    res.json({success:true,message:"删除股票成功！"})
})

module.exports = router; //导出路由
