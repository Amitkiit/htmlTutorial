const { sequelize, DataTypes } = require("sequelize");

module.exports=(sequelize,DataTypes)=>{
const userDetails = sequelize.define('userDetails',{
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    mobileNumber:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type: DataTypes.STRING,
        defaultValue: false
    },
    otp:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    expire_In:{
        type:DataTypes.STRING,
        allowNull:true
    },
    upload_logo:{
        type:DataTypes.STRING,
        allowNull:true
    }
});

return userDetails

}