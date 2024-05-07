const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CommentSchema = new Schema({
    
    username: {
        type: String,
        required: true, //Validation
        unique: false
    },
    body: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Comment', CommentSchema) 