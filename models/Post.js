const mongoose = require('mongoose')
const PostSchema =  mongoose.Schema({
    
    title:{
        type:String,
        required:true
    },
    timestamp:{
        type:Date,
        default:Date.now,
        required:true  
    },
    description:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model('posts',PostSchema)