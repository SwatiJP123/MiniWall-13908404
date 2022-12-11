const { required } = require('joi')
const mongoose = require('mongoose')
const UserSchema =  mongoose.Schema({
    username:{
        type:String,
        min:3,
        max:256,
        required:true
    },
    email:{
        type:String,
        required:true,
        min:8,
        max:256
        //check that it should be unique 
    },
    password:{
        type:String,
        required:true,
        min:8,
        max:1024
        //validate pasword for at least one uc,lc,sym, digit
    }
})
module.exports = mongoose.model('users',UserSchema)