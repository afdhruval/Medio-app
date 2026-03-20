const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false        
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    bio: String,
    profileImage: {
        type: String,
        default: "https://ik.imagekit.io/hnoglyswo0/avatar-gender-neutral-silhouette-vector-600nw-2470054311.webp"
    }
})

const userModel = mongoose.model("user", userSchema)

module.exports = userModel



// const mongoose = require("mongoose")

// const userSchema = mongoose.Schema({
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     username: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     bio: String,
//     profileImage: {
//         type: String,
//         default: "https://ik.imagekit.io/hnoglyswo0/avatar-gender-neutral-silhouette-vector-600nw-2470054311.webp"
//     }
// })

// const userModel = mongoose.model("users", userSchema)

// module.exports = userModel