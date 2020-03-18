module.exports = app => {
    // 引入生成token插件
    // const jwt = require('jsonwebtoken')
    const jwtUtil = require("../../utils/jwt")

    const express = require("express")
    const router = express.Router()
    const db = require("../../plugins/db")
    const noticesdb = require("../../plugins/noticesdb")
    const topicsdb = require("../../plugins/topicsdb")
    const userdb = require("../../plugins/usersdb")
    const answerdb = require("../../plugins/answersdb")
    const adminuserdb = require("../../plugins/adminuserdb")


    // 引入express-ws实现websocket
    // var expressWs = require('express-ws');
    // expressWs(app)
    // 引入moment库
    const moment = require('moment')

    //话题管理
    const arr = ['agree', 'agree', 'comment', 'follow', 'heat', 'brower']
    //话题列表
    router.post('/topiclist', (req, res) => {

        console.log("打印创建时间")
        console.log(req.body.createtime)
        let count = [];
        let x = (req.body.pageNo - 1) * req.body.pageSize
        let y = req.body.pageSize
        let topic = req.body
        // 对提交数据处理
        for (let index in topic) {
            let obj = arr.find(e => {
                return e == index
            })
            if (obj) {
                if (topic[index] == '') {
                    topic[index] = 0
                }
            }
        }
        topicsdb.find(topic, x, y, [], (dbresult, fields) => {
            console.log(dbresult)
            let counts = []
            db.query(`select count(id) from topics`, [], (countresult, field) => {
                count = countresult[0]
                for (let index in count) {
                    counts.push(count[index])
                }
                console.log("打印记录总数")
                console.log(counts[0])

                let data = { 'success': true }
                data.data = dbresult
                data.pageCount = counts[0]

                // app.ws('/admin/api/ws', function (ws, req) {
                //     ws.send(JSON.stringify(data))
                //     ws.on('message', function (msg) {
                //         // 业务代码
                //         console.log("监听到了")
                //         console.log(msg)
                //     })
                //     ws.close()
                // })

                res.send(data)
            })
        })

    })
    //话题详情
    router.post('/topic/:id', (req, res) => {
        topicsdb.findById(req.params.id, [], (dbresult, fields) => {
            let data = {}
            data.success = true
            data.msg = '查询成功'
            data.data = dbresult[0]
            console.log("打印查询结果")
            res.send({ 'data': data })
        })
    })
    //新增话题
    router.post('/save/topic', (req, res) => {
        topicsdb.insert(req.body, [], (dbresult, fields) => {
            let data = {}
            data.success = true
            data.msg = '新增成功'
            console.log(dbresult)
            res.send({ 'data': data })
        })
    })

    //删除话题
    router.post('/delete/topic/:id', (req, res) => {
        topicsdb.deleteById(req.params.id, [], (dbresult, fields) => {
            let data = {}
            data.success = true
            data.msg = '删除成功'
            console.log("打印删除")
            console.log(dbresult)
            res.send({ 'data': data })
        })
    })

    //修改话题
    router.post('/update/topic/:id', (req, res) => {
        req.body.updatetime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        topicsdb.updateById(req.body, req.params.id, [], (dbresult, fields) => {
            let data = {}
            data.success = true
            data.msg = '修改成功'
            console.log('打印修改')
            console.log(dbresult)
            res.send({ 'data': data })
        })
    })

    //回答管理
    // 获取回答列表
    router.post('/answer/list', (req, res) => {
        let x = (req.body.pageNo - 1) * req.body.pageSize
        let y = req.body.pageSize
        answerdb.find(req.body, x, y, [], (dbresult, fields) => {
            answerdb.findCount('id', [], (result, fields) => {
                let data = {}
                let list = []
                for (let index in result[0]) {
                    list.push(result[0][index])
                }
                data.pageCount = list[0]
                data.success = true
                data.msg = '查询成功'
                data.list = dbresult
                data.pageNo = req.body.pageNo
                data.pageSize = req.body.pageSize
                res.send({ 'data': data })
            })
        })
    })

    //回答详情
    router.post('/answer/:id', [], (req, res) => {
        answerdb.findById(req.params.id, [], (dbresult, fields) => {
            let data = {}
            data.success = true
            data.msg = '查询成功',
                data.data = dbresult[0]
            res.send({ 'data': data })
        })
    })

    //新建回答
    router.post('/save/answer', (req, res) => {
        let notice = req.body
        notice.createtime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        notice.updatetime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        answerdb.insert(notice, [], (dbresult, fields) => {
            console.log("打印插入结果")
            console.log(dbresult)
            if (dbresult.affectedRows != 0) {
                let data = {}
                data.success = true
                data.msg = "新建成功"
                res.send({ 'data': data })
            }
        })
    })
    //删除回答
    router.post('/delete/answer/:id', [], (req, res) => {
        answerdb.deleteById(req.params.id, [], (dbresult, fields) => {
            if (dbresult.affectedRows != 0) {
                let data = {}
                data.success = true
                data.msg = "删除成功"
                res.send(data)
            }
        })
    })
    //修改回答
    router.post('/update/answer/:id', [], (req, res) => {
        req.body.updatetime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        answerdb.updateById(req.body, req.params.id, [], (dbresult, fields) => {
            if (dbresult.affectedRows != 0) {
                console.log(dbresult)
                let data = {}
                data.success = true
                data.msg = "修改成功"
                res.send({ 'data': data })
            }

        })
    })


    //内容管理
    //公告管理，公告列表
    router.post('/noticelist', (req, res) => {
        let x = (req.body.pageNo - 1) * req.body.pageSize
        let y = req.body.pageSize
        noticesdb.find(req.body, x, y, [], (dbresult, fields) => {
            noticesdb.findCount('id', [], (result, fields) => {
                let data = {}
                let list = []
                for (let index in result[0]) {
                    list.push(result[0][index])
                }
                data.pageCount = list[0]
                data.success = true
                data.msg = '查询成功'
                data.list = dbresult
                data.pageNo = req.body.pageNo
                data.pageSize = req.body.pageSize
                res.send({ 'data': data })
            })
        })
    })

    //公告详情
    router.post('/notice/:id', [], (req, res) => {
        noticesdb.findById(req.params.id, [], (dbresult, fields) => {
            let data = {}
            data.success = true
            data.msg = '查询成功',
                data.data = dbresult[0]
            res.send({ 'data': data })
        })
    })

    //新建公告
    router.post('/save/notice', (req, res) => {
        let notice = req.body
        notice.createtime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        notice.updatetime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        console.log(notice)
        console.log("打印notice")
        noticesdb.insert(notice, [], (dbresult, fields) => {
            console.log("打印插入结果")
            console.log(dbresult)
            if (dbresult.affectedRows != 0) {
                let data = {}
                data.success = true
                data.msg = "新建成功"
                res.send({ 'data': data })
            }
        })
    })
    //删除公告
    router.post('/delete/notice/:id', [], (req, res) => {
        noticesdb.deleteById(req.params.id, [], (dbresult, fields) => {

            if (dbresult.affectedRows != 0) {
                let data = {}
                data.success = true
                data.msg = "删除成功"
                res.send({ 'data': data })
            }
        })
    })
    //修改公告
    router.post('/update/notice/:id', [], (req, res) => {
        req.body.updatetime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        noticesdb.updateById(req.body, req.params.id, [], (dbresult, fields) => {
            if (dbresult.affectedRows != 0) {
                console.log(dbresult)
                let data = {}
                data.success = true
                data.msg = "修改成功"
                res.send({ 'data': data })
            }

        })
    })

    //数据分析
    // 后台用户管理
     //公告管理，公告列表
     router.post('/admin/user/list', (req, res) => {
        let x = (req.body.pageNo - 1) * req.body.pageSize
        let y = req.body.pageSize
        adminuserdb.find(x, y, [], (dbresult, fields) => {
            adminuserdb.findCount('username', [], (result, fields) => {
                let data = {}
                let list = []
                for (let index in result[0]) {
                    list.push(result[0][index])
                }
                data.pageCount = list[0]
                data.success = true
                data.msg = '查询成功'
                data.list = dbresult
                data.pageNo = req.body.pageNo
                data.pageSize = req.body.pageSize
                res.send({ 'data': data })
            })
        })
    })
    // router.post('/admin/user/list',(req,res) => {
    //     let x = (req.body.pageNo - 1) * req.body.pageSize
    //     let y = req.body.pageSize
    //     adminuserdb.find(x,y,[],(result,fields)=> {
    //         let data = {}
    //         data.success = true
    //         data.msg = "查询成功"
    //         data.list = result
    //         res.send(data)
    //     })
    // })
    
    //用户管理
    router.post('/user/:id', [], (req, res) => {
        userdb.findById(req.params.id, [], (dbresult, fields) => {
            let data = {}
            data.success = true
            data.msg = "查询成功"
            data.data = dbresult[0]
            res.send({ 'data': data })
        })
    })

    // 新增用户
    // 修改用户信息
    // 删除用户

    // 用户登录
    router.post('/admin/user/login', [], (req, res) => {
        let user = req.body
        adminuserdb.findByName(user.username, [], (result, error) => {
            if (result[0]) {
                console.log("打印登录用户")
                console.log(user)
                console.log(result[0])
                if(user.password == result[0].password){
                    console.log("用户已存在")
                    // let jwt = new jwtUtil(user.name)
                    let token = jwtUtil.generateToken(user.name)
                    let data = {}
                    data.userinfo = result[0]
                    data.success = true
                    data.msg = '登陆成功'
                    data.token = token
                    res.send(data)
                }else{
                    console.log("用户或密码错误")
                    let data = {}
                    data.success = false
                    data.msg = '用户或密码错误'
                    res.send(data)
                }
            } else {
                console.log("用户不存在")
                let data = {}
                data.success = false
                data.msg = "该账号不存在"
                // 账号不存在
                data.code = -2
                res.send(data)
            }
        })
    })


    router.get('/categories/:id', (req, res) => {
        db.query(`select * from test where id=${req.params.id}`, [], function (result, fields) {
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

    app.use('/admin/api', (req, res, next) => {
        if (req.url != '/admin/user/login' && req.url != '/user/register' && req.url != '/upload') {
            let token = req.headers.token;
            // let jwt = new JwtUtil(token);
            let result = jwtUtil.verifyToken(token);
            console.log('token验证')
            console.log(result)
            // 如果考验通过就next，否则就返回登陆信息不正确
            if (result == 'err') {
                console.log(result);
                res.send({success:false,status: 403, msg: '登录已过期,请重新登录' });
                // res.render('login.html');
            } else {
                next();
            }
        } else {
            next();
        }
    }, router)




    // 文件上传模块
    const multer = require("multer")
    const upload = multer({ dest: __dirname + '/../../uploads' })
    app.post('/admin/api/upload', upload.single('file'), async (req, res) => {
        console.log("监听图片上传")
        const file = req.file
        file.url = `http://localhost:8080/uploads/${file.filename}`
        // file.url = `http://39.106.159.120:8080/uploads/${file.filename}`
        res.send({ 'data': file })
    })

    // 用户登录token模块
    // app.post('/admin/api/login',jsonParser,(req,res)=>{
    //   const jwt = require('jsonwebtoken')
    //   const token = jwt.sign({ id: userid},app.get('secret'))
    //   res.send({token})
    // })



}
