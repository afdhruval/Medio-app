const mongoose = require("mongoose")

const postSchema = mongoose.Schema({
    caption: {
        type: String,
        default: ""
    },
    imgUrl: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
})

const postModel = mongoose.model("posts", postSchema)

module.exports = postModel





