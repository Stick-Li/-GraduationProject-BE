// 数据库 database -> 集合 collection -> 文档 document 
// Schema(模式对象：约束了数据库中的文档结构) -> Model（集合中的所有文档） -> Document（集合中的具体文档） 

const mongoose = require('mongoose')

const Schema = mongoose.Schema
const majorSchema = new Schema({
    majorName: String,
    majorId: {
        type: String,
        unique: true,   // 为嘛不管用？？？？？
    },
    deptName: String,
    deptId: Number,
    key: String
})

const MajorModel = mongoose.model('majors', majorSchema)

module.exports = MajorModel