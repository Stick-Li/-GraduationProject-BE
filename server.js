const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

// 解析【表单数据】的中间件（post请求）
app.use(express.urlencoded({ extended: false }))
// 解析【axios传递数据】的中间件 (axios post提交方式 默认数据提交格式(content-type)为application/json)
app.use(express.json({ extended: true }))
// cors解决接口跨域问题
app.use(cors())

// 导入自定义路由模块
const router = require('./router')
// 注册路由模块
app.use(router)



// 连接数据库成功后 再启动服务器
mongoose.connect('mongodb://127.0.0.1/graduationProject')
mongoose.connection.once('open', function () {
    // console.log('数据库连接成功')
    app.listen(80, () => {
        console.log('server running at http://127.0.0.1:80')
    })
})

