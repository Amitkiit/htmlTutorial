const db= require("../models/mainModel")
const Users = db.users
const jwt = require('jsonwebtoken');
const authenticate = async function(req,res,next){
        
        let token= req.headers['x-api-key']
        if(token){
            let decodedToken = jwt.verify(token,"my first project")
            req.id=decodedToken.userId
            next()
        }
        else {
            res.status(400).send({ msg: "x-api-key is require in header" })
        }   
}

const authorization = async function(req,res,next){
    let user_Id=req.params.userId
    let Id = req.id
    let userCheck = await Users.findOne({
        where:{
            id:user_Id
        }
    })
    if(!userCheck) return res.status(400).send({status:false,message:"user are not able to procied on the next step"})
    //console.log("authorization is finished")
    
    if(Id==userCheck.id){
        next()
    }
    else{
        return res.status(400).send({status:false,message:"user have no authorization"})
    }
}

module.exports={authenticate,authorization}

