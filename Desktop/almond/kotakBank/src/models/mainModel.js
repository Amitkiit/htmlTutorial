const {Sequelize, DataTypes} = require("sequelize");

const sequelize = new Sequelize('kotakbank','root','Amit@1604',{

host : "localhost",
dialect : 'mysql',
logging : false,
pool : {max:5,min:0,idle:10000}
})

sequelize.authenticate()
.then(()=> {
console.log("DataBase connected successfully");
})
.catch( err => {
console.log(err);
})

const db = {}
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.userDetails = require('./logindetails')(sequelize,DataTypes);
db.logos = require('./logo')(sequelize,DataTypes)
db.otphistorys=require('./otpHistory')(sequelize,DataTypes)
db.questions = require('./question')(sequelize,DataTypes)

//===============relation between user and otpHistory=======================//



db.sequelize.sync({force:false})
.then(()=> {
console.log("yes re sync");
})

module.exports = db;