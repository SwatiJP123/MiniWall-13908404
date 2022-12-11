const express = require('express');
const app = express();
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');


// connect to db
mongoose.connect('mongodb+srv://useroot:12345@cluster0.izeh6tz.mongodb.net/ShareTalk?retryWrites=true&w=majority');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log(`Database has been connected successfully`);
});

// defining schema
autoIncrement.initialize(mongoose.connection);
let Schema = mongoose.Schema;
let userSchema = new Schema({
    '_id' : String,
    'title' : String,
    'description' : String,
    'timestamp' : String,
    'user_id' : String
});

PostSchema.plugin(autoIncrement.plugin, {
    model: 'title',
    field: '_id',
    startAt: 0,
    incrementBy: 1
});

let posts = mongoose.model('posts', PostSchema);

app.get('/getNextId', function(req, res){
    User.nextCount((err, count) => {                          
        let user = new User();
        user.save((err) => {
            console.log(`The Id is ${count}`);
            user.nextCount((err, count) => {
                console.log(`The next Id is ${count}`);
            });
        });
        res.status(200).send(JSON.stringify({ id : count }, null, 3));
    });
});

app.listen(PORT, () => {
    console.log(`Server is up and running on Port : ${PORT}`);
});
