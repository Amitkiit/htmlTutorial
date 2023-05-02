const mysql= require("mysql")
const dotenv = require('dotenv');
require('dotenv').config();
const express = require("express")
const route = require("./routes/route")
const app = express()
app.use(express.json())
require('./models/mainModel')
//app.use('/',route)
app.use("/",route)
let port = process.env.PORT
app.listen(port,()=>{
    console.log("server is connected on : " + port)
})
