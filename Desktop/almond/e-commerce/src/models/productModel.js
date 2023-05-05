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
        rating:{
            type:DataTypes.INTEGER,
            validate: {
                min: 0,
                max: 5
              },
            defaultValue: false 
        },
        price:{
            type:DataTypes.DECIMAL(10, 2),
            allowNull:false
        },
        isDeleted:{
            type: DataTypes.BOOLEAN,
            defaultValue:false
        }

    });

    return products
}