var express = require('express')
var router = express.Router()
var categoryControllers = require('../controllers/category.js')

//新建分类
router.post('/add',categoryControllers.addCate)
//获取分类
router.get('/list',categoryControllers.cateList)
//删除分类
router.delete('/delete/:id',categoryControllers.delCate)
//某个分类详情
router.get('/detail/:id',categoryControllers.detailCate)
//修改分类
router.put('/edit',categoryControllers.editCate)
//增加点击量
router.post('/click',categoryControllers.click)
module.exports = router