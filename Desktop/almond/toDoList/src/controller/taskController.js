
const db= require("../models/mainModel")
const Tasks = db.tasks

const taskCreate = async function(req,res){
    let data = req.body
    //console.log(data)
    let createTask = await Tasks.create(data)
    res.status(201).send({status:true,data:createTask})
}

//=============================find task ====================================================================//
const findTask = async function(req,res){
    let query = req.query
    let {id,task,who,duedate}= query
    if(!id && !task && !who && ! duedate){
        let allTaskDetails = await Tasks.findAll()
        return res.status(200).send({status:true,data:allTaskDetails})
    }
    
    let findTask = await Tasks.findOne({
              where:query
          })
          if(!findTask) return res.status(400).send({message:"task does not exists"})
         if(findTask.done==1) {
            res.status(200).send({message:"task is already deleted"})
         }
         else{
            res.status(200).send({status:true,data:findTask})
         }
}
//===============================update task=================================================================//
const updateTask = async function(req,res){
    let UserId = req.params.userId
    let data = req.body
    let taskDetail = await Tasks.findOne({
        where:{
            id:UserId
        }
    })
    if(!taskDetail) return res.status(200).send({status:false,message:"task does not exist"})
    if(taskDetail.done==0){
        let updateData = await Tasks.update(
        data,
        {where:{id:UserId}}
    )
    res.status(200).send({status:true,data:updateData})
    }
    else{
        return res.status(200).send({status:false,message:"taskDetails is already deleted"})
    }
   
}

const deleteTask= async function(req,res){
    let data = req.params.userId
    let taskDetail = await Tasks.findOne({
        where:{
            id:data
        }
    })
    if(!taskDetail) return res.status(400).send({message:"task is not exits"})
    if(taskDetail.done==0){
        let deleteData = await Tasks.update(
            {done:true},
            {where:{id:data}}
        )
    }
    else{
        return res.status(200).send({message:"task is already deleted"})
    }


    res.status(200).send({message:"task deleted successfully"})
}

module.exports={taskCreate,findTask,updateTask,deleteTask}

