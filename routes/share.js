//Step 1: Importing Libraries
const express = require('express')
//Step 2: Create an app
const router = express()

const verifyToken = require('../verifyToken')
const Post = require('../models/Post')
const User = require('../models/Users')
const Activity = require('../models/Activity')
const res = require('express/lib/response')
const { default: mongoose } = require('mongoose')
const db  = mongoose.connect("mongodb+srv://useroot:12345@cluster0.izeh6tz.mongodb.net/ShareTalk?retryWrites=true&w=majority")


router.post('/', verifyToken, async(req,res) =>{
    try{
        const CurrentUser = await User.find({_id:req.user},{username:1, _id:0 })
        console.log(CurrentUser[0].username)
        const postData = new Post({
            title:req.body.title,
            username:CurrentUser[0].username,
            description:req.body.description
        })
        const postToSave = await postData.save()
        res.send(postToSave)

    }catch(err){
        res.status(400).send({message:err})
    }
})


//View POST BY ID 
router.get('/view/:post_id', verifyToken, async (req,res)=>{
    try{
        const posts = await Post.findById(req.params.post_id)
        res.send(posts)
    }catch(err){
        res.send({message:err})
    }
})

//GET ALL POSTS OF AUTHORISED USERS
router.get('/profile', verifyToken, async (req,res)=>{
    try{
        //here it is
       //console.log(req.header.username)
        //const posts = await Post.find({ user: req.user._id }).sort({ date: -1 });
        const CurrentUser = await User.find({_id:req.user},{username:1, _id:0 })
        console.log(CurrentUser[0].username)
        const posts = await Post.find({ username: CurrentUser[0].username}).sort({ date: -1 });//sort on the basis of likes
        res.send(posts)
    }catch(err){
        res.send({message:err})
    }
})
//AUTHORISED USERS CAN COMMENT ON OTHER USER'S POST
router.post('/comment/:post_id', verifyToken, async(req,res) =>{
    try{
        const currentUser = await User.find({_id:req.user},{username:1, _id:0 })
        console.log("current user: "+currentUser[0].username)
        var pid=req.params.post_id
        const postCreator = await Post.findById({_id:pid}, {username: 1, _id:0})
        console.log("Post creator: "+postCreator.username)
        if(currentUser[0].username == postCreator.username){
            res.send("NOT ALLOWED TO COMMENT ON YOUR OWN POST")
        }
        else{
            const commentData = new Activity({
            post_id:req.params.post_id,
            username:currentUser[0].username,
            type:"COMMENT",
            comment_text:req.body.comment_text
        })
        const commentToSave = await commentData.save()
        res.send("SUCCESS! "+commentToSave)
    }
    }catch(err){
        res.status(400).send({message:err})
    }
})

router.post('/like/:post_id', verifyToken, async(req,res) =>{
    try{
        const currentUser = await User.find({_id:req.user},{username:1, _id:0 })
        console.log("current user: "+currentUser[0].username)
        var pid=req.params.post_id
        const postCreator = await Post.findById({_id:pid}, {username: 1, _id:0})
        console.log("Post creator: "+postCreator.username)
        if(currentUser[0].username == postCreator.username){
            res.send("NOT ALLOWED TO LIKE YOUR OWN POST")
        }
        else{
            const commentData = new Activity({
            post_id:req.params.post_id,
            username:currentUser[0].username,
            type:"LIKE"
        })
        const commentToSave = await commentData.save()
        res.send("SUCCESS! "+commentToSave)
    }
    }catch(err){
        res.status(400).send({message:err})
    }
})

//UPDATE OPERATION ON POST (update only if this post belongs to authorised user)
router.patch('/:post_id', async(req,res)=>{
    const currentUser = await User.find({_id:req.user},{username:1, _id:0 })
        console.log("current user: "+currentUser[0].username)
        var pid=req.params.post_id
        const postCreator = await Post.findById({_id:pid}, {username: 1, _id:0})
        console.log("Post creator: "+postCreator.username)
        if(currentUser[0].username == postCreator.username){
    const postData = new Post({
        post_id:req.body.post_id,
        title:req.body.title,
        user_id:req.body.user_id,
        description:req.body.description
    })
    try{
        const updatePosts_ID = await Post.updateOne(
            {_id:req.params.post_id},
            {$set: 
                {
                    post_id:req.body.post_id,
                    title:req.body.title,
                    user_id:req.body.user_id,
                    description:req.body.description
                }
            }
        )
        res.send(updatePosts_ID)
    }catch(err){
        res.send({message:err})
    }
}else{
    res.send("You are not the creator of this post. NOT ALLOWED TO EDIT") 
}
})
//DELETE allow deletion only if this post belongs to auhorised user
router.delete('/:post_id', async(req,res)=>{
    try{
        /*const currentUser = await User.find({_id:req.user},{username:1, _id:0 })
        console.log("current user: "+currentUser[0].username)
        var pid=req.params.post_id
        const postCreator = await Post.findById({_id:pid}, {username:1, _id:0})
        console.log("Post creator: "+postCreator.username)
        if(currentUser[0].username == postCreator.username){*/
            const deletePost_ID = await Post.deleteOne({_id:req.params.post_id})
            res.send("SUCCESS!! "+deletePost_ID)        
    /*}else {
        res.send("You are not the creator of this post. NOT ALLOWED TO DELETE")
    }*/
    }catch(err){
        res.send({message:err})
    }
})

module.exports=router