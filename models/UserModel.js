var mongoose = require('mongoose')
const md5 = require('blueimp-md5')

// 定义Schema(描述文档Document结构)
var Schema = mongoose.Schema
var userSchema = new Schema({
    username: String,
    password: {
        type: String,
        default: md5('gd111111')
    },
    userId: String,
    // userName: String,
    userPhone: Number,
    userInstitute: String,
    userSubject: String,
    userRole: String
})

// 定义Model(与集合对应, 可以操作集合)
var UserModel = mongoose.model('users', userSchema)

// 创建一个Document Document 和 集合中的文档一一对应，Document是Model的实例，通过model查询到的结果都是Document
// 初始化默认超级管理员用户: admin/admin
UserModel.findOne({ userId: 'Admin123' }, (err, doc) => {
    if (!err) {
        // console.log('查询结果:', doc)
        if (!doc) {
            UserModel.create(
                { userId: 'Admin123', password: md5('Admin123'), username: 'Admin' },
                () => {
                    console.log('初始化超级管理员成功!账号:Admin123,密码:Admin123')
                }
            )
        }
    }
})
// console.log('引入就被执行')

module.exports = UserModel