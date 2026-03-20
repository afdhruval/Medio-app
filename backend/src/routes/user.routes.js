const express = require("express")
const userRouter = express.Router()
const userController = require("../controllers/user.controller")
const identifyUser = require("../middlewares/auth.middleware")

// Get all users (for sidebar)
userRouter.get("/all", identifyUser, userController.getAllUsersController)

// Follow / Unfollow
userRouter.post("/follow/:username", identifyUser, userController.followUserController)
userRouter.post("/unfollow/:username", identifyUser, userController.unfollowUserController)

module.exports = userRouter
