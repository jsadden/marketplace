const mongoose = require('mongoose')


var conversationSchema = mongoose.Schema({
    user1: {
        type: String,
        required: true
    },
    user2: {
        type: String,
        required: true
    },
    deletedByUser1: {
        type: Boolean,
        default: false
    },
    deletedByUser2: {
        type: Boolean,
        default: false
    },
    datePosted: {
        type: Date,
        default: Date.now
    },
    messages: [{
        sentByUser1: {
            type: Boolean,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        message: {
            type: String,
            required: true
        }
    }]
})

var Conversation = mongoose.model('Conversation', conversationSchema)

module.exports = {Conversation}