const express = require('express')
const router = express.Router()

const User = require('../models/Users')
const {registerValidation, loginValidation} = require('../validations/validation.js')

const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const Users = require('../models/Users')
var MAX_LOGIN_ATTEMPTS = 5;
//User Registeration
router.post('/register', async(req,res)=>{

    //Validation : User input
    const {error} = registerValidation(req.body)
    if(error)
        return res.status(400).send({message:error['details'][0]['message']})

    //encrypt the user password
    const salt = await bcryptjs.genSalt(5)
    const hashpassword = await bcryptjs.hash(req.body.password,salt)

    //Validation: check if email exists
    const emailExists = await User.findOne({email:req.body.email})
    if(emailExists){
        return res.status(400).send({message:'Email Already Exist'})
    }
    //Validation: check if username exists
    const userExists = await User.findOne({username:req.body.username})
    if(userExists){
        return res.status(400).send({message:'Username Already Exist'})
    }
    //Save the user data into database
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashpassword
    })
    try{
        const userSaved = await user.save()
        res.send(userSaved)
    }catch(err){
        res.status(400).send({message:err})
    }
})

//Login
router.post('/login', async(req,res)=>{

    //Validation : User input
    const {error} = loginValidation(req.body)
    if(error)
        return res.status(400).send({message:error['details'][0]['message']})   

   //Validation: check if user exists
   const user = await Users.findOne({email:req.body.email})
   if(!user){
       return res.status(400).send({message:'User does not Exist'})
   }

   //Validate the password
   const passwordValidation = await bcryptjs.compare(req.body.password,user.password)
   if(!passwordValidation){
    return res.status(400).send({message:'Incorrect Password'})
    }
    //res.send('You are logged In successfully!!!')

    //Generating auth-token
    const token = jsonwebtoken.sign({_id:user._id}, "" + process.env.TOKEN_SECRET,{
        expiresIn: "5h"})
    res.header('auth-token',token).send({'auth-token':token})
})

module.exports = router