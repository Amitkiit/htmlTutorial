const db = require("../models/mainModel");
const { sequelize, DataTypes, model, Op, where } = require("sequelize");

const Likes = db.likes;
const Products = db.products;
const Users = db.users;
const Orders = db.orders

//=========================create product =====================================//
const createProduct = async function (req, res) {
  let data = req.body;
  let postProduct = await Products.create(data);
  res.status(201).send({ status: true, data: postProduct });
};

//=======================get product ===============================================//
const getProduct = async function (req, res) {
  let query = req.query;
  let { productName, category, color,size,price } = query;
  // console.log(size)
  // size = size.split(',')
  // for(i of size){
  //   if(!['S','M','L','XL','XX'].includes(i))  return res.status(400).send({ status: false, message: "please provide availableSizes in [S, XS, M, X, L, XXL, XL]" })
  // }
  //if(!size.include('S','M','L','XL','XX')) return res.status(400).send({status:false,message:"pls give valid size like 'S','M','L','XL','XX' "})
  if (!productName && !category && !color && !size && !price) {
    let allProduct = await Products.findAll();
    return res.status(200).send({ status: true, data: allProduct });
  }
  let getProduct = await Products.findOne({
    where: query,
  });
  if(!getProduct) return res.status(400).send({status:false,message:"this type of product is not  exist"})

  res.status(200).send({ status: true, data: getProduct.toJSON()});
};
//===================get product based one the user responce(like or dislike)=========================//

const likeFilterOutOnPerticularProduct = async function (req, res) {
  let productId = req.params.productId;
  let query = req.query;
  const findLike = await Products.findAll({
    include: [
      {
        model: Likes,
        as: "likes",
        where: {
          product_Id: productId,
          like: {
            [Op.eq]: query.like,
          },
        },
        include: [
          {
            model: Users,
            as: "users",
          },
        ],
      },
    ],
  });
  res.status(200).send({ status: true, data: findLike });
};

//===================find all like count ===============================//

const countAllLikeProduct = async function (req, res) {
  let productId = req.params.productId;
  let query = req.query;
  const findLikeWithCount = await Likes.findAndCountAll({
    where: {
      product_Id: productId,
      like: { [Op.eq]: query.like },
    },
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });
  res
    .status(200)
    .send({
      status: true,
      message: "count get all the data",
      data: findLikeWithCount,
    });
};

//=========================update product ============================================================//
const updateProduct = async function (req, res) {
  let productId = req.params.productId;
  let data = req.body;
  let findProduct = await Products.findOne({
    where: {
      id: productId,
    },
  });
  if (!findProduct)
    return res.status(400).send({ message: "produxt does not exist" });
  if (findProduct.isDeleted == 0) {
    let productUpgrade = await Products.update(data, {
      where: {
        id: productId,
      },
    });
    res
      .status(200)
      .send({
        status: true,
        message: "product upgrade successfully",
        data: productUpgrade,
      });
  } else {
    return res.status(400).send({ message: "product is already deleted" });
  }
};

//=======================delete product =====================================================//

const deleteProduct = async function (req, res) {
  let productId = req.params.productId;
  let findProduct = await Products.findOne({
    where: {
      id: productId,
    },
  });
  if (!findProduct)
    return res
      .status(400)
      .send({ status: false, message: "product is not exist" });
  if (findProduct.isDeleted == 0) {
    let productDelete = await Products.update(
      { isDeleted: true },
      {
        where: {
          id: productId,
        },
      }
    );
    res
      .status(200)
      .send({ status: true, message: "product deleted successfully" });
  } else {
    return res.status(400).send({ message: "product is already deleted" });
  }
};

//-----------------------raw query for the delete---------------------------------------------------//
// const deleteProduct = async function (req, res) {
//   let productId = req.params.productId;
//   //let queries = `DELETE FROM Products WHERE id = ${productId}`  // hardly deleted
//   let queries=`UPDATE Products SET isDeleted = true WHERE id = ${productId}`    //softly deleted
//   let deleteProduct = await db.sequelize.query(queries)
//   res.status(200).send({status:true,message:"prodcut deleted successfully"})
// };
//--------------------------------------------------------------------------------------------------//
module.exports = {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  likeFilterOutOnPerticularProduct,
  countAllLikeProduct,
};

 