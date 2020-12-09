const express = require('express')
const router = express.Router()

const {User} = require('../models/userModel')

//authentication middleware
const {AuthMiddleware} = require('../middleware/authMiddleware')
const {AdminAuthMiddleware} = require('../middleware/adminAuthMiddleware')

//rate limit middleware
const rateLimit = require('express-rate-limit')
const createUserLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 mins
    max: 20,
    message: 'Too many accounts created from this IP, try again in 30 minutes'
})
const loginUserLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 mins
    max: 10,
    message: 'Too many attempts from this IP, try again in 30 minutes'
})

//add user
router.post('/add', createUserLimiter, (req,res) => {
    const user = new User(req.body)
    
    user.save((err, doc) => {
        if (err) {

            if (err.code === 11000 && err.keyValue.email) {
                return res.json({success: false, message: 'This email has already been registered', user: false})
            }
            
            return res.json({success: false, message: "There was an error", user: false})
        }
        
        user.generateTokens((err,user) => {
            if (err) return res.status(400).send(err)

            return res.cookie('auth', user.accessToken, {httpOnly: true}).json({success: true, message: 'Registration successful', user: doc})
        })


    })
})

//check authentication
router.get('/auth', AuthMiddleware, (req,res) => {

    res.cookie('auth', req.accessToken, {httpOnly: true}).json({
        auth: true,
        userData: {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email
        }
    })
})


//login user
router.post('/login', loginUserLimiter, (req,res) => {

    //get user
    User.findOne({email: req.body.email}, (err,user) => {
        if (err) return res.status(400).send(err)

        //user not found
        if (!user) {
            return res.json({success: false, message: 'User not found', userData: false})
        }

        //check if banned
        if (user.banned) {
            if (user.bannedUntil < Date.now()) {
                user.banned = false
                user.save((err,doc) => {
                    if (err) return res.json({success:false, message: 'Something went wrong', user: false})
                })
            } else {
                return res.json({success: false, message: 'You are banned until ' + user.bannedUntil, userData: false})
            }
        }

        //check password
        user.comparePassword(req.body.password, (err, match) => {
            if (err) return res.status(400).send(err)

            //password didn't match
            if (!match) return res.json({success: false, message: 'Password does not match', userData: false})
            
            //password matched, generate tokens
            user.generateTokens((err,doc) => {
                if (err) return res.status(400).send(err)
    
                return res.cookie('auth', user.accessToken, {httpOnly: true}).json(
                {
                    success: true, 
                    message: 'Login successful', 
                    user: {
                        email: doc.email,
                        firstName: doc.firstName,
                        lastName: doc.lastName
                    }
                })
            })
        })
        
    })
})

//logout user
router.get('/logout', AuthMiddleware, (req,res) => {

    //get user and accesstoken via middleware, then delete tokens
    req.user.deleteTokens(req.accessToken, function(err, doc) {
        if (err) return res.json({success:false, message: 'Something went wrong, please refresh the page'})

        res.json({success: true, message: 'Logout successful'})
    })
})

//delete user
router.delete('/delete', AuthMiddleware, (req,res) => {

    User.deleteOne({email: req.user.email}, function(err) {
        if (err) return res.json({success:false, message: 'Something went wrong'})

        return res.json({success:true, message: 'Deletion successful'})
    })
})

//change password
router.post('/changePass', loginUserLimiter, AuthMiddleware, (req,res) => {

    //compare password for verification check
    req.user.comparePassword(req.body.password, (err,match) => {
        if (err) return res.json({success:false, message: 'Something went wrong', user: false})
        
        //password didnt match
        if (!match) return res.json({success:false, message: 'Password incorrect', user: false})
    
        //set new
        req.user.password = req.body.newPassword

        //save
        req.user.save((err,user) => {
            if (err) return res.json({success:false, message: 'Something went wrong', user: false})

            return res.json({
                success:true, 
                message: 'Password changed', 
                user: {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            })
        })
    })
})


//ban user for a period of time
router.post('/ban', AdminAuthMiddleware, (req,res) => {
    User.findOne({email: req.body.email}, (err,user) => {
        if (err) return res.json({success:false, message: 'Something went wrong', user: false})

        if (!user) return res.json({success:false, message: 'No user found', user: false})

        user.banned = true
        let date = new Date( Date.now() + Number(req.body.banDays) * 24 * 60 * 60 * 1000)
        user.bannedUntil = date


        user.save((err, doc) => {
            if (err) return res.json({success:false, message: 'Something went wrong', user: false})
        
            return res.json({
                success:true, 
                message: 'Ban successful', 
                user: {
                    email: doc.email,
                    firstName: doc.firstName,
                    lastName: doc.lastName,
                    banned: doc.banned,
                    bannedUntil: doc.bannedUntil
                }
            })
        })
    })
})

module.exports = router