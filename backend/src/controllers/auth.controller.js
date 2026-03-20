const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const bcrypt = require("bcryptjs")

async function registerUser(req, res) {

    const { email, username, password, bio, profileImage } = req.body

    if (!email || !username || !password) {
        return res.status(400).json({ message: "Username, email, and password are required" });
    }

    const isUserAlredyExits = await userModel.findOne({
        $or: [
            { username }, { email }
        ]
    })

    if (isUserAlredyExits) {
        return res.status(409).json({
            message: "user already exits"
        })
    }
    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        email, bio, password: hash, profileImage, username
    })

    const token = jwt.sign({
        id: user._id,
        username: user.username,
    }, process.env.JWT_SECRET)


    res.cookie("token", token)

    res.status(201).json({
        message: "user created successfully",
        user
    })

}
async function loginUser(req, res) {

    const { username, password, email } = req.body

    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }
    if (!username && !email) {
        return res.status(400).json({ message: "Username or email is required" });
    }

    const user = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    }).select("+password")

    if (!user) {
        return res.status(401).json({
            message: "unauthorized access"
        })
    }

    // const isPasswordInvalid = await bcrypt.compare(password, user.password)

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "invalid password"
        })
    }

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token)

    res.status(200).json({
        message: "User loggedIn successfully.",
        user: {
            username: user.username,
            email: user.email,
            bio: user.bio,
            profileImage: user.profileImage
        }
    })
}
async function getMecontroller(req, res) {

    const userId = req.user.id

    const user = await userModel.findById(userId)


    res.status(200).json({
        user: {
            username: user.username,
            email: user.email,
            bio: user.bio,
            profileImage: user.profileImage
        }
    })

}

module.exports = {
    registerUser, loginUser, getMecontroller
}
