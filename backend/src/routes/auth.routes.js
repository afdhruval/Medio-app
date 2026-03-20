const express = require("express")
const authRouter = express.Router()
const authController = require("../controllers/auth.controller")
const identifyUser = require("../middlewares/auth.middleware")

authRouter.post("/register", authController.registerUser)
authRouter.post("/login", authController.loginUser)
authRouter.post("/get-me", identifyUser, authController.getMecontroller)

module.exports = authRouter


// const express = require("express")
// const authRouter = express.Router()
// const authController = require("../controllers/auth.controller")

// // auth routes
// authRouter.post("/register", authController.registerUser)
// authRouter.post("/login", authController.loginUser)


// module.exports = authRouter