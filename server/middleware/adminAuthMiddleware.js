const {Admin} = require('../models/adminModel')

let AdminAuthMiddleware = (req,res,next) => {

    //get access token from cookies
    let token = req.cookies.adminauth
    if (!token) return res.status(401).json({message: 'Not logged in'})

    //check for alg attack
    const header = token.split('.')[0]
    const headerString = Buffer.from(header, 'base64').toString('ascii')
    const headerObj = JSON.parse(headerString)
    if (headerObj.alg !== 'HS256') return res.status(401).json({message: 'Incorrect alg detected'})

    //verify
    Admin.verifyAccessToken(token, (err, admin) => {
        if (err) {

            //token expired
            if (err.name == 'TokenExpiredError') {
                Admin.getNewAccessToken(token, (err, newToken, admin) => {
                    if (err) return res.json(err)
                    
                    //set value
                    admin.accessToken = newToken

                    //save to db
                    admin.save((err,doc) => {
                        if (err) return res.json(err)

                        req.admin = doc
                        
                        //update cookie
                        res.cookie('adminauth', newToken)
                        return next()
                    })
                    
                })

            } else {
                //general error
                return res.json(err)
            }

        } else if (!admin) {

            //send this if no admin was returned
            return res.send(false)
        } else {

            //token is valid
            req.accessToken = token
            req.admin = admin
            return next()
        }
    })
}

module.exports = {AdminAuthMiddleware}