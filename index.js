var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');

var corsOptions = {
	'origin' : '*',
	'allowedHeaders' : 'Content-Type,X-Requested-With,accept,Origin,Access-Control-Request-Method,Access-Control-Request-Headers,token',
	'exposedHeaders' : 'token'
};

var jwt = require('jsonwebtoken');//用来创建和确认用户信息摘要
var config = require('./config'); //读取配置文件config.js信息

var setUser = require('./routers/userManage');// 导入路由文件
var login = require('./routers/login');// 导入路由文件

//一些配置
var port = process.env.PORT || 8080; // 设置启动端口
mongoose.connect(config.database); // 连接数据库
app.set('superSecret', config.secret); // 设置app 的超级密码--用来生成摘要的密码

//用body parser 来解析post和url信息中的参数
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors(corsOptions));

// 使用 morgan 将请求日志打印到控制台
app.use(morgan('dev'));

//路由
//基础路由
app.get('/',function(req,res){
    res.send("这里是nodejs+mongodb编写restfulAPI的笔记！");
})

app.use('/addUser',setUser);   //添加一个用户
app.use('/login',login);   //登录 api

// 启动服务
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
