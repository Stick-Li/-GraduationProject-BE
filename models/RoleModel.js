// 数据库 database -> 集合 collection -> 文档 document 
// Schema(模式对象：约束了数据库中的文档结构) -> Model（集合中的所有文档） -> Document（集合中的具体文档） 

const mongoose = require('mongoose')

const Schema = mongoose.Schema
const roleSchema = new Schema({
    roleName: String,
    createTime: Number,
    powerTime: Number,
    powerUser: String
})

const RoleModel = mongoose.model('roles', roleSchema)

module.exports = RoleModel