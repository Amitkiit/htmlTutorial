const { sequelize, DataTypes } = require("sequelize");

module.exports=(sequelize,DataTypes)=>{
const techRatings = sequelize.define('techRatings',{
    rating:{
        type:DataTypes.INTEGER
    },
});
return techRatings
}