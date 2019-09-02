var express = require('express')
var router = express.Router()
var adminControllers = require('../controllers/admin.js')

//获取用户信息
router.get('/getUser',adminControllers.getUser)
//冻结用户操作
router.put('/freeze',adminControllers.freezeUser)
//删除用户操作
router.delete('/delete/:id',adminControllers.deleteUser)

module.exports = router