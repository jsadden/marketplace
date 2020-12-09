const mongoose = require('mongoose')

var postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imagePath: {
        type: String
    },
    userEmail: {
        type: String,
        required: true 
    },
    price: {
        type: Number,
        required: true
    },
    datePosted: {
        type: Date,
        default: Date.now
    },
    city: {
        type: String,
        required: true
    }
})

var Post = mongoose.model('Post', postSchema)

module.exports = {Post}
