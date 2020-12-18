const {User} = require('../models/userModel')

let AuthMiddleware = (req,res,next) => {

    //get access token from cookies
    let token = req.cookies.auth 
    if (!token) return res.json({message: 'Not logged in'})

    //check for alg attack
    const header = token.split('.')[0]
    const headerString = Buffer.from(header, 'base64').toString('ascii')
    let headerObj
    try {
        headerObj = JSON.parse(headerString)
    } catch (error) {
        return res.json({message: 'Cookie error'})
    }
     
    if (headerObj.alg !== 'HS256') return res.status(401).json({message: 'Incorrect alg detected'})


    //try verifying token
    User.verifyAccessToken(token, (err, user) => {
        if (err) {

            //if token is expired
            if (err.name == 'TokenExpiredError') {

                //try get new token
                User.getNewAccessToken(token, (err, newToken, user) => {
                    if (err) return res.json(err)

                    //set value
                    user.accessToken = newToken

                    //save to db
                    user.save((err, doc) => {
                        if (err) return res.json(err)

                        req.user = doc
                        req.accessToken = newToken
                        //update cookie
                        res.cookie('auth', newToken)
                        return next()
                    })
                    
                })
            } else {

                //general error
                return res.json(err)
            }

        } else if (!user) {

            //send this if no user was returned
            return res.send(false)
        } else {

            //token is valid, set values and continue
            //console.log(token)
            req.accessToken = token
            req.user = user
            res.cookie('auth', token)
            return next()
        }

    })
}

module.exports = {AuthMiddleware}