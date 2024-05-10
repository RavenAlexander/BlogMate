const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CommentSchema = new Schema({
    
    username: {
        type: String,
        
    },
    body: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Comment', CommentSchema) 