const {Sequelize, DataTypes} = require("sequelize");

const sequelize = new Sequelize('ecommercedb','root','Amit@1604',{

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

db.users = require('./userModel')(sequelize,DataTypes);
db.products= require('./productModel')(sequelize,DataTypes);
db.orders = require('./orderModel')(sequelize,DataTypes);
db.likes= require('./likeModel')(sequelize,DataTypes);

//====================relation between user and product==============================//
// db.users.hasMany(db.products,{
//     foreignKey:'user_Id',
//     as:"products"
// })

// db.products.belongsTo(db.users, {
//      foreignKey: 'user_Id',
//      as:"users"
// })

//===============relation between user like========================================================//

db.users.hasMany(db.likes,{
    foreignKey:'user_Id',
    as:"likes"
})

db.likes.belongsTo(db.users, {
     foreignKey: 'user_Id',
     as:"users"
})

//======================relation between product and like =====================================//

db.products.hasMany(db.likes,{
    foreignKey:'product_Id',
    as:"likes"
})

db.likes.belongsTo(db.products, {
     foreignKey: 'product_Id',
     as:"products"
})

//======================relation between product and order========================================//
db.products.hasMany(db.orders,{
    foreignKey:'product_Id',
    as:"orders"

})

db.orders.belongsTo(db.products,{
    foreignKey:'product_Id',
    as:'products'
})
//=======================relation between order and user============================================================//
db.users.hasMany(db.orders,{
    foreignKey:'user_Id',
    as:"orders"

})
db.orders.belongsTo(db.users,{
    foreignKey:'user_Id',
    as:'users'
})

db.sequelize.sync({force:false})
.then(()=> {
console.log("yes re sync");
})

module.exports = db;