const postModel = require("../models/post.model")
const jwt = require("jsonwebtoken")
const ImageKit = require("@imagekit/nodejs")
const { toFile } = require("@imagekit/nodejs")
const likeModel = require("../models/like.model")
const userModel = require("../models/user.model")
const commentModel = require("../models/comment.model")

const imageKit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})

async function createPostController(req, res) {
    const file = await imageKit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'),
        fileName: 'image',
        folder: "instaclone-post"
    })

    const post = await postModel.create({
        caption: req.body.caption,
        imgUrl: file.url,
        user: req.user.id
    })

    res.status(201).json({
        message: "post created successfully",
        post
    })

    console.log(posts)

}

async function getUserPost(req, res) {
    const userId = req.user.id

    const posts = await postModel.find({
        user: userId
    })

    res.status(200).json({
        message: "Post fetched successfully",
        posts
    })

}

async function getAllDataPost(req, res) {
    const userId = req.user.id
    const postId = req.params.postId

    const post = await postModel.findById(postId)

    if (!post) {
        return res.status(404).json({
            message: "page not found "
        })
    }

    const isValiduser = post.user.toString() === userId

    if (!isValiduser) {
        return res.status(403).json({
            message: "forbidden content"
        })
    }

    return res.status(200).json({
        message: "post created successfully",
        post
    })

}

async function likePostController(req, res) {
    try {
        const username = req.user.username
        const postId = req.params.postId

        const post = await postModel.findById(postId)

        if (!post) {
            return res.status(404).json({
                message: "post not found"
            })
        }

        const existingLike = await likeModel.findOne({ post: postId, user: username })

        if (existingLike) {
            // Unlike
            await likeModel.findByIdAndDelete(existingLike._id)
            return res.status(200).json({ message: "post unliked successfully", liked: false })
        }

        // Like
        const like = await likeModel.create({
            post: postId,
            user: username
        })

        res.status(200).json({
            message: "post like successfully",
            like,
            liked: true
        })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

async function getFeedController(req, res) {

    const posts = await postModel
        .find()
        .populate("user", "username profileImage")
        .sort({ createdAt: -1 })
        .lean()

    const updatedPosts = await Promise.all(
        posts.map(async (post) => {

            const isLiked = await likeModel.findOne({
                user: req.user.username,
                post: post._id
            })

            post.isLiked = !!isLiked
            post.likesCount = await likeModel.countDocuments({ post: post._id })

            // Fetch comments for the post
            const comments = await commentModel.find({ post: post._id }).populate("user", "username profileImage").lean()
            post.comments = comments

            return post
        })
    )

    res.status(200).json({
        message: "post fetched successfully",
        posts: updatedPosts
    })
}

async function commentPostController(req, res) {
    try {
        const postId = req.params.postId
        const text = req.body.text

        if (!text) {
            return res.status(400).json({ message: "Comment text is required" })
        }

        const post = await postModel.findById(postId)
        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        const comment = await commentModel.create({
            post: postId,
            user: req.user.id,
            text: text
        })

        // populate user details for frontend
        await comment.populate("user", "username profileImage")

        res.status(201).json({
            message: "Comment added successfully",
            comment
        })
    } catch (error) {
        res.status(500).json({ message: "Failed to add comment", error: error.message })
    }
}

async function deletePostController(req, res) {
    try {
        const postId = req.params.postId
        const post = await postModel.findById(postId)
        
        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }
        
        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to delete this post" })
        }
        
        await postModel.findByIdAndDelete(postId)
        await likeModel.deleteMany({ post: postId })
        await commentModel.deleteMany({ post: postId })
        
        return res.status(200).json({ message: "Post deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Failed to delete post", error: error.message })
    }
}

module.exports = {
    createPostController,
    getUserPost,
    getAllDataPost,
    likePostController,
    commentPostController,
    deletePostController,
    getFeedController
}