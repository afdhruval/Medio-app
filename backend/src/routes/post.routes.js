const express = require("express")
const postRouter = express.Router()
const postController = require("../controllers/post.controller")
const multer = require("multer")
const upload = multer({ storage: multer.memoryStorage() })
const identifyUser = require("../middlewares/auth.middleware")

postRouter.post("/", upload.single("image"), identifyUser, postController.createPostController)

postRouter.get("/posts", identifyUser, postController.getUserPost)

postRouter.get("/posts/:postId", identifyUser, postController.getAllDataPost)

postRouter.post("/like/:postId", identifyUser, postController.likePostController)

postRouter.post("/comment/:postId", identifyUser, postController.commentPostController)

postRouter.delete("/delete/:postId", identifyUser, postController.deletePostController)

postRouter.get("/feed", identifyUser, postController.getFeedController)

module.exports = postRouter
