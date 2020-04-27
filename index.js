
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

// *********************************

var fs = require('fs');
var http = require('http');
var https = require('https');
// var privateKey  = fs.readFileSync('/path/to/private.pem', 'utf8'),
// var certificate = fs.readFileSync('/path/to/file.crt', 'utf8');
// var credentials = {key: privateKey, cert: certificate};
 
var httpServer = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);
var PORT = 8080;
var SSLPORT = 18081;
 
httpServer.listen(PORT, function() {
    console.log('HTTP Server is running on: http://localhost:%s', PORT);
});
// httpsServer.listen(SSLPORT, function() {
//     console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
// });
 
// Welcome
// app.get('/', function(req, res) {
//     if(req.protocol === 'https') {
//         res.status(200).send('Welcome to Safety Land!');
//     }
//     else {
//         res.status(200).send('Welcome!');
//     }
// });

// *************************************



// app.listen(8080,()=>{
//     console.log("http://39.106.159.120:8080")
// })
