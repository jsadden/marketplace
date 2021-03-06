const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const app = express()
const dotenv = require('dotenv')
const result = dotenv.config()

app.use(express.json({limit: '15mb'}))
app.use(cookieParser())

//import routes
const User = require('./routes/userRoutes')
app.use('/api/users', User)
const Posts = require('./routes/postRoutes')
app.use('/api/posts', Posts)
const Conversation = require('./routes/conversationRoutes')
app.use('/api/conversations', Conversation)



//connect to db
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})

//production config
app.use(express.static('client/build'))
if(process.env.NODE_ENV === 'production') {
    const path = require('path')
    app.get('/*', (req,res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'))
    })
}

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log("Server running on port: " + PORT)