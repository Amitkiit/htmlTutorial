const { sequelize, DataTypes } = require("sequelize");

module.exports=(sequelize,DataTypes)=>{
const orders = sequelize.define('orders',{
    orderquentity:{
        type:DataTypes.INTEGER
    },

});
return orders
}