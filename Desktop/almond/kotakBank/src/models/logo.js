const { sequelize, DataTypes } = require("sequelize");

module.exports=(sequelize,DataTypes)=>{
const logos = sequelize.define('logos',{
    // name:{
    //     type:DataTypes.STRING,
    //     allowNull:false
    // },
    Image:{
        type:DataTypes.STRING,
        allowNull:false
    },
});

return logos

}