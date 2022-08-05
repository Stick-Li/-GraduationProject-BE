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

// 设置（添加）角色权限（菜单）
router.post('/getpower', handle.getPower)

// 添加单人用户
router.post('/addoneuser', handle.addOneUser)

// 获取所有用户
router.get('/getallusers', handle.getAllUsers)

// 根据当前登录用户查询Role表的menuPath
router.get('/getmemu', handle.getMenu)

module.exports = router