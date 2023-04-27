const { sequelize, DataTypes } = require("sequelize");

module.exports=(sequelize,DataTypes)=>{
const locations  = sequelize.define('locations ',{
    currAdd:{
        type:DataTypes.STRING,
        allowNull:false
    },
    perAdd:{
        type:DataTypes.STRING,
        allowNull:false
    },
   
});

return locations 

}