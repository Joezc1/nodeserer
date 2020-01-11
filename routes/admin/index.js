module.exports = app => {
    // 引入生成token插件
    const jwt = require('jsonwebtoken')
    const express = require("express")
    const router = express.Router()
    const db = require("../../plugins/db")
    const noticesdb = require("../../plugins/noticesdb")
    // 引入第三方的插件，来解析post请求参数
    const bodyParser = require('body-parser')
    const jsonParser = bodyParser.json()
    // 引入moment库
    const moment = require('moment')
    //话题管理

    //话题列表
    router.post('/topiclist', (req, res) => {
        console.log(req.body)
        let count = [];
        let x = (req.body.pageNo - 1) * req.body.pageSize
        let y = req.body.pageSize
        db.query(`select id,title,abstract,topic,heat,agree,comment,follow,brower,userid,topiccover from topics limit ${x},${y}`, [], (dbresult, error) => {
            console.log(dbresult)
            let counts = []
            db.query(`select count(id) from topics`, [], (countresult, error) => {
                count = countresult[0]
                for (let index in count) {
                    counts.push(count[index])
                }
                console.log("打印记录总数")
                console.log(counts[0])

                let data = { 'success': true }
                data.data = dbresult
                data.pageCount = counts[0]
                res.send(data)
            })
        })

    })
    //话题详情
    router.post('/topic/:id', (req, res) => {
        db.query(`select id,title,abstract,topic,heat,agree,comment,follow,brower,userid,topiccover from topics where id=${req.params.id}`, [], (result, error) => {
            let data = {}
            data.success = 'true'
            data.data = result[0]
            res.send(data)
        })
    })
    //新增话题
    router.post('/save/topic', (req, res) => {
        db.query('insert into topics(title,abstract,topic,userid,topiccover,createtime) values("' + req.title + '","' + req.abstract + '","' + req.topic + '","' + req.userid + '","' + req.topiccover + '","' + req.creatime + '")', [], (result, error) => {
            console.log("打印新增话题结果")
            console.log(result)
        })
    })

    //删除话题
    router.post('/delete/topic/:id', (req, res) => {
        db.query(`delete from topics where id=${req.id}`, [], (result, error) => {
            console.log("打印删除结果")
            console.log(result)
        })
    })

    //修改话题
    router.post('/update/topic/:id', (req, res) => {
        db.query('update topic set title="' + req.title + '",abstract=' + '"' + req.abstract + '",topic=' + '"' + req.topic + '",userid=' + '"' + req.userid + '",topiccover=' + '"' + req.topiccover + '",createtime=' + req.createtime + 'where id=' + req.params.id, [], (result, error) => {
            console.log("打印修改结果")
            console.log(result)
        })
    })

    //回答管理
    //内容管理

    //公告管理，公告列表
    router.post('/noticelist', (req, res) => {
        let x = (req.body.pageNo - 1) * req.body.pageSize
        let y = req.body.pageSize
        noticesdb.find(x,y,[],(dbresult,error)=>{
            // if(error){
                // res.send({'msg':error})
            // }else{
                let data = {}
                data.success = true
                data.msg = '查询成功'
                data.list = dbresult
                res.send({'data':data})
            // }
        })
    })

    //公告详情
    router.post('/notice/:id', [], (req, res) => {
        noticesdb.findById(req.params.id,[],(dbresult,error)=>{
            let data = {}
            data.success = true
            data.msg = '查询成功',
            data.data = dbresult[0]
            res.send({'data':data})
        })
    })

    //新建公告
    router.post('/save/notice', (req, res) => {
        let notice = req.body
        notice.createtime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        notice.updatetime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        console.log(notice)
        console.log("打印notice")
        noticesdb.insert(notice,[],(dbresult,error)=>{
            console.log("打印插入结果")
            console.log(dbresult)
            if(error){
                res.send({'msg':error})
            }else{
                if(dbresult.affectedRows!=0){
                    let data = {}
                    data.success = true
                    data.msg = "新建成功"
                    res.send({'data':data})
                }  
            }
        })
    })
    //删除公告
    router.post('/delete/notice/:id',[],(req,res)=>{
        noticesdb.deleteById(req.params.id,[],(dbresult,error)=>{
            if(error){
                res.send({'msg':error})
            }else{
                if(dbresult.affectedRows!=0){
                    let data = {}
                    data.success = true
                    data.msg = "删除成功"
                    res.send({'data':data})
                }
            }
        })
    })
    //修改公告
    router.post('/update/notice/:id', [], (req,res) => {
        req.body.updatetime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        noticesdb.updateById(req.body,req.params.id,[],(dbresult,error)=>{
            if(error){
                res.send({'msg':error})
            }else{
                if(dbresult.affectedRows!=0){
                    console.log(dbresult)
                    let data = {}
                    data.success = true
                    data.msg = "修改成功"
                    res.send({'data':data})
                }
            }
        })
    })

    //数据分析
    //用户管理
    router.get('/categories/:id', (req, res) => {
        db.query(`select * from test where id=${req.params.id}`, [], function (result, error) {
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

    app.use('/admin/api', jsonParser, router)




    // 文件上传模块
    const multer = require("multer")
    const upload = multer({ dest: __dirname + '/../../uploads' })
    app.post('/admin/api/upload', upload.single('file'), async (req, res) => {
        console.log("监听图片上传")
        const file = req.file
        file.url = `http://localhost:8080/uploads/${file.filename}`
        //   file.url = `http://39.106.159.120:8080/uploads/${file.filename}`
        res.send({ 'data': file })
    })

    // 用户登录token模块
    // app.post('/admin/api/login',jsonParser,(req,res)=>{
    //   const jwt = require('jsonwebtoken')
    //   const token = jwt.sign({ id: userid},app.get('secret'))
    //   res.send({token})
    // })
}
