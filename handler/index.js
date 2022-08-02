// 进行数据库的操作
const md5 = require('blueimp-md5')
const UserModel = require('../models/LoginModel')
const RoleModel = require('../models/RoleModel')

// 登录
exports.login = (req, res) => {
    // req.body：{ username: 'stickL', password: '1231231A' }
    const { username, password } = req.body

    UserModel.findOne({ username, password: md5(password) })
        .then((doc) => {
            if (doc) {
                res.send({
                    status: 200,
                    msg: '账号密码正确',
                    data: doc
                })
            } else {
                res.send({
                    status: 400,
                    msg: '账号或密码错误'
                })
            }
        })
        .catch(() => {
            res.send({
                status: 401,
                msg: '登录异常，请重新尝试'
            })
        })
}

// 新增身份角色
exports.addRole = (req, res) => {
    // req.body：{role: '新身份', createTime: 1659348848962}

    const { role, createTime } = req.body

    RoleModel.findOne({ roleName: role })
        .then((dbRole) => {
            // console.log('=====', dbRole)  // null
            if (!dbRole) {
                RoleModel.create({ roleName: role, createTime })
                    .then(() => {
                        res.send({
                            status: 200,
                            msg: '角色添加成功！'
                        })
                    })
                    .catch(() => {
                        res.send({
                            status: 401,
                            msg: '添加异常，请重新尝试'
                        })
                    })
            } else {
                res.send({
                    status: 400,
                    msg: '该角色已存在，不能重复添加'
                })

            }
        })
        .catch((error) => {
            res.send({
                status: 401,
                msg: `添加异常，请重新尝试${error}`
            })
        })
}

// 获取所有身份角色
exports.getRoles = (req, res) => {
    RoleModel.find({}).sort({ createTime: 1 })
        .then((roles) => {
            // console.log(roles)
            res.send({
                status: 200,
                msg: '获取数据成功！',
                data: roles
            })
        })
        .catch((error) => {
            res.send({
                status: 401,
                msg: `获取数据异常，请重新尝试${error}`
            })
        })
}