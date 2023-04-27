const express = require("express")
const router = express.Router()
const {taskCreate,findTask,updateTask,deleteTask}=require("../controller/taskController")
const{userCreate,loginUser,findUser,updateTaskByValidUser,deleteTaskByValidUser}= require("../controller/userController")
const {authenticate,authorization}= require("../middlewre/auth")
const {createAddress}= require("../controller/addressController")

//======================task API ======================================================//
router.post('/createTask',taskCreate)
router.get('/getTask',findTask)
router.put('/updateTask/:taskId',updateTask)
router.delete('/deleteTask/:taskId',deleteTask)
//========================user API=====================================================//
router.post('/createUser',userCreate)
router.post('/login',loginUser)
router.get('/findUser/:userId/:taskId',findUser)
router.put('/updateTaskByValidUser/:userId/:taskId',authenticate,authorization,updateTaskByValidUser)
router.delete("/deleteByValidUser/:userId/:taskId",authenticate,authorization,deleteTaskByValidUser)

//=============================Address Api ===================================================//

router.post("/createAddress",createAddress)

module.exports= router
