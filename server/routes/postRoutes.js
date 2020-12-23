const express = require('express')
const router = express.Router()
const {AuthMiddleware} = require('../middleware/authMiddleware')

//cloudinary for image uploads
const {cloudinary} = require('../utils/cloudinary')


const {Post} = require('../models/postModel')

//add poat
router.post('/add', AuthMiddleware, (req,res) => {

    //cloudinary upload
    cloudinary.uploader.upload(req.body.file, (err, uploadRes) => {
        if (err) return res.json({success:false, message: 'Something went wrong', postData: false})
        
        //add poster's email and image data to body
        const postBody = {
            title: req.body.title,
            description: req.body.description,
            city: req.body.city,
            price: req.body.price,
            userEmail: req.user.email,
            imagePath: uploadRes.url,
            imagePublicId: uploadRes.public_id
        }

        const post = new Post(postBody)
    
        //save
        post.save((err, doc) => {
            if (err) return res.json({success:false, message: 'Something went wrong', postData: false})
    
            return res.json({
                success: true, 
                message: 'Post succeeded', 
                postData: doc}
            )
        })

    })
    
})

//get X number of posts -- should depend on city
router.get('/getPosts', AuthMiddleware, (req,res) => {

    //get params
    const city = req.query.city || req.user.city
    
    //find posts in a city
    Post.find({city: city}).sort({datePosted: -1}).exec((err,posts) => {
        if (err) return res.json({success:false, message: 'Something went wrong', posts: false})

        return res.json({success:true, message: 'Found posts', posts: posts})
    })
    
})

//get posts by a user
router.get('/getPostsByUser', AuthMiddleware, (req,res) => {

    //find by user email
    Post.find({userEmail: req.user.email}).sort({datePosted: -1}).exec((err,posts) => {
        if (err) return res.json({success:false, message: 'Something went wrong', posts: false})

        return res.json({success:true, message: 'Found posts', posts: posts})
    })
})


//delete post by id
router.delete('/remove', AuthMiddleware, (req,res) => {

    //find by id, must also have email from logged in user
    Post.findOneAndDelete({_id: req.body.id, userEmail: req.user.email}, (err,post) => {
        if (err) return res.json({success:false, message: 'Something went wrong', postData: false})

        if (!post) return res.json({success:false, message: 'Post not found', postData: false})

        //delete from cloudinary
        cloudinary.uploader.destroy(post.imagePublicId)

        return res.json({success:true, message: 'Post deleted', postData: post})
    })
})

//edit post by id
router.patch('/editPost', AuthMiddleware, (req,res) => {

    if (req.body.file) {
        
        //cloudinary upload
        cloudinary.uploader.upload(req.body.file, (err, uploadRes) => {
            if (err) return res.json({success:false, message: 'Something went wrong', postData: false})
            
            //remove old file
            cloudinary.uploader.destroy(req.body.imagePublicId)

            //add poster's email and image data to body
            const postBody = {
                title: req.body.title,
                description: req.body.description,
                city: req.body.city,
                price: req.body.price,
                userEmail: req.user.email,
                imagePath: uploadRes.url,
                imagePublicId: uploadRes.public_id
            }

            //find by id, must also have email from logged in user
            Post.findOneAndUpdate({_id: req.body.id, userEmail: req.user.email}, postBody, {new: true}).exec((err,post) => {
                if (err) return res.json({success:false, message: 'Something went wrong', postData: false})

                if (!post) return res.json({success:false, message: 'Post not found', postData: false})

                return res.json({success:true, message: 'Post updated', postData: post})
            })
        })
    } else {
        
        //add poster's email and image data to body
        const postBody = {
            title: req.body.title,
            description: req.body.description,
            city: req.body.city,
            price: req.body.price,
            userEmail: req.user.email
        }

        //find by id, must also have email from logged in user
        Post.findOneAndUpdate({_id: req.body.id, userEmail: req.user.email}, postBody, {new: true}).exec((err,post) => {
            if (err) return res.json({success:false, message: 'Something went wrong', postData: false})

            if (!post) return res.json({success:false, message: 'Post not found', postData: false})

            return res.json({success:true, message: 'Post updated', postData: post})
        })

    }


    
})

module.exports = router