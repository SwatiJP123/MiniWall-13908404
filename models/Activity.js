const mongoose = require('mongoose')
const ActivitySchema =  mongoose.Schema({
    post_id:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    comment_text:{
        type:String
    },
    timestamp:{
        type:Date,
        default:Date.now,
        required:true  
    }
})
module.exports = mongoose.model('activity',ActivitySchema)