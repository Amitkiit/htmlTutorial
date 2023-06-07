const { sequelize, DataTypes } = require("sequelize");

module.exports=(sequelize,DataTypes)=>{
const users = sequelize.define('users',{
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    number:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
       type: DataTypes.STRING,
       default:false
    },
    password:{
        type: DataTypes.STRING,
        defaultValue: false
    },
    balance:{
        type: DataTypes.DECIMAL(10, 2),
    }, 
});

return users

}