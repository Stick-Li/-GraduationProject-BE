const express = require('express')
const md5 = require('blueimp-md5')

const UserModel = require('../models/LoginModel')

// 创建路由对象
const router = express.Router()

// {username: 'stickLee', password: '1231231A'}
router.post('/login', (req, res) => {
    // console.log(req.body)   //{ username: 'stickL', password: '1231231A' }
    const { username, password } = req.body

    UserModel.findOne({ username, password: md5(password) }, (err, doc) => {
        if (!err) {
            if (doc) {
                res.send({
                    status: 200,
                    msg: '账号密码正确',
                    data:doc
                })
            } else {
                res.send({
                    status: 400,
                    msg: '账号或密码错误'
                })
            }
        } else {
            res.send({
                status: 401,
                msg: '登录异常，请重新尝试'
            })
        }
    })
})

module.exports = router