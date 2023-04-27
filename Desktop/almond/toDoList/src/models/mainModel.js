const {Sequelize, DataTypes} = require("sequelize");

const sequelize = new Sequelize('todolist','root','Amit@1604',{

host : "localhost",
dialect : 'mysql',
logging : false,
pool : {max:5,min:0,idle:10000}
})

sequelize.authenticate()
.then(()=> {
console.log("connected");
})
.catch( err => {
console.log(err);
})

const db = {}
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.tasks = require('./taskModel')(sequelize,DataTypes);
db.users = require('./userModel')(sequelize,DataTypes);
db.locations=require('./addressModel')(sequelize,DataTypes)

db.users.hasMany(db.tasks,{
    foreignKey:'user_Id',
    as:"tasks"
})

db.tasks.belongsTo(db.users, {
     foreignKey: 'user_Id',
     as:"users"
})

db.users.hasMany(db.locations,{
    foreignKey: 'user_Id',
    as:"locations"
})

db.locations.belongsTo(db.users,{
    foreignKey: 'user_Id',
    as:"users"
})
db.tasks.hasMany(db.locations,{
    foreignKey: 'task_Id',
    as:"locations"
})

db.locations.belongsTo(db.tasks,{
    foreignKey: 'task_Id',
    as:"tasks"
})

db.sequelize.sync({force:false})
.then(()=> {
console.log("yes re sync");
})

module.exports = db;