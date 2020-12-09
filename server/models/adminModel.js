const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const SALT_I = 10


var adminSchema = mongoose.Schema({
    username: {
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
    accessToken: {
        type: String
    },
    refreshToken: {
        type: String
    }
})


//password hashing presave
adminSchema.pre('save', function(next) {
    var admin = this

    //check if password changed
    if (admin.isModified('password')) {

        //generate salt
        bcrypt.genSalt(SALT_I, function(err, salt) {
            if (err) return next(err)

            //generate hash
            bcrypt.hash(admin.password, salt, function(err, hash) {
                if (err) return next(err)

                //store hash
                admin.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

//compare password
adminSchema.methods.comparePassword = function(candidate, cb) {
    var admin = this

    bcrypt.compare(candidate, admin.password, (err,match) => {
        if (err) return cb(err)

        cb(null, match)
    })
}

//create tokens
adminSchema.methods.createTokens = function(cb) {
    var admin = this

    //create access token
    var accessToken = jwt.sign({email: admin.email}, process.env.ADMIN_JWT_ACCESS_SECRET, {
        algorithm: 'HS256',
        expiresIn: process.env.ACCESS_LIFETIME
    })

    //create refresh token
    var refreshToken = jwt.sign({email: admin.email}, process.env.ADMIN_JWT_REFRESH_SECRET, {
        algorithm: 'HS256'
    })

    //store them
    admin.refreshToken = refreshToken
    admin.accessToken = accessToken

    admin.save((err,admin) => {
        if (err) return cb(err)

        cb(null, admin)
    })
}


//delete tokens
adminSchema.methods.deleteTokens = function(cb) {
    var admin = this

    admin.updateOne({$unset: {accessToken: 1, refreshToken: 1}}, function(err, admin) {
        if (err) return cb(err)

        cb(null, err)
    })
}

//verify access token
adminSchema.statics.verifyAccessToken = function(token, cb) {
    var admin = this

    jwt.verify(token, process.env.ADMIN_JWT_ACCESS_SECRET, function(err,decode) {
        if (err) return cb(err)

        admin.findOne({accessToken: token}, function(err,doc) {
            if (err) return cb(err)

            cb(null, doc)
        })
    })
}


//renew access token
adminSchema.statics.getNewAccessToken = function(token, cb) {
    var admin = this

    //verify expired access token
    const payload = jwt.verify(token, process.env.ADMIN_JWT_ACCESS_SECRET, {ignoreExpiration: true})

    //get admin
    admin.findOne({email: payload.email}, function(err,doc) {
        if (err) return cb(err)

        //verify admin refresh token
        jwt.verify(doc.refreshToken, process.env.ADMIN_JWT_REFRESH_SECRET, function(err, decode) {
            if (err) return cb(err)

            //generate new access token
            const newToken = jwt.sign({email: doc.email}, process.env.ADMIN_JWT_ACCESS_SECRET, {
                algorithm: 'HS256',
                expiresIn: process.env.ACCESS_LIFETIME
            })

            return cb(null, newToken, doc)
        })
    })
}


var Admin = mongoose.model('Admin', adminSchema)

module.exports = {Admin}