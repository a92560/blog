var {categoryModel} = require('../models/category.js')

var addCate = async (req,res,next) =>{
	const {name,createTime} = req.body
	new categoryModel({name,createTime}).save().then(() =>{
		res.send({
			status: 0,
			msg: '保存成功'
		})
	}).catch(() =>{
		res.send({
			status: -1,
			msg: '保存失败'
		})
	})
}

var cateList = async (req,res,next) =>{
	categoryModel.find().then((result,err) =>{
		if(err){
			res.send({
				status: -1,
				msg: '服务器错误,请稍后重试'
			})
		}else{
			res.send({
				status: 0,
				msg: '获取成功',
				data: {
					categoryList : result
				}
			})
		}
	})
}

var delCate = async (req,res,next) =>{
	let id = req.params.id
	categoryModel.findOneAndDelete({_id:id}).then(() =>{
		res.send({
			status: 0,
			msg: '删除成功'
		})
	}).catch(() =>{
		res.send({
			status: -1,
			msg: '删除失败'
		})
	})
}

var detailCate = async (req,res,next) =>{
	let id = req.params.id 
	categoryModel.findById(id).then((result,err) =>{
		if(err){
			res.send({
				status: -1,
				msg: '服务器错误,请稍后重试'
			})
		}else{
			res.send({
				status: 0,
				msg: '获取成功',
				data:{
					category: result
				}
			})
		}
	})
}

var editCate = async (req,res,next) =>{
	const {id,name,createTime} = req.body
	categoryModel.findOneAndUpdate({_id:id},{name,createTime}).then(() =>{
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

var click = async (req,res,next) =>{
	const id = req.body.id
	//console.log(id)
	categoryModel.findById(id).then((result) =>{
		//console.log(result)
		result.clickCount ++ 
		new categoryModel(result).save().then(() =>{
			res.send({
				status: 0,
				msg: '点击量增加成功'
			})
		}).catch(() =>{
			res.send({
				status:-1,
				msg: '服务器错误,请稍后重试'
			})
		})
	}).catch(() =>{
		res.send({
			status: -1,
			msg: '服务器错误,请稍后重试'
		})
	})
}
module.exports = {
	addCate,
	cateList,
	delCate,
	detailCate,
	editCate,
	click
}