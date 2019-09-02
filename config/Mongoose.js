var mongoose = require('mongoose')

var Mongoose = {
	url : 'mongodb://localhost:27017/myblog',
	connect(){
		mongoose.connect(this.url,{
			useNewUrlParser: true,
			useFindAndModify: true,
			useCreateIndex: true,
		}, (err)=>{
			if(err){
				console.log('数据库连接失败')
			}else{
				console.log('数据库连接成功')
			}
		})
	}
}

var Head = {
	BASE_URL: 'http://localhost:5000/uploads/'
}

module.exports = {
	Mongoose,
	Head
}