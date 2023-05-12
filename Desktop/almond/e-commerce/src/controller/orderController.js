const db = require("../models/mainModel");
const mysql = require("mysql");
const { sequelize, QueryTypes, model, where } = require("sequelize");
const Likes = db.likes;
const Products = db.products;
const Users = db.users;
const Orders = db.orders;
const Datamaintains = db.datamaintains;

//=====================create order =====================================================//
const createOrder = async function (req, res) {
  let data = req.body;
  let orderCreate = await Orders.create(data);
  res.status(201).send({ message: "order is created", data: orderCreate });
};

//======================only order place here =======================================================//
const orderPlace = async function (req, res) {
  let userId = req.params.userId;
  let productId = req.params.productId;
  let userFind = await Users.findOne({
    where: {
      id: userId,
    },
  });
  if (!userFind)
    return res
      .status(400)
      .send({
        status: false,
        message: "Before placing the order you need to first register",
      });
  let x = userFind.balance;                        //user balance
  let productFind = await Products.findOne({
    where: {
      id: productId,
    },
  });
  if (!productFind || productFind.quentity <= 0 || productFind.isDeleted == 1)
    return res.status(400).send({
      status: false,
      message:
        "product are not available in the stock or may be order is deleted ",
    });
  let y = productFind.price;                          // product price

  let findAmount = await Orders.findOne({
    where: {
      user_Id: userId,
      product_Id: productId,
    },
  });

  if (!findAmount)
    return res
      .status(400)
      .send({
        status: false,
        message:
          "before placing the order you need to add this prodcut in your cart",
      });

  let p = findAmount.orderquentity; // order quentity
  if (x < y * p)
    return res
      .status(400)
      .send({ status: false, message: "user have not sufficient balance " });

  if (productFind.quentity < p)
    return res.status(400).send({
      status: false,
      message: "product quantity is insufficient",
    });

  let orderFind = await Orders.findOne({
    include: [
      {
        model: Users,
        as: "users",
      },
      {
        model: Products,
        as: "products",
      },
    ],
    where: {
      user_Id: userId,
      product_Id: productId,
    },
  });
  let z = orderFind.orderquentity;
  //console.log(z)
  orderFind.users.balance = x - y * z;
  let a = x - y * z;
  if (a < 0) {
    orderFind.users.balance = 0;
  }
  orderFind.products.quentity = productFind.quentity - orderFind.orderquentity;
  let b = productFind.quentity - orderFind.orderquentity;
  //console.log(b)
  if (b < 0) {
    orderFind.products.quentity = 0;
  }
  productFind.quentity = productFind.quentity - orderFind.orderquentity;
  let updatedUserBalance = await Users.update(
    {
      balance: orderFind.users.balance,
    },
    {
      where: {
        id: userId,
      },
    }
  );
  await Products.update(
    {
      quentity: orderFind.products.quentity,
    },
    {
      where: {
        id: productId,
      },
    }
  );
  if (updatedUserBalance.length == 1) {
    let userOrder = await Datamaintains.findOne({
      where:{
        product_Id:productId
      }
    })
      if(userOrder.availableStock>0){
        await Datamaintains.update(
          {
            userOrderQuentity:userOrder.userOrderQuentity +z,
            availableStock: productFind.quentity - findAmount.orderquentity,
          },
          {
            where: {
              user_Id: userId,
              product_Id: productId,
            },
          }
        );
      }
      else{
        return res.status(400).send({status:false,message:"stock is empty"})
      }
  }

  res.status(200).send({
    status: true,
    message: "order place successfully",
    orderPrice: y * z,
    data: orderFind,
  });
};

//===============================ordreplace and product return in same API  ====================//

const returnPlaceOrder = async function (req, res) {
  let userId = req.params.userId;
  let orderId = req.params.orderId;
  let productId = req.params.productId;
  let updateUserBalance = await Orders.findOne({
    where: {
      id: orderId,
      user_Id: userId,
      product_Id: productId,
    },
  });
  if (updateUserBalance) {
    let updateUser = await Users.findOne({
      where: {
        id: userId,
      },
    });
    let b = updateUser.balance; // current user balance
    let updateProduct = await Products.findOne({
      where: {
        id: productId,
      },
    });
    let c = updateProduct.quentity; // current quentity of  return prodcut

    let a = updateUserBalance.orderquentity;
    let d = updateProduct.price; // price of the return product
    let z = a * d; // total amount of product*quentity
    let updatedBalance = b + z;

    if (req.body.balance >= updatedBalance) {
      await Users.update(
        {
          balance: updatedBalance,
        },
        {
          where: {
            id: userId,
          },
        }
      );
      await Products.update(
        {
          quentity: parseInt(c) + parseInt(a),
        },
        {
          where: {
            id: productId,
          },
        }
      );

      return res.status(200).send({
        status: true,
        message:
          "all data updated successfully including product quantity and user balance ",
      });
    } else {
      return res.status(400).send({
        status: false,
        message:
          "product order successfully and amount is also credit in account and product also update in stock",
      });
    }
  } else {
    return res
      .status(400)
      .send({
        status: 400,
        message:
          "user are not able to return this order because you are not a valid user for returning this product",
      });
  }
};

module.exports = { createOrder, orderPlace, returnPlaceOrder };
