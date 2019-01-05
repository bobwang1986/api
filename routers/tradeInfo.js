var express = require("express");
var TradeInfo = require("../models/tradeInfo");
var Stock = require("../models/stock");

var router = express.Router();


// 显示用户的交易信息
router.get('/',function(req,res){
    var {userId} = req.query;
    var whereObj = {};
    if(userId){
        var reg = new RegExp('^'+userId+'$');
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
router.post('/buy',function(req,res){
    var {code,name,currentPrice,tradePrice,userId,tradeAmount} = req.body;
    //这里暂时缺少复杂的买入规则校验，目前只包含简单判空
    if(code && name && tradePrice && userId && tradeAmount){
        var {code,userId} = req.body;
        //先查询该股票是否存在
        Stock.findOne({code:code},function(err,item){
          if(item && item.code){
            name = item.name
            //查询该用户是否已经购买该股票
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
                          name:item.name,
                          currentPrice:currentPrice,
                          tradePrice:tradePrice,
                          userId:userId,
                          tradeAmount:tradeAmount
                      }
                      //更新买入信息
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
                      // 新买入一支股票
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
            res.json({
                success:false,message:"该股票代码不存在"
            })
          }
        })

    }else{
        res.json({success:false,messafe:"请完善买入信息"})
    }
})

// 卖出
router.post('/sell',function(req,res){
    var {code,name,currentPrice,tradePrice,userId,tradeAmount} = req.body;
    //这里暂时缺少复杂的买入规则校验，目前只包含简单判空
    if(code && name && tradePrice && userId && tradeAmount){
        var {code,userId} = req.body;
        //先查询该股票是否存在
        Stock.findOne({code:code},function(err,item){
          if(item && item.code){

            //查询该用户是否已经购买该股票
            TradeInfo.findOne({code:code,userId:userId},function(err,tradeInfo){
                if(err){
                    res.json({
                        success:false,message:"卖出查询失败"
                    })
                }else{
                  if(tradeInfo && tradeInfo.tradePrice && tradeInfo.tradeAmount){
                      //卖掉部分股票，计算当前购买均价，此逻辑暂时未加
                      //tradePrice = (tradeInfo.tradePrice*tradeInfo.tradeAmount + tradePrice*tradeAmount)/(tradeInfo.tradeAmount*1+tradeAmount*1)
                      //减去购买数量
                      tradeAmount =  tradeInfo.tradeAmount*1 - tradeAmount*1
                      if(tradeAmount < 0){
                          res.json({
                              success:false,message:"卖出数量不得大约持有数量"
                          })
                      }else{
                        var _data = {
                            code:code,
                            name:name,
                            currentPrice:currentPrice,
                            tradePrice:tradePrice,
                            userId:userId,
                            tradeAmount:tradeAmount
                        }
                        //更新买入信息
                        TradeInfo.updateOne({code:code,userId:userId}, _data, function(err,tradeInfo){
                            if(err){
                                res.json({
                                    success:false,message:"卖出查询失败"
                                })
                            }else{
                                res.json({success:true,message:"卖出更新成功"})
                            }
                        })
                      }
                  }else{
                      res.json({
                          success:false,message:"未持有该股票，无法卖出"
                      })
                  }
                }
            })
          }else{
            res.json({
                success:false,message:"该股票代码不存在"
            })
          }
        })

    }else{
        res.json({success:false,messafe:"请完善卖出信息"})
    }
})

module.exports = router;
