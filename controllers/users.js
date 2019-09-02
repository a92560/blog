var svgCaptcha = require('svg-captcha')
var {Head} = require('../config/Mongoose.js')
var {userModel} = require('../models/user.js')
var {articleModel} = require('../models/article.js')
var sms_util = require('../utils/sms_util.js')
var md5 = require('blueimp-md5')
var fs = require('fs')
var url = require('url')


var getSvgCaptcha = async (req,res,next) =>{
  //req.session.captcha = ''
	//验证码有两个属性  一个是data  svg图片  另一个是text 验证码字符
	var captcha = svgCaptcha.create({
		// 翻转颜色
        inverse: false,
        // 字体大小
        fontSize: 48,
        // 噪声线条数
        noise: 2,
        // 宽度
        width: 100,
        // 高度
        height: 36,
	});
	if(!captcha){
		return false
	}
  console.log(captcha.text)
	req.session.captcha = captcha.text.toLowerCase()
  res.type('svg');
  console.log(req.session.captcha)
  res.status(200).send(captcha.data);
}


var register = async (req,res,next) =>{
    let {username,password,phone,code,createTime} = req.body
    //console.log(username)
    password = md5(password)
    console.log(`username:${username}                    password:${password}  phone:${phone}  code:${code}`)
    //先判断是不是请求短信验证码的手机  和验证码是否正确
    if(req.session.phone !== phone && req.session.code !== code){
        res.send({
            status: -2,
            msg: '手机号或验证码不正确'
        })
    }
    userModel.findOne({$or:[{phone:phone},{username:username}]}).then((result,err) =>{
        if(err){
            console.log(err)
            console.log(result)
            res.send({
                status: -2,
                msg: '服务器错误,请稍后重试'
            })
        }else if(result){
            res.send({
                status: -2,
                msg: '用户名或手机已被注册'
            })
        }else{
            //保存用户数据
            new userModel({username,password,createTime,phone}).save((err1,result1) =>{
                if(err1){
                    res.send({
                        //console.log(err1)
                        status: -2,
                        msg: '服务器错误,请稍后重试'
                    })
                }else{
                    res.send({
                        status: 0,
                        msg: '注册成功',
                    })
                }
            })
            
        }
    })
}

var sendcode = async (req,res,next) =>{
  //1. 获取请求参数数据
  var phone = req.query.phone;

  //判断是否已经注册过了
  /*userModel.findOne({phone}).then((result,err) =>{
    if(err){
        return
        res.status(403).send({
          status: -2,
          msg: '服务器错误,请稍后重试'
        })
        //return false
    }else{
        return
        res.send({
          status: -1,
          msg: '手机号已经被注册过了'
        })
        //return false
    }
  })*/
  const result = await userModel.findOne({phone})
  if(result){
    // res.status(403).send({
    //   status: -1,
    //   msg: '手机号已经被注册过了'
    // })
    return 
  }
  //2. 处理数据
  //生成验证码(6位随机数)
  var code = sms_util.randomCode(6);
  //持久化存储手机号和短信验证码
  req.session.phone = phone
  req.session.code = code
  //发送给指定的手机号
  console.log(`向${phone}发送验证码短信: ${code}`);
  sms_util.sendCode(phone, code, function (success) {//success表示是否成功
    if (success) {
      console.log('保存验证码: ', phone, code)
      res.send({
        status: 0,
        msg: '短信验证码发送成功'
      })
    } else {
      res.send({
        status: -1,
        msg: '短信验证码发送失败'
      })
    }
  })
}

var login = async (req,res,next) =>{
  var {username,password,captcha} = req.body
  /*console.log(req.session.captcha)
  console.log(captcha)
  console.log(typeof captcha)
  console.log(typeof req.session.captcha)*/
  if(req.session.captcha !== captcha){
    res.send({
      status: -1,
      msg: '验证码不正确'
    })
  }else{
    password = md5(password)
    console.log(password)
    console.log(typeof password)

    userModel.findOne({username:username,password:password}).then((result,err) =>{
      if(err){
        //console.log(err)
        res.send({
          status: -2,
          msg: '用户名或密码错误'
        })
      }else if(result.isFreeze){
        res.send({
          status: -3,
          msg: '账号已被冻结'
        })
      }else{
        req.session.username = username
        req.session.avatar = result.avatar
        req.session.isAdmin = result.isAdmin
        req.session._id = result._id
        console.log(result)
        res.send({
          status: 0,
          msg: '登录成功',
          data : {
            username: username,
            isAdmin: result.isAdmin,
            avatar: result.avatar,
            id : req.session._id
          }
        })
      }
    })
  }
  //console.log(password)
  
  /*userModel.find({username,password},function(err,result) {
    if(err){
      console.log(1)
      console.log(err)
    }else{
      console.log(2)
      console.log(result)
    }
  })*/
}

var logout = async (req,res,next) =>{
  req.session.username = ''
  res.send({
    status: 0,
    msg: '退出成功'
  })
}

var updateAvatar = async (req,res,next) =>{
  //console.log(req.file)
  /*userModel.update({username},{avatar}).then((result,err) =>{
    if (err) {
      res.send({
        status: -1,
        msg: '服务器错误,请稍后重试'
      })
    }
  })*/

  var extnamePosition = req.file.originalname.lastIndexOf('.')
  var mimeType = req.file.originalname.substring(extnamePosition)
  var username = req.session.username
  var avatar = url.resolve(Head.BASE_URL,req.session.username+mimeType)
  console.log(mimeType)
  await fs.rename('public/uploads/' + req.file.filename, 'public/uploads/' + req.session.username + mimeType,(err) =>{
    if(err){
      console.log(err)
    }else{
      userModel.updateOne({username},{avatar:avatar}).then((result,err) =>{
        if (err) {
          res.send({
            status: -1,
            msg: '服务器错误,请稍后重试'
          })
        }else{
          //console.log(result)
          req.session.avatar = avatar
          res.send({
            status: 0,
            msg: '头像上传成功',
            avatar: req.session.avatar
          })
        }
      })
    }
  })
}

var getUser = async (req,res,next) =>{
  if(req.session.username && req.session.avatar && req.session.isAdmin){
    console.log(req.session.avatar)
    res.send({
      status: 0,
      msg: '获取用户信息成功',
      data : {
            username: req.session.username,
            isAdmin: req.session.isAdmin,
            avatar: req.session.avatar,
            id: req.session._id
          }
    })
  }else{
    res.send({
      status: -1,
      msg: '获取用户信息失败'
    })
  }
}

var comment = async (req,res,next) =>{
  let {articleId,createTime,content,username} = req.body
  articleModel.findOne({_id:articleId}).then((result,err) =>{
    if(err){
      res.send({
        status: -1,
        msg: '服务器错误,请稍后重试'
      })
    }else{
      result.comments.push({username,createTime,content})
      console.log(result)
      new articleModel(result).save().then(() =>{
        res.send({
          status: 0,
          msg: '评论成功'
        })
      }).catch(() =>{
        res.send({
          status: -2,
          msg: '服务器错误,请稍后重试'
        })
      })
    }
  })
}

module.exports = {
	getSvgCaptcha,
    register,
    sendcode,
    login,
    logout,
    updateAvatar,
    getUser,
    comment
}