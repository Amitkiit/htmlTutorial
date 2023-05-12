const db = require("../models/mainModel");
const { sequelize, QueryTypes} = require("sequelize");




const Datamaintains = db.datamaintains;

const createStock = async function(req,res){
    let data = req.body
    let result = await Datamaintains.create(data)
    res.status(201).send({status:true,data:result})

}


module.exports={createStock}