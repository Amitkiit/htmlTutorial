
const { sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const questions = sequelize.define("questions", {
    question_text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    option1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    option2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    option3: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    option4: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correct_option: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return questions;
};
