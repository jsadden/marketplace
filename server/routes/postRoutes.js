const express = require('express')
const router = express.Router()
const {AuthMiddleware} = require('../middleware/authMiddleware')

const {Post} = require('../models/postModel')

//add poat
router.post('/add', AuthMiddleware, (req,res) => {

    //add poster's email to body
    const postBody = {
        ...req.body,
        userEmail: req.user.email
    }
    const post = new Post(postBody)

    //save
    post.save((err, doc) => {
        if (err) return res.json(err)

        return res.json({
            success: true, 
            message: 'Post succeeded', 
            postData: doc}
        )
    })
})

//get X number of posts -- should depend on city
router.get('/getPosts', AuthMiddleware, (req,res) => {

    //get params
    const limit = parseInt(req.query.limit)
    const city = req.query.city || req.user.city
    
    //find posts in a city
    Post.find({city: city}).limit(limit).exec((err,posts) => {
        if (err) return res.json({success:false, message: 'Something went wrong', posts: false})

        return res.json({success:true, message: 'Found posts', posts: posts})
    })
    
})

//get posts by a user
router.get('/getPostsByUser', AuthMiddleware, (req,res) => {

    //find by user email
    Post.find({userEmail: req.user.email}).exec((err,posts) => {
        if (err) return res.json({success:false, message: 'Something went wrong', posts: false})

        return res.json({success:true, message: 'Found posts', posts: posts})
    })
})


//delete post by id
router.delete('/remove', AuthMiddleware, (req,res) => {

    //find by id, must also have email from logged in user
    Post.findOneAndDelete({_id: req.body.id, userEmail: req.user.email}, (err,post) => {
        if (err) return res.json({success:false, message: 'Something went wrong', posts: false})

        if (!post) return res.json({success:false, message: 'Post not found', posts: false})

        return res.json({success:true, message: 'Post deleted', posts: post})
    })
})

//edit post by id
router.patch('/editPost', AuthMiddleware, (req,res) => {

    //new post body
    const newBody = {
        title: req.body.title,
        description: req.body.description,
        imagePath: req.body.imagePath,
        price: req.body.price,
        city: req.body.city
    }

    //find by id, must also have email from logged in user
    Post.findOneAndUpdate({_id: req.body.id, userEmail: req.user.email}, newBody, {new: true}).exec((err,post) => {
        if (err) return res.json({success:false, message: 'Something went wrong', posts: false})

        if (!post) return res.json({success:false, message: 'Post not found', posts: false})

        return res.json({success:true, message: 'Post updated', posts: post})
    })
})

module.exports = router