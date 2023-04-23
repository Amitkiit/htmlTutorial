const express = require("express")
const router = express.Router()
const {taskCreate,findTask,updateTask,deleteTask}=require("../controller/taskController")


router.post('/createTask',taskCreate)
router.get('/getUser',findTask)
router.put('/updateUser/:userId',updateTask)
router.put('/deleteUser/:userId',deleteTask)

module.exports= router