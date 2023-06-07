const express = require("express")
const router = express.Router()

const {userCreate,loginUser,findProduct, updateUser}= require("../controller/userController")
const {createProduct,getProduct,updateProduct,deleteProduct,likeFilterOutOnPerticularProduct,countAllLikeProduct} = require("../controller/productController")
const {createLike}= require("../controller/likeController")
const {createOrder,orderPlace,withoutCart,returnPlaceOrder,returnPlaceOrderwithoutCart,deleteCart,placeOrderWithExistOffer} = require("../controller/orderController")
const {createStock} = require('../controller/dataMaintain')
const {techProduct,ratingOnProduct} = require('../controller/techProdController')

//==========================create user==========================================================//
router.post("/createUser",userCreate)
router.post("/userLogin",loginUser)
router.get("/findProductWithLikeWithUserDetails/:userId/:productId",findProduct)
router.get("/findProductWithLike/:productId")


//===========================create products======================================================//
router.post("/createProduct",createProduct)
router.get("/findProduct",getProduct)
router.get("/findProductWithLike/:productId",likeFilterOutOnPerticularProduct)
router.get("/getProductBasisOnLike/:productId",countAllLikeProduct)   //get all like on the basis of product id
router.put('/upgradeProdcut/:productId',updateProduct)
router.put("/deleteProduct/:productId",deleteProduct)

//=====================offer router ====================================================//

router.post('/getProductWithOffer/:userId/:productId',placeOrderWithExistOffer)

//==========================create Like ================================================//
router.post("/createLike",createLike)

//=========================create Order =====================================================//
router.post("/createOrder",createOrder)
router.post('/orderPlace/:userId/:productId',orderPlace)
router.post('/withoutCart/:userId/:productId',withoutCart)
router.post('/returnPlacedOrder/:userId/:productId/:orderId',returnPlaceOrder)
router.post('/returnPlacedOrder/:userId/:productId/',returnPlaceOrderwithoutCart)
router.put('/deleteCart/:userId/:productId/:cartId',deleteCart)

//====================maiantane stock=====================================//
router.post("/maintain",createStock)

//==================create Tech Stock ====================================//

router.post("/createTechProduct",techProduct)
router.post("/createReview",ratingOnProduct)






//=============@@@@@@@@@@@@@@@@@@@@ RAW ROUTE ======================================================//

// router.post("/createUser",userCreate)
// router.post("/userLogin",loginUser)
// router.put("/updateUser/:userId",updateUser)
// router.delete('/deleteYYY/:productId',deleteProduct)
// router.get("/findProductWithLikeWithUserDetails/:userId/:productId",findProduct)
// router.get("/findProductWithLike/:productId")

//============##################### RAW ROUTE ======================================================//

module.exports= router