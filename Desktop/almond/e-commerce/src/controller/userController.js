const db = require("../models/mainModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");
const { sequelize, QueryTypes } = require("sequelize");

const {
  validateEmail,
  validPassword,
  validMobile,
} = require("../validator/validator");

const Users = db.users;
const Products = db.products;
const Likes = db.likes;

//=========================create user ==========================================//
const userCreate = async function (req, res) {
  let data = req.body;
  const { name, email, number, password } = req.body;
  if (!validateEmail(email))
    return res
      .status(400)
      .send({ status: false, message: "email is not valid form" });
  if (!validPassword(password))
    return res
      .status(400)
      .send({ status: false, message: "password is not in valid form" });
  if (!validMobile(number))
    return res
      .status(400)
      .send({ message: "mobile number is not in valid form" });
  let uniqueMobile = await Users.findOne({
    where: {
      number: number,
    },
  });
  if (uniqueMobile)
    return res
      .status(200)
      .send({ status: true, message: "mobile number is already exist" });
  let uniqueEmail = await Users.findOne({
    where: {
      email: email,
    },
  });
  if (uniqueEmail)
    return res
      .status(200)
      .send({ status: false, message: "email number is already exist" });
  let saltRound = 10;
  const hashedPassword = await bcrypt.hash(password, 10);
  data.password = hashedPassword;
  let createuser = await Users.create(data);

  res.status(201).send({ status: true, data: createuser });
};

//-----------------------------raw query for userCreation ----------------------------------------//

// const userCreate = async function(req,res){
//     const {name,number,email,password} = req.body
//     const now = new Date();
//     let queries = `INSERT INTO Users (name,number,email,password,createdAt,updatedAt) VALUES (?,?,?,?,?,?)`

//     //console.log(name)
//     const createUser= await db.sequelize.query( queries,   //sequelize. query
//         {
//             replacements:[name, number, email, password,now,now],
//             type:QueryTypes.INSERT
//         }
//     )
//     const getUser = await Users.findOne({
//         where: { id: createUser[0] } // assuming the primary key is "id"
//     });
//     console.log(getUser)
//     res.status(201).send({ data: getUser });
// }

//==========================login user  =====================================================//

const loginUser = async function (req, res) {
  let data = req.body;
  const { email, password } = data;
  let user = await Users.findOne({
    where: {
      email: email,
    },
  });
  if (!user)
    return res
      .status(200)
      .send({ status: false, message: "user are not register" });
  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
      let token = jwt.sign({ userId: user.id }, "my second project");
      res.header("x-api-key", token);
      res.status(200).send({
        status: true,
        message: "logging successfully",
        data: { user: user, token },
      });
    } else {
      return res
        .status(400)
        .send({ status: false, message: "password is incorrect" });
    }
  });
};

//-------------------raw query for findOne -----------------------------------------------------//
// const loginUser = async function (req, res) {
//         const data = req.body;
//         const { email, password } = data;
//         const queries = `SELECT * FROM Users WHERE email = "${email}" limit 1`
//         const [one , two] = await db.sequelize.query(queries);
//         res.status(200).send({ status: true, data: one});

//   };

//---------------------raw query for update user ----------------------------------------------------//

const updateUser = async function (req, res) {
  let userId = req.params.userId;
  //let data = req.body
  let data = req.query;
  const { name, password } = data;
  //let queries =`UPDATE Users SET name = '${name}' WHERE id = ${userId}`;   passing data by the postman
  let queries = `UPDATE Users SET name='${name}' WHERE id = ${userId}`; // passsing data by the query
  let [result] = await db.sequelize.query(queries, { types });
  res.status(200).send({ status: true, data: result });
};

//===============find product based on userId and what is the responce from user side on the perticular product ======================================//
const findProduct = async function (req, res) {
  let userId = req.params.userId;
  let productId = req.params.productId;
  let getAllProduct = await Users.findAll({
    //productId
    include: [
      {
        model: Products,
        as: "products",
        where: {
          isDeleted: false,
          user_Id: userId,
        },
      },
      {
        model: Likes,
        as: "likes",
        where: {
          product_Id: productId,
        },
      },
    ],
  });

  res.status(200).send({ status: true, data: getAllProduct });
};

//===============find product based on the liks or dislike =============================//

module.exports = { userCreate, loginUser, findProduct, updateUser };

//=============@@@@@@@@@@ raw query @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@====================================//

/**
 * app.post('/users', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const [results, metadata] = await sequelize.query(
      'INSERT INTO Users (name, email, age) VALUES (:name, :email, :age)',
      {
        replacements: {
          name,
          email,
          age
        },
        type: QueryTypes.INSERT
      }
    );
    const [user] = results;
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

 */

// const createUser = async function(req,res){
//     const {name,number,email,password} = req.body
//     //console.log(name)
//     const [results,metadata]= await sequelize.query(
//         'INSERT INTO Users (name,number,email,password) VALUES (:name,:number,:email,:password)',{
//             replacement:{
//                 name,
//                 number,
//                 email,
//                 password
//             },
//             type:QueryTypes.INSERT
//         }
//     )
//     console.log(results)
//     const [user] = results;
//     res.status(201).send({data:user})

// }

// module.exports={createUser}

//===============######### raw query ##########################=====================================//
