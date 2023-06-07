const { sequelize, DataTypes } = require("sequelize");

module.exports=(sequelize,DataTypes)=>{
const datamaintains = sequelize.define('datamaintains',{
    product_Id:{
        type:DataTypes.INTEGER
    },
    user_Id:{
        type:DataTypes.INTEGER,
        //defaultValue: NULL
    },
    userOrderQuentity:{
        type:DataTypes.INTEGER

    },
    availableStock:{
        type:DataTypes.INTEGER,
        //defaultValue: NULL
    },
    stockSize:{
        type:DataTypes.INTEGER
    },
    refund:{
        type: DataTypes.BOOLEAN,
        defaultValue:false
    }
});

return datamaintains

}