const { sequelize, DataTypes } = require("sequelize");

module.exports=(sequelize,DataTypes)=>{
const tasks = sequelize.define('tasks',{
    task:{
        type:DataTypes.STRING,
        allowNull:false
    },
    who:{
        type:DataTypes.STRING,
        allowNull:false
    },
    dueDate:{
       type: DataTypes.STRING,
       default:false
    },
    done:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});
return tasks

}