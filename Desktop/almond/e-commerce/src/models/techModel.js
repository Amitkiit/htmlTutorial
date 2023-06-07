const { sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const techProducts = sequelize.define("techProducts", {
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quentity: {
      type: DataTypes.STRING,
    },
    model: {
      type: DataTypes.STRING,
    },
    series: {
      type: DataTypes.STRING,
    },
    processer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    graphic: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    ram: {
      type: DataTypes.STRING,
    },
    Storage: {
      type: DataTypes.STRING,
      //defaultValue:false
    },
  });

  return techProducts;
};
