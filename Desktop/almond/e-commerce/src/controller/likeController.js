const db = require("../models/mainModel")


const Likes = db.likes

const createLike = async function(req,res){
    let data = req.body
    let {like} = data
    let createLike = await Likes.create(data)
    res.status(201).send({status:true,message:"product like successfully",data:createLike})
}



module.exports={createLike}