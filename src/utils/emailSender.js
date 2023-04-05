const { User } = require("../models");
const Sib = require('sib-api-v3-sdk')
const client = Sib.ApiClient.instance ;
const apiKey = client.authentications['api-key'] ;
apiKey.apiKey = process.env.API_KEY ;


exports.emailSender = async (userid, link, subject) => {
  let text = link?link:'You have create new job'
  let sub = subject?subject: 'New JOb Alert'
    try {
      const userDetails = await User.findById({_id:userid})
      const tranEmailApi = new Sib.TransactionalEmailsApi()
      const sender = {
        email: 'finejob@gmail.com',
        name: 'Fines Jobs',
      }
      const receivers = [
        {
            email: userDetails.email,
        },
    ]
    console.log(receivers)
      tranEmailApi.sendTransacEmail({
          sender,
          to: receivers,
          subject: sub, 
          textContent: text ,
          params: {
              role: 'Frontend',
          },
      })
      .then(console.log)
      .catch(console.log)
  
      return
    } catch (error) {
      throw new Error(error);
      return
    }
  }