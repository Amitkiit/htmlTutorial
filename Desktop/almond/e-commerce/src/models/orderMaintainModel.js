const { sequelize, DataTypes } = require("sequelize");

module.exports=(sequelize,DataTypes)=>{
const orderMaintains = sequelize.define('orderMaintains',{
    quentity:{
        type:DataTypes.INTEGER
    },
    orderPrice:{
        type: DataTypes.BOOLEAN,
        defaultValue:false
    },
});
return orderMaintains
}