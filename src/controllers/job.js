const { User } = require('../models');
const Job = require('../models/job');
const { emailSender } = require('../utils/emailSender');
const { handleError, handleResponse } = require('../utils/helper');


exports.filterSalary = async (req,res) => {
    const {min,max,Titel,location} = req.body
    try{
       let jobs 
       if(min && max && Titel && location ){
          jobs = await Job.find({Salary :  { $gt: min, $lt: max } , Titel: Titel, Location: location })
       }
       else if(Titel && !location && min && max ){
         jobs = await Job.find({Salary :  { $gt: min, $lt: max } , Titel: Titel })
       }
       else if(!Titel && location && min && max ){
        jobs = await Job.find({Salary:  { $gt: min, $lt: max } , Location: location })
      }
      else if( Titel && location && !min && !max ){
        jobs = await Job.find({ Titel: Titel, Location: location })
      }
      else if( Titel && !location && min && max ){
        jobs = await Job.find({Salary:  { $gt: min, $lt: max },Titel: Titel })
      }
      else if(Titel && !location && !min && !max){
        jobs = await Job.find({Titel: Titel })
      }
      else if(!Titel && location && !min && !max){
        jobs = await Job.find({ Location: location})
      }
      else if(!Titel && !location && min && max){
        jobs = await Job.find({Salary: { $gt: min, $lt: max }})
      }
      else{
        handleError(res,'Not Found!',404)
        return
      }
      if(jobs){
       // handleResponse(res,jobs,200)
       const user = req.user
       let userDetails
       if(user){
          userDetails = await User.findById({_id:user._id})
       }
       else{
         userDetails = ''
       }
       res.status(200).render('home',{jobs:jobs,user:userDetails})
      }else{
        handleError(res,'Not Found!',404)
      }

    }catch(error){
        handleError(res,error)
    }
}

exports.addJob = async (req,res) => {
    const {jobpost, Titel, Company, Location,  Salary, userid} = req.body
    if(req.user){
      try{
        const newJob = await Job.create({
            jobpost, 
            Titel, 
            Company, 
            Location,  
            Salary,
            userid: req.user_id
         })
         
         if(newJob){
          emailSender(req.user._id)
           res.status(201).redirect('/')
         }
         else{
            handleError(res,'Job is not created')
         }
      }catch(error){
        handleError(res,error)
      }
    }else{
      handleError(res,'error')
    }
}
exports.saveJob = async (req,res) => {
    if(req.user){
        const id = req.params.id
        const jobid = await Job.findById({_id:id})
        if(jobid){
          const userid = req.user._id
            await Job.updateOne( { _id: id },{$set:{userid:userid}})
            emailSender(req.user._id)  
            res.status(201).redirect("/")
        }else{
            handleError(res,'Job does not exist',404)
        }


    }else{
        return res.status(404).redirect('/')
    }
}

exports.myJob = async(req,res) => {
  if(req.user){
    const userid = req.user._id
    const ifUser = await User.findById({_id:userid})
    if(ifUser){
      const myjobs = await Job.find({userid:userid})
      const user = req.user
       let userDetails
       if(user){
          userDetails = await User.findById({_id:user._id})
       }
       else{
         userDetails = ''
       }
      res.status(200).render('myJobs',{myjobs:myjobs,user:userDetails})
    }else{
      handleError(res,'user does not exist')
      return
    }
    
  }else{
    res.status(404).redirect('/')
  }
}

exports.remove = async(req,res) => {
  if(req.user){
    const id = req.params.id
     const jobid = await Job.findById({_id:id})
    if(jobid){
        await Job.updateOne({ _id: id },{$set:{userid:null}}) 
        emailSender(req.user._id)
        res.status(201).redirect('/job/myjob')
    }else{
        handleError(res,'Job does not exist',404)
    }
  }
}
exports.deleteJob = async(req,res) =>{
  try{
    const id = req.params.id
    const jobDetails = await Job.findById({_id:id})
    if( !jobDetails ){
        handleError(res,"book not Found",404)
        return
    }
    const deletedJob = await Job.deleteOne({_id:id})
    if( !deletedJob ){
        handleError(res,"Book is not Delete")
        return
    }
    res.status(200).redirect('/')
    return

}catch(error){
    handleError(res, error)
    return
}
}
