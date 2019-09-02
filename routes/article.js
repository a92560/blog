var express = require('express')
var router = express.Router()
var articleControllers = require('../controllers/article.js')

//新增文章
router.post('/add',articleControllers.articleAdd)
//文章列表
router.get('/list',articleControllers.list)
//文章详情
router.get('/detail/:id',articleControllers.artiDetail)
//修改文章
router.put('/edit',articleControllers.artiEdit)
//指定类别的所有文章
router.get('/list/category',articleControllers.categoryList)

module.exports = router