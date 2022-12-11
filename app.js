//Step 1: Importing Libraries
const express = require('express')
//Step 2: Create an app
const app = express()

const bodyParser = require('body-parser')
require('dotenv/config')
app.use(bodyParser.json())

const shareRoute = require('./routes/share')
const wallRoute = require('./routes/wall')
const mongoose = require('mongoose')

const authRoute = require('./routes/auth')
app.use('/api/user',authRoute)

//Step 3: Create a middleware
app.use('/api/share',shareRoute) //middleware
app.use('/api/wall',wallRoute) //middleware


//Step 4: Create root
app.get('/',(req,res)=>{
    res.send("Welcome to ShareTalk")
})
app.get('/wall',(req,res)=>{
    res.send("Feeds are here!")
})
app.get('/share',(req,res)=>{
    res.send("TALK it out! and SHARE it here")
})

mongoose.connect(process.env.DB_CONNECTOR,()=>{
    console.log("Connected to MongDB")     
})
//Step 5: Start the server
app.listen(9000,()=>{
    console.log("Server is running")
})