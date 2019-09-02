var mongoose = require('mongoose')

var articleSchema = new mongoose.Schema({
	category:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'category'
	},

	title: {
		type: String,
		required: true
	},

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	},

	createTime: {
		type: Date,
		default: Date.now()
	},

	views: {
		type: Number,
		default: 0,
	},

	description: {
		type: String,
		default: ''
	},

	content: {
		type: String,
		required: true
	},

	comments: {
		type: Array,
		default: []
	}
})

var articleModel = mongoose.model('article',articleSchema)

module.exports = {
	articleModel
}