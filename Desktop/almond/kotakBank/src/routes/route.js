const express = require("express");
const fileUpload = require("express-fileupload");
const AWS = require("aws-sdk");
const multer = require("multer");
const router = express.Router();
//let upload = multer({dest:'public/'})

const {
  createUser,
  loginUser,
  verifyOtp,
} = require("../controller/userCreate");
const {
  createQuestion,
  getQuestion,
  getQuestionById,
} = require("../controller/questionCreation");
const { authenticate, authorization } = require("../middleware/auth");
const {linkGenerate} = require('../controller/imageLinkGenerater')
const { userProfile } = require("../controller/logo");

//=========================================AWS -Work =================================//
let upload = multer({
  limits: 1024*1024*5,
  fileFilter:function(req,file,done){
    if(file.mimetype==='image/jpeg' || file.mimetype==='image/jng' || file.mimetype==='image/jpg' ){
      done(null,true)
    }
    else{
      done("multer error- file type is not supported",false)
    }
  }
  
  })

//=============Aws router=========================================//  

router.post('/upload',upload.single("image"),linkGenerate)


//===========user creation =======================================//
router.post("/userCreations", createUser);
router.post("/loginByMobileNumber", loginUser);
router.get("/verification",verifyOtp);
//router.get("/verification", authenticate,authorization, verifyOtp);

//===============question creation ===============================//
router.post("/questionCreation", createQuestion);
router.get("/getAllQuestion", getQuestion);
router.get("/getQuestionById", getQuestionById);

//==================logo creation ================================//
//router.post('/upload',upload.single('path'),userProfile)

module.exports = router;
