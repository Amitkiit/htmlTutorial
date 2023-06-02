const db = require("../models/mainModel");
const Logo=db.logos
const multer = require('multer')
const path =require('path')

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'Images')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now() + path.extname(file.originalname))
    }
})

// const userProfile = async function(req,res){
     
// }


//module.exports={userProfile}