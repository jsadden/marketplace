const express = require('express')
const router = express.Router()
const {Conversation} = require('../models/conversationModel')
const {AuthMiddleware} = require('../middleware/authMiddleware')


//add conversation
router.post('/add', AuthMiddleware, (req,res) => {
    //user 1 is sender, user 2 is recipient
    const conBody = {
        ...req.body,
        user1: req.user.email
    }

    const conversation = new Conversation(conBody)

    conversation.save((err,con) => {
        if (err) return res.json({success:false, message: 'Something went wrong', conversation: false})
    
        return res.json({success:true, message: 'Conversation added', conversation: con})
    })
})

//get conversations by user
router.get('/getConversations', AuthMiddleware, (req,res) => {

    //get if user1 of user2 matches the logged in user's email
    Conversation.find({$or: [{user1: req.user.email}, {user2: req.user.email}]}, (err, cons) => {
        if (err) return res.json({success:false, message: 'Something went wrong', conversation: false})

        return res.json({success:true, message: 'Conversations found', conversation: cons})
    })
})

//update deletion for a user
router.route('/delete')
.patch(AuthMiddleware, (req,res) => {

    Conversation.findOne({_id: req.body.id}, (err,con) => {
        if (err) return res.json({success:false, message: 'Something went wrong', conversation: false})
        if (!con) return res.json({success:false, message: 'Conversation not found', conversation: false})

        //if sender is user2
        if (req.user.email == con.user2) {
            con.deletedByUser2 = true
        
        //if sender is user1
        } else if (req.user.email == con.user1) {
            con.deletedByUser1 = true
        
        //not authorized in this conversation
        } else {
            return res.json({success:false, message: 'You cannot delete this conversation', conversation: false})
        }

        con.save((err, doc) => {
            if (err) return res.json({success:false, message: 'Something went wrong', conversation: false})

            return res.json({success:true, message: 'User deleted conversation', conversation: doc})
        })
    })
})

//get if conversation is to be deleted
.get(AuthMiddleware, (req,res) => {

    Conversation.findOne({_id: req.query.id}, (err,con) => {
        if (err) return res.json({success:false, message: 'Something went wrong', conversation: false})
        if (!con) return res.json({success:false, message: 'Conversation not found', conversation: false})
        if (con.user1 !== req.user.email && con.user2 !== req.user.email) return res.json({success:false, message: 'Forbidden', conversation: false})

        //both users deleted this, return true
        if (con.deletedByUser1 && con.deletedByUser2) {
            return res.json({success:true, message: 'Deleted by both users', deleteMe: true})
        
        //someone hasn't deleted this, return false
        } else {
            return res.json({success:true, message: 'Not deleted by both users', deleteMe: false})
        }
    })
})

//delete conversation -- check to see if both parties deleted before completing
.delete(AuthMiddleware, (req,res) => {

    //delete conversation -- must match user1 or user2
    Conversation.findOneAndDelete({_id: req.body.id, $or: [{user1: req.user.email}, {user2: req.user.email}]}, (err,con) => {
        if (err) return res.json({success:false, message: 'Something went wrong', conversation: false})
        if (!con) return res.json({success:false, message: 'Conversation not found', conversation: false})

        return res.json({success:true, message: 'Deleted from database', conversation: con})
    })
})

//add message to conversation using conversation id
router.post('/addMessage', AuthMiddleware, (req,res) => {

    //find convo
    Conversation.findOne({_id: req.body.id}, (err,con) => {
        if (err) return res.json({success:false, message: 'Something went wrong', conversation: false})


        //if sender is user1
        let isUser1
        if (req.user.email == con.user2) {
            isUser1 = false
        } else if (req.user.email == con.user1) {
            isUser1 = true
        } else {

            //not authorized in this conversation
            return res.json({success:false, message: 'You cannot add to this conversation', conversation: false})
        }

        const newMessage = {
            sentByUser1: isUser1,
            message: req.body.message
        }

        con.messages.push(newMessage)
        con.save((err, doc) => {
            if (err) return res.json({success:false, message: 'Something went wrong', conversation: false})

            return res.json({success:true, message: 'Sent message', conversation: doc})
        })
    })
})  

module.exports = router