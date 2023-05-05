const express = require("express")
const router = express.Router()

const {userCreate,loginUser,findProduct, updateUser}= require("../controller/userController")
const {createProduct,getProduct,updateProduct,deleteProduct,likeFilterOutOnPerticularProduct,countAllLikeProduct} = require("../controller/productController")
const {createLike}= require("../controller/likeController")

//==========================create  user==========================================================//
//router.post("/createUser",userCreate)
//router.post("/userLogin",loginUser)
//router.get("/findProductWithLikeWithUserDetails/:userId/:productId",findProduct)
//router.get("/findProductWithLike/:productId")


//===========================create products======================================================//
router.post("/createProduct",createProduct)
router.get("/findProduct",getProduct)
router.get("/findProductWithLike/:productId",likeFilterOutOnPerticularProduct)
router.get("/getProductBasisOnLike/:productId",countAllLikeProduct)   //get all like on the basis of product id
router.put('/upgradeProdcut/:productId',updateProduct)
router.delete("/deleteProduct/:productId",deleteProduct)

//==========================create Like =========================================================//
router.post("/createLike",createLike)






//=============@@@@@@@@@@@@@@@@@@@@ RAW ROUTE ======================================================//

router.post("/createUser",userCreate)
router.post("/userLogin",loginUser)
router.put("/updateUser/:userId",updateUser)
router.delete('/deleteYYY/:productId',deleteProduct)
// router.get("/findProductWithLikeWithUserDetails/:userId/:productId",findProduct)
// router.get("/findProductWithLike/:productId")

//============##################### RAW ROUTE ======================================================//

module.exports= router