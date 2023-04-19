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

// 添加多组数据
router.post('/addusers', handle.addUsers)

// 修改单人信息
router.post('/updateoneuser', handle.updateOneUser)

// 删除单人信息
router.post('/deleteoneuser', handle.deleteOneUser)

// 身份A发送通知
router.post('/sendMessage', handle.sendMessage)

// 拿到发给当前登录用户的通知
router.get('/getnoticearr', handle.getNoticeArr)

// 修改isReceiveRead
router.get('/changeisread', handle.changeIsRead)

// 向用户中添加选择的志愿老师
router.post('/selectteachers', handle.selectTeachers)

// 查询学生是否已经选择了三名志愿老师
router.get('/ishavestuval', handle.isHaveStuVal)

// 查询所有老师的信息
router.get('/getallteachers', handle.getAllTeachers)

// // 查询当前学生选中的教师信息
// router.get('/getselteachers', handle.getSelectTeachers)

// 查询所有的志愿里有当前导师用户的学生
router.get('/getallstus', handle.getAllStudents)

// 获取所有二级学院信息 
router.get('/getalldept', handle.getAllDept)

// 新增二级学院
router.post('/adddept', handle.addDept)

// 更改二级学院
router.post('/updatedept', handle.UpdateDept)

// 获取该二级学院下所有专业
router.get('/getallmajor',handle.getAllMajor)

// 增加专业
router.post('/addmajor', handle.addMajor)


module.exports = router