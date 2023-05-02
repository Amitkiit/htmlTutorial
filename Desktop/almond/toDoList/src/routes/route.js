const express = require("express")
const router = express.Router()
const {taskCreate,findTask,updateTask,deleteTask}=require("../controller/taskController")
const{userCreate,loginUser,findUser,updateTaskByValidUser,deleteTaskByValidUser}= require("../controller/userController")
const {authenticate,authorization}= require("../middlewre/auth")
const {createAddress,findTaskAddress,averageAge}= require("../controller/addressController")

//======================task API ======================================================//
router.post('/createTask',taskCreate)
router.get('/getTask',findTask)
router.put('/updateTask/:taskId',updateTask)
router.delete('/deleteTask/:taskId',deleteTask)
//========================user API=====================================================//
router.post('/createUser',userCreate)
router.post('/login',loginUser)
router.get('/findUser/:userId',findUser)
router.put('/updateTaskByValidUser/:userId/:taskId',authenticate,authorization,updateTaskByValidUser)
router.delete("/deleteByValidUser/:userId/:taskId",authenticate,authorization,deleteTaskByValidUser)

//=============================Address Api ===================================================//

router.post("/createAddress",createAddress)

//===============find task address at the same query=========================================//
router.get('/findUser/:userId/:taskId',findTaskAddress)

//=================================aggegration operation======================================//

router.get('/getAge',averageAge)

module.exports= router
