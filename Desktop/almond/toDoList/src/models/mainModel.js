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
db.sequelize.sync({force:false})
.then(()=> {
console.log("yes re sync");
})
module.exports = db;