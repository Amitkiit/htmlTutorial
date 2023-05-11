const {sequelize,DataTypes}= require("sequelize")

module.exports=(sequelize,DataTypes)=>{
    const products = sequelize.define('products',{
        productName:{
            type:DataTypes.STRING,
            allowNull:false
        },
        category:{
            type:DataTypes.STRING,
            allowNull:false
        },
        color:{
            type:DataTypes.STRING,
        },
        size:{
            type:DataTypes.ENUM('S','M','L','XL','XX')

        },
        price:{
            type:DataTypes.DECIMAL(10, 2),
            allowNull:false
        },
        isDeleted:{
            type: DataTypes.BOOLEAN,
            defaultValue:false
        },
        quentity:{
            type:DataTypes.DECIMAL

        }

    });

    return products
}