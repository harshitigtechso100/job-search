
exports.handleResponse = (res, data, status = 200) => {
   res.status(status).json({data, error: false})
   return
}

exports.handleError = (res, error, status = 400) => {
        if(error.details){
            const data = {}
            error?.details.forEach(v => {
                data[v.context?.key] = [v.message.replace(/"/g, '')]
            })
            res.status(status).json({error: data})
            return
        }
        else{
            return res.json({message:error, error:true}).status(400)
            return
        }
}