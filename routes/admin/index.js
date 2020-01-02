module.exports = app=> {
    // 引入生成token插件
    const jwt = require('jsonwebtoken')
    const express = require("express")
    const router = express.Router()
    const db = require("../../plugins/db")
    // 引入第三方的插件，来解析post请求参数
    const bodyParser = require('body-parser')
    const jsonParser = bodyParser.json()
	
    //话题管理
    router.post('/topiclist',(req,res)=>{
	console.log(req.body)
	let count = 0;
        let x = (req.body.pageNo-1)* req.body.pageSize
        let y = req.body.pageSize
	db.query(`select id,title,abstract,topic,heat,agree,comment,follow,brower,userid,topiccover from topics limit ${x},${y}`,[],(dbresult,error)=>{
		console.log(dbresult)
		let data={'sucess':true,'data':dbresult}
		res.send(data)
	})
	db.query(`select count(id) from topics`,[],(dbresult,error)=>{
		count = dbresult[0]
		let counts = []
		for(let index in count){
			counts.push(count[index])
		}
		console.log("打印记录总数")
		console.log(counts[0])
	})
	
    })
  
    //回答管理
    //内容管理
    //数据分析
    //用户管理
    router.get('/categories/:id',(req,res)=>{
      db.query(`select * from test where id=${req.params.id}`,[],function(result,error){
        console.log(req.params)
        console.log(result)
        res.send(result)
      })
        // let params = req.query.params
        // console.log(params)
    })

    // 验证token的请求

    //router.post('/categories/token',(req,res,next)=>{
      //const token = String(req.headers.authorization || '').split(' ').pop()
     // const { id } = jwt.verify(token,app.get('secret'))
    //  next()
    //},(req,res)=>{
      //console.log("打印")
      //console.log(req.body)
    //})

    app.use('/admin/api',jsonParser,router)




    // 文件上传模块
    const multer = require("multer")
    const upload = multer({dest: __dirname + '/../../uploads'})
    app.post('/admin/api/upload',upload.single('file'),async (req,res)=>{
      console.log("监听图片上传")
      const file = req.file
      file.url = `http://localhost:3000/uploads/${file.filename}`
      res.send(file)
    })

    // 用户登录token模块
    // app.post('/admin/api/login',jsonParser,(req,res)=>{
    //   const jwt = require('jsonwebtoken')
    //   const token = jwt.sign({ id: userid},app.get('secret'))
    //   res.send({token})
    // })
}
