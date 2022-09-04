// 进行数据库的操作
const md5 = require('blueimp-md5')
const UserModel = require('../models/UserModel')
const RoleModel = require('../models/RoleModel')
const NoticeModule = require('../models/NoticeModule')

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

// 修改单人信息
exports.updateOneUser = (req, res) => {
    // console.log(req.body)
    const { _id, username, userId, userPhone, userRole, userInstitute, userSubject } = req.body
    // console.log('_id', _id)
    UserModel.findOne({ userId })
        .then((idCannotChange) => {
            console.log('开始寻找传入的userID')
            // console.log('_id', _id)
            // console.log('idCannotChange._id', JSON.stringify(idCannotChange._id).slice(1, -1))
            if (idCannotChange) {
                console.log('传入的userID存在')
                if (idCannotChange._userId !== userId) {
                    console.log('传入的userID存在-不是自己，返回报错', idCannotChange.userId, userId)
                    res.send({
                        status: 400,
                        msg: `添加异常，修改后学号/工号与他人重复！`
                    })
                    return;
                }
            }
            console.log('传入的userID存在-是自己/不存在，更新数据')
            UserModel.updateOne({ _id }, { $set: { username, userId, userPhone, userRole, userInstitute, userSubject } })
                .then(() => {
                    res.send({
                        status: 200,
                        msg: `修改成功`
                    })
                })
        }
        )
        .catch((error) => {
            res.send({
                status: 500,
                msg: `添加异常，请重新尝试${error}`
            })
        })

}

// 删除单人信息
exports.deleteOneUser = (req, res) => {
    // const _id = JSON.stringify(req.body)
    // console.log(_id)
    // console.log(Object.keys(_id))
    const { _id } = req.body
    console.log(_id)
    UserModel.deleteOne({ _id })
        .then(() => {
            res.send({
                status: 200,
                msg: `删除成功！`
            })
        })
        .catch((error) => {
            res.send({
                status: 500,
                msg: `删除失败，请重新尝试${error}`
            })
        })
}

// 发送通知
exports.sendMessage = (req, res) => {
    console.log('后端获取到的数据', req.body)
    const { receiverRole, receiverId } = req.body
    if (receiverRole) {
        // 根据receiverRole的值查找所有符合的id，然后挨个添加
        UserModel.find({ userRole: receiverRole })
            .then((receivers) => {
                console.log('查找结果：', receivers)
                receivers.map((value, index, array) => {
                    NoticeModule.create({ ...req.body, receiverId: value.userId })
                        .then(() => {
                            console.log('添加成功')
                            res.send({
                                status: 200,
                                msg: `添加成功`
                            })
                        })
                    // .catch((error) => {
                    //     console.log('添加失败', error.message)
                    //     res.send({
                    //         status: 500,
                    //         msg: `添加失败，请重新尝试${error}`
                    //     })
                    // })
                })

                // NoticeModule.create(req.body)
                //     .then(() => {
                //         console.log('添加成功')
                //         res.send({
                //             status: 200,
                //             msg: `添加成功`
                //         })
                //     })
                //     .catch((error) => {
                //         console.log('添加失败', error.message)
                //         res.send({
                //             status: 500,
                //             msg: `添加失败，请重新尝试${error}`
                //         })
                //     })


            })
            .catch((error) => {
                res.send({
                    status: 500,
                    msg: `操作失败，请重新尝试：${error}`
                })
            })
    } else {
        console.log(receiverRole)
        UserModel.findOne({ userId: receiverId })
            .then((info) => {
                console.log('找到了吗', info)
                if (info) {
                    NoticeModule.create(req.body)
                        .then(() => {
                            console.log('添加成功')
                            res.send({
                                status: 200,
                                msg: `添加成功`
                            })
                        })
                } else {
                    res.send({
                        status: 501,
                        msg: `该用户不存在，无法发送消息`
                    })
                }
            })
            .catch((error) => {
                res.send({
                    status: 500,
                    msg: `操作失败，请重新尝试：${error}`
                })
            })

    }

}

// 拿到发给当前登录用户的通知
exports.getNoticeArr = (req, res) => {
    const { receiverId } = req.query
    console.log('****', receiverId)
    NoticeModule.find({ receiverId }).sort({ sendTime: -1 })
        .then((noticeArr) => {
            // console.log(noticeArr)
            res.send({
                status: 200,
                msg: `查询成功`,
                data: noticeArr
            })
        })
        .catch((error) => {
            res.send({
                status: 500,
                msg: `操作失败，请重新尝试：${error}`,
                data: null
            })
        })
}

// 修改isReceiveRead
exports.changeIsRead = (req, res) => {
    const { _id } = req.query
    // console.log(req.query)
    NoticeModule.updateOne({ _id }, { $set: { isReceiveRead: true } })
        .then(() => {
            console.log('修改成功')
            // res.send({
            //     status: 200,
            //     msg: `修改成功`
            // })
        })
        .catch((error) => {
            console.log('修改失败')
            // res.send({
            //     status: 500,
            //     msg: `服务端错误：${error}`,
            //     data: null
            // })
        })
}