const express = require('express')
const handle = require('../handler')

// 创建路由对象
const router = express.Router()

// 新建Admin + 登录
router.post('/login', handle.login)

// 新增身份角色
router.post('/addrole', handle.addRole)

// 获取所有身份角色
router.get('/getroles', handle.getRoles)

module.exports = router