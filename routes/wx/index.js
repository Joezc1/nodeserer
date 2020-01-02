 const db = require("../../plugins/db")

module.exports = app=> {
    // 生成token的插件
    const jwt = require('jsonwebtoken')
    const express = require("express")
    // 引入express的routes
    const router = express.Router()
    //const db = require("../../plugins/db")
    const bodyParser = require('body-parser')
    const jsonParser = bodyParser.json()
    //小程序的登录要用到的信息
    const request = require("request")
    const appid = "wx277170f5b81d6ef2"
    const appSecret = "28ce2c515d202c9944d581615683927a"
    
    //内容管理,
	//获取热榜数据,分页获取
    router.post('/topics/heatlist',(req,res)=>{
	 // limit (${req.body.pageNo}-1)*${req.body.pageSize},${req.body.pageSize}
	  let x = (req.body.pageNo-1)* req.body.pageSize
	  let y = req.body.pageSize
      db.query(`SELECT a.id,a.title,a.heat,a.topiccover FROM topics As a order by a.heat DESC limit ${x},${y}`,[],function(dbresult,error){
		//if(error){
		//	res.send({message: "操作失败"})
		//}
        console.log(req.body)
		
		res.send({data:dbresult,success:true})
      })
    })
	//获取推荐列表数据
    router.post('/topics',(req,res)=>{
	  let x = (req.body.pageNo-1)* req.body.pageSize
	  let y = req.body.pageSize
      db.query(`SELECT a.id,a.title,a.abstract,a.topic,a.heat,a.agree,a.comment,a.follow,a.brower,b.nickname,b.cover FROM topics AS a,users AS b WHERE a.userid=b.userid limit ${x},${y}`,[],function(dbresult,error){
        console.log(req.params)
        console.log(dbresult)
		res.send({data:dbresult,success:true})
      })
    })
	
    //查询话题详情
    router.post('/topic/:id',(req,res)=>{
	console.log("打印id"+req.params.id)
	db.query(`SELECT a.id,a.title,a.abstract,a.topic,a.heat,a.agree,a.comment,a.follow,a.brower FROM topics AS a WHERE a.id=${req.params.id}`,[],(dbresult,error)=>{
		console.log(dbresult)
		res.send({data:dbresult[0],success:true})
	})
    })
    // 验证token的请求

    // router.post('/categories/token',(req,res,next)=>{
    //   const token = String(req.headers.authorization || '').split(' ').pop()
    //   const { id } = jwt.verify(token,app.get('secret'))
    //   next()
    // }, jsonParser,(req,res)=>{
    //   console.log("打印")
    //   console.log(req.body)
    // })

    app.use('/wx/api',jsonParser,router)


    // 文件上传模块
    const multer = require("multer")
    const upload = multer({dest: __dirname + '/../../uploads'})
    app.post('/wx/api/upload',upload.single('file'),async (req,res)=>{
      console.log("监听图片上传")
      const file = req.file
      file.url = `http://39.106.159.120:8080/uploads/${file.filename}`
      res.send(file)
    })
	

    //用户模块,微信授权登陆
   router.post('/login/:code',(req,res)=>{
	let user = {}
       const url = "https://"+`api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${appSecret}&js_code=${req.params.code}&grant_type=authorization_code`
       request(url ,(err,wxres,body)=>{
	 console.log("打印小程序登录参数")
	 let wxbody = JSON.parse(body)
	 console.log("打印JSON对象")
  	 console.log(wxbody)
	 //向users表插入数据
	 console.log("打印登录请求参数")
	 console.log(req.body)
	 db.query("select userid,nickname,cover,sex,birthday,grade,isComplete from users where userid="+"'"+wxbody.openid+"'",[],(dbresult,error)=>{
           user = dbresult[0]
	   console.log("打印user用户")
	   user = dbresult[0]
	   if(user){
	     console.log("用户存在")
	     res.send({data:{wxbody,user},success:true})
	   }else{
	     console.log("新用户")
	     let imgurl = req.body.avatarUrl.substring(0,8)
	     let imgstr = req.body.avatarUrl.substring(8)
	     console.log(imgurl)
	     console.log(imgstr)
	     let img = imgurl+imgstr
	     db.query('insert into users(userid,nickname,cover) values("'+wxbody.openid+'","'+req.body.nickName+'","'+img+'")',[],(inresult,inerror)=>{
	       console.log("新用户插入结果")
		console.log(inresult)
		if(inresult.affectedRows==1){
		     db.query("select userid,nickname,cover,sex,birthday,grade,isComplete from users where userid="+"'"+wxbody.openid+"'",[],(dbresult2,error2)=>{
			if(dbresult2){
				res.send({data:{wxbody:wxbody,user:dbresult2},success:true})
			}
		     })
		}else{
		  res.send({message:'插入失败'})
		}
	     })    
	   }
         })
        // res.send({data:wxbody,success:true})
       })
     })
	
   app.use('/wx/api',jsonParser,router)
}
