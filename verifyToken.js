const { send } = require('express/lib/response')
require('dotenv')
const jsonwebtoken = require('jsonwebtoken')

function auth(req, res, next){
    const token = req.header('auth-token')
        if(!token){
        return res.status(401).send({message:'Access Denied'})
    }

    try{
        const verified = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
        req.user = verified
        next()
    }catch(err){
        return res.status(401).send(err)
    }
}

module.exports = auth