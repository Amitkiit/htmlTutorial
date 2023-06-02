const { sequelize, DataTypes } = require("sequelize");

module.exports=(sequelize,DataTypes)=>{
const otphistorys = sequelize.define('otphistorys',{
    otp:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    mobileNumber:{
        type:DataTypes.STRING,
        allowNull:false
    },
    
});

return otphistorys

}