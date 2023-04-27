const db= require("../models/mainModel")
const Users = db.users
const jwt = require('jsonwebtoken');
const authenticate = async function(req,res,next){
    
        let token= req.headers['x-api-key']

        //console.log(token)
        if(token){
            let decodedToken = jwt.verify(token,"my first project")
            req.id=decodedToken.userId
            //console.log(req.id)
            next()
        }
        else {
            res.status(400).send({ msg: "x-api-key is require in header" })
        }   
}

const authorization = async function(req,res,next){
    let user_Id=req.params.userId
    //console.log(user_Id)
    let Id = req.id
    let userCheck = await Users.findOne({
        where:{
            id:user_Id
        }
    })
    //console.log(userCheck)
    if(!userCheck) return res.status(400).send({status:false,message:"user are not able to procied on the next step"})
    console.log("authorization is finished")
    console.log(Id)
    console.log(userCheck.id)
    if(Id==userCheck.id){
        console.log("authorization has been finished")
       
        next()
    }
    else{
        return res.status(400).send({status:false,message:"user have no authorization"})
    }
}

module.exports={authenticate,authorization}

