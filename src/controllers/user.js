const User = require("../models/user")
const Token = require("../models/token")
const crypto = require("crypto")
const md5 = require("md5")
const {
  checkForAuthenticationCookie,
} = require("../middlewares/authentication");
const { createTokenForUser } = require("../services/authetication")
const { emailSender } = require('../utils/emailSender')
const {handleError,handleResponse} = require('../utils/helper')

exports.userSignup = async (req, res) => {
  const { name, email, password, TYPE } = req.body;
  if (!name || !email || !password) {
    handleError(res,'all fields are required',400)
    return
  }
  const userAvailable = await User.findOne({ email: email });
  if (userAvailable) {
    handleError(res,'User is alrady exist',400)
    return
  }
  try {
    const newUser = await User.create({
      name,
      email,
      password: md5(password),
      TYPE
    })
    if (newUser) {
    res.status(200).redirect("/")
    return
    }
  } catch (error) {
    handleError(res,error)
  }
}

exports.userSignin = async (req, res) => {
  const { email, password } = req.body
  if(!email){
   handleError(res,'email is required')
   return
  }
  if(!password){
   handleError(res,'password is required')
   return
  }
  try {
    const user = await User.findOne({ email: email })
    if (user) {
      const hashedPassword = md5(password)
      if (hashedPassword != user.password) {
       return res.status(404).json({msg:"invalid password"})
      }
      const token = createTokenForUser(user)
      return res.status(200).cookie('token', token).redirect("/")
    } else {
      return res.json("invalid user or password")
    }
  } catch (error) {
   handleError(res,error)
   return 
  }
}

exports.userLogout = async (req, res) => {
   res.clearCookie("google-auth-session")
   res.clearCookie("google-auth-session.sig")
   res.clearCookie("facebook-auth-session")
   res.clearCookie("facebook-auth-session.sig") 
   res.clearCookie("token")
   req.session = null
   req.logout()
   
  res.status(200).redirect('/')
  return

}

exports.forgotPassword = async (req,res) => {
  try{
    const {email} = req.body
    const user = await User.findOne({email: email})
    if(!user){
      res.status(404).json('user does not exist')

    }
    let token = await Token.findOne({ userId: user._id })
    if(!token){
        token = await new Token({
          userId: user._id,
         token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }
    const link = `${process.env.BASE_URL}/user/${user._id}/${token.token}`
    emailSender(user._id,link,'reset your password')
    res.status(200).json('email send succesfully')
  }catch(error){
    handleError(res,error)
  } 
}

exports.resetpassword = async(req, res) => {
  try{
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).send("invalid link or expired")
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link or expired")
    const password = md5(req.body.password)
    await User.updateOne({_id: token.userId},{$set:{password: password}})
    await Token.deleteOne({_id:token._id})

    res.send("password reset sucessfully.")
  }catch(error){
    handleError(res,error)
  }
}


