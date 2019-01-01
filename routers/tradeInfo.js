var express = require("express");
var tradeInfo = require("../models/tradeInfo");

var router = express.Router();


// 显示所有
router.get('/',function(req,res){
    // 根据分类查找
    var {user} = req.userId;
    var whereObj = {};
    if(user){
        var reg = new RegExp('^'+user+'$');
        whereObj = {userId:reg}
    }
    //var reg = new RegExp('^'+category+'$')与/^category$/的区别
    //前者中的category是拼接上的一个变量，是动态的，
    //后者是静态的只能匹配'category'这个内容

    tradeInfo.find(whereObj,function(err,infos){
        res.json({
            success:true,
            data:infos
        })
    })
})

// 发布
// router.post('/',function(req,res){
//     // 结构赋值
//     var {title,body,author,tags,hidden,category} = req.body;
//     console.log(title);
//     if(title.length<3){
//         res.json({
//             success:false,
//             message:"标题长度不能小于3"
//         })
//     }
//
//     // 标签格式应该是对象数组
//
//     // 把标签分割成数组格式
//     var tagsArray = tags.split(",");
//     // 新建一个空数组，用来放对象
//     var tagsObjArray = [];
//     // 通过遍历的方式，把标签内容放入对象里面，通过push方式
//     tagsArray.forEach(function(v){
//         tagsObjArray.push({title:v});
//     })
//
//     var blog = new Blog({
//         title,
//         body,
//         author,
//         tags:tagsObjArray,
//         hidden,
//         category
//     });
//
//    blog.save(function(err){
//        if(err){
//            res.json({success:false,messafe:"发布失败"})
//        };
//        res.json({success:true,message:"发布成功"})
//    })
// })
//
// // 修改
// router.put('/',function(){
//     var {title,newTitle,body,newBody,author,newAuthor} = req.body;
//     if(newTitle.length<3){
//         res.json({
//             success:false,
//             message:"标题长度不能小于3"
//         })
//     }
//     blog.update({
//         title:title,
//         body:body,
//         author:author
//     },{
//         title:newTitle,
//         body:newBody,
//         author:newAuthor
//     },function(err,blog){
//         if(err){
//             res.json({
//                 success:false,
//                 message:"更新失败"
//             })
//         }
//     });
//     res.json({
//         success:true,
//         message:"更新成功"
//     })
//
// })
//
// // 删除
// router.delete('/',function(req,res){
//
//     // 解构赋值
//     var {title} = req.body;
//
//     Blog.remove({
//         title:title,
//     },function(err){
//         if(err){
//             res.json({
//                 success:false,messge:"删除失败！"
//             })
//         }
//     })
//     res.json({success:true,message:"删除成功！"})
// })

module.exports = router;
