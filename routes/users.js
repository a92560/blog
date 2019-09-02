var express = require('express');
var router = express.Router();
var svgCaptcha = require('svg-captcha')
var usersControllers = require('../controllers/users.js')
var multer = require('multer')
var upload = multer({dest:'public/uploads/'})
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//获取图形验证码
router.get('/svg-captcha',usersControllers.getSvgCaptcha)
//注册
router.post('/register',usersControllers.register)
//发送验证码短信
router.get('/sendcode', usersControllers.sendcode)
//登录验证
router.post('/login',usersControllers.login)
//退出登录
router.get('/logout',usersControllers.logout)
//更换用户头像
router.post('/updateAvatar',upload.single('file'),usersControllers.updateAvatar)
//获取用户信息
router.get('/getUser',usersControllers.getUser)
//用户发表评论
router.post('/comment',usersControllers.comment)

module.exports = router;
