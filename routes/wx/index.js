const db = require("../../plugins/db")

module.exports = app => {
  // 生成token的插件
  const jwt = require('jsonwebtoken')
  const express = require("express")
  // 引入express的routes
  const router = express.Router()
  //const db = require("../../plugins/db")

  //小程序的登录要用到的信息
  const request = require("request")
  const appid = "wx277170f5b81d6ef2"
  const appSecret = "28ce2c515d202c9944d581615683927a"
  const topicdb = require("../../plugins/topicsdb")
  const answerdb = require("../../plugins/answersdb")
  const userdb = require("../../plugins/usersdb")
  const noticedb = require("../../plugins/noticesdb")
  // 文件上传模块
  const multer = require("multer")
  const upload = multer({ dest: __dirname + '/../../uploads' })

  // 引入moment库
  const moment = require('moment')

  //话题管理
  //获取热榜数据,分页获取
  router.post('/topics/heatlist', (req, res) => {
    // limit (${req.body.pageNo}-1)*${req.body.pageSize},${req.body.pageSize}
    let x = (req.body.pageNo - 1) * req.body.pageSize
    let y = req.body.pageSize
    db.query(`SELECT a.id,a.title,a.heat,a.topiccover FROM topics As a order by a.heat DESC limit ${x},${y}`, [], function (dbresult, error) {
      //if(error){
      //	res.send({message: "操作失败"})
      //}
      console.log(req.body)

      res.send({ data: dbresult, success: true })
    })
  })
  //获取推荐列表数据
  router.post('/topics', (req, res) => {
    let x = (req.body.pageNo - 1) * req.body.pageSize
    let y = req.body.pageSize
    let sql = `SELECT a.id,a.title,a.abstract,a.topic,a.heat,a.agree,a.comment,a.userid,a.follow,a.brower,a.topiccover,a.createtime,a.updatetime,a.userid,b.nickname,b.cover FROM topics AS a,users AS b WHERE a.userid=b.userid limit ${x},${y}`
    db.query(sql, [], function (dbresult, error) {
      console.log("打印获取列表数据")
      console.log(sql)
      console.log(dbresult)
      res.send({ data: dbresult, success: true })
    })
  })
  // 收藏话题
  router.post('/follow/topic', (req, res) => {
    topicdb.followTopic(req.body, [], (dbresult, error) => {
      if (error) {
        let data = {}
        data.msg = error
        res.send(data)
      } else {
        let data = {}
        data.success = true
        data.msg = '关注成功'
        res.send(data)
      }
    })
  })
  // 赞同话题
  router.post('/agree/topic', (req, res) => {
    topicdb.agreeTopic(req.body, [], (dbresult, error) => {
      if (error) {
        let data = {}
        data.msg = error
        res.send(data)
      } else {
        let data = {}
        data.success = true
        data.msg = '赞同成功'
        res.send(data)
      }
    })
  })

  // 话题浏览
  router.post('/topic/brower/:id', (req, res) => {
    req.body.brower = req.body.brower * 1 + 1
    console.log("话题浏览")
    topicdb.updateById(req.body, req.params.id, [], (dbresult, error) => {
      if (error) {
        let data = {}
        data.msg = error
        res.send(data)
      } else {
        let data = {}
        data.success = true
        data.msg = '修改成功'
        res.send(data)
      }
    })
  })
  // 话题赞同数
  router.post('/topic/agree/:id', (req, res) => {
    req.body.agree = req.body.agree * 1 + 1
    topicdb.updateById(req.body, req.params.id, [], (dbresult, error) => {
      if (error) {
        let data = {}
        data.msg = error
        res.send(data)
      } else {
        let data = {}
        data.success = true
        data.msg = '修改成功'
      }
    })
  })
  // 话题评论数
  router.post('/topic/comment/:id', (req, res) => {
    req.body.comment = req.body.comment * 1 + 1
    topicdb.updateById(req.body, req.params.id, [], (dbresult, error) => {
      if (error) {
        let data = {}
        data.msg = error
        res.send(data)
      } else {
        let data = {}
        data.success = true
        data.msg = '修改成功'
      }
    })
  })
  // 话题关注数
  router.post('/topic/follow/:id', (req, res) => {
    req.body.follow = req.body.follow * 1 + 1
    topicdb.updateById(req.body, req.params.id, [], (dbresult, error) => {
      if (error) {
        let data = {}
        data.msg = error
        res.send(data)
      } else {
        let data = {}
        data.success = true
        data.msg = '修改成功'
      }
    })
  })
  // 新建话题
  router.post('/save/topic', (req, res) => {
    req.body.createtime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    req.body.abstract = req.body.topic.substring(0, 20)
    topicdb.insert(req.body, [], (dbresult, error) => {
      if (error) {
        let data = {}
        data.msg = error
        res.send(data)
      } else {
        let data = {}
        data.success = 'true'
        data.msg = '新建成功'
        res.send(data)
      }
    })
  })
  //查询话题详情
  router.post('/topic/:id', (req, res) => {
    console.log("打印id" + req.params.id)
    db.query(`SELECT a.id,a.title,a.abstract,a.topic,a.heat,a.agree,a.comment,a.follow,a.brower,a.userid,a.topiccover,a.createtime,a.updatetime FROM topics AS a WHERE a.id=${req.params.id}`, [], (dbresult, error) => {
      console.log(dbresult)
      res.send({ data: dbresult[0], success: true })
    })
  })

  // 回答内容管理
  // 回答列表
  router.post('/answerlist', (req, res) => {
    let x = (req.body.pageNo - 1) * req.body.pageSize
    let y = req.body.pageSize
    console.log("打印回答列表")
    console.log(req.body)
    answerdb.find(req.body, x, y, [], (dbresult, err) => {
      let data = {}
      data.list = dbresult
      // for (let i=0;i<dbresult.length;i++) {
      //   userdb.findById(dbresult[i].userid, [], (result, error) => {
      //     console.log("打印用户信息")
      //     console.log(result)
      //     data.list[i].nickname = result[0].nickname
      //     data.list[i].cover = result[0].cover
      //   })
      // }
      userdb.findsByList(data.list, [], (result) => {
        for (let i = 0; i < data.list.length; i++) {
          data.list[i].nickname = result[i].nickname
          data.list[i].cover = result[i].cover
        }
        data.success = true
        data.msg = '查询成功'
        data.pageNo = req.body.pageNo
        data.pageSize = req.body.pageSize
        res.send(data)
      })
    })
  })
  // 新建回答
  router.post('/save/answer', (req, res) => {
    answerdb.insert(req.body, [], (dbresult, err) => {
      if (err) {
        let data = {}
        data.msg = err
        res.send(data)
      } else {
        let data = {}
        data.success = true
        data.msg = '新建成功'
        res.send(data)
      }
    })
  })
  // 修改回答
  router.post('/update/answer', (req, res) => {
    answerdb.insert(req.body, req.body.id, [], (dbresult, err) => {
      if (err) {
        let data = {}
        data.msg = err
        res.send(data)
      } else {
        let data = {}
        data.success = true
        data.msg = '修改成功'
        res.send(data)
      }
    })
  })
  // 删除回答
  router.post('/delete/answer', (req, res) => {
    answerdb.deleteById(req.body.id, [], (dbresult, err) => {
      if (err) {
        let data = {}
        data.msg = err
        res.send(data)
      } else {
        let data = {}
        data.success = true
        data.msg = '删除成功'
        res.send(data)
      }
    })
  })
  // 回答详情
  router.post('/answer/:id', (req, res) => {
    answerdb.findById(req.params.id, [], (dbresult, err) => {
        let data = {}
        data.success = true
        data.msg = '查询成功'
        console.log("打印结果")
        console.log(dbresult)
        data.data = dbresult[0]
        res.send(data)
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

  // 文件上传
  router.post('/upload', upload.single('file'), async (req, res) => {
    console.log("监听文件上传")
    const file = req.file
    file.url = `http://39.106.159.120:8080/uploads/${file.filename}`
    // file.url = `http://localhost:8080/uploads/${file.filename}`
    res.send(file)
  })

  // 用户模块
  // 用户详情
  router.post('/userinfo/:userid',(req,res) => {
    userdb.findById(req.params.userid,[],(dbresult,err)=>{
      let data = {}
      data.msg = '查询成功'
      data.data = dbresult[0]
      res.send(data)
    })
  })
  //用户模块,微信授权登陆
  router.post('/login/:code', (req, res) => {
    let user = {}
    const url = "https://" + `api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${appSecret}&js_code=${req.params.code}&grant_type=authorization_code`
    request(url, (err, wxres, body) => {
      console.log("打印小程序登录参数")
      let wxbody = JSON.parse(body)
      console.log("打印JSON对象")
      console.log(wxbody)
      //向users表插入数据
      console.log("打印登录请求参数")
      console.log(req.body)
      db.query("select userid,nickname,cover,sex,birthday,grade,isComplete from users where userid=" + "'" + wxbody.openid + "'", [], (dbresult, error) => {
        user = dbresult[0]
        console.log("打印user用户")
        user = dbresult[0]
        if (user) {
          console.log("用户存在")
          res.send({ data: { wxbody, user }, success: true })
        } else {
          console.log("新用户")
          let imgurl = req.body.avatarUrl.substring(0, 8)
          let imgstr = req.body.avatarUrl.substring(8)
          console.log(imgurl)
          console.log(imgstr)
          let img = imgurl + imgstr
          db.query('insert into users(userid,nickname,cover) values("' + wxbody.openid + '","' + req.body.nickName + '","' + img + '")', [], (inresult, inerror) => {
            console.log("新用户插入结果")
            console.log(inresult)
            if (inresult.affectedRows == 1) {
              db.query("select userid,nickname,cover,sex,birthday,grade,isComplete from users where userid=" + "'" + wxbody.openid + "'", [], (dbresult2, error2) => {
                if (dbresult2) {
                  res.send({ data: { wxbody: wxbody, user: dbresult2 }, success: true })
                }
              })
            } else {
              res.send({ message: '插入失败' })
            }
          })
        }
      })
      // res.send({data:wxbody,success:true})
    })
  })
  
  // 公告管理
  // 公告列表
  router.post('/notice/list',(req,res)=>{
    
  })


  app.use('/wx/api', router)
}
