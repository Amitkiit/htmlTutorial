const db = require("../models/mainModel");
const mysql = require("mysql");
const { sequelize, QueryTypes, model, where, NUMBER } = require("sequelize");
const Likes = db.likes;
const Products = db.products;
const Users = db.users;
const Orders = db.orders;
const Datamaintains = db.datamaintains;

//=====================add product in cart=====================================================//
const createOrder = async function (req, res) {
  let data = req.body;
  let orderCreate = await Orders.create(data);
  res.status(201).send({ message: "order is created", data: orderCreate });
};

//======================only add cart product will place the order =======================================================//
const orderPlace = async function (req, res) {
  let userId = req.params.userId;
  let productId = req.params.productId;
  let userFind = await Users.findOne({
    where: {
      id: userId,
    },
  });
  if (!userFind)
    return res.status(400).send({
      status: false,
      message: "Before placing the order you need to first register",
    });
  let x = userFind.balance; //user balance
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
  let y = productFind.price; // product price

  let findAmount = await Orders.findOne({
    where: {
      user_Id: userId,
      product_Id: productId,
    },
  });

  if (!findAmount)
    return res.status(400).send({
      status: false,
      message:
        "before placing the order you need to add this product in your cart",
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
  orderFind.users.balance = x - y * z;
  let a = x - y * z;
  if (a < 0) {
    orderFind.users.balance = 0;
  }
  orderFind.products.quentity = productFind.quentity - orderFind.orderquentity;
  let b = productFind.quentity - orderFind.orderquentity;

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
      where: {
        product_Id: productId,
      },
    });
    let quentityCount = await Orders.findOne({
      where: {
        product_Id: productId,
        user_Id: userId,
      },
    });
    await Datamaintains.update(
      {
        userOrderQuentity: userOrder.userOrderQuentity + z,
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

  res.status(200).send({
    status: true,
    message: "order place successfully",
    orderPrice: y * z,
    data: orderFind,
  });
};

//=======================without adding the product in cart place the order ==========//
const withoutCart = async function (req, res) {
  let userId = req.params.userId;
  let productId = req.params.productId;
  let data = req.body;
  let userFind = await Users.findOne({
    where: {
      id: userId,
    },
  });
  if (!userFind)
    return res.status(400).send({
      status: false,
      message: "Before placing the order you need to first register",
    });
  if (userFind.balance < 0) {
    userFind.balance = 0;
  }
  let productFind = await Products.findOne({
    where: {
      id: productId,
    },
  });
  let productPrice = productFind.price;
  if (productFind.quentity <= 0) {
    productFind.quentity = 0;
  }
  if (userFind.balance < productFind.price * data.quentity) {
    return res
      .status(400)
      .send({ status: false, message: "user have insufficient balance" });
  }
  if (
    !productFind ||
    productFind.quentity <= 0 ||
    productFind.isDeleted == 1 ||
    productFind.quentity < data.quentity
  )
    return res.status(400).send({
      status: false,
      message:
        "product are not available in the stock or may be order is deleted ",
    });
  let orderCreate = await Products.findOne({
    where: {
      id: productId,
    },
    attributes: { exclude: ["quentity"] },
  });
  if (orderCreate && userFind.balance > 0) {
    let newBalance = await Users.update(
      {
        balance: userFind.balance - productPrice * data.quentity,
      },
      {
        where: {
          id: userId,
        },
      }
    );
    if (newBalance.balance <= 0) {
      newBalance.balance == 0;
    }

    let newProduct = await Products.update(
      {
        quentity: productFind.quentity - data.quentity,
      },
      {
        where: {
          id: productId,
        },
      }
    );

    if (newProduct.quentity <= 0) {
      newProduct.quentity == 0;
    }

    let checkStock = await Datamaintains.findOne({
      where: {
        user_Id: userId,
        product_Id: productId,
      },
    });
    await Datamaintains.update(
      {
        user_Id: userId,
        userOrderQuentity: checkStock.userOrderQuentity + data.quentity,
        availableStock: productFind.quentity - data.quentity,
        refund: true,
      },
      {
        where: {
          product_Id: productId,
        },
      }
    );
  } else {
    return res.status(400).send({ status: 400, message: "" })
  }
  res.status(200).send({
    status: true,
    orderPrice: orderCreate.price * data.quentity,
    message: "order place successfully",
    data: orderCreate,
  });
};

//===============================return product if the product is add in cart and get the money ====================//

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
    let stockCheck = await Datamaintains.findOne({
      where: {
        user_Id: userId,
        product_Id: productId,
        refund: false,
      },
    });

    //console.log(stockCheck)
    let c = updateProduct.quentity; // current quentity of  return prodcut
    let priceOfReturnProduct = updateProduct.price;
    let numberOfProduct = updateUserBalance.orderquentity;
    let returnAmount = priceOfReturnProduct * numberOfProduct + b;

    let a = updateUserBalance.orderquentity;
    let d = updateProduct.price; // price of the return product
    let z = a * d; // total amount of product*quentity
    let updatedBalance = b + z;

    if (stockCheck) {
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
      await Datamaintains.update(
        {
          refund: true,
          availableStock: parseInt(c) + parseInt(a),
          userOrderQuentity:
            stockCheck.userOrderQuentity - updateUserBalance.orderquentity,
        },
        {
          where: {
            user_Id: userId,
            product_Id: productId,
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
          "product already return  successfully and amount is already credit in account and product also update in stock",
      });
    }
  } else {
    return res.status(400).send({
      status: 400,
      message:
        "user are not able to return this order because you are not a valid user for returning this product",
    });
  }
};

//===============return product if product is not added in cart=============================//

const returnPlaceOrderwithoutCart = async function (req, res) {
  let userId = req.params.userId;
  let productId = req.params.productId;
  let data = req.body;
  let updateUser = await Users.findOne({
    where: {
      id: userId,
    },
  });
  let b = updateUser.balance; // current user balance
  if (!updateUser)
    return res
      .status(400)
      .send({
        status: false,
        message: "you are not register user to return the product",
      });
  let updateProduct = await Products.findOne({
    where: {
      id: productId,
    },
  });
  let stockCheck = await Datamaintains.findOne({
    where: {
      user_Id: userId,
      product_Id: productId,
      refund: false,
    },
  });
  let c = updateProduct.quentity; // current quentity of  return prodcut
  let priceOfReturnProduct = updateProduct.price; // price of the prodcut
  let numberOfProduct = data.returnQuentity;

  let a = numberOfProduct;
  let d = updateProduct.price; // price of the return product
  let z = a * d; // total amount of product*quentity
  let updatedBalance = b + z;

  if (stockCheck) {
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
    await Datamaintains.update(
      {
        refund: true,
        availableStock: parseInt(c) + parseInt(a),
        userOrderQuentity: stockCheck.userOrderQuentity - numberOfProduct,
      },
      {
        where: {
          user_Id: userId,
          product_Id: productId,
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
        "product already return  successfully and amount is already credit in account and product also update in stock",
    });
  }

};

//==================place order with the existing offer=================================//

const placeOrderWithExistOffer = async function (req, res) {
  let userId = req.params.userId;
  let productId = req.params.productId;
  let userFind = await Users.findOne({
    where: {
      id: userId,
    },
  });
  if (!userFind)
    return res.status(400).send({
      status: false,
      message: "Before placing the order you need to first register",
    });
  let x = parseInt(userFind.balance); //user balance
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
  let y = Number(productFind.price) - (Number(productFind.price) * Number(productFind.offerInPercentage)) / 100; // product price
  let findAmount = await Orders.findOne({
    where: {
      user_Id: userId,
      product_Id: productId,
    },
  });

  if (!findAmount)
    return res.status(400).send({
      status: false,
      message:
        "before placing the order you need to add this product in your cart",
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
  //console.log(a)
  if (a < 0) {
    orderFind.users.balance = 0;
  }
  orderFind.products.quentity = productFind.quentity - orderFind.orderquentity;
  let b = productFind.quentity - orderFind.orderquentity;

  if (b < 0) {
    orderFind.products.quentity = 0;
  }
  //console.log(b)
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
      where: {
        product_Id: productId,
      },
    });
    console.log(userOrder)
    await Orders.findOne({
      where: {
        product_Id: productId,
        user_Id: userId,
      },
    });
   
    await Datamaintains.update(
      {
        userOrderQuentity: userOrder.userOrderQuentity + z,
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

  res.status(200).send({
    status: true,
    message: "order place successfully",
    orderPrice: y * z,
    data: orderFind,
  });
};
//========================delete the cart ================================================//

const deleteCart = async function (req, res) {
  let userId = req.params.userId;
  let cartId = req.params.cartId;
  let productId = req.params.productId;
  let cartDeleted = await Orders.findAndCountAll({
    where: {
      id: cartId,
      user_Id: userId,
      product_Id: productId,
    },
  });
  if (cartDeleted.isDeleted == 0) {
    let updateCartLikeDeleted = await Orders.update(
      { isDeleted: true },
      {
        where: {
          user_Id: userId,
        },
      }
    );
    if (updateCartLikeDeleted.isDeleted == 1) {
      await Datamaintains.update(
        {
          availableStock: availableStock + 1,
        },
        {
          where: {
            product_Id: productId,
          },
        }
      );
    }
    res.status(400).send({
      status: true,
      data: cartDeleted,
      message: "cart deleted successfully",
    });
  } else {
    return res
      .status(400)
      .send({ status: false, message: "cart is already deleted" });
  }
};

module.exports = {
  createOrder,
  orderPlace,
  returnPlaceOrder,
  returnPlaceOrderwithoutCart,
  withoutCart,
  deleteCart,
  placeOrderWithExistOffer,
};
