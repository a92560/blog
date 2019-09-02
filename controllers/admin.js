var {userModel} = require('../models/user.js')


var getUser = async (req,res,next) =>{
	var page = Number(req.query.page || 1);
    var limit = Number(req.query.limit || 10);
    var pages = 0;

    userModel.countDocuments().then(function(count) {
    	//console.log(count)
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min( page, pages );
        //取值不能小于1
        page = Math.max( page, 1 );
        var skip = (page - 1) * limit;
        console.log(`page:${page}  pages:${pages}  skip:${skip}`)
        userModel.find().limit(limit).skip(skip).then(function(users) {
            if(users){
				res.send({
					status : 0,
					msg : 'ok',
					data : {
						userList : users,
						totalCount: count,
		                pages: pages,
		               	page: page
					}
				})
			}else{
				res.send({
					status : -1,
					msg: '获取失败'
				})
			}
        });
    }).catch((err) =>{
    	res.send({
    		status: -1,
    		msg:'服务器错误'
    	})
    })
}

var freezeUser = async (req,res,next) =>{
  const {id,isFreeze} = req.body
  console.log(id)
  userModel.updateOne({_id:id},{isFreeze:isFreeze}).then(() =>{
    res.send({
      status: 0,
      msg: '删除成功'
    })
  }).catch(() =>{
    res.send({
      status: -1,
      msg: '服务器错误,请稍后重试'
    })
  })
}


var deleteUser = async (req,res,next) =>{
	const id = req.params.id
	console.log(id)
	userModel.findOneAndDelete({_id:id}).then(() =>{
		res.send({
			status: 0,
			msg: '删除成功'
		})
	}).catch(() =>{
		res.send({
			status: -1,
			msg: '服务器错误,请稍后重试'
		})
	})
}
module.exports = {
	getUser,
	freezeUser,
	deleteUser
}