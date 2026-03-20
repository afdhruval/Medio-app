const followModel = require("../models/follow.model")
const userModel = require("../models/user.model")

// Get all users except the logged-in user
async function getAllUsersController(req, res) {
    const currentUsername = req.user.username

    const users = await userModel.find({ username: { $ne: currentUsername } })
        .select("username profileImage bio")
        .lean()

    // For each user, check if current user is following them
    const followRecord = await followModel.findOne({ username: currentUsername })
    const followingList = followRecord ? followRecord.following : []

    const usersWithFollowStatus = users.map(u => ({
        ...u,
        isFollowing: followingList.includes(u.username)
    }))

    res.status(200).json({
        message: "users fetched successfully",
        users: usersWithFollowStatus
    })
}

async function followUserController(req, res) {
    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    if (followerUsername === followeeUsername) {
        return res.status(400).json({ message: "you cannot follow yourself" })
    }

    const isFollowExists = await userModel.findOne({ username: followeeUsername })
    if (!isFollowExists) {
        return res.status(404).json({ message: "user not found" })
    }

    await followModel.findOneAndUpdate(
        { username: followerUsername },
        { $addToSet: { following: followeeUsername } },
        { upsert: true }
    )

    await followModel.findOneAndUpdate(
        { username: followeeUsername },
        { $addToSet: { followers: followerUsername } },
        { upsert: true }
    )

    res.status(201).json({ message: "you are now following the user" })
}

async function unfollowUserController(req, res) {
    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    await followModel.findOneAndUpdate(
        { username: followerUsername },
        { $pull: { following: followeeUsername } }
    )

    await followModel.findOneAndUpdate(
        { username: followeeUsername },
        { $pull: { followers: followerUsername } }
    )

    res.status(200).json({ message: "you have unfollowed this user" })
}

module.exports = {
    getAllUsersController,
    followUserController,
    unfollowUserController
}
