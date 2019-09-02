var {articleModel} = require('../models/article.js')

var articleAdd = async (req,res,next) =>{
	const {title,content,description,createTime,category,user} = req.body
	new articleModel({title,content,description,createTime,category,user}).save().then((result,err) =>{
		if(err){
			console.log(err)
			res.send({
				status: -1,
				msg: '保存失败'
			})
		}else{
			console.log(result)
			res.send({
				status: 0,
				msg: '保存成功'
			})
		}
	})
}

var list = async (req,res,next) =>{
	articleModel.find().populate([{path:'user', select: 'username'},{path:'category',select:'name'}]).then((result,err) =>{
		if(err){
			console.log(err)
			res.send({
				status: -1,
				msg: '获取失败'
			})
		}else{
			//console.log(result[0].user)
			res.send({
				status: 0,
				msg: '获取成功',
				data:{
					articleList:result,
					username: result[0].user.username,
					name: result[0].category.name
				}
			})
		}
	})
}

var artiDetail = async (req,res,next) =>{
	let id = req.params.id
	articleModel.findById(id).then((result,err) =>{
		if(err){
			console.log(err)
			res.send({
				status: -1,
				msg: '查询失败'
			})
		}else{
			console.log(result)
			res.send({
				status: 0,
				msg: '查询成功',
				data: {
					article: result
				}
			})
		}
	})
}

var artiEdit = async (req,res,next) =>{
	const {id,title,description,content,category,user,createTime} = req.body

	articleModel.findOneAndUpdate({_id:id},{title,description,createTime,content,category,user}).then(() =>{
		res.send({
			status: 0,
			msg: '修改成功'
		})
	}).catch(() =>{
		res.send({
			status: -1,
			msg: '修改失败'
		})
	})
}

var categoryList = async (req,res,next) =>{
	let id = req.query.id
	let user = req.query.user
	console.log(id)
	console.log(user)
	articleModel.find().populate({path:'user',select:'username'}).then((result,err) =>{
		if(err){
			console.log(err)
			res.send({
				status: -1,
				msg: '获取失败'
			})
		}else{
			console.log(result)
			res.send({
				status: 0,
				msg: '获取成功',
				data:{
					articleList : result
				}
			})
		}
	}).catch(() =>{
		res.send({
			status: -2,
			msg: '服务器错误,请稍后重试'
		})
	})
}
module.exports = {
	articleAdd,
	list,
	artiDetail,
	artiEdit,
	categoryList
}