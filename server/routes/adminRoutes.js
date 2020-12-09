const express = require('express')
const router = express.Router()
const {Admin} = require('../models/adminModel')

//auth middleware
const { AdminAuthMiddleware } = require('../middleware/adminAuthMiddleware')

//rate limit middleware
const rateLimit = require('express-rate-limit')
const loginAdminLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 mins
    max: 10,
    message: 'Too many attempts from this IP, try again in 30 minutes'
})


//login
router.post('/login', loginAdminLimiter, (req,res) => {

    //get admin
    Admin.findOne({username: req.body.username}, (err, admin) => {
        if (err) return res.json({success: false, message: 'Admin not found', admin: false})

        if (!admin) return res.json({success: false, message: 'Admin not found', admin: false})
        //compare passwords 
        admin.comparePassword(req.body.password, (err, match) => {
            if (err) return res.json({success: false, message: 'Something went wrong', admin: false})
            
            //no match
            if (!match) return res.json({success: false, message: 'Password incorrect', admin: false})
            
            //generate tokens
            admin.createTokens((err, doc) => {
                if (err) return res.json({success: false, message: 'Error generating tokens', admin: false})
            
                return res.cookie('adminauth', doc.accessToken, {httpOnly: true}).json({
                    success: true, 
                    message: 'Login successful', 
                    admin: {
                        email: doc.email,
                        username: doc.username
                    }
                })
            })
        })
    })
})

//logout
router.get('/logout', AdminAuthMiddleware, (req,res) => {

    //revoke tokens
    req.admin.deleteTokens((err, doc) => {
        if (err) return  res.json({success: false, message: 'Something went wrong', admin: false})

        res.json({success: true, message: 'Logout successful'})
    })
})


//auth check
router.get('/auth', AdminAuthMiddleware, (req,res) => {
    res.cookie('adminauth', req.accessToken, {httpOnly: true}).json({
        auth: true,
        adminData: {
            username: req.admin.username,
            email: req.admin.email
        }
    })
})

//change password
router.post('/changePass', loginAdminLimiter, AdminAuthMiddleware, (req,res) => {

    //compare current password for verification
    req.admin.comparePassword(req.body.password, (err, match) => {
        if (err) return res.json({success:false, message: 'Something went wrong', admin: false})
        
        //didnt match
        if (!match) return res.json({success:false, message: 'Password incorrect', admin: false})
    
        //set new
        req.admin.password = req.body.newPassword

        //save
        req.admin.save((err, doc) => {
            if (err) return res.json({success:false, message: 'Something went wrong', admin: false})

            return res.json({
                success:true, 
                message: 'Password changed', 
                admin: {
                    email: doc.email,
                    username: doc.username
                }
            })
        })
    })
})


module.exports = router