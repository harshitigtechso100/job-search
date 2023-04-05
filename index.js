const express = require('express')
const app = express()
require('dotenv').config()
const mongoose = require('mongoose')
const path = require('path')
const helmet = require('helmet')
const passport = require('passport')
const cookieparser = require('cookie-parser')
const cookieSession = require('cookie-session')
const session = require('express-session')

const userRoute = require('./src/router/user')
const jobRoute = require('./src/router/job')
const authRoute = require('./src/router/auth')
require('./src/utils/passport')

mongoose.connect('mongodb://127.0.0.1:27017/JobSearch')
.then((e) => console.log("MongoDB Conected"))


const {
    checkForAuthenticationCookie,
  } = require("./src/middlewares/authentication")
const Job = require('./src/models/job')
const User = require('./src/models/user')



//***************************************Middlewares*************************************//
// app.use(session({
//   resave: false,
//   saveUninitialized: true,
//   secret: 'SECRET'
// }))
// app.use(cookieSession({
//   name: 'google-auth-session',
//   keys: ['key1', 'key2']
// }))
app.use(cookieSession({
  name: 'facebook-auth-session',
  keys: ['key1', 'key2']
}))
app.use(helmet())
app.use(express.json())
app.use(cookieparser())
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.resolve('./public')))
app.use(express.urlencoded({extended: false}))
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(checkForAuthenticationCookie("token"))



//**********************************Home Route******************************//
app.get('/',async (req,res)=>{
    const user = req.user
    let userDetails
    if(user) userDetails = await User.findById({_id:user._id})
    else userDetails = ''
    const jobs = await Job.find({})
    res.status(200).render('home', {jobs:jobs,user:userDetails })
})

//***************************************All Routes*************************************//
app.use('/auth', authRoute)
app.use('/user',userRoute)
app.use('/job',jobRoute)


//******************************************Port****************************************//
PORT = process.env.PORT 
app.listen(PORT,()=>{
    console.log(`Express app is live on PORT --->>> ${PORT} `)
})