# api
a simple node.js rest api with mongo

## 添加管理员
post     host:8080/addUser

## 登录
post     host:8080/login

## 股票基本信息维护，前端仅调用了get获取所有股票列表，其他接口目前仅限于数据维护
get      host:8080/stock
post     host:8080/stock
put      host:8080/stock
delete   host:8080/stock

## 股票交易信息接口，包括获取已交易列表，买入以及卖出
get      host:8080/tradeInfo?userId=admin
post     host:8080/tradeInfo/buy
post     host:8080/tradeInfo/sell    
