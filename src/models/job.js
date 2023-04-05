const mongoose = require('mongoose')
const Schema = mongoose.Schema

const jobSchema = new mongoose.Schema({
    jobpost:{
        type: String
    },
    Titel:{
        type: String,
    },
    Company:{
        type: String,
    },
    Location:{
        type: String,
    },
    Salary:{
        type:Number
    },
    userid:{
        type: Schema.Types.ObjectId,
        ref: "user",
    }

},{timestamps: true})

const Job  = mongoose.model('job',jobSchema)
module.exports = Job