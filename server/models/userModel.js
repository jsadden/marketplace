const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const SALT_I = 10


var userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    city: {
        type: String,
        required: true
    },
    accessToken: {
        type: String
    },
    refreshToken: {
        type: String
    },
    banned: {
        type: Boolean,
        default: false
    },
    bannedUntil: {
        type: Date
    }
})


//password hashing and storage if changed
userSchema.pre('save', function(next) {

    //get user
    var user = this

    //check if password changed
    if (user.isModified('password')) {

        //generate salt
        bcrypt.genSalt(SALT_I, function(err, salt) {
            if (err) return next(err)

            //generate hash
            bcrypt.hash(user.password, salt, function(err, hash){
                if (err) return next(err)

                //store hash
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

//check password
userSchema.methods.comparePassword = function(candidate, cb) {
    var user = this

    bcrypt.compare(candidate, user.password, (err, match) => {
        if (err) return cb(err)

        cb(null, match)
    })
}

//generate tokens
userSchema.methods.generateTokens = function (cb) {

    //get user
    var user = this

    //create temporary access token
    var accessToken = jwt.sign({email: user.email, city: user.city}, process.env.JWT_ACCESS_SECRET,
        {
            algorithm: 'HS256',
            expiresIn: process.env.ACCESS_LIFETIME
        })
    
    //create refresh token
    var refreshToken = jwt.sign({email: user.email}, process.env.JWT_REFRESH_SECRET,
        {
            algorithm: 'HS256',
        })

    //store them
    user.accessToken = accessToken
    user.refreshToken = refreshToken

    user.save((err,user) => {
        if (err) return cb(err)

        cb(null, user)
    })
}

//verify access token
userSchema.statics.verifyAccessToken = function(token, cb) {

    //get user
    var user = this

    //attempt verification
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, function(err, decode) {
        if (err) return cb(err)
        
        //find user based on decoded information
        user.findOne({accessToken: token}, function(err, user) {
            if (err) return cb(err)

            //return user
            cb(null, user)
        })
    })
}

//generate new access token from refreshed token
userSchema.statics.getNewAccessToken = function(token, cb) {

    //get user
    var user = this
    
    //get payload data from expired access token
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET, {ignoreExpiration: true})

    //get user from payload data
    user.findOne({email: payload.email}, function(err,user) {
        if (err) return cb(err)

        //verify user's refresh token
        jwt.verify(user.refreshToken, process.env.JWT_REFRESH_SECRET, function(err,decode){
            if (err) return cb(err)

            //generate new access token
            const newToken = jwt.sign({email: payload.email, city: payload.city}, process.env.JWT_ACCESS_SECRET,
                {
                    algorithm: 'HS256',
                    expiresIn: process.env.ACCESS_LIFETIME
                })
            
            //return user and new token
            return cb(null, newToken, user)
        })
    })
}


//delete tokens, called on logout
userSchema.methods.deleteTokens = function (token, cb) {
    
    //get user
    var user = this

    //unset tokens
    user.updateOne({$unset: {accessToken: 1, refreshToken: 1}}, function(err, doc) {
        if (err) return cb(err)

        cb(null,doc)
    })
}

var User = mongoose.model('User', userSchema)

module.exports = {User}