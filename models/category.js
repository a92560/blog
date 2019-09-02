var mongoose = require('mongoose')

var categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		index:{
			unique: true,
		}
	},
	createTime: {
		type: Date,
		default: Date.now()
	},
	clickCount: {
		type: Number,
		default: 0
	}
})

var categoryModel = mongoose.model('category',categorySchema)

module.exports = {
	categoryModel
}