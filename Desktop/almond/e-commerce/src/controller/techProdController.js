const db = require("../models/mainModel");
const { sequelize, DataTypes, model, Op} = require("sequelize");

const TechProduct = db.techProducts;
const TechRating = db.techRatings


const techProduct = async function(req,res){
    let data = req.body
    const {productName,price,category,quentity,model,series,processer,graphic,image,ram,storage} =data
    //console.log(productName)
    const productCreate = await TechProduct.create(data)
    return res.status(201).send({status:true,data:productCreate})
}
const ratingOnProduct = async function(req,res){
    let data = req.body
    const {user_Id,techProd_Id,rating} = data
    //console.log(user_Id)
    const createProduct = await TechRating.create(data)
    return res.status(201).send({status:true,data:createProduct})

}
module.exports= {techProduct,ratingOnProduct}