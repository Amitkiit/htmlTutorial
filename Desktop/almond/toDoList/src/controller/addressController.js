const db= require("../models/mainModel")
const { model, where, Op } = require('sequelize');
const Users = db.users
const Tasks = db.tasks
const Locations = db.locations
 
const createAddress = async function(req,res){
    let data = req.body
    let postAddress = await Locations.create(data)
    res.status(201).send({status:true,message:postAddress})
}
const findTaskAddress = async function(req, res) {
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


     //==============================aggregation===============================================================//
     const averageAge = async function(req,res){

      const result = await Locations.min('age')
      res.status(200).send({status:true,data:result})
          

    

     }



module.exports={createAddress,findTaskAddress,averageAge}
