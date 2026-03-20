require("dotenv").config()
const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require("cors")
const path = require("path")

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}))

// ✅ Correct path (VERY IMPORTANT)
const __dirname2 = path.resolve()

app.use(express.static(path.join(__dirname2, "dist")))

// ✅ Routes
const postRouter = require("./routes/post.routes")
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes")

app.use("/api/auth", authRouter)
app.use("/api/post", postRouter)
app.use("/api/user", userRouter)

// ✅ Catch-all (React routing fix)
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname2, "dist", "index.html"))
})

module.exports = app