//Step 1: Importing Libraries
const express = require('express')
//Step 2: Create an app
const router = express()

const verifyToken = require('../verifyToken')
const Post = require('../models/Post')
const User = require('../models/Users')
const Activity = require('../models/Activity')
const res = require('express/lib/response')
router.get('/', async(req,res) =>{
    try{
        const posts = await Post.find();
        console.log(posts)
        res.send(posts)
    }catch(err){
        res.status(400).send({message:err})
    }
})

//READ BY ID FROM CRUD
router.get('/:post_id',async (req,res)=>{
    try{
        const posts = await Post.findById(req.params.post_id)
        res.send(posts)
    }catch(err){
        res.send({message:err})
    }
})

router.get('/comment/:post_id',async (req,res)=>{
    try{
        const CurrentUser = await User.find({_id:req.user},{username:1, _id:0 })
        console.log(CurrentUser[0].username)
        const ActivityData = new Activity({
             title:req.body.title,
             username:CurrentUser[0].username,
             description:req.body.description
        })
        const activityToSave = await ActivityData.save()
        res.send(activityToSave)
     }catch(err){
         res.status(400).send({message:err})
     }
})

router.patch('/:post_id', async(req,res)=>{
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
})
//DELETE delete only if this post belongs to auhorised user
/*router.delete('/:post_id', async(req,res)=>{
    try{
        const deletePost_ID = await Post.deleteOne({_id:req.params.post_id})
        res.send(deletePost_ID)
    }catch(err){
        res.send({message:err})
    }
})*/

//VIEW COMMENTS ON MY POSTS
router.get('/view/comments/', verifyToken, async (req,res)=>{
    try{
        const CurrentUser = await User.find({_id:req.user},{username:1, _id:1})
        console.log(CurrentUser[0].username)
     
        const comments = await Post.aggregate([
        {
            $lookup: {
                from: "activities",//db name in mongodb colections
                localField: '_id',//id from Post model
                foreignField: 'post_id',//post_id from activities
                as: 'commentdetails'//connection between two collections
            }
        }
    ])
 
    res.send(comments)
    }catch(err){
        res.send({message:err})
    }
})
//SEE LIKES ON MY POSTS
module.exports=router