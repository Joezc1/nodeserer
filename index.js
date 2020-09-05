
const express = require("express")

const app = express()
  // 引入第三方的插件，来解析post请求参数


// 生成token时的秘钥
// app.set('secret','i2iwiwi23i2')

// 解析body参数
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

app.use(jsonParser)
// 后台管理端
require('./routes/admin')(app)
// 微信小程序端
require('./routes/wx')(app)
// require('./plugins/db')(app)

app.use(express.json())


app.use(require('cors')())

app.use('/uploads',express.static(__dirname+ '/uploads'))
app.use('/admin',express.static(__dirname+ '/admin'))

app.listen(8080,()=>{
    console.log("http://39.106.159.120:8080")
})
