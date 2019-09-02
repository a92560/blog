var mongoose = require('mongoose')
var {Head} = require('../config/Mongoose.js')
var url = require('url')

var userSchema = new mongoose.Schema({
	username:{
		type: String,
		required: true,
		index: {
			unique: true
		}
	},
	password:{
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true
	},
	createTime:{
		type: Date,
		default: Date.now()
	},
	isAdmin:{
		type:Boolean,
		default:false
	},
	isFreeze:{
		type:Boolean,
		default:false
	},
	avatar: {
		type:String,
		default: url.resolve(Head.BASE_URL,'default.jpg')
	}
})

var userModel = mongoose.model('user',userSchema)


module.exports ={
	userModel
}