// 数据库 database -> 集合 collection -> 文档 document 
// Schema(模式对象：约束了数据库中的文档结构) -> Model（集合中的所有文档） -> Document（集合中的具体文档） 

const mongoose = require('mongoose')

const Schema = mongoose.Schema
const noticeSchema = new Schema({
    senderId: String,
    // receiverRole: String,
    receiverId: String,
    message: String,
    sendTime: {
        type: String,
        default: new Date().getTime() //1603009495724,精确到毫秒
    },
    isReceiveRead: {
        type: Boolean,
        default: false,
    },
})

const NoticeModule = mongoose.model('notice', noticeSchema)

module.exports = NoticeModule