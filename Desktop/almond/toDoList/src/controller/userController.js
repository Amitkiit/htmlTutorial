const db= require("../models/mainModel")
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { model, where,Op } = require('sequelize');
const {validateEmail,validPassword,validMobile} = require("../validator/validator")
const {}= require("../middlewre/auth")

const Users = db.users
const Tasks = db.tasks
const Locations = db.locations


const userCreate = async function(req,res){
    let data = req.body
    const {name,email,number,password} = req.body
    if(!validateEmail(email)) return res.status(400).send({status:false,message:"email is not valid form"})
    if(!validPassword(password)) return res.status(400).send({status:false,message:"password is not in valid form"})
    if(!validMobile(number)) return res.status(400).send({message:"mobile number is not in valid form"})
    let saltRound = 10;
    const hashedPassword = await bcrypt.hash(password, 10);
    data.password=hashedPassword
    let createuser = await Users.create(data)

    res.status(201).send({status:true,data:createuser})

}

const loginUser=async function(req,res){
    let data = req.body
    const {email,password} = data
    let user = await Users.findOne({
        where:{
            email:email
        }
    })
    if(!user) return res.status(200).send({status:false,message:"user are not register"})
    bcrypt.compare(password,user.password, function(err, result) {
        if(result){
            
            let token = jwt.sign({userId:user.id},"my first project")
            res.header('x-api-key',token)
            res.status(200).send({status:true,message:"logging successfully",data:{user:user,token}})
        }
        else { return res.status(400).send({ status: false, message: 'password is incorrect' }) }
    });   
}

// ==============this is the API for find user as per userId=====================================//

// const findUser = async function(req, res) {
//   const userId= req.params.userId;
//   let userNotExist= await Users.findOne({
//     where:{
//       id:userId
//     }
//   })
//   if(!userNotExist)return res.status(400).send({status:false,message:"user are not exist"})
//     const user = await Users.findAll({
//       include:[{
//         model:Tasks,
//         as:"tasks",
//         where:{
//           isDeleted:false
//         }
//       }],
//       where:{
//         id:userId,
//       }
//     })
//     res.status(200).send({status:true,data:user})
  
//    }

   //===========get task address=======================================//
   const findUser = async function(req, res) {
    const userId= req.params.userId;
    const taskId = req.params.taskId
    let userNotExist = await Users.findOne({
      where:{
        id:userId
      }
    })
    if(!userNotExist)return res.status(400).send({status:false,message:"user are not exist"})
      const user = await Users.findAll({
        include:[{
          model:Tasks,
          as:"tasks",
          where:{
            isDeleted:false
          }
        },
        {
          model: Locations,
          as: "locations",
          where:{
            task_Id:taskId
          }
        }
      
      ],
        // include:[{
        //   model:Locations,
        //   as:"locations",
        // }],
        where:{
          id:userId,
        }
      })
      res.status(200).send({status:true,data:user})  
     }


  //=====================update the task if the user is valid==================================//



  const updateTaskByValidUser= async function(req,res){
    let userId = req.params.userId
    let taskId = req.params.taskId
    let data = req.body
    let findTask = await Tasks.findOne({
      where:{
        [Op.and]:[
          {user_Id:{[Op.like]:userId}},
          {id:{[Op.like]:taskId}}
        ]
      }
    })  
    if(findTask.isDeleted==0){
      let updateTask = await Tasks.update(
        data,
        {where:{id:taskId}}
      )
       res.status(200).send({status:true,message:updateTask})
    }
    else {
      return res.status(400).send({status:false,message:"task is already deleted"})
    }
  }

  //==================delete by the with the valid user==============================//
  const deleteTaskByValidUser = async function(req,res){
    let userId= req.params.userId
    let taskId = req.params.taskId
    console.log(userId)
    console.log(taskId)
    let userFind= await Tasks.findOne({
      where:{
        [Op.and]:[
          {user_Id:{[Op.like]:userId}},
          {id:{[Op.like]:taskId}}
        ]
      }
    })
    if(userFind.isDeleted==0){
      let deleteTask= await Tasks.update(
        {isDeleted:true},
        {where:{id:taskId}}
      )
      res.status(200).send({status:true,data:deleteTask})
    }
    else{
      return res.status(400).send({message:"task is already deleted"})
    }
  }

  //=======================find user detail with the task and address also of user===================//

  
  
 
module.exports={userCreate,loginUser,findUser,updateTaskByValidUser,deleteTaskByValidUser}