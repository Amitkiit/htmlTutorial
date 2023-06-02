const db= require("../models/mainModel")
const Users = db.userDetails
const jwt = require('jsonwebtoken');
const authenticate = async function(req,res,next){
        
        let token= req.headers['x-api-key']
        if(token){
            let decodedToken = jwt.verify(token,"process.env.SIGNATURE")
            req.id=decodedToken.user_mobileNumber
            next()
        }
        else {
            res.status(400).send({ msg: "x-api-key is require in header" })
        }   
}

const authorization = async function(req,res,next){
    let Id = req.id
    const {mobileNumber} = req.body
    let userCheck = await Users.findOne({
        where:{
            mobileNumber:mobileNumber
        }
    })
    if(!userCheck) return res.status(400).send({status:false,message:"user are not able to procced on the next step"})
    if(Id==userCheck.mobileNumber){
        next()
    }
    else{
        return res.status(400).send({status:false,message:"user have no authorization"})
    }
}

module.exports={authenticate,authorization}