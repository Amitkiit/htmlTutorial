const db= require("../models/mainModel")
const { model, where, Op } = require('sequelize');

const Locations = db.locations 
const createAddress = async function(req,res){
    let data = req.body
    let postAddress = await Locations.create(data)
    res.status(201).send({status:true,message:postAddress})
}

module.exports={createAddress}
