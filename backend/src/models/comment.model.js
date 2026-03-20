const mongoose = require("mongoose")

const commentSchema = mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true })

const commentModel = mongoose.model("comment", commentSchema)

module.exports = commentModel
