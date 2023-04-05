const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    googleId:{
        type: String
    },
    facebookId:{
        type: String
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    TYPE: {
        type: String,
        default: "STUDENT",
    },
    provider:{
        type: String,
    },
    jobid:{type : Array , "default" : []}
},{timestamps:true})

const User = mongoose.model('user',userSchema)
module.exports = User