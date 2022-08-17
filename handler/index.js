// 进行数据库的操作
const md5 = require('blueimp-md5')
const UserModel = require('../models/UserModel')
const RoleModel = require('../models/RoleModel')

// 登录
exports.login = (req, res) => {
    // req.body：{ username: 'stickL', password: '1231231A' }
    const { userId, password } = req.body

    UserModel.findOne({ userId, password: md5(password) })
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

// 设置角色权限
exports.getPower = (req, res) => {
    // 更新数据库，添加menu
    // console.log(req.body)
    const { _id, menu, powerTime, powerUser } = req.body
    RoleModel.updateOne({ _id }, { $set: { menuPath: menu, powerTime, powerUser } })
        .then(() => {
            res.send({
                status: 200,
                msg: `添加成功`
            })
        })
        .catch((error) => {
            res.send({
                status: 400,
                msg: `添加异常，请重新尝试${error}`
            })
        })
}

// 添加单人用户信息
exports.addOneUser = (req, res) => {
    console.log('添加用户信息，前端传来的数据：', req.body)
    UserModel.findOne({ userId: req.body.userId })
        .then((user) => {
            if (!user) {
                UserModel.create(req.body)
                    .then(() => {
                        res.send({
                            status: 200,
                            msg: '用户添加成功！'
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

// 获取所有用户
exports.getAllUsers = (req, res) => {
    UserModel.find({}).sort({ userId: 1 })
        .then((users) => {
            res.send({
                status: 200,
                msg: '获取数据成功！',
                data: users
            })
        })
        .catch((error) => {
            res.send({
                status: 401,
                msg: `获取数据异常，请重新尝试${error}`
            })
        })
}

// 根据当前登录用户查询Role表的menuPath
exports.getMenu = (req, res) => {
    const roleName = req.query['0']     // params是/:xxx  query是/?id=xxx
    // console.log('根据前端传来的roleName找menuPath:', req.query['0'])
    RoleModel.findOne({ roleName })
        .then((role) => {
            res.send({
                status: 200,
                msg: '角色对比成功，返回menuPath',
                menuPath: role.menuPath
            })
        })
        .catch((error) => {
            res.send({
                status: 400,
                msg: error.massage
            })
        })

}

// 获取前端传递过来的excel数据
exports.addUsers = (req, res) => {
    console.log('后端接口', req.body)
    const dataArr = req.body
    const promise = new Promise((resolve, reject) => {
        dataArr.forEach((value, index, array) => {
            UserModel.findOne({ userId: value.userId })
                .then((user) => {
                    if (user) {
                        UserModel.updateOne({ userId: value.userId }, { $set: { value } })
                        // .then(() => {
                        //     console.log('更新成功')
                        //     // res.send({
                        //     //     status: 200,
                        //     //     msg: `更新成功`
                        //     // })
                        // })
                        // .catch((error) => {
                        //     console.log('更新失败')
                        //     // res.send({
                        //     //     status: 500,
                        //     //     msg: `更新失败${error}`
                        //     // })
                        // })
                    } else {
                        UserModel.create(value)
                        // .then(() => {
                        //     console.log('添加成功')
                        // })
                        // .catch((error) => {
                        //     console.log('添加失败')
                        // })
                    }
                })
                .catch((error) => {
                    reject(error)
                })
        })
        resolve()
    })
    promise.then(() => {
        res.send({
            status: 200,
            msg: '数据添加/更新成功！'
        })
    }).catch((error) => {
        res.send({
            status: 500,
            msg: `部分数据导入失败：${error.message}`
        })
    })
    // res.send({
    //     status: 200,
    //     msg: '数据添加/更新成功！'
    // })
    // res.send({
    //     status: 500,
    //     msg: `数据导入失败：${error.message}`
    // })
}