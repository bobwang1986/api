var express = require("express");
var User = require("../models/user");

var router = express.Router();

router.get('/',function(req,res){

    var admin = new User({
        name:'admin',
        password:'admin123',
        age:30,
        identifyCode:'610102198808081988'
    })      //创建用户

    admin.save(function(err){
        if(err){
            res.json({
                success:false,
                message:'用户创建失败'
            });
        }
        res.json({success:true,message:"用户创建成功"})

    })          //加入数据库，并判断是否成功
})

module.exports = router; //导出路由
