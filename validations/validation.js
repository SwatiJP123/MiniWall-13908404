const joi = require('joi')

//Validate Registeration User Input
const registerValidation = (data) => {
    const schemaValidation = joi.object({
        username:joi.string().required().min(3).max(256),
        email:joi.string().required().min(3).max(256).email(),
        password:joi.string().required().min(3).max(1024)
    })
    return schemaValidation.validate(data)
}
//Validate Login Input
const loginValidation = (data) => {
    const schemaValidation = joi.object({
        email:joi.string().required().min(3).max(256).email(),
        password:joi.string().required().min(3).max(1024)
    })
    return schemaValidation.validate(data)
}
module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation

//User can only create post using oauth V2 autorization service to get their tokens
//if no token is used to call API, this call should be unsuccesful
//authorised users can see the posts in chronoogy
//posts should be appeared in chronological fashion as highest likes appear first. If no likes, all the posts appear on the basis of their creation timestamp.
//posts are created in roud-robin fashion, one after the anoter.
//user cannot like or comment his own posts.
//user can see comments on her posts.
//Users can like each others posts


//other tests cases
//1. unsucessful likings of own posts
//2. 

