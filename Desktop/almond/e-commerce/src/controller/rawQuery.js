const db = require("../models/mainModel")
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models/mainModel');
const Users = db.users;
const Products = db.products;
const Likes = db.likes;

//const users = await sequelize.query("SELECT * FROM `users`", { type: QueryTypes.SELECT });
// We didn't need to destructure the result here - the results were returned directly
/**
 * const user = await User.create({
  name: 'John Doe',
  email: 'johndoe@example.com',
  age: 25
});


const [results, metadata] = await sequelize.query(
  "INSERT INTO Users (name, email, age) VALUES (:name, :email, :age)",
  {
    replacements: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      age: 25
    },
    type: QueryTypes.INSERT
  }
);

 */
// const findQuery = await sequelize.query(
//     "INSERT INTO Users(name,number,email,password)",{
//         data
//     },
//     type: QueryTypes.INSERT
//     )