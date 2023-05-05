const { sequelize, DataTypes } = require("sequelize");

module.exports=(sequelize,DataTypes)=>{
const likes = sequelize.define('likes',{
    like:{
        type:DataTypes.STRING,
        allowNull:false
    }
});

return likes

}