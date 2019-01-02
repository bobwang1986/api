var express = require("express");
var TradeInfo = require("../models/tradeInfo");

var router = express.Router();


// 显示用户的交易信息
router.get('/',function(req,res){
    var {userId} = req.query;
    var whereObj = {};
    if(userId){
        var reg = new RegExp('^'+user+'$');
        whereObj = {userId:reg}
        TradeInfo.find(whereObj,function(err,infos){
            res.json({
                success:true,
                data:infos
            })
        })
    }else{
        res.json({
            success:false,
            data:null
        })
    }
})

// 买入
router.post('/',function(req,res){
    var {code,name,currentPrice,tradePrice,userId,tradeAmount} = req.body;
    //这里暂时缺少复杂的买入规则校验，目前只包含简单判空
    if(code && name && tradePrice && userId && tradeAmount){
        //查询该用户是否已经购买该股票
        var {code,userId} = req.body;
        TradeInfo.findOne({code:code,userId:userId},function(err,tradeInfo){
            if(err){
                res.json({
                    success:false,message:"买入查询失败"
                })
            }else{
              if(tradeInfo && tradeInfo.tradePrice && tradeInfo.tradeAmount){
                  //之前已购买过同一股票，计算当前购买均价
                  tradePrice = (tradeInfo.tradePrice*tradeInfo.tradeAmount + tradePrice*tradeAmount)/(tradeInfo.tradeAmount*1+tradeAmount*1)
                  //累加购买数量
                  tradeAmount = tradeInfo.tradeAmount*1 + tradeAmount*1
                  var _data = {
                      code:code,
                      name:name,
                      currentPrice:currentPrice,
                      tradePrice:tradePrice,
                      userId:userId,
                      tradeAmount:tradeAmount
                  }
                  TradeInfo.updateOne({code:code,userId:userId}, _data, function(err,tradeInfo){
                      if(err){
                          res.json({
                              success:false,message:"买入查询失败"
                          })
                      }else{
                          res.json({success:true,message:"买入更新成功"})
                      }
                  })
              }else{
                  var tradeInfoNew = new TradeInfo({
                      code,
                      name,
                      currentPrice,
                      tradePrice,
                      userId,
                      tradeAmount
                  });
                 tradeInfoNew.save(function(err){
                     if(err){
                         res.json({success:false,messafe:"买入失败"})
                     };
                     res.json({success:true,message:"买入成功"})
                 })
              }
            }
        })

    }else{
        res.json({success:false,messafe:"请完善买入信息"})
    }
})

// 卖出
router.post('/',function(req,res){
    var {code,name,currentPrice,tradePrice,userId,tradeAmount} = req.body;
    //这里暂时缺少复杂的买入规则校验，目前只包含简单判空
    if(code && name && tradePrice && userId && tradeAmount){
        //查询该用户是否已经购买该股票
        var {code,userId} = req.body;
        TradeInfo.findOne({code:code},{userId:userId},function(err,tradeInfo){
            if(err){
                res.json({
                    success:false,message:"更新分类失败"
                })
            }else{
              //卖出数量不得大于当前持有数量
              if(tradeInfo && tradeInfo.tradePrice && tradeInfo.tradeAmount && tradeInfo.tradeAmount >= tradeAmount){
                  //只卖部分持仓的情况
                  if(tradeInfo.tradeAmount > tradeAmount){
                      //之前已购买过同一股票，计算当前购买均价，了解业务后处理
                      //tradePrice = (tradeInfo.tradePrice*tradeInfo.tradeAmount - tradePrice*tradeAmount)/(tradeInfo.tradeAmount-tradeAmount)
                      //累加购买数量
                      tradeAmount = tradeInfo.tradeAmount-tradeAmount
                  }

              }
            }
        })
        var tradeInfoNew = new TradeInfo({
            code,
            name,
            currentPrice,
            tradePrice,
            userId,
            tradeAmount
        });
       tradeInfoNew.save(function(err){
           if(err){
               res.json({success:false,messafe:"买入失败"})
           };
           res.json({success:true,message:"买入成功"})
       })
    }else{
        res.json({success:false,messafe:"请完善买入信息"})
    }
})

module.exports = router;
